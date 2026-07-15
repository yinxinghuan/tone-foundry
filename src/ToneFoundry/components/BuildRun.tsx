import { useEffect, useMemo, useRef, useState } from 'react'
import { GUITARS } from '../catalog'
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
import type { GuitarSpec } from '../types'
import { ModularGuitarPreview as GuitarPreview } from './ModularGuitarPreview'
import { AssemblyGuitarPreview } from './AssemblyGuitarPreview'
import { PublicWall } from './PublicWall'
import { useFoundrySave } from '../hooks/useFoundrySave'
import { useGuitarWall } from '../hooks/useGuitarWall'
import { emptyRiff, type PublishedGuitar, type RiffCell, type RiffPattern } from '../gameplay/save'
import './BuildRun.less'

type RunScreen = 'start' | 'sealed' | 'choose' | 'complete' | 'riff' | 'collection' | 'wall'

const copy = {
  zh: {
    title: '做一把只属于你的琴', intro: '五个包裹。每次留下一个部件。',
    start: '开始制琴', collection: '我的琴架', wall: '公共琴墙', odds: '部件等级', oddsLine: '工坊 68% · 精选 27% · 典藏 5%',
    stages: { body: '琴体', neck: '琴颈', pickups: '拾音器', bridge: '琴桥', finish: '饰面' },
    sealed: '打开下一个包裹', sealedNote: '里面只会出现这一次的候选。', open: '拆开包裹',
    choose: '哪一个更像你的琴？', chooseNote: '轻点候选，直接在琴上试装。', mount: '就选这个',
    chooseTitle: { body: '先选它的轮廓', neck: '握住它的性格', pickups: '让它开始有声音', bridge: '决定琴弦落在哪里', finish: '最后，让木头显色' },
    chooseDetail: { body: '轻点候选，琴体会在模具上显影。', neck: '镜头已移到琴颈，直接试装。', pickups: '不同线圈，会留下不同的攻击感。', bridge: '琴桥改变触弦、延音与回弹。', finish: '漆面会在确认前完整显影。' },
    workshop: '工坊级', select: '精选级', archive: '典藏级',
    platformBolt: '25.5 英寸螺栓颈工单', platformSet: '24.75 英寸胶合颈工单',
    complete: '你的琴做好了', completeNote: '五次选择，留下这一种声音。', listen: '试听', riff: '写一段 First Riff', save: '收进琴架', next: '再做一把', archiveLabel: '查看制造档案',
    riffTitle: 'First Riff / 16 步草稿', riffNote: '轻点格子循环：关闭 → 音符 → 重音 → 闷音。', play: '播放', stop: '停止', back: '返回成琴', publish: '发布到公共琴墙', preset: '装入示范节奏',
    empty: '琴架还是空的。完成第一把琴后，它会出现在这里。', view: '查看', backStart: '返回工单', gradeScore: '制造档案', saved: '已收入琴架', measure: '小节',
  },
  en: {
    title: 'Build a guitar that is only yours', intro: 'Five parcels. Keep one part from each.',
    start: 'Start building', collection: 'My rack', wall: 'Public wall', odds: 'Part grades', oddsLine: 'Workshop 68% · Select 27% · Archive 5%',
    stages: { body: 'Body', neck: 'Neck', pickups: 'Pickups', bridge: 'Bridge', finish: 'Finish' },
    sealed: 'Open the next parcel', sealedNote: 'Only this run’s candidates are inside.', open: 'Unwrap parcel',
    choose: 'Which one feels like yours?', chooseNote: 'Tap a candidate to trial-fit it on the guitar.', mount: 'Keep this one',
    chooseTitle: { body: 'Choose its silhouette', neck: 'Shape the hand feel', pickups: 'Give it a voice', bridge: 'Set the strings in place', finish: 'Let the wood show' },
    chooseDetail: { body: 'Tap a candidate to reveal it on the form.', neck: 'The camera is on the neck. Trial-fit it here.', pickups: 'Each coil changes the attack.', bridge: 'The bridge changes touch, sustain and return.', finish: 'See the full finish before you keep it.' },
    workshop: 'Workshop', select: 'Select', archive: 'Archive',
    platformBolt: '25.5 in bolt-on order', platformSet: '24.75 in set-neck order',
    complete: 'Your guitar is ready', completeNote: 'Five choices left one distinct voice.', listen: 'Listen', riff: 'Write a First Riff', save: 'Add to rack', next: 'Make another', archiveLabel: 'View build archive',
    riffTitle: 'First Riff / 16-step draft', riffNote: 'Tap a cell to cycle: off → note → accent → mute.', play: 'Play', stop: 'Stop', back: 'Back to guitar', publish: 'Publish to public wall', preset: 'Load demo rhythm',
    empty: 'Your rack is empty. Finish the first guitar to place it here.', view: 'View', backStart: 'Back to order', gradeScore: 'Build archive', saved: 'Added to rack', measure: 'Bar',
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

function sourceGuitar(platform: BuildPlatform, config: BuildConfig): GuitarSpec {
  const body = config.body
  const id = platform === 'bolt-on'
    ? body === 'contour' ? 'contour-sss' : body === 'offset' ? 'offset-current' : 'workshop-slab'
    : body === 'centerblock' ? 'centerblock-semi' : body === 'thin-horn' ? 'thin-double-horn' : 'carved-crown'
  return GUITARS.find((guitar) => guitar.id === id) ?? GUITARS[0]
}

export function BuildRun() {
  const c = copy[locale]
  const save = useFoundrySave()
  const wall = useGuitarWall()
  const engineRef = useRef<ToneEngine | null>(null)
  const sequenceTimerRef = useRef<number | null>(null)
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
  const [riff, setRiff] = useState<RiffPattern>(() => emptyRiff())
  const [playhead, setPlayhead] = useState(-1)
  const [measure, setMeasure] = useState(0)

  const stage = BUILD_STAGES[stageIndex]
  const progress = screen === 'complete' || screen === 'riff' ? 5 : stageIndex
  const previewConfig = useMemo(() => selectedOffer ? applyOffer(config, stage, selectedOffer) : config, [config, selectedOffer, stage])
  const selectedSource = useMemo(() => sourceGuitar(platform, previewConfig), [platform, previewConfig])

  useEffect(() => {
    engineRef.current = new ToneEngine()
    return () => {
      if (sequenceTimerRef.current !== null) window.clearInterval(sequenceTimerRef.current)
      engineRef.current?.dispose()
    }
  }, [])

  const beginRun = () => {
    const seed = createRunSeed()
    setRunId(seed.id); setPlatform(seed.platform); setConfig(seed.config); setStageIndex(0); setOffers([]); setSelectedOffer(null); setGrades({}); setCompleted(null); setSaved(false); setRiff(emptyRiff()); setMeasure(0); setScreen('sealed')
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

  const toggleRiffPlayback = async () => {
    if (sequenceTimerRef.current !== null) {
      window.clearInterval(sequenceTimerRef.current); sequenceTimerRef.current = null; setPlayhead(-1); engineRef.current?.stopAll(); return
    }
    await engineRef.current?.enable()
    let step = 0
    setPlayhead(step)
    riff.steps.forEach((track, stringIndex) => { if (track[step]) engineRef.current?.pluck(selectedSource, stringIndex, 'clean', 0, track[step] === 2 ? 1 : track[step] === 3 ? .38 : .72) })
    sequenceTimerRef.current = window.setInterval(() => {
      step = (step + 1) % 16; setPlayhead(step)
      riff.steps.forEach((track, stringIndex) => { if (track[step]) engineRef.current?.pluck(selectedSource, stringIndex, 'clean', 0, track[step] === 2 ? 1 : track[step] === 3 ? .38 : .72) })
    }, 60000 / riff.bpm / 4)
  }

  const saveToRack = () => {
    if (!completed || saved) return
    save.saveBuild(completed); setSaved(true)
  }

  const loadDemoRiff = () => {
    const next = emptyRiff()
    const pattern: Array<[number, number, RiffCell]> = [[0,0,2],[0,4,1],[0,8,2],[0,12,1],[1,2,1],[1,6,1],[1,10,1],[1,14,1],[2,3,3],[2,7,3],[2,11,3],[2,15,3],[4,6,1],[5,14,2]]
    for (const [stringIndex, step, value] of pattern) next.steps[stringIndex][step] = value
    setRiff(next)
  }

  const publishCurrent = () => {
    if (!completed) return
    const published: PublishedGuitar = { ...completed, riff, publishedAt: Date.now() }
    save.publish(published)
    wall.refresh()
    setScreen('wall')
  }

  if (screen === 'start') return <section className="tfrun tfrun--start">
    <div className="tfrun-start__mark" aria-hidden="true"><span>TF</span><i /></div>
    <p className="tfrun-kicker">TONE FOUNDRY</p><h2>{c.title}</h2><p className="tfrun-lead">{c.intro}</p>
    <button className="tfrun-primary" type="button" onClick={beginRun}>{c.start}</button>
    <div className="tfrun-start__links"><button type="button" onClick={() => setScreen('collection')}>{c.collection}<span>{save.collection.length}</span></button><i /><button type="button" onClick={() => setScreen('wall')}>{c.wall}<span>{save.published.length}</span></button></div>
    <details className="tfrun-odds"><summary>{c.odds}</summary><b>{c.oddsLine}</b></details>
  </section>

  if (screen === 'collection') return <section className="tfrun tfrun--collection">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('start')}>{c.backStart}</button><div><h2>{c.collection}</h2></div><button type="button" onClick={() => setScreen('wall')}>{c.wall}</button></header>
    {save.collection.length === 0 ? <p className="tfrun-empty">{c.empty}</p> : <div className="tfrun-rack">{save.collection.map((guitar) => <article key={guitar.id}><div><GuitarPreview platform={guitar.platform} config={guitar.config} /></div><span>{guitar.id}</span><h3>{partLabel(guitar.config.body)}</h3><p>{c.gradeScore} · {guitar.rarityScore}</p><button type="button" onClick={() => {setCompleted(guitar);setPlatform(guitar.platform);setConfig(guitar.config);setGrades(guitar.grades);setRiff(emptyRiff());setSaved(true);setScreen('complete')}}>{c.view}</button></article>)}</div>}
  </section>

  if (screen === 'wall') return <PublicWall community={wall.entries} mine={save.published} loaded={wall.loaded} onBack={() => setScreen('collection')} onView={(guitar) => { setCompleted(guitar); setPlatform(guitar.platform); setConfig(guitar.config); setGrades(guitar.grades); setRiff(guitar.riff); setSaved(save.collection.some((item) => item.id === guitar.id)); setScreen('complete') }} />

  if (screen === 'riff') return <section className="tfrun tfrun--riff">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('complete')}>{c.back}</button><div><h2>{c.riffTitle}</h2></div></header>
    <p className="tfrun-riff__note">{c.riffNote}</p>
    <div className="tfrun-riff__tools"><button type="button" onClick={() => setRiff((current) => ({ ...current, bpm: current.bpm === 90 ? 120 : current.bpm === 120 ? 150 : 90 }))}>{riff.bpm} BPM</button><button type="button" onClick={loadDemoRiff}>{c.preset}</button></div>
    <nav className="tfrun-measures" aria-label={locale === 'zh' ? '选择小节' : 'Choose measure'}>{['I','II','III','IV'].map((label,index)=><button type="button" key={label} className={measure===index?'is-current':''} aria-pressed={measure===index} onClick={()=>setMeasure(index)}>{c.measure} {label}</button>)}</nav>
    <div className="tfrun-sequencer" role="grid" aria-label={c.riffTitle}>{riff.steps.map((track,stringIndex)=><div role="row" key={stringIndex}><b>{['E2','A2','D3','G3','B3','E4'][stringIndex]}</b>{track.slice(measure*4,measure*4+4).map((cell,localStep)=>{const step=measure*4+localStep;return <button type="button" role="gridcell" aria-pressed={cell>0} className={`${cell?'is-active':''} ${cell===2?'is-accent':''} ${cell===3?'is-muted':''} ${playhead===step?'is-playing':''}`} key={step} onClick={()=>setRiff((current)=>({...current,steps:current.steps.map((row,rowIndex)=>rowIndex===stringIndex?row.map((value,cellIndex)=>cellIndex===step?((value+1)%4) as RiffCell:value):row)}))}><span>{step+1}</span></button>})}</div>)}</div>
    <div className="tfrun-riff__actions"><button className="tfrun-primary" type="button" onClick={() => void toggleRiffPlayback()}>{playhead >= 0 ? c.stop : c.play}</button><button className="tfrun-primary" type="button" onClick={publishCurrent}>{c.publish}</button></div>
  </section>

  if (screen === 'complete' && completed) return <section className="tfrun tfrun--complete">
    <div className="tfrun-result__light" aria-hidden="true" /><div className="tfrun-result__guitar"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-result__copy"><p className="tfrun-kicker">{completed.id} / SCORE {completed.rarityScore}</p><h2>{c.complete}</h2><p>{c.completeNote}</p><details className="tfrun-result__archive"><summary>{c.archiveLabel}</summary><div className="tfrun-result__grades">{BUILD_STAGES.map((item)=><span key={item}>{c.stages[item]} · {gradeLabel(grades[item] ?? 'workshop')}</span>)}</div></details></div>
    <div className="tfrun-result__actions"><button className="is-primary" type="button" onClick={() => setScreen('riff')}>{c.riff}</button><div><button type="button" onClick={() => void playReference()}>{c.listen}</button><i /><button type="button" onClick={saveToRack} disabled={saved}>{saved ? c.saved : c.save}</button><i /><button type="button" onClick={beginRun}>{c.next}</button></div></div>
  </section>

  return <section className={`tfrun tfrun--build tfrun--${screen}`}>
    <div className="tfrun-progress" aria-label={`${progress + 1} / 5`}>{BUILD_STAGES.map((item,index)=><i key={item} className={index < progress ? 'is-done' : index === stageIndex ? 'is-current' : ''} />)}</div>
    <div className="tfrun-build__preview"><div className="tfrun-build__halo" aria-hidden="true" /><AssemblyGuitarPreview platform={platform} config={previewConfig} stage={stage} stageIndex={stageIndex} focusing={screen === 'choose'} trialing={Boolean(selectedOffer)} />{selectedOffer && <div className="tfrun-trial"><span>{partLabel(selectedOffer.part)}</span><b>{gradeLabel(selectedOffer.grade)}</b></div>}</div>
    <div className="tfrun-build__panel">
      <div className="tfrun-build__prompt"><h2>{screen === 'sealed' ? c.sealed : c.chooseTitle[stage]}</h2><p>{screen === 'sealed' ? c.sealedNote : c.chooseDetail[stage]}</p></div>
      {screen === 'sealed' ? <button className="tfrun-case" type="button" onClick={openCase}><span aria-hidden="true">TONE FOUNDRY</span><b>{c.open}</b><i aria-hidden="true" /></button> : <>
        <div className="tfrun-offers">{offers.map((offer)=><button type="button" key={offer.id} className={`tfrun-offer tfrun-offer--${offer.grade} ${selectedOffer?.id===offer.id?'is-selected':''}`} onClick={()=>setSelectedOffer(offer)} aria-pressed={selectedOffer?.id===offer.id}><b>{partLabel(offer.part)}</b><small>{gradeLabel(offer.grade)}</small><i aria-hidden="true" /></button>)}</div>
        <button className="tfrun-primary" type="button" onClick={mountPart} disabled={!selectedOffer}>{c.mount}</button>
      </>}
    </div>
  </section>
}
