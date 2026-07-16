import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToneEngine } from './audio/ToneEngine'
import { GUITARS } from './catalog'
import { GuitarSvg } from './components/GuitarSvg'
import { InstrumentViewport } from './components/InstrumentViewport'
import { AssemblyLab } from './components/AssemblyLab'
import { locale } from './i18n'
import type { AmpChannel, GuitarId, GuitarSpec, ToneMetric } from './types'
import './ToneFoundry.less'
import './ReviewPage.less'

type AudioState = 'locked' | 'ready' | 'error'

const AUDIO_METRICS: Record<GuitarId, { duration: string; attack: string; brightness: string }> = {
  'workshop-slab': { duration: '2.532 s', attack: '0.38744', brightness: '0.56507' },
  'carved-crown': { duration: '3.960 s', attack: '0.34393', brightness: '0.47986' },
  'offset-current': { duration: '3.246 s', attack: '0.38994', brightness: '0.52593' },
  'timber-dreadnought': { duration: '3.552 s', attack: '0.36263', brightness: '0.51127' },
  'contour-sss': { duration: '2.872 s', attack: '0.37329', brightness: '0.60422' },
  'centerblock-semi': { duration: '3.756 s', attack: '0.36340', brightness: '0.50871' },
  'thin-double-horn': { duration: '3.688 s', attack: '0.34788', brightness: '0.47076' },
  'concert-nylon': { duration: '3.280 s', attack: '0.34620', brightness: '0.50687' },
}

const TONE_METRICS: Array<{ id: ToneMetric; zh: string; en: string }> = [
  { id: 'warmth', zh: '温暖', en: 'Warmth' },
  { id: 'brightness', zh: '明亮', en: 'Brightness' },
  { id: 'attack', zh: '起音', en: 'Attack' },
  { id: 'sustain', zh: '延音', en: 'Sustain' },
  { id: 'drive', zh: '驱动', en: 'Drive' },
  { id: 'space', zh: '空间', en: 'Space' },
]

