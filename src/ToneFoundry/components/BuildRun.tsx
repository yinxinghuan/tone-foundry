import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ToneEngine } from '../audio/ToneEngine'
import {
  BUILD_STAGES,
  applyOffer,
  createRunSeed,
  drawOffers,
  finishBuild,
  type BuildConfig,
  type BuildGrade,
  type BuildPlatform,
  type BuildStage,
  type CompletedBuild,
  type PartOffer,
} from '../gameplay/buildRun'
import { locale } from '../i18n'
import { ModularGuitarPreview as GuitarPreview } from './ModularGuitarPreview'
import { AssemblyGuitarPreview } from './AssemblyGuitarPreview'
import { PublicWall } from './PublicWall'
import { useFoundrySave } from '../hooks/useFoundrySave'
import { useGuitarWall } from '../hooks/useGuitarWall'
import { emptyRiff, type PublishedGuitar, type RiffCell, type RiffPattern } from '../gameplay/save'
import { guitarFromBuild } from '../gameplay/buildTone'
import type { WallEntry } from '../gameplay/save'
import { GuitarWallDetail } from './GuitarWallDetail'
import type { AmpChannel, ToneMetric } from '../types'
import './BuildRun.less'

type RunScreen = 'start' | 'sealed' | 'choose' | 'complete' | 'riff' | 'collection' | 'wall' | 'detail'

const copy = {
  zh: {
    title: '做一把只属于你的琴', intro: '五个包裹。每次留下一个部件。',
    start: '开始制琴', collection: '我的琴架', wall: '公共琴墙', odds: '部件等级', oddsLine: '工坊 68% · 精选 27% · 典藏 5%',
    stages: { body: '琴体', neck: '琴颈', pickups: '拾音器', bridge: '琴桥', finish: '饰面' },
    sealed: '打开下一个包裹', sealedNote: '里面只会出现这一次的候选。', open: '拆开包裹',
    choose: '哪一个更像你的琴？', chooseNote: '轻点候选，直接在琴上试装。', mount: '就选这个', audition: '试听当前组合', zoomIn: '放大', zoomOut: '缩小', resetZoom: '复位视图', toneLab: '音色测试', clean: '清音', driveChannel: '驱动',
    chooseTitle: { body: '先选它的轮廓', neck: '握住它的性格', pickups: '让它开始有声音', bridge: '决定琴弦落在哪里', finish: '最后，让木头显色' },
    chooseDetail: { body: '轻点候选，琴体会在模具上显影。', neck: '镜头已移到琴颈，直接试装。', pickups: '不同线圈，会留下不同的攻击感。', bridge: '琴桥改变触弦、延音与回弹。', finish: '漆面会在确认前完整显影。' },
    workshop: '工坊级', select: '精选级', archive: '典藏级',
    platformBolt: '25.5 英寸螺栓颈工单', platformSet: '24.75 英寸胶合颈工单',
    complete: '你的琴做好了', completeNote: '五次选择，留下这一种声音。', listen: '试听', riff: '写一段 First Riff', save: '收进琴架', next: '再做一把', archiveLabel: '查看制造档案',
    riffTitle: 'First Riff / 16 步草稿', riffNote: '轻点格子循环：关闭 → 音符 → 重音 → 闷音。', play: '播放', stop: '停止', back: '返回成琴', publish: '发布到公共琴墙', preset: '装入示范节奏',
    empty: '琴架还是空的。完成第一把琴后，它会出现在这里。', view: '查看', backStart: '返回工单', gradeScore: '制造档案', saved: '已收入琴架', measure: '小节',
  },
  en: {
    title: 'Make sound into an object', intro: 'Five sealed choices. One instrument with a voice of its own.',
    start: 'Begin a new specimen', collection: 'My instruments', wall: 'Public index', odds: 'Edition grades', oddsLine: 'Workshop 68% · Select 27% · Archive 5%',
    stages: { body: 'Body', neck: 'Neck', pickups: 'Pickups', bridge: 'Bridge', finish: 'Finish' },
    sealed: 'Open the next specimen pack', sealedNote: 'This run contains a limited set of parts.', open: 'Reveal candidates',
    choose: 'Which one feels like yours?', chooseNote: 'Tap a candidate to trial-fit it on the guitar.', mount: 'Keep this one', audition: 'Hear this build', zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetZoom: 'Reset view', toneLab: 'Tone test', clean: 'Clean', driveChannel: 'Drive',
    chooseTitle: { body: 'Choose its silhouette', neck: 'Shape the hand feel', pickups: 'Give it a voice', bridge: 'Set the strings in place', finish: 'Let the wood show' },
    chooseDetail: { body: 'Tap a candidate to reveal it on the form.', neck: 'The camera is on the neck. Trial-fit it here.', pickups: 'Each coil changes the attack.', bridge: 'The bridge changes touch, sustain and return.', finish: 'See the full finish before you keep it.' },
    workshop: 'Workshop', select: 'Select', archive: 'Archive',
    platformBolt: '25.5 in bolt-on order', platformSet: '24.75 in set-neck order',
    complete: 'Specimen complete', completeNote: 'A unique instrument, indexed by shape and sound.', listen: 'Listen', riff: 'Write its First Riff', save: 'Add to collection', next: 'Make another', archiveLabel: 'View specimen record',
    riffTitle: 'First Riff / 16-step study', riffNote: 'Tap a cell to cycle: off → note → accent → mute.', play: 'Play', stop: 'Stop', back: 'Back to instrument', publish: 'Publish to public index', preset: 'Load demo rhythm',
    empty: 'Your collection is empty. Complete the first specimen to place it here.', view: 'View', backStart: 'Back to index', gradeScore: 'Archive score', saved: 'Added to collection', measure: 'Bar',
  },
} as const

