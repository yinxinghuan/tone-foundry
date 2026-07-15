import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToneEngine } from './audio/ToneEngine'
import { GUITARS } from './catalog'
import { InstrumentViewport } from './components/InstrumentViewport'
import { BuildRun } from './components/BuildRun'
import { locale, t, type CopyKey } from './i18n'
import type { AmpChannel, GuitarId, ToneMetric } from './types'
import './ToneFoundry.less'

type AudioState = 'locked' | 'ready' | 'error'

const METRICS: Array<{ id: ToneMetric; label: CopyKey }> = [
  { id: 'warmth', label: 'warmth' },
  { id: 'brightness', label: 'brightness' },
  { id: 'attack', label: 'attack' },
  { id: 'sustain', label: 'sustain' },
  { id: 'drive', label: 'driveMetric' },
  { id: 'space', label: 'space' },
]

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {playing ? (
        <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
      ) : (
        <path d="M8 5.7v12.6l10-6.3z" />
      )}
    </svg>
  )
}

function AudioLamp({ state, onRetry }: { state: AudioState; onRetry: () => void }) {
  const label = state === 'ready' ? t('audioReady') : state === 'error' ? t('audioError') : t('audioLocked')
  return (
    <button className={`tf-audio-lamp tf-audio-lamp--${state}`} type="button" onClick={onRetry} disabled={state === 'ready'}>
      <span className="tf-audio-lamp__bulb" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

export default function ToneFoundry() {
  const engineRef = useRef<ToneEngine | null>(null)
  const playTimerRef = useRef<number | null>(null)
  const [selectedId, setSelectedId] = useState<GuitarId>('workshop-slab')
  const [channel, setChannel] = useState<AmpChannel>('clean')
  const [audioState, setAudioState] = useState<AudioState>('locked')
  const [playing, setPlaying] = useState(false)
  const [workspace, setWorkspace] = useState<'build' | 'test'>('build')
  const selected = useMemo(() => GUITARS.find((guitar) => guitar.id === selectedId) ?? GUITARS[0], [selectedId])

  useEffect(() => {
    const engine = new ToneEngine()
    engineRef.current = engine
    return () => {
      if (playTimerRef.current !== null) window.clearTimeout(playTimerRef.current)
      engine.dispose()
    }
  }, [])

  const enableAudio = useCallback(async () => {
    try {
      await engineRef.current?.enable()
      setAudioState('ready')
      return true
    } catch {
      setAudioState('error')
      return false
    }
  }, [])

  const pluck = useCallback(async (stringIndex: number) => {
    if (audioState !== 'ready') {
      const enabled = await enableAudio()
      if (!enabled) return
    }
    engineRef.current?.pluck(selected, stringIndex, channel)
  }, [audioState, channel, enableAudio, selected])

  const stopReference = useCallback(() => {
    engineRef.current?.stopAll()
    if (playTimerRef.current !== null) window.clearTimeout(playTimerRef.current)
    playTimerRef.current = null
    setPlaying(false)
  }, [])

  const toggleReference = useCallback(async () => {
    if (playing) {
      stopReference()
      return
    }
    if (audioState !== 'ready') {
      const enabled = await enableAudio()
      if (!enabled) return
    }
    const duration = engineRef.current?.playReference(selected, channel) ?? 0
    setPlaying(true)
    playTimerRef.current = window.setTimeout(() => {
      setPlaying(false)
      playTimerRef.current = null
    }, duration * 1000 + 120)
  }, [audioState, channel, enableAudio, playing, selected, stopReference])

  const selectGuitar = (id: GuitarId) => {
    stopReference()
    setSelectedId(id)
  }

  return (
    <main className={`tf-shell ${workspace === 'build' ? 'tf-shell--build' : 'tf-shell--test'}`}>
      <header className="tf-header">
        <div>
          <p className="tf-header__eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="tf-header__intro">{t('intro')}</p>
        </div>
        <AudioLamp state={audioState} onRetry={() => void enableAudio()} />
      </header>

      <nav className="tf-workspaces" aria-label="Tone Foundry workspaces">
        <button type="button" className={workspace === 'build' ? 'is-active' : ''} onClick={() => setWorkspace('build')} aria-pressed={workspace === 'build'}><span>01</span>{t('buildWorkspace')}</button>
        <button type="button" className={workspace === 'test' ? 'is-active' : ''} onClick={() => setWorkspace('test')} aria-pressed={workspace === 'test'}><span>02</span>{t('testWorkspace')}</button>
      </nav>

      {workspace === 'build' ? <BuildRun /> : <>
        <section className="tf-bench" aria-label={selected.family[locale]}>
        <div className="tf-bench__grain" aria-hidden="true" />
        <div className="tf-instrument-stage">
          <div className="tf-instrument-stage__lamp" aria-hidden="true" />
          <div className="tf-instrument-stage__mat">
            <InstrumentViewport key={selected.id} guitar={selected} onPluck={(index) => void pluck(index)} />
          </div>
          <div className="tf-inspection-stamp" aria-hidden="true">
            <span>INSPECTED</span>
            <strong>TF / 07·14</strong>
          </div>
        </div>

        <aside className="tf-inspection">
          <div className="tf-inspection__plate">
            <span>{t('inspection')}</span>
            <b>{selected.serial}</b>
          </div>
          <p className="tf-inspection__era">{selected.year}</p>
          <h2>{selected.name[locale]}</h2>
          <p className="tf-inspection__family">{selected.family[locale]}</p>
          <div className="tf-inspection__tags">
            {selected.tags[locale].map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <p className="tf-inspection__note">{selected.note[locale]}</p>

          <div className="tf-channel" aria-label={t('channel')}>
            <span className="tf-channel__label">{t('channel')}</span>
            <div className="tf-channel__switch">
              <button type="button" className={channel === 'clean' ? 'is-active' : ''} onClick={() => setChannel('clean')}>{t('clean')}</button>
              <button type="button" className={channel === 'drive' ? 'is-active' : ''} onClick={() => setChannel('drive')}>{t('drive')}</button>
              <span className={`tf-channel__lever tf-channel__lever--${channel}`} aria-hidden="true" />
            </div>
          </div>

          <button className={`tf-play ${playing ? 'is-playing' : ''}`} type="button" onClick={() => void toggleReference()}>
            <PlayIcon playing={playing} />
            <span>{playing ? t('stopRiff') : t('playRiff')}</span>
            <small>120 BPM · 4/4</small>
          </button>

          <section className="tf-tone" aria-labelledby="tf-tone-title">
            <div className="tf-tone__heading">
              <h3 id="tf-tone-title">{t('toneProfile')}</h3>
              <span>CALIBRATED / 100</span>
            </div>
            <div className="tf-tone__grid">
              {METRICS.map((metric) => (
                <div className="tf-meter" key={metric.id}>
                  <div className="tf-meter__label"><span>{t(metric.label)}</span><b>{selected.tone[metric.id]}</b></div>
                  <div className="tf-meter__track"><span style={{ width: `${selected.tone[metric.id]}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </aside>
        </section>

        <section className="tf-selector" aria-labelledby="tf-selector-title">
        <div className="tf-selector__heading">
          <h2 id="tf-selector-title">{t('selectInstrument')}</h2>
          <span>04 / CULTURE TEST SET</span>
        </div>
        <div className="tf-selector__rail">
          {GUITARS.map((guitar, index) => (
            <button
              className={`tf-sample ${guitar.id === selected.id ? 'is-selected' : ''}`}
              type="button"
              key={guitar.id}
              onClick={() => selectGuitar(guitar.id)}
              aria-pressed={guitar.id === selected.id}
            >
              <span className="tf-sample__index">0{index + 1}</span>
              <span className="tf-sample__swatch" style={{ background: guitar.colors.body }} aria-hidden="true" />
              <span className="tf-sample__copy"><b>{guitar.name[locale]}</b><small>{guitar.family[locale]}</small></span>
              <span className="tf-sample__marker" aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="tf-selector__future">{t('compare')}</p>
        </section>
      </>}

      <footer className="tf-footer">
        <span>{t('prototype')}</span>
        <span>TONE FOUNDRY / R0.1</span>
      </footer>
    </main>
  )
}