const reviewCopy = {
  zh: {
    eyebrow: 'TONE FOUNDRY · CONTENT FOUNDATION REVIEW 01',
    title: '八把校准母版，十一种可玩基础琴型',
    intro: '八把精细琴覆盖不同弦长、接柄、箱体与桥尾语言；装配台把十一种可玩琴型拆进 25.5 英寸螺栓颈与 24.75 英寸胶合颈两套真实 SVG 接口。',
    status: '本阶段已通过',
    openLab: '进入完整试琴台',
    overview: '01 / 全身比例与家族辨识',
    overviewNote: '先在同一尺度下判断轮廓，再进入单琴放大检查。',
    gold: '金标准',
    module: '独立模块',
    select: '选择并检视',
    inspect: '02 / 实时结构检视',
    inspectNote: '支持 100%–350% 缩放、拖动、逐弦拨奏与扫弦。',
    ready: '声音已就绪',
    locked: '点此启用声音',
    error: '声音启动失败，点此重试',
    clean: '清音',
    drive: '驱动',
    verdict: '结构结论',
    verdictBody: '琴体、琴颈、琴头、硬件和弦路均使用独立几何契约。切换琴型不会共享或拉伸另一把琴的轮廓。',
    assembly: '03 / 模块拼装实验台',
    assemblyNote: '先选结构平台，再逐件更换琴体、琴颈、拾音器、琴桥与饰面；不跨越不成立的弦长和接柄接口。',
    details: '04 / 350% 局部关注点',
    detailsNote: '以下仍是实时 SVG 裁切，用来快速检查琴头、指板与桥尾层级。',
    headstock: '琴头与弦钮',
    fingerboard: '指板与琴颈连接',
    hardware: '拾音器、桥与控制件',
    acousticHardware: '音孔、木桥与弦钉',
    audio: '05 / 音色差异的机械证据',
    audioNote: '固定 48 kHz、低 E 弦和相同力度测量；试听按钮调用同一生产音频引擎。',
    play: '播放标准试听',
    stop: '停止试听',
    duration: '持续时长',
    attackRms: '起音 RMS',
    brightProxy: '明亮度代理',
    qa: '06 / 当前验收边界',
    qaNote: '评审页只总结已经完成并实际验证的部分。',
    qaItems: ['八把校准母版覆盖四类实心电吉他、半空心、偏移与两类木吉他结构', '新增薄空心、反向偏移、V 翼、前卫角型与全空心拱面五种可玩基础琴型', '两套平台分别锁定 25.5 英寸螺栓颈与 24.75 英寸胶合颈的结构锚点', '每套平台均提供 5 个实时可换插槽、至少 8 个文化预设与 8 种可抽取饰面', '螺栓颈平台有 320 种、胶合颈平台有 336 种兼容组合', '更换琴身会联动桥位 / 拾音器兼容规则，不兼容件不可选', '360 / 390 / 430 / 1024 px 无横向溢出', '所有交互目标不小于 44×44 px', '切琴后检视倍率自动恢复 100%', '生产构建、音色断言和严格 UI 扫描通过'],
    footer: 'LOCAL REVIEW · NOT PUBLISHED',
  },
  en: {
    eyebrow: 'TONE FOUNDRY · CONTENT FOUNDATION REVIEW 01',
    title: 'Eight calibration masters, eleven playable body families',
    intro: 'Eight detailed instruments cover distinct scale, joint, body, and bridge languages; the bench expands them into eleven playable forms across physically coherent 25.5 in bolt-on and 24.75 in set-neck SVG sockets.',
    status: 'Stage accepted',
    openLab: 'Open full instrument lab',
    overview: '01 / Full proportions and family read',
    overviewNote: 'Judge the silhouettes at one scale, then enter live inspection.',
    gold: 'Gold standard',
    module: 'Independent module',
    select: 'Select and inspect',
    inspect: '02 / Live structure inspection',
    inspectNote: 'Zoom from 100%–350%, pan, pluck individual strings, or sweep to strum.',
    ready: 'Audio ready',
    locked: 'Enable audio',
    error: 'Audio failed. Retry',
    clean: 'Clean',
    drive: 'Drive',
    verdict: 'Structure verdict',
    verdictBody: 'Body, neck, headstock, hardware, and string paths use independent geometry contracts. Switching instruments never stretches a shared silhouette.',
    assembly: '03 / Modular assembly lab',
    assemblyNote: 'Choose a construction platform, then swap body, neck, pickups, bridge, and finish without crossing invalid scale or neck-joint interfaces.',
    details: '04 / 350% detail targets',
    detailsNote: 'These are live SVG crops for reviewing the headstock, fingerboard, and bridge hierarchy.',
    headstock: 'Headstock and tuners',
    fingerboard: 'Fingerboard and neck joint',
    hardware: 'Pickups, bridge, and controls',
    acousticHardware: 'Soundhole, wood bridge, and pins',
    audio: '05 / Mechanical evidence of tone difference',
    audioNote: 'Measured at 48 kHz with the same low E string and force; preview uses the production audio engine.',
    play: 'Play reference riff',
    stop: 'Stop riff',
    duration: 'Duration',
    attackRms: 'Attack RMS',
    brightProxy: 'Brightness proxy',
    qa: '06 / Current acceptance boundary',
    qaNote: 'This page only summarizes implemented and verified work.',
    qaItems: ['Eight calibration masters cover four solid-body languages, semi-hollow, offset, and two acoustic structures', 'Thinline, reverse offset, V-wing, angular solid, and full hollow archtop are now playable body families', 'Two platforms lock distinct 25.5 in bolt-on and 24.75 in set-neck construction anchors', 'Each platform exposes 5 live swappable slots, at least 8 culture presets, and 8 drawable finishes', 'The bolt-on platform has 320 and the set-neck platform has 336 compatible combinations', 'Changing the body enforces bridge and pickup compatibility; mismatched parts cannot be selected', 'No horizontal overflow at 360 / 390 / 430 / 1024 px', 'All interaction targets are at least 44×44 px', 'Instrument switch restores the inspector to 100%', 'Production build, tone assertions, and strict UI audit pass'],
    footer: 'LOCAL REVIEW · NOT PUBLISHED',
  },
} as const

function WaveIcon({ playing }: { playing: boolean }) {
  return playing
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z" /></svg>
}