const partNames: Record<string, { zh:string; en:string }> = {
  slab:{zh:'板式单切',en:'Slab single-cut'}, contour:{zh:'轮廓双切',en:'Contour double-cut'}, offset:{zh:'偏移琴体',en:'Offset body'},
  carved:{zh:'雕面单切',en:'Carved single-cut'}, centerblock:{zh:'中心块半空心',en:'Centerblock semi'}, 'thin-horn':{zh:'薄双角',en:'Thin double-horn'},
  'maple-inline':{zh:'一体枫木六联',en:'Maple inline'}, 'rosewood-inline':{zh:'深色指板六联',en:'Dark-board inline'},
  'dot-bound':{zh:'圆点包边指板',en:'Bound dot board'}, 'trapezoid-bound':{zh:'梯形包边指板',en:'Bound trapezoid board'},
  'dual-single':{zh:'双单线圈',en:'Dual single'}, sss:{zh:'SSS 三单',en:'SSS triple'}, hss:{zh:'HSS 热改',en:'HSS hot rod'}, 'wide-dual':{zh:'双宽单线圈',en:'Dual wide single'},
  'covered-humbuckers':{zh:'双封闭线圈',en:'Covered humbuckers'}, 'soapbar-p90':{zh:'双皂条单线圈',en:'Soapbar singles'}, 'mini-humbuckers':{zh:'双迷你线圈',en:'Mini humbuckers'},
  'three-saddle':{zh:'三鞍桥板',en:'Three-saddle plate'}, tremolo:{zh:'同步颤音',en:'Synchronized trem'}, hardtail:{zh:'六鞍硬尾',en:'Hardtail'}, floating:{zh:'浮动颤音',en:'Floating vibrato'},
  stopbar:{zh:'止弦尾件',en:'Stop bar'}, trapeze:{zh:'梯形尾件',en:'Trapeze tail'}, 'short-vibrola':{zh:'短板颤音',en:'Short vibrola'},
  blonde:{zh:'陈年金黄',en:'Aged blonde'}, sunburst:{zh:'三色渐变',en:'Three-tone burst'}, black:{zh:'旧黑',en:'Worn black'}, surf:{zh:'海玻璃绿',en:'Sea glass'},
  cherry:{zh:'深樱桃红',en:'Deep cherry'}, gold:{zh:'陈年金色',en:'Aged gold'}, ebony:{zh:'黑檀漆面',en:'Ebony lacquer'}, natural:{zh:'自然枫木',en:'Natural maple'},
}

function gradeLabel(grade: BuildGrade) { return copy[locale][grade] }
function partLabel(part: string) { return partNames[part]?.[locale] ?? part }

function InspectIcon({kind}:{kind:'play'|'stop'|'in'|'out'|'reset'|'tone'|'close'}) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{kind==='close'?<path d="m7 7 10 10M17 7 7 17" fill="none"/>:kind==='tone'?<><path d="M5 16V9M9 19V5M13 15V8M17 18V6M21 14v-4" fill="none"/></>:kind==='play'?<path d="M8 5.5v13l10-6.5z"/>:kind==='stop'?<rect x="7" y="7" width="10" height="10" rx="1"/>:kind==='in'||kind==='out'?<><circle cx="10.5" cy="10.5" r="5.5" fill="none"/><path d="M14.7 14.7 20 20M7.5 10.5h6" fill="none"/>{kind==='in'&&<path d="M10.5 7.5v6" fill="none"/>}</>:<><path d="M5 9a7.5 7.5 0 1 1 1.4 7.7" fill="none"/><path d="M5 4v5h5" fill="none"/></>}</svg>
}

