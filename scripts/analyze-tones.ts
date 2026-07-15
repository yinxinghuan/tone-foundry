import { GUITARS } from '../src/ToneFoundry/catalog'
import { renderPluckSamples } from '../src/ToneFoundry/audio/pluckModel'

const sampleRate = 48000

function rms(samples: Float32Array, start: number, end: number): number {
  let sum = 0
  const limit = Math.min(end, samples.length)
  for (let i = start; i < limit; i += 1) sum += samples[i] * samples[i]
  return Math.sqrt(sum / Math.max(1, limit - start))
}

function differenceRatio(samples: Float32Array, start: number, end: number): number {
  let signal = 0
  let difference = 0
  const limit = Math.min(end, samples.length)
  for (let i = Math.max(1, start); i < limit; i += 1) {
    signal += samples[i] * samples[i]
    const delta = samples[i] - samples[i - 1]
    difference += delta * delta
  }
  return Math.sqrt(difference / Math.max(signal, 1e-12))
}

const measurements = GUITARS.map((guitar) => {
  const { samples, duration } = renderPluckSamples(guitar, {
    sampleRate,
    stringIndex: 0,
    velocity: 0.82,
    voiceNumber: 0,
  })
  return {
    id: guitar.id,
    durationSeconds: Number(duration.toFixed(3)),
    attackRms: Number(rms(samples, 0, sampleRate * 0.02).toFixed(5)),
    earlyRms: Number(rms(samples, sampleRate * 0.05, sampleRate * 0.25).toFixed(5)),
    lateRms: Number(rms(samples, sampleRate * 1.5, sampleRate * 2).toFixed(5)),
    brightnessProxy: Number(differenceRatio(samples, sampleRate * 0.025, sampleRate * 0.25).toFixed(5)),
  }
})

const signatures = new Set(measurements.map((entry) => `${entry.durationSeconds}:${entry.attackRms}:${entry.brightnessProxy}`))
if (signatures.size !== GUITARS.length) throw new Error('Tone signatures are not distinct')

const byId = Object.fromEntries(measurements.map((entry) => [entry.id, entry]))
if (!(byId['carved-crown'].durationSeconds > byId['offset-current'].durationSeconds
  && byId['offset-current'].durationSeconds > byId['workshop-slab'].durationSeconds)) {
  throw new Error('Expected sustain order: carved-crown > offset-current > workshop-slab')
}
if (!(byId['workshop-slab'].brightnessProxy > byId['offset-current'].brightnessProxy + 0.02
  && byId['offset-current'].brightnessProxy > byId['carved-crown'].brightnessProxy + 0.02)) {
  throw new Error('Expected brightness order: workshop-slab > offset-current > carved-crown')
}
if (!(byId['carved-crown'].attackRms < byId['workshop-slab'].attackRms - 0.02)) {
  throw new Error('Carved Crown attack is not sufficiently softer than Blackguard')
}
if (!(byId['carved-crown'].durationSeconds > byId['timber-dreadnought'].durationSeconds
  && byId['timber-dreadnought'].durationSeconds > byId['offset-current'].durationSeconds)) {
  throw new Error('Expected acoustic sustain order: carved-crown > timber-dreadnought > offset-current')
}
if (!(byId['offset-current'].brightnessProxy > byId['timber-dreadnought'].brightnessProxy
  && byId['timber-dreadnought'].brightnessProxy > byId['carved-crown'].brightnessProxy)) {
  throw new Error('Expected acoustic brightness between offset-current and carved-crown')
}

process.stdout.write(`${JSON.stringify({ sampleRate, measurements }, null, 2)}\n`)
