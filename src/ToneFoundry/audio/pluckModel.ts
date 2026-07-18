import { STRING_FREQUENCIES } from '../catalog'
import type { GuitarSpec } from '../types'

function hashSeed(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface PluckRenderOptions {
  sampleRate: number
  stringIndex: number
  velocity: number
  voiceNumber: number
}

export interface RenderedPluck {
  samples: Float32Array<ArrayBuffer>
  duration: number
  frequency: number
}

export function renderPluckSamples(guitar: GuitarSpec, options: PluckRenderOptions): RenderedPluck {
  const { sampleRate, stringIndex, velocity, voiceNumber } = options
  const frequency = STRING_FREQUENCIES[stringIndex]
  const duration = 0.9 + guitar.synthesis.damping * 3.4
  const frameCount = Math.ceil(sampleRate * duration)
  const samples = new Float32Array(new ArrayBuffer(frameCount * Float32Array.BYTES_PER_ELEMENT))
  const period = Math.max(2, Math.round(sampleRate / frequency))
  const delayLine = new Float32Array(period)
  const random = mulberry32(hashSeed(`${guitar.id}:${stringIndex}:${voiceNumber}`))

  const pickSoftness = 0.12 + (1 - guitar.synthesis.brightness) * 0.46
  for (let i = 0; i < period; i += 1) {
    const noise = random() * 2 - 1
    const edge = Math.sin((Math.PI * i) / period)
    delayLine[i] = noise * (1 - pickSoftness + edge * pickSoftness) * velocity
  }

  const feedback = 0.992 + guitar.synthesis.damping * 0.0062
  const smoothing = 0.2 + (1 - guitar.synthesis.brightness) * 0.52
  let previous = 0
  for (let i = 0; i < frameCount; i += 1) {
    const index = i % period
    const nextIndex = (index + 1) % period
    const raw = delayLine[index]
    const averaged = raw * (1 - smoothing) + delayLine[nextIndex] * smoothing
    delayLine[index] = averaged * feedback
    const bodyPulse = Math.sin((2 * Math.PI * frequency * 0.5 * i) / sampleRate) * guitar.synthesis.bodyResonance * 0.06
    const acousticAir = guitar.id === 'timber-dreadnought'
      ? Math.sin((2 * Math.PI * 102 * i) / sampleRate) * 0.038 * Math.exp(-i / (sampleRate * 1.15))
        + Math.sin((2 * Math.PI * 190 * i) / sampleRate) * 0.024 * Math.exp(-i / (sampleRate * 0.72))
      : guitar.id === 'grand-concert-koa'
        ? Math.sin((2 * Math.PI * 132 * i) / sampleRate) * 0.026 * Math.exp(-i / (sampleRate * 0.74))
          + Math.sin((2 * Math.PI * 244 * i) / sampleRate) * 0.018 * Math.exp(-i / (sampleRate * 0.49))
        : guitar.id === 'grand-auditorium'
          ? Math.sin((2 * Math.PI * 116 * i) / sampleRate) * 0.034 * Math.exp(-i / (sampleRate * 1.02))
            + Math.sin((2 * Math.PI * 207 * i) / sampleRate) * 0.022 * Math.exp(-i / (sampleRate * 0.65))
          : guitar.id === 'sunburst-jumbo'
            ? Math.sin((2 * Math.PI * 94 * i) / sampleRate) * 0.045 * Math.exp(-i / (sampleRate * 1.3))
              + Math.sin((2 * Math.PI * 178 * i) / sampleRate) * 0.028 * Math.exp(-i / (sampleRate * 0.82))
      : guitar.id === 'concert-nylon'
        ? Math.sin((2 * Math.PI * 98 * i) / sampleRate) * 0.032 * Math.exp(-i / (sampleRate * 1.05))
          + Math.sin((2 * Math.PI * 218 * i) / sampleRate) * 0.018 * Math.exp(-i / (sampleRate * 0.62))
        : 0
    const attackAmount = guitar.id === 'concert-nylon' ? 0.065 : 0.12
    const attackNoise = i < sampleRate * 0.018 ? (random() * 2 - 1) * (1 - i / (sampleRate * 0.018)) * attackAmount : 0
    previous = previous * 0.08 + raw * 0.92
    samples[i] = (previous + bodyPulse + acousticAir + attackNoise) * Math.exp(-i / (sampleRate * duration * 0.74))
  }

  return { samples, duration, frequency }
}