function ReviewInstrument({ guitar, selected, onSelect }: { guitar: GuitarSpec; selected: boolean; onSelect: () => void }) {
  const c = reviewCopy[locale]
  return (
    <article className={`tfr-family ${selected ? 'is-selected' : ''}`}>
      <div className="tfr-family__serial"><span>{guitar.year}</span><b>{guitar.serial}</b></div>
      <div className="tfr-family__figure" aria-hidden="true"><GuitarSvg guitar={guitar} onPluck={() => undefined} /></div>
      <div className="tfr-family__copy">
        <span className="tfr-family__badge">{guitar.id === 'workshop-slab' ? c.gold : c.module}</span>
        <h3>{guitar.name[locale]}</h3>
        <p>{guitar.family[locale]}</p>
        <button type="button" onClick={onSelect} aria-pressed={selected}>{c.select}</button>
      </div>
    </article>
  )
}

function DetailCrop({ guitar, kind, label }: { guitar: GuitarSpec; kind: 'headstock' | 'fingerboard' | 'hardware'; label: string }) {
  return (
    <article className="tfr-detail">
      <div className={`tfr-detail__window tfr-detail__window--${kind}`} aria-hidden="true">
        <div className="tfr-detail__instrument"><GuitarSvg guitar={guitar} onPluck={() => undefined} /></div>
      </div>
      <div><span>350% LIVE CROP</span><h3>{label}</h3></div>
    </article>
  )
}

