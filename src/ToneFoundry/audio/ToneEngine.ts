import type { AmpChannel, GuitarSpec } from '../types'
import type { EffectId } from './effects'
import { renderPluckSamples } from './pluckModel'

type ActiveVoice = AudioBufferSourceNode

function makeDriveCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 2048
  const curve = new Float32Array(new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT))
  const k = 1 + amount * 42
  for (let i = 0; i < samples; i += 1) {
    const x = (i / (samples - 1)) * 2 - 1
    curve[i] = Math.tanh(x * k) / Math.tanh(k)
  }
  return curve
}

export class ToneEngine {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private compressor: DynamicsCompressorNode | null = null
  private active = new Set<ActiveVoice>()
  private voiceCounter = 0

  async enable(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext({ latencyHint: 'interactive' })
      this.master = this.context.createGain()
      this.master.gain.value = 0.76
      this.compressor = this.context.createDynamicsCompressor()
      this.compressor.threshold.value = -12
      this.compressor.knee.value = 16
      this.compressor.ratio.value = 5
      this.compressor.attack.value = 0.003
      this.compressor.release.value = 0.16
      this.master.connect(this.compressor)
      this.compressor.connect(this.context.destination)
    }
    if (this.context.state !== 'running') await this.context.resume()
  }

  get isReady(): boolean {
    return this.context?.state === 'running'
  }

  pluck(guitar: GuitarSpec, stringIndex: number, channel: AmpChannel, delay = 0, velocity = 0.82, effects: EffectId[] = []): void {
    const ctx = this.context
    const master = this.master
    if (!ctx || !master || ctx.state !== 'running') return

    const sampleRate = ctx.sampleRate
    const rendered = renderPluckSamples(guitar, {
      sampleRate,
      stringIndex,
      velocity,
      voiceNumber: this.voiceCounter,
    })
    this.voiceCounter += 1
    const buffer = ctx.createBuffer(1, rendered.samples.length, sampleRate)
    buffer.copyToChannel(rendered.samples, 0)

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const pickupFilter = ctx.createBiquadFilter()
    pickupFilter.type = 'lowpass'
    pickupFilter.frequency.value = 2100 + guitar.synthesis.brightness * 7900
    pickupFilter.Q.value = 0.4 + guitar.synthesis.pickupPosition * 1.9

    const bodyFilter = ctx.createBiquadFilter()
    bodyFilter.type = 'peaking'
    const acousticBody = ['timber-dreadnought', 'grand-concert-koa', 'grand-auditorium', 'sunburst-jumbo', 'concert-nylon'].includes(guitar.id)
    bodyFilter.frequency.value = guitar.id === 'timber-dreadnought' ? 108 : guitar.id === 'grand-concert-koa' ? 132 : guitar.id === 'grand-auditorium' ? 116 : guitar.id === 'sunburst-jumbo' ? 94 : guitar.id === 'concert-nylon' ? 100 : 240 + guitar.synthesis.bodyResonance * 520
    bodyFilter.Q.value = acousticBody ? 1.05 : 0.7
    bodyFilter.gain.value = -1 + guitar.synthesis.bodyResonance * 5.5

    const gain = ctx.createGain()
    const channelGain = channel === 'drive' ? 0.42 : 0.66
    gain.gain.value = guitar.synthesis.output * channelGain

    source.connect(pickupFilter)
    pickupFilter.connect(bodyFilter)

    let signal: AudioNode = bodyFilter
    if (channel === 'drive') {
      const shaper = ctx.createWaveShaper()
      shaper.curve = makeDriveCurve(0.16 + guitar.synthesis.drive * 0.3)
      shaper.oversample = '4x'
      const driveTone = ctx.createBiquadFilter()
      driveTone.type = 'lowpass'
      driveTone.frequency.value = 3900 + guitar.synthesis.brightness * 1800
      bodyFilter.connect(shaper)
      shaper.connect(driveTone)
      signal = driveTone
    }
    signal.connect(gain)

    let output: AudioNode = gain
    for (const effect of effects) {
      if (effect === 'boost') { const boost=ctx.createGain();boost.gain.value=1.45;output.connect(boost);output=boost }
      if (effect === 'overdrive') { const shaper=ctx.createWaveShaper();shaper.curve=makeDriveCurve(.34);shaper.oversample='4x';output.connect(shaper);output=shaper }
      if (effect === 'chorus') { const dryChorus=ctx.createGain();const delayNode=ctx.createDelay(.08);const wetChorus=ctx.createGain();const mix=ctx.createGain();dryChorus.gain.value=.72;wetChorus.gain.value=.5;delayNode.delayTime.value=.028;output.connect(dryChorus);output.connect(delayNode);delayNode.connect(wetChorus);dryChorus.connect(mix);wetChorus.connect(mix);output=mix }
      if (effect === 'tape-echo') { const direct=ctx.createGain();const echo=ctx.createDelay(.5);const echoGain=ctx.createGain();const mix=ctx.createGain();direct.gain.value=.8;echo.delayTime.value=.19;echoGain.gain.value=.28;output.connect(direct);output.connect(echo);echo.connect(echoGain);echoGain.connect(mix);direct.connect(mix);output=mix }
    }

    const dry = ctx.createGain()
    const wetDelay = ctx.createDelay(0.45)
    const wet = ctx.createGain()
    dry.gain.value = 1 - guitar.synthesis.room * 0.2
    wetDelay.delayTime.value = guitar.id === 'offset-current' ? 0.17 : guitar.id === 'grand-concert-koa' ? 0.033 : guitar.id === 'grand-auditorium' ? 0.046 : guitar.id === 'sunburst-jumbo' ? 0.059 : guitar.id === 'timber-dreadnought' ? 0.042 : guitar.id === 'concert-nylon' ? 0.05 : 0.065
    wet.gain.value = guitar.synthesis.room * 0.24
    output.connect(dry)
    output.connect(wetDelay)
    wetDelay.connect(wet)
    dry.connect(master)
    wet.connect(master)

    const startAt = ctx.currentTime + Math.max(0, delay)
    source.start(startAt)
    this.active.add(source)
    source.onended = () => this.active.delete(source)
  }

  playReference(guitar: GuitarSpec, channel: AmpChannel, effects: EffectId[] = []): number {
    this.stopAll()
    const beat = 0.5
    const sequence: Array<[number, number, number]> = [
      [0, 0, 0.9], [2, 1, 0.72], [3, 2, 0.76], [4, 3, 0.78],
      [5, 4, 0.86], [3, 5, 0.72], [2, 6, 0.74], [1, 7, 0.8],
      [0, 8, 0.9], [1, 9, 0.72], [2, 10, 0.76], [4, 11, 0.82],
      [5, 12, 0.92], [4, 13, 0.76], [3, 14, 0.8], [0, 15, 0.94],
    ]
    for (const [stringIndex, step, velocity] of sequence) {
      this.pluck(guitar, stringIndex, channel, step * beat, velocity, effects)
    }
    return 8
  }

  playComparison(guitar: GuitarSpec, channel: AmpChannel, effects: EffectId[] = []): number {
    this.stopAll()
    const phrase: Array<[number, number, number]> = [[0,0,.9],[2,.38,.74],[4,.82,.82],[5,1.28,.92]]
    for (const [stringIndex,delay,velocity] of phrase) this.pluck(guitar,stringIndex,channel,delay,velocity,effects)
    return 2.4
  }

  stopAll(): void {
    for (const source of this.active) {
      try {
        source.stop()
      } catch {
        // A source may already have ended between iteration and stop.
      }
    }
    this.active.clear()
  }

  dispose(): void {
    this.stopAll()
    void this.context?.close()
    this.context = null
    this.master = null
    this.compressor = null
  }
}
