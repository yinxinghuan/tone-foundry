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
import { PublicWall } from './PublicWall'
import { useFoundrySave } from '../hooks/useFoundrySave'
import { useGuitarWall } from '../hooks/useGuitarWall'
import { emptyRiff, type PublishedGuitar, type RiffCell, type RiffPattern } from '../gameplay/save'
import './BuildRun.less'

type RunScreen = 'start' | 'sealed' | 'choose' | 'complete' | 'riff' | 'collection' | 'wall'

const copy = {
  zh: {
    title: '今晚做一把什么琴？', intro: '开一张随机工单。每一步只从这次开出的部件里选一个。',
    start: '开启新工单', collection: '我的琴架', wall: '公共琴墙', odds: '公开概率', oddsLine: 'WORKSHOP 68% · SELECT 27% · ARCHIVE 5%',
    stages: { body: '琴体', neck: '琴颈', pickups: '拾音器', bridge: '琴桥', finish: '饰面' },
    sealed: '零件箱已到达', sealedNote: '本箱只包含当前步骤的 2–3 个候选。开启后不能刷新。', open: '拆开零件箱',
    choose: '选择一个部件', chooseNote: '其余部件会退回仓库。选择确认后进入下一张工单。', mount: '装上这个部件',
    workshop: '工坊级', select: '精选级', archive: '典藏级',
    platformBolt: '25.5 英寸螺栓颈工单', platformSet: '24.75 英寸胶合颈工单',
    complete: '成琴检验完成', completeNote: '这把琴由本局五次抽取共同决定。', listen: '播放标准试听', riff: '写一段 First Riff', save: '放入琴架', next: '再开一张工单',
    riffTitle: 'First Riff / 16 步草稿', riffNote: '轻点格子循环：关闭 → 音符 → 重音 → 闷音。', play: '播放', stop: '停止', back: '返回成琴', publish: '发布到公共琴墙', preset: '装入示范节奏',
    empty: '琴架还是空的。完成第一把琴后，它会出现在这里。', view: '查看', backStart: '返回工单', gradeScore: '制造档案', saved: '已收入琴架',
  },
  en: {
    title: 'What will the bench build tonight?', intro: 'Open a random work order. At each step, keep one of the parts drawn for this run.',
    start: 'Open new work order', collection: 'My rack', wall: 'Public wall', odds: 'Published odds', oddsLine: 'WORKSHOP 68% · SELECT 27% · ARCHIVE 5%',
    stages: { body: 'Body', neck: 'Neck', pickups: 'Pickups', bridge: 'Bridge', finish: 'Finish' },
    sealed: 'Parts case delivered', sealedNote: 'This case contains only 2–3 candidates for the current step. No rerolls.', open: 'Open parts case',
    choose: 'Choose one part', chooseNote: 'The other parts return to stock. Confirming advances the work order.', mount: 'Mount this part',
    workshop: 'Workshop', select: 'Select', archive: 'Archive',
    platformBolt: '25.5 in bolt-on order', platformSet: '24.75 in set-neck order',
    complete: 'Final inspection passed', completeNote: 'Five limited draws created this instrument.', listen: 'Play reference riff', riff: 'Write a First Riff', save: 'Add to rack', next: 'Open another order',
    riffTitle: 'First Riff / 16-step draft', riffNote: 'Tap a cell to cycle: off → note → accent → mute.', play: 'Play', stop: 'Stop', back: 'Back to guitar', publish: 'Publish to public wall', preset: 'Load demo rhythm',
    empty: 'Your rack is empty. Finish the first guitar to place it here.', view: 'View', backStart: 'Back to order', gradeScore: 'Build archive', saved: 'Added to rack',
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

  const stage = BUILD_STAGES[stageIndex]
  const progress = screen === 'complete' || screen === 'riff' ? 5 : stageIndex
  const selectedSource = useMemo(() => sourceGuitar(platform, config), [config, platform])

  useEffect(() => {
    engineRef.current = new ToneEngine()
    return () => {
      if (sequenceTimerRef.current !== null) window.clearInterval(sequenceTimerRef.current)
      engineRef.current?.dispose()
    }
  }, [])

  const beginRun = () => {
    const seed = createRunSeed()
    setRunId(seed.id); setPlatform(seed.platform); setConfig(seed.config); setStageIndex(0); setOffers([]); setSelectedOffer(null); setGrades({}); setCompleted(null); setSaved(false); setRiff(emptyRiff()); setScreen('sealed')
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
    <p className="tfrun-kicker">TONE FOUNDRY / BUILD RUN</p><h2>{c.title}</h2><p className="tfrun-lead">{c.intro}</p>
    <button className="tfrun-primary" type="button" onClick={beginRun}>{c.start}</button>
    <button className="tfrun-secondary" type="button" onClick={() => setScreen('collection')}>{c.collection}<span>{save.collection.length}</span></button>
    <button className="tfrun-secondary" type="button" onClick={() => setScreen('wall')}>{c.wall}<span>{save.published.length}</span></button>
    <div className="tfrun-odds"><span>{c.odds}</span><b>{c.oddsLine}</b></div>
  </section>

  if (screen === 'collection') return <section className="tfrun tfrun--collection">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('start')}>{c.backStart}</button><div><span>COLLECTION / {save.collection.length} OF 24</span><h2>{c.collection}</h2></div><button type="button" onClick={() => setScreen('wall')}>{c.wall}</button></header>
    {save.collection.length === 0 ? <p className="tfrun-empty">{c.empty}</p> : <div className="tfrun-rack">{save.collection.map((guitar) => <article key={guitar.id}><div><GuitarPreview platform={guitar.platform} config={guitar.config} /></div><span>{guitar.id}</span><h3>{partLabel(guitar.config.body)}</h3><p>{c.gradeScore} · {guitar.rarityScore}</p><button type="button" onClick={() => {setCompleted(guitar);setPlatform(guitar.platform);setConfig(guitar.config);setGrades(guitar.grades);setRiff(emptyRiff());setSaved(true);setScreen('complete')}}>{c.view}</button></article>)}</div>}
  </section>

  if (screen === 'wall') return <PublicWall community={wall.entries} mine={save.published} loaded={wall.loaded} onBack={() => setScreen('collection')} onView={(guitar) => { setCompleted(guitar); setPlatform(guitar.platform); setConfig(guitar.config); setGrades(guitar.grades); setRiff(guitar.riff); setSaved(save.collection.some((item) => item.id === guitar.id)); setScreen('complete') }} />

  if (screen === 'riff') return <section className="tfrun tfrun--riff">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('complete')}>{c.back}</button><div><span>{riff.bpm} BPM / 4·4</span><h2>{c.riffTitle}</h2></div></header>
    <p className="tfrun-riff__note">{c.riffNote}</p>
    <div className="tfrun-riff__tools"><button type="button" onClick={() => setRiff((current) => ({ ...current, bpm: current.bpm === 90 ? 120 : current.bpm === 120 ? 150 : 90 }))}>{riff.bpm} BPM</button><button type="button" onClick={loadDemoRiff}>{c.preset}</button></div>
    <div className="tfrun-sequencer" role="grid" aria-label={c.riffTitle}>{riff.steps.map((track,stringIndex)=><div role="row" key={stringIndex}><b>{['E2','A2','D3','G3','B3','E4'][stringIndex]}</b>{track.map((cell,step)=><button type="button" role="gridcell" aria-pressed={cell>0} className={`${cell?'is-active':''} ${cell===2?'is-accent':''} ${cell===3?'is-muted':''} ${playhead===step?'is-playing':''}`} key={step} onClick={()=>setRiff((current)=>({...current,steps:current.steps.map((row,rowIndex)=>rowIndex===stringIndex?row.map((value,cellIndex)=>cellIndex===step?((value+1)%4) as RiffCell:value):row)}))}><span>{step+1}</span></button>)}</div>)}</div>
    <div className="tfrun-riff__actions"><button className="tfrun-primary" type="button" onClick={() => void toggleRiffPlayback()}>{playhead >= 0 ? c.stop : c.play}</button><button className="tfrun-primary" type="button" onClick={publishCurrent}>{c.publish}</button></div>
  </section>

  if (screen === 'complete' && completed) return <section className="tfrun tfrun--complete">
    <div className="tfrun-result__light" aria-hidden="true" /><div className="tfrun-result__guitar"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-result__copy"><p className="tfrun-kicker">{completed.id} / SCORE {completed.rarityScore}</p><h2>{c.complete}</h2><p>{c.completeNote}</p><div className="tfrun-result__grades">{BUILD_STAGES.map((item)=><span key={item}>{c.stages[item]} · {gradeLabel(grades[item] ?? 'workshop')}</span>)}</div></div>
    <div className="tfrun-result__actions"><button type="button" onClick={() => void playReference()}>{c.listen}</button><button type="button" onClick={() => setScreen('riff')}>{c.riff}</button><button className="is-primary" type="button" onClick={saveToRack} disabled={saved}>{saved ? c.saved : c.save}</button><button type="button" onClick={beginRun}>{c.next}</button></div>
  </section>

  return <section className={`tfrun tfrun--build tfrun--${screen}`}>
    <header className="tfrun-order"><div><span>WORK ORDER / {runId}</span><b>{platform === 'bolt-on' ? c.platformBolt : c.platformSet}</b></div><ol>{BUILD_STAGES.map((item,index)=><li key={item} className={index < progress ? 'is-done' : index === stageIndex ? 'is-current' : ''}><span>{index+1}</span><b>{c.stages[item]}</b></li>)}</ol></header>
    <div className="tfrun-build__preview"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-build__panel">
      <p className="tfrun-kicker">STEP {stageIndex + 1} / 5 · {c.stages[stage]}</p><h2>{screen === 'sealed' ? c.sealed : c.choose}</h2><p>{screen === 'sealed' ? c.sealedNote : c.chooseNote}</p>
      {screen === 'sealed' ? <button className="tfrun-case" type="button" onClick={openCase}><span aria-hidden="true">TF / {runId.slice(-4)}</span><b>{c.open}</b><i aria-hidden="true" /></button> : <>
        <div className="tfrun-offers">{offers.map((offer)=><button type="button" key={offer.id} className={`tfrun-offer tfrun-offer--${offer.grade} ${selectedOffer?.id===offer.id?'is-selected':''}`} onClick={()=>setSelectedOffer(offer)} aria-pressed={selectedOffer?.id===offer.id}><span>{offer.serial}</span><b>{partLabel(offer.part)}</b><small>{gradeLabel(offer.grade)}</small><i aria-hidden="true" /></button>)}</div>
        <button className="tfrun-primary" type="button" onClick={mountPart} disabled={!selectedOffer}>{c.mount}</button>
      </>}
    </div>
  </section>
}