export function ReviewPage() {
  const c = reviewCopy[locale]
  const engineRef = useRef<ToneEngine | null>(null)
  const timerRef = useRef<number | null>(null)
  const [selectedId, setSelectedId] = useState<GuitarId>('workshop-slab')
  const [channel, setChannel] = useState<AmpChannel>('clean')
  const [audioState, setAudioState] = useState<AudioState>('locked')
  const [playingId, setPlayingId] = useState<GuitarId | null>(null)
  const selected = useMemo(() => GUITARS.find((guitar) => guitar.id === selectedId) ?? GUITARS[0], [selectedId])

  useEffect(() => {
    engineRef.current = new ToneEngine()
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      engineRef.current?.dispose()
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

  const stopAudio = useCallback(() => {
    engineRef.current?.stopAll()
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
    setPlayingId(null)
  }, [])

  const playReference = useCallback(async (guitar: GuitarSpec) => {
    if (playingId === guitar.id) {
      stopAudio()
      return
    }
    stopAudio()
    if (audioState !== 'ready' && !(await enableAudio())) return
    const duration = engineRef.current?.playReference(guitar, channel) ?? 0
    setPlayingId(guitar.id)
    timerRef.current = window.setTimeout(() => setPlayingId(null), duration * 1000 + 120)
  }, [audioState, channel, enableAudio, playingId, stopAudio])

  const pluck = useCallback(async (stringIndex: number) => {
    if (audioState !== 'ready' && !(await enableAudio())) return
    engineRef.current?.pluck(selected, stringIndex, channel)
  }, [audioState, channel, enableAudio, selected])

  const selectGuitar = (id: GuitarId) => {
    stopAudio()
    setSelectedId(id)
  }

  return (
    <main className="tfr-shell">
      <header className="tfr-hero">
        <div className="tfr-hero__status"><span aria-hidden="true" />{c.status}</div>
        <p className="tfr-kicker">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="tfr-hero__intro">{c.intro}</p>
        <a className="tfr-link" href="./"><span>{c.openLab}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" /></svg></a>
      </header>

      <section className="tfr-section" aria-labelledby="tfr-overview-title">
        <div className="tfr-section__heading"><div><p>{c.overview}</p><h2 id="tfr-overview-title">{c.overviewNote}</h2></div><span>600 × 1200 / SAME SCALE</span></div>
        <div className="tfr-family-grid">
          {GUITARS.map((guitar) => <ReviewInstrument key={guitar.id} guitar={guitar} selected={guitar.id === selectedId} onSelect={() => selectGuitar(guitar.id)} />)}
        </div>
      </section>

      <section className="tfr-section" aria-labelledby="tfr-inspect-title">
        <div className="tfr-section__heading"><div><p>{c.inspect}</p><h2 id="tfr-inspect-title">{c.inspectNote}</h2></div><button className={`tfr-audio tfr-audio--${audioState}`} type="button" onClick={() => void enableAudio()} disabled={audioState === 'ready'}><span aria-hidden="true" />{audioState === 'ready' ? c.ready : audioState === 'error' ? c.error : c.locked}</button></div>
        <div className="tfr-inspection-grid">
          <div className="tfr-live-stage"><InstrumentViewport key={selected.id} guitar={selected} onPluck={(index) => void pluck(index)} /></div>
          <aside className="tfr-record">
            <div className="tfr-record__plate"><span>{selected.year}</span><b>{selected.serial}</b></div>
            <h2>{selected.name[locale]}</h2>
            <p className="tfr-record__family">{selected.family[locale]}</p>
            <p className="tfr-record__note">{selected.note[locale]}</p>
            <div className="tfr-channel" aria-label="Amp channel">
              <button type="button" className={channel === 'clean' ? 'is-active' : ''} onClick={() => { stopAudio(); setChannel('clean') }}>{c.clean}</button>
              <button type="button" className={channel === 'drive' ? 'is-active' : ''} onClick={() => { stopAudio(); setChannel('drive') }}>{c.drive}</button>
            </div>
            <div className="tfr-tone-grid">
              {TONE_METRICS.map((metric) => <div className="tfr-meter" key={metric.id}><div><span>{metric[locale]}</span><b>{selected.tone[metric.id]}</b></div><i><span style={{ width: `${selected.tone[metric.id]}%` }} /></i></div>)}
            </div>
            <div className="tfr-verdict"><span>{c.verdict}</span><p>{c.verdictBody}</p></div>
          </aside>
        </div>
      </section>

      <section className="tfr-section" aria-labelledby="tfr-assembly-title">
        <div className="tfr-section__heading"><div><p>{c.assembly}</p><h2 id="tfr-assembly-title">{c.assemblyNote}</h2></div><span>DUAL SOCKET / V0.2</span></div>
        <AssemblyLab />
      </section>

      <section className="tfr-section" aria-labelledby="tfr-details-title">
        <div className="tfr-section__heading"><div><p>{c.details}</p><h2 id="tfr-details-title">{c.detailsNote}</h2></div><span>{selected.serial}</span></div>
        <div className="tfr-detail-grid">
          <DetailCrop guitar={selected} kind="headstock" label={c.headstock} />
          <DetailCrop guitar={selected} kind="fingerboard" label={c.fingerboard} />
          <DetailCrop guitar={selected} kind="hardware" label={selected.id === 'timber-dreadnought' || selected.id === 'concert-nylon' ? c.acousticHardware : c.hardware} />
        </div>
      </section>

      <section className="tfr-section" aria-labelledby="tfr-audio-title">
        <div className="tfr-section__heading"><div><p>{c.audio}</p><h2 id="tfr-audio-title">{c.audioNote}</h2></div><span>FIXED SEED / LOW E / FORCE .82</span></div>
        <div className="tfr-audio-table" role="table" aria-label={c.audio}>
          {GUITARS.map((guitar) => {
            const measurement = AUDIO_METRICS[guitar.id]
            const isPlaying = playingId === guitar.id
            return <div className="tfr-audio-row" role="row" key={guitar.id}>
              <div className="tfr-audio-row__name" role="cell"><span style={{ background: guitar.colors.body }} /><div><b>{guitar.name[locale]}</b><small>{guitar.family[locale]}</small></div></div>
              <div role="cell"><small>{c.duration}</small><b>{measurement.duration}</b></div>
              <div role="cell"><small>{c.attackRms}</small><b>{measurement.attack}</b></div>
              <div role="cell"><small>{c.brightProxy}</small><b>{measurement.brightness}</b></div>
              <button type="button" className={isPlaying ? 'is-playing' : ''} onClick={() => void playReference(guitar)}><WaveIcon playing={isPlaying} /><span>{isPlaying ? c.stop : c.play}</span></button>
            </div>
          })}
        </div>
      </section>

      <section className="tfr-section tfr-qa" aria-labelledby="tfr-qa-title">
        <div className="tfr-section__heading"><div><p>{c.qa}</p><h2 id="tfr-qa-title">{c.qaNote}</h2></div><span>QA / 07·16</span></div>
        <ol>{c.qaItems.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><b>{index === c.qaItems.length - 1 ? 'SCOPE' : 'PASS'}</b></li>)}</ol>
      </section>

      <footer className="tfr-footer"><span>TONE FOUNDRY / REVIEW 01</span><span>{c.footer}</span></footer>
    </main>
  )
}