const toneLabels:Record<ToneMetric,{zh:string;en:string}>={warmth:{zh:'温暖',en:'Warm'},brightness:{zh:'明亮',en:'Bright'},attack:{zh:'起音',en:'Attack'},sustain:{zh:'延音',en:'Sustain'},drive:{zh:'驱动',en:'Drive'},space:{zh:'空间',en:'Space'}}

export function BuildRun() {
  const c = copy[locale]
  const save = useFoundrySave()
  const wall = useGuitarWall()
  const engineRef = useRef<ToneEngine | null>(null)
  const sequenceTimerRef = useRef<number | null>(null)
  const auditionTimerRef = useRef<number | null>(null)
  const [screen, setScreen] = useState<RunScreen>('start')
  const [runId, setRunId] = useState('')
  const [platform, setPlatform] = useState<BuildPlatform>('bolt-on')
  const [config, setConfig] = useState<BuildConfig>(() => createRunSeed().config)
  const [stageIndex, setStageIndex] = useState(0)
  const [offers, setOffers] = useState<PartOffer[]>([])
  const [selectedOffer, setSelectedOffer] = useState<PartOffer | null>(null)
  const [grades, setGrades] = useState<Partial<Record<BuildStage, BuildGrade>>>({})
  const [completed, setCompleted] = useState<CompletedBuild | null>(null)
  const [saved, setSaved] = useState(false)
  const [riff, setRiffState] = useState<RiffPattern>(() => emptyRiff())
  const riffRef = useRef(riff)
  const [playhead, setPlayhead] = useState(-1)
  const [measure, setMeasure] = useState(0)
  const [manualZoom, setManualZoom] = useState(1)
  const [auditioning, setAuditioning] = useState(false)
  const [detailEntry, setDetailEntry] = useState<WallEntry | null>(null)
  const [tonePanelOpen, setTonePanelOpen] = useState(false)
  const [channel, setChannel] = useState<AmpChannel>('clean')

  const stage = BUILD_STAGES[stageIndex]
  const progress = screen === 'complete' || screen === 'riff' ? 5 : stageIndex
  const previewConfig = useMemo(() => selectedOffer ? applyOffer(config, stage, selectedOffer) : config, [config, selectedOffer, stage])
  const selectedSource = useMemo(() => guitarFromBuild(platform, previewConfig), [platform, previewConfig])

  useEffect(() => {
    engineRef.current = new ToneEngine()
    return () => {
      if (sequenceTimerRef.current !== null) window.clearTimeout(sequenceTimerRef.current)
      if (auditionTimerRef.current !== null) window.clearTimeout(auditionTimerRef.current)
      engineRef.current?.dispose()
    }
  }, [])

  const updateRiff = (update: RiffPattern | ((current: RiffPattern) => RiffPattern)) => {
    const next = typeof update === 'function' ? update(riffRef.current) : update
    riffRef.current = next
    setRiffState(next)
  }

  const beginRun = () => {
    const seed = createRunSeed()
    setRunId(seed.id); setPlatform(seed.platform); setConfig(seed.config); setStageIndex(0); setOffers([]); setSelectedOffer(null); setGrades({}); setCompleted(null); setSaved(false); updateRiff(emptyRiff()); setMeasure(0); setManualZoom(1); setScreen('sealed')
  }

  const openCase = () => {
    setOffers(drawOffers(stage, platform, config, runId))
    setSelectedOffer(null)
    setScreen('choose')
  }

  const mountPart = () => {
    if (!selectedOffer) return
    const nextConfig = applyOffer(config, stage, selectedOffer)
    const nextGrades = { ...grades, [stage]: selectedOffer.grade }
    setConfig(nextConfig); setGrades(nextGrades); setSelectedOffer(null); setOffers([])
    if (stageIndex === BUILD_STAGES.length - 1) {
      setCompleted(finishBuild(runId, platform, nextConfig, nextGrades)); setScreen('complete')
    } else {
      setStageIndex((current) => current + 1); setScreen('sealed')
    }
  }

  const playReference = async () => {
    await engineRef.current?.enable()
    engineRef.current?.playReference(selectedSource, 'clean')
  }

  const auditionBuild = async () => {
    if (auditioning) { engineRef.current?.stopAll(); if (auditionTimerRef.current!==null) window.clearTimeout(auditionTimerRef.current); auditionTimerRef.current=null; setAuditioning(false); return }
    setAuditioning(true)
    let duration=0
    try { await engineRef.current?.enable(); duration=engineRef.current?.playComparison(selectedSource,channel) ?? 0 } catch { setAuditioning(false); return }
    auditionTimerRef.current=window.setTimeout(()=>{setAuditioning(false);auditionTimerRef.current=null},duration*1000+80)
  }

  const toggleRiffPlayback = async () => {
    if (sequenceTimerRef.current !== null) {
      window.clearTimeout(sequenceTimerRef.current); sequenceTimerRef.current = null; setPlayhead(-1); engineRef.current?.stopAll(); return
    }
    await engineRef.current?.enable()
    let step = 0
    const playStep = () => {
      const currentRiff = riffRef.current
      setPlayhead(step)
      currentRiff.steps.forEach((track, stringIndex) => {
        const cell = track[step]
        if (cell) engineRef.current?.pluck(selectedSource, stringIndex, 'clean', 0, cell === 2 ? 1 : cell === 3 ? .38 : .72)
      })
      step = (step + 1) % 16
      sequenceTimerRef.current = window.setTimeout(playStep, 60000 / currentRiff.bpm / 4)
    }
    playStep()
  }

  const saveToRack = () => {
    if (!completed || saved) return
    save.saveBuild(completed); setSaved(true)
  }

  const loadDemoRiff = () => {
    const next = emptyRiff()
    const pattern: Array<[number, number, RiffCell]> = [[0,0,2],[0,4,1],[0,8,2],[0,12,1],[1,2,1],[1,6,1],[1,10,1],[1,14,1],[2,3,3],[2,7,3],[2,11,3],[2,15,3],[4,6,1],[5,14,2]]
    for (const [stringIndex, step, value] of pattern) next.steps[stringIndex][step] = value
    updateRiff(next)
  }

  const publishCurrent = () => {
    if (!completed) return
    const published: PublishedGuitar = { ...completed, riff, publishedAt: Date.now() }
    save.publish(published)
    wall.refresh()
    setScreen('wall')
  }

  if (screen === 'start') return <section className="tfrun tfrun--start">
    <div className="tfrun-start__ticket">
      <div className="tfrun-start__mark" aria-hidden="true"><span>TF</span><i /></div>
      <p className="tfrun-kicker">TONE FOUNDRY · INSTRUMENT STUDY</p><h2>{c.title}</h2><p className="tfrun-lead">{c.intro}</p>
      <button className="tfrun-primary" type="button" onClick={beginRun}>{c.start}</button>
      <div className="tfrun-start__links"><button type="button" onClick={() => setScreen('collection')}>{c.collection}<span>{save.collection.length}</span></button><i /><button type="button" onClick={() => setScreen('wall')}>{c.wall}<span>{save.published.length}</span></button></div>
      <details className="tfrun-odds"><summary>{c.odds}</summary><b>{c.oddsLine}</b></details>
    </div>
  </section>

  if (screen === 'collection') return <section className="tfrun tfrun--collection">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('start')}>{c.backStart}</button><div><h2>{c.collection}</h2></div><button type="button" onClick={() => setScreen('wall')}>{c.wall}</button></header>
    {save.collection.length === 0 ? <p className="tfrun-empty">{c.empty}</p> : <div className="tfrun-rack">{save.collection.map((guitar) => <article key={guitar.id}><div><GuitarPreview platform={guitar.platform} config={guitar.config} /></div><span>{guitar.id}</span><h3>{partLabel(guitar.config.body)}</h3><p>{c.gradeScore} · {guitar.rarityScore}</p><button type="button" onClick={() => {setCompleted(guitar);setPlatform(guitar.platform);setConfig(guitar.config);setGrades(guitar.grades);updateRiff(emptyRiff());setSaved(true);setScreen('complete')}}>{c.view}</button></article>)}</div>}
  </section>

  if (screen === 'wall') return <PublicWall community={wall.entries} mine={save.published} loaded={wall.loaded} onBack={() => setScreen('collection')} onView={(guitar,entry) => { setCompleted(guitar); setPlatform(guitar.platform); setConfig(guitar.config); setGrades(guitar.grades); updateRiff(guitar.riff); setSaved(save.collection.some((item) => item.id === guitar.id)); setDetailEntry(entry); setScreen('detail') }} />

  if (screen === 'detail' && detailEntry) return <GuitarWallDetail entry={detailEntry} guitar={guitarFromBuild(detailEntry.guitar.platform,detailEntry.guitar.config)} parts={BUILD_STAGES.map(item=>({label:c.stages[item],value:partLabel(detailEntry.guitar.config[item])}))} playing={playhead>=0} onPlay={()=>void toggleRiffPlayback()} onBack={()=>{engineRef.current?.stopAll();if(sequenceTimerRef.current!==null)window.clearTimeout(sequenceTimerRef.current);sequenceTimerRef.current=null;setPlayhead(-1);setScreen('wall')}} />

  if (screen === 'riff') return <section className="tfrun tfrun--riff">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('complete')}>{c.back}</button><div><h2>{c.riffTitle}</h2></div></header>
    <p className="tfrun-riff__note">{c.riffNote}</p>
    <div className="tfrun-riff__tools"><button type="button" onClick={() => updateRiff((current) => ({ ...current, bpm: current.bpm === 90 ? 120 : current.bpm === 120 ? 150 : 90 }))}>{riff.bpm} BPM</button><button type="button" onClick={loadDemoRiff}>{c.preset}</button></div>
    <nav className="tfrun-measures" aria-label={locale === 'zh' ? '选择小节' : 'Choose measure'}>{['I','II','III','IV'].map((label,index)=><button type="button" key={label} className={measure===index?'is-current':''} aria-pressed={measure===index} onClick={()=>setMeasure(index)}>{c.measure} {label}</button>)}</nav>
    <div className="tfrun-sequencer" role="grid" aria-label={c.riffTitle}>{riff.steps.map((track,stringIndex)=><div role="row" key={stringIndex}><b>{['E2','A2','D3','G3','B3','E4'][stringIndex]}</b>{track.slice(measure*4,measure*4+4).map((cell,localStep)=>{const step=measure*4+localStep;return <button type="button" role="gridcell" aria-pressed={cell>0} className={`${cell?'is-active':''} ${cell===2?'is-accent':''} ${cell===3?'is-muted':''} ${playhead===step?'is-playing':''}`} key={step} onClick={()=>updateRiff((current)=>({...current,steps:current.steps.map((row,rowIndex)=>rowIndex===stringIndex?row.map((value,cellIndex)=>cellIndex===step?((value+1)%4) as RiffCell:value):row)}))}><span>{step+1}</span></button>})}</div>)}</div>
    <div className="tfrun-riff__actions"><button className="tfrun-primary" type="button" onClick={() => void toggleRiffPlayback()}>{playhead >= 0 ? c.stop : c.play}</button><button className="tfrun-primary" type="button" onClick={publishCurrent}>{c.publish}</button></div>
  </section>

  if (screen === 'complete' && completed) return <section className="tfrun tfrun--complete">
    <div className="tfrun-result__light" aria-hidden="true" /><div className="tfrun-result__guitar"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-result__copy"><p className="tfrun-kicker">{completed.id} / SCORE {completed.rarityScore}</p><h2>{c.complete}</h2><p>{c.completeNote}</p><details className="tfrun-result__archive"><summary>{c.archiveLabel}</summary><div className="tfrun-result__grades">{BUILD_STAGES.map((item)=><span key={item}>{c.stages[item]} · {gradeLabel(grades[item] ?? 'workshop')}</span>)}</div></details></div>
    <div className="tfrun-result__actions"><button className="is-primary" type="button" onClick={() => setScreen('riff')}>{c.riff}</button><div><button type="button" onClick={() => void playReference()}>{c.listen}</button><i /><button type="button" onClick={saveToRack} disabled={saved}>{saved ? c.saved : c.save}</button><i /><button type="button" onClick={beginRun}>{c.next}</button></div></div>
  </section>

  return <section className={`tfrun tfrun--build tfrun--${screen}`}>
    <div className="tfrun-progress" aria-label={`${progress + 1} / 5`}>{BUILD_STAGES.map((item,index)=><i key={item} className={index < progress ? 'is-done' : index === stageIndex ? 'is-current' : ''} />)}</div>
    <div className="tfrun-build__preview"><div className="tfrun-build__halo" aria-hidden="true" /><div className="tfrun-build__camera" style={{'--tf-manual-zoom':manualZoom} as CSSProperties}><AssemblyGuitarPreview platform={platform} config={previewConfig} stage={stage} stageIndex={stageIndex} focusing={screen === 'choose'} trialing={Boolean(selectedOffer)} /></div><div className="tfrun-preview-tools" aria-label={locale==='zh'?'乐器检视工具':'Instrument inspection tools'}><button type="button" className={tonePanelOpen?'is-active':''} onClick={()=>setTonePanelOpen(value=>!value)} aria-label={c.toneLab} aria-pressed={tonePanelOpen}><InspectIcon kind="tone"/></button><button type="button" onClick={()=>void auditionBuild()} disabled={stageIndex===0&&!selectedOffer} aria-label={c.audition}><InspectIcon kind={auditioning?'stop':'play'}/></button><button type="button" onClick={()=>setManualZoom((value)=>Math.max(.8,+(value-.15).toFixed(2)))} disabled={manualZoom<=.8} aria-label={c.zoomOut}><InspectIcon kind="out"/></button><button className="tfrun-preview-tools__scale" type="button" onClick={()=>setManualZoom(1)} aria-label={c.resetZoom}>{Math.round(manualZoom*100)}</button><button type="button" onClick={()=>setManualZoom((value)=>Math.min(1.45,+(value+.15).toFixed(2)))} disabled={manualZoom>=1.45} aria-label={c.zoomIn}><InspectIcon kind="in"/></button></div>{tonePanelOpen&&<aside className="tfrun-tone-test"><header><span>{c.toneLab}</span><button type="button" onClick={()=>setTonePanelOpen(false)} aria-label={locale==='zh'?'关闭音色测试':'Close tone test'}><InspectIcon kind="close"/></button></header><div className="tfrun-tone-test__channel"><button type="button" className={channel==='clean'?'is-active':''} onClick={()=>setChannel('clean')}>{c.clean}</button><button type="button" className={channel==='drive'?'is-active':''} onClick={()=>setChannel('drive')}>{c.driveChannel}</button></div><div className="tfrun-tone-test__meters">{(Object.keys(toneLabels) as ToneMetric[]).map(metric=><p key={metric}><span>{toneLabels[metric][locale]}</span><i><em style={{width:`${selectedSource.tone[metric]}%`}}/></i><b>{selectedSource.tone[metric]}</b></p>)}</div><button className="tfrun-tone-test__play" type="button" onClick={()=>void auditionBuild()} disabled={stageIndex===0&&!selectedOffer}><InspectIcon kind={auditioning?'stop':'play'}/><span>{c.audition}</span></button></aside>}{selectedOffer && <div className="tfrun-trial"><span>{partLabel(selectedOffer.part)}</span><b>{gradeLabel(selectedOffer.grade)}</b></div>}</div>
    <div className="tfrun-build__panel">
      <div className="tfrun-build__folio" aria-hidden="true"><span>SPECIMEN BUILD</span><b>{String(stageIndex+1).padStart(2,'0')} / 05</b></div>
      <div className="tfrun-build__prompt"><h2>{screen === 'sealed' ? c.sealed : c.chooseTitle[stage]}</h2><p>{screen === 'sealed' ? c.sealedNote : c.chooseDetail[stage]}</p></div>
      {screen === 'sealed' ? <button className="tfrun-case" type="button" onClick={openCase}>
        <span className="tfrun-case__number" aria-hidden="true">{String(stageIndex + 1).padStart(2, '0')}</span>
        <span className="tfrun-case__copy">
          <small>{locale === 'zh' ? `密封部件 · ${c.stages[stage]}` : `SEALED SPECIMEN · ${c.stages[stage].toUpperCase()}`}</small>
          <b>{c.open}</b>
        </span>
        <i className="tfrun-case__seal" aria-hidden="true" />
      </button> : <>
        <div className="tfrun-offers">{offers.map((offer)=><button type="button" key={offer.id} className={`tfrun-offer tfrun-offer--${offer.grade} ${selectedOffer?.id===offer.id?'is-selected':''}`} onClick={()=>{engineRef.current?.stopAll();if(auditionTimerRef.current!==null)window.clearTimeout(auditionTimerRef.current);auditionTimerRef.current=null;setAuditioning(false);setSelectedOffer(offer)}} aria-pressed={selectedOffer?.id===offer.id}><span className="tfrun-offer__serial">{offer.serial}</span><b>{partLabel(offer.part)}</b><small>{gradeLabel(offer.grade)}</small><i aria-hidden="true" /></button>)}</div>
        <button className="tfrun-primary" type="button" onClick={mountPart} disabled={!selectedOffer}>{c.mount}</button>
      </>}
    </div>
  </section>
}
