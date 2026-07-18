import { useEffect, useMemo, useRef, useState } from 'react'
import { ToneEngine } from '../audio/ToneEngine'
import { EFFECTS, type EffectId } from '../audio/effects'
import { telegramId } from '@shared/runtime'
import {
  BUILD_STAGES,
  applyOffer,
  createRunSeed,
  drawOffers,
  finishBuild,
  isOfferCompatible,
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
import { ModularGuitarViewport } from './ModularGuitarViewport'
import { EffectPedal } from './EffectPedal'
import { PublicWall } from './PublicWall'
import { useFoundrySave } from '../hooks/useFoundrySave'
import { useGuitarWall } from '../hooks/useGuitarWall'
import { emptyRiff, type PublishedGuitar, type RemixSource, type RiffCell, type RiffPattern } from '../gameplay/save'
import { guitarFromBuild } from '../gameplay/buildTone'
import type { WallEntry } from '../gameplay/save'
import { GuitarWallDetail } from './GuitarWallDetail'
import type { ToneMetric } from '../types'
import './BuildRun.less'

type RunScreen = 'start' | 'sealed' | 'choose' | 'tone' | 'complete' | 'riff' | 'collection' | 'wall' | 'detail'

const copy = {
  zh: {
    title: '把声音做成一件物品', intro: '五次选择，做出一把只属于你的琴。',
    start: '开始一份新标本', collection: '我的琴架', wall: '公共琴墙', odds: '部件等级', oddsLine: '工坊 68% · 精选 27% · 典藏 5%',
    stages: { body: '琴体', neck: '琴颈', pickups: '拾音器', bridge: '琴桥', finish: '饰面' },
    sealed: '打开下一个包裹', sealedNote: '这一包会随机揭示 2–3 件候选；本局只能从中选 1 件。下一份工单会抽到不同组合。', open: '拆开包裹', drawLabel: '本局随机抽取', drawNote: '下一局会有不同候选',
    choose: '哪一个更像你的琴？', chooseNote: '轻点候选，直接在琴上试装。', mount: '就选这个', audition: '试听当前组合', zoomIn: '放大', zoomOut: '缩小', resetZoom: '复位视图', toneLab: '音色测试',
    chooseTitle: { body: '先选它的轮廓', neck: '握住它的性格', pickups: '让它开始有声音', bridge: '决定琴弦落在哪里', finish: '最后，让木头显色' },
    chooseDetail: { body: '轻点候选，琴体会在模具上显影。', neck: '镜头已移到琴颈，直接试装。', pickups: '不同线圈，会留下不同的攻击感。', bridge: '琴桥改变触弦、延音与回弹。', finish: '漆面会在确认前完整显影。' },
    workshop: '工坊级', select: '精选级', archive: '典藏级',
    platformBolt: '25.5 英寸螺栓颈工单', platformSet: '24.75 英寸胶合颈工单',
    tuneTitle: '现在，听它怎么说话', tuneNote: '点选已开出的部件，或加入效果器；吉他和声音会立刻变化。', tuneContinue: '确认这把琴', refit: '试装部件',
    complete: '你的琴做好了', completeNote: '五次选择，留下这一种声音。', listen: '试听', riff: '写一段 First Riff', save: '收进琴架', next: '再做一把', archiveLabel: '查看制造档案',
    riffTitle: 'First Riff / 步进草稿', riffNote: '轻点格子循环：关闭 → 音符 → 重音 → 闷音。预设会随效果器链优先匹配。', play: '播放', stop: '停止', back: '返回成琴', publish: '发布到公共琴墙', preset: '抽一条匹配效果器的预载 Riff',
    empty: '琴架还是空的。完成第一把琴后，它会出现在这里。', view: '查看', backStart: '返回工单', gradeScore: '制造档案', saved: '已收入琴架', measure: '小节',
  },
  en: {
    title: 'Make sound into an object', intro: 'Five sealed choices. One instrument with a voice of its own.',
    start: 'Begin a new specimen', collection: 'My instruments', wall: 'Public index', odds: 'Edition grades', oddsLine: 'Workshop 68% · Select 27% · Archive 5%',
    stages: { body: 'Body', neck: 'Neck', pickups: 'Pickups', bridge: 'Bridge', finish: 'Finish' },
    sealed: 'Open the next specimen pack', sealedNote: 'This pack randomly reveals 2–3 candidates. Keep one this run; a new order draws a different set.', open: 'Reveal candidates', drawLabel: 'This run’s random draw', drawNote: 'A new order reveals a different set',
    choose: 'Which one feels like yours?', chooseNote: 'Tap a candidate to trial-fit it on the guitar.', mount: 'Keep this one', audition: 'Hear this build', zoomIn: 'Zoom in', zoomOut: 'Zoom out', resetZoom: 'Reset view', toneLab: 'Tone test',
    chooseTitle: { body: 'Choose its silhouette', neck: 'Shape the hand feel', pickups: 'Give it a voice', bridge: 'Set the strings in place', finish: 'Let the wood show' },
    chooseDetail: { body: 'Tap a candidate to reveal it on the form.', neck: 'The camera is on the neck. Trial-fit it here.', pickups: 'Each coil changes the attack.', bridge: 'The bridge changes touch, sustain and return.', finish: 'See the full finish before you keep it.' },
    workshop: 'Workshop', select: 'Select', archive: 'Archive',
    platformBolt: '25.5 in bolt-on order', platformSet: '24.75 in set-neck order',
    tuneTitle: 'Now hear it speak', tuneNote: 'Try a revealed part or add a pedal. The instrument and its voice change immediately.', tuneContinue: 'Keep this instrument', refit: 'Try fitted parts',
    complete: 'Specimen complete', completeNote: 'A unique instrument, indexed by shape and sound.', listen: 'Listen', riff: 'Write its First Riff', save: 'Add to collection', next: 'Make another', archiveLabel: 'View specimen record',
    riffTitle: 'First Riff / step study', riffNote: 'Tap a cell to cycle: off → note → accent → mute. Presets favor your current pedal chain.', play: 'Play', stop: 'Stop', back: 'Back to instrument', publish: 'Publish to public index', preset: 'Draw an effect-matched preset',
    empty: 'Your collection is empty. Complete the first specimen to place it here.', view: 'View', backStart: 'Back to index', gradeScore: 'Archive score', saved: 'Added to collection', measure: 'Bar',
  },
} as const

const partNames: Record<string, { zh:string; en:string }> = {
  slab:{zh:'板式单切',en:'Slab single-cut'}, contour:{zh:'轮廓双切',en:'Contour double-cut'}, offset:{zh:'偏移琴体',en:'Offset body'}, thinline:{zh:'薄空心单切',en:'Thinline single-cut'}, reverse:{zh:'反向偏移',en:'Reverse offset'},
  carved:{zh:'雕面单切',en:'Carved single-cut'}, centerblock:{zh:'中心块半空心',en:'Centerblock semi'}, 'thin-horn':{zh:'薄双角',en:'Thin double-horn'}, 'v-wing':{zh:'V 翼实心',en:'V-wing solid'}, angular:{zh:'前卫角型',en:'Angular solid'}, archtop:{zh:'全空心拱面',en:'Full hollow archtop'},
  'maple-inline':{zh:'一体枫木六联',en:'Maple inline'}, 'rosewood-inline':{zh:'深色指板六联',en:'Dark-board inline'},
  'dot-bound':{zh:'圆点包边指板',en:'Bound dot board'}, 'trapezoid-bound':{zh:'梯形包边指板',en:'Bound trapezoid board'},
  'dual-single':{zh:'双单线圈',en:'Dual single'}, sss:{zh:'SSS 三单',en:'SSS triple'}, hss:{zh:'HSS 热改',en:'HSS hot rod'}, 'wide-dual':{zh:'双宽单线圈',en:'Dual wide single'},
  'covered-humbuckers':{zh:'双封闭线圈',en:'Covered humbuckers'}, 'soapbar-p90':{zh:'双皂条单线圈',en:'Soapbar singles'}, 'mini-humbuckers':{zh:'双迷你线圈',en:'Mini humbuckers'},
  'three-saddle':{zh:'三鞍桥板',en:'Three-saddle plate'}, tremolo:{zh:'同步颤音',en:'Synchronized trem'}, hardtail:{zh:'六鞍硬尾',en:'Hardtail'}, floating:{zh:'浮动颤音',en:'Floating vibrato'},
  stopbar:{zh:'止弦尾件',en:'Stop bar'}, trapeze:{zh:'梯形尾件',en:'Trapeze tail'}, 'short-vibrola':{zh:'短板颤音',en:'Short vibrola'},
  blonde:{zh:'陈年金黄',en:'Aged blonde'}, sunburst:{zh:'三色渐变',en:'Three-tone burst'}, black:{zh:'旧黑',en:'Worn black'}, surf:{zh:'海玻璃绿',en:'Sea glass'}, copper:{zh:'铜火金属漆',en:'Copper fire metallic'}, ice:{zh:'冰蓝金属漆',en:'Ice blue metallic'}, walnut:{zh:'透明胡桃',en:'Translucent walnut'}, ivory:{zh:'旧象牙',en:'Aged ivory'},
  cherry:{zh:'深樱桃红',en:'Deep cherry'}, gold:{zh:'陈年金色',en:'Aged gold'}, ebony:{zh:'黑檀漆面',en:'Ebony lacquer'}, natural:{zh:'自然枫木',en:'Natural maple'}, wine:{zh:'酒红漆',en:'Wine nitro'}, silver:{zh:'银雾金属漆',en:'Silver mist metallic'}, tobacco:{zh:'烟草渐变',en:'Tobacco burst'}, cream:{zh:'奶油旧漆',en:'Aged cream'},
}

function gradeLabel(grade: BuildGrade) { return copy[locale][grade] }
function partLabel(part: string) { return partNames[part]?.[locale] ?? part }

function InspectIcon({kind}:{kind:'play'|'stop'|'in'|'out'|'reset'|'tone'|'close'}) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{kind==='close'?<path d="m7 7 10 10M17 7 7 17" fill="none"/>:kind==='tone'?<><path d="M5 16V9M9 19V5M13 15V8M17 18V6M21 14v-4" fill="none"/></>:kind==='play'?<path d="M8 5.5v13l10-6.5z"/>:kind==='stop'?<rect x="7" y="7" width="10" height="10" rx="1"/>:kind==='in'||kind==='out'?<><circle cx="10.5" cy="10.5" r="5.5" fill="none"/><path d="M14.7 14.7 20 20M7.5 10.5h6" fill="none"/>{kind==='in'&&<path d="M10.5 7.5v6" fill="none"/>}</>:<><path d="M5 9a7.5 7.5 0 1 1 1.4 7.7" fill="none"/><path d="M5 4v5h5" fill="none"/></>}</svg>
}

const toneLabels:Record<ToneMetric,{zh:string;en:string}>={warmth:{zh:'温暖',en:'Warm'},brightness:{zh:'明亮',en:'Bright'},attack:{zh:'起音',en:'Attack'},sustain:{zh:'延音',en:'Sustain'},drive:{zh:'驱动',en:'Drive'},space:{zh:'空间',en:'Space'}}

type RiffPreset={name:string;bpm:number;effects:EffectId[];steps:16|32;notes:Array<[number,number,RiffCell]>}
// Original studies built around classic effect-era playing techniques, never transcriptions.
const RIFF_PRESETS:RiffPreset[]= [
  {name:'DUSTY EIGHTHS',bpm:120,effects:['boost'],steps:16,notes:[[0,0,2],[0,4,1],[0,8,2],[0,12,1],[1,2,1],[1,6,1],[1,10,1],[1,14,1],[2,3,3],[2,7,3],[2,11,3],[2,15,3],[4,6,1],[5,14,2]]},
  {name:'GARAGE PULSE',bpm:150,effects:['overdrive'],steps:16,notes:[[0,0,2],[0,8,2],[1,4,1],[1,12,1],[2,2,1],[2,6,1],[2,10,1],[2,14,1],[3,7,2],[3,15,2],[4,3,1],[4,11,1]]},
  {name:'MUTED ENGINE',bpm:120,effects:['overdrive'],steps:16,notes:[[0,0,3],[0,3,3],[0,6,3],[0,9,3],[0,12,3],[0,15,3],[1,2,1],[1,10,1],[2,6,2],[2,14,2],[3,4,1],[3,12,1]]},
  {name:'MIDNIGHT CHIME',bpm:90,effects:['chorus'],steps:32,notes:[[5,0,1],[4,2,1],[3,4,2],[4,6,1],[5,8,1],[4,10,1],[3,12,2],[2,14,1],[5,16,1],[4,18,1],[3,20,2],[4,22,1],[5,24,1],[4,26,1],[2,28,2],[1,30,1]]},
  {name:'OFFSET GLOW',bpm:120,effects:['chorus'],steps:32,notes:[[0,0,1],[1,1,1],[2,2,1],[3,3,2],[4,4,1],[5,5,1],[4,8,1],[3,9,2],[2,10,1],[1,11,1],[0,12,1],[3,15,2],[0,16,1],[1,17,1],[2,18,1],[3,19,2],[4,20,1],[5,21,1],[4,24,1],[3,25,2],[2,26,1],[1,27,1],[0,28,1],[3,31,2]]},
  {name:'SLOW BURN',bpm:90,effects:['boost','overdrive'],steps:32,notes:[[0,0,2],[0,12,2],[1,4,1],[1,8,1],[2,2,1],[2,10,1],[3,6,2],[4,14,1],[5,15,1],[0,16,2],[1,20,1],[2,18,1],[3,22,2],[4,30,1],[5,31,2]]},
  {name:'REPEAT TRAIL',bpm:96,effects:['tape-echo'],steps:32,notes:[[5,0,2],[4,5,1],[3,9,1],[2,14,2],[4,16,1],[5,20,2],[3,25,1],[2,29,2]]},
  {name:'TAPE PARADE',bpm:108,effects:['chorus','tape-echo'],steps:32,notes:[[0,0,2],[3,4,1],[4,7,1],[5,12,2],[2,16,1],[3,20,1],[4,23,2],[5,28,1],[1,30,2]]},
  {name:'CLEAN AIR',bpm:110,effects:[],steps:16,notes:[[5,0,1],[4,3,1],[3,6,1],[2,9,2],[4,12,1],[5,15,1]]},
]

function drawPresetRiff(activeEffects:EffectId[]=[],exceptName?:string):RiffPattern {
  const pool=RIFF_PRESETS.filter(item=>item.name!==exceptName)
  const score=(item:RiffPreset)=>item.effects.reduce((total,effect)=>total+(activeEffects.includes(effect)?3:-2),0)+(item.effects.length===0&&activeEffects.length===0?2:0)
  const highScore=Math.max(...pool.map(score))
  const matches=pool.filter(item=>score(item)===highScore)
  const preset=matches[Math.floor(Math.random()*matches.length)] ?? RIFF_PRESETS[0]
  const next=emptyRiff(preset.steps);next.name=preset.name;next.bpm=preset.bpm
  for (const [stringIndex,step,value] of preset.notes) next.steps[stringIndex][step]=value
  return next
}

export function BuildRun() {
  const c = copy[locale]
  const save = useFoundrySave()
  const wall = useGuitarWall()
  // The start-screen public-wall counter mirrors the same de-duplicated
  // dataset the wall renders, rather than the player's own published archive.
  const publicWallCount = useMemo(() => {
    const ids = new Set(wall.entries.map((entry) => entry.guitar.id))
    for (const guitar of save.published) ids.add(guitar.id)
    return ids.size
  }, [save.published, wall.entries])
  const engineRef = useRef<ToneEngine | null>(null)
  const sequenceTimerRef = useRef<number | null>(null)
  const playbackTokenRef = useRef(0)
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
  const [auditioning, setAuditioning] = useState(false)
  const [detailEntry, setDetailEntry] = useState<WallEntry | null>(null)
  const [choiceBank, setChoiceBank] = useState<Partial<Record<BuildStage, PartOffer[]>>>({})
  const [remixSource, setRemixSource] = useState<RemixSource | null>(null)
  const [effects, setEffects] = useState<EffectId[]>([])

  const stage = BUILD_STAGES[stageIndex]
  const progress = screen === 'tone' || screen === 'complete' || screen === 'riff' ? 5 : stageIndex
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
    setRunId(seed.id); setPlatform(seed.platform); setConfig(seed.config); setStageIndex(0); setOffers([]); setSelectedOffer(null); setGrades({}); setChoiceBank({}); setCompleted(null); setSaved(false); setRemixSource(null); setEffects([]); updateRiff(emptyRiff()); setMeasure(0); setScreen('sealed')
  }

  const openCase = () => {
    const nextOffers=drawOffers(stage, platform, config, runId)
    setOffers(nextOffers); setChoiceBank(current=>({...current,[stage]:nextOffers}))
    setSelectedOffer(null)
    setScreen('choose')
  }

  const mountPart = () => {
    if (!selectedOffer) return
    const nextConfig = applyOffer(config, stage, selectedOffer)
    const nextGrades = { ...grades, [stage]: selectedOffer.grade }
    setConfig(nextConfig); setGrades(nextGrades); setSelectedOffer(null); setOffers([])
    if (stageIndex === BUILD_STAGES.length - 1) {
      setCompleted(finishBuild(runId, platform, nextConfig, nextGrades)); updateRiff(drawPresetRiff()); setScreen('tone')
    } else {
      setStageIndex((current) => current + 1); setScreen('sealed')
    }
  }

  const playReference = async () => {
    await engineRef.current?.enable()
    engineRef.current?.playReference(selectedSource, 'clean', effects)
  }

  const stopRiffPlayback = () => {
    playbackTokenRef.current += 1
    if (sequenceTimerRef.current !== null) window.clearTimeout(sequenceTimerRef.current)
    sequenceTimerRef.current = null
    engineRef.current?.stopAll()
    setPlayhead(-1)
  }

  const auditionBuild = async () => {
    if (auditioning) { engineRef.current?.stopAll(); if (auditionTimerRef.current!==null) window.clearTimeout(auditionTimerRef.current); auditionTimerRef.current=null; setAuditioning(false); return }
    setAuditioning(true)
    let duration=0
    try { await engineRef.current?.enable(); duration=engineRef.current?.playComparison(selectedSource,'clean',effects) ?? 0 } catch { setAuditioning(false); return }
    auditionTimerRef.current=window.setTimeout(()=>{setAuditioning(false);auditionTimerRef.current=null},duration*1000+80)
  }

  const tryTonePart = async (target:BuildStage, offer:PartOffer) => {
    if (!isOfferCompatible(target,platform,config,offer.part)) return
    const nextConfig=applyOffer(config,target,offer)
    const nextGrades={...grades,[target]:offer.grade}
    const source=guitarFromBuild(platform,nextConfig)
    setConfig(nextConfig);setGrades(nextGrades);setCompleted(finishBuild(runId,platform,nextConfig,nextGrades))
    engineRef.current?.stopAll()
    if (auditionTimerRef.current!==null) window.clearTimeout(auditionTimerRef.current)
    setAuditioning(true)
    try { await engineRef.current?.enable();const duration=engineRef.current?.playComparison(source,'clean',effects) ?? 0;auditionTimerRef.current=window.setTimeout(()=>{setAuditioning(false);auditionTimerRef.current=null},duration*1000+80) } catch { setAuditioning(false) }
  }

  const toggleEffect = async (effect:EffectId) => {
    const next=effects.includes(effect)?effects.filter(item=>item!==effect):[...effects,effect]
    setEffects(next);engineRef.current?.stopAll()
    if (auditionTimerRef.current!==null) window.clearTimeout(auditionTimerRef.current)
    setAuditioning(true)
    try { await engineRef.current?.enable();const duration=engineRef.current?.playComparison(selectedSource,'clean',next) ?? 0;auditionTimerRef.current=window.setTimeout(()=>{setAuditioning(false);auditionTimerRef.current=null},duration*1000+80) } catch { setAuditioning(false) }
  }

  const toggleRiffPlayback = async () => {
    if (sequenceTimerRef.current !== null) {
      stopRiffPlayback(); return
    }
    const token=playbackTokenRef.current+1
    playbackTokenRef.current=token
    await engineRef.current?.enable()
    if (token!==playbackTokenRef.current) return
    let step = 0
    const playStep = () => {
      if (token!==playbackTokenRef.current) return
      const currentRiff = riffRef.current
      setPlayhead(step)
      currentRiff.steps.forEach((track, stringIndex) => {
        const cell = track[step]
        if (cell) engineRef.current?.pluck(selectedSource, stringIndex, 'clean', 0, cell === 2 ? 1 : cell === 3 ? .38 : .72, effects)
      })
      step = (step + 1) % Math.max(1, currentRiff.steps[0]?.length ?? 16)
      sequenceTimerRef.current = window.setTimeout(playStep, 60000 / currentRiff.bpm / 4)
    }
    playStep()
  }

  const saveToRack = () => {
    if (!completed || saved) return
    save.saveBuild(completed); setSaved(true)
  }

  const loadRandomRiff = () => { updateRiff(drawPresetRiff(effects,riffRef.current.name)); setMeasure(0) }

  const publishCurrent = () => {
    if (!completed) return
    stopRiffPlayback()
    const published: PublishedGuitar = { ...completed, riff, publishedAt: Date.now(), effects, ...(remixSource ? { remix: remixSource } : {}) }
    save.publish(published)
    wall.refresh()
    setScreen('wall')
  }

  const remixEntry = (entry:WallEntry) => {
    const seed=createRunSeed()
    const nextConfig={...entry.guitar.config}
    const nextGrades={...entry.guitar.grades}
    setRunId(seed.id);setPlatform(entry.guitar.platform);setConfig(nextConfig);setGrades(nextGrades);setEffects(entry.guitar.effects ?? []);setCompleted(finishBuild(seed.id,entry.guitar.platform,nextConfig,nextGrades));setSaved(false);setRemixSource({sourceEntryId:entry.guitar.id,sourceGuitarId:entry.guitar.id,sourceAuthor:entry.userName,sourceAuthorId:entry.userId});updateRiff({...entry.guitar.riff,name:`REMIX / ${entry.guitar.riff.name}`,steps:entry.guitar.riff.steps.map(row=>[...row])});setMeasure(0);setScreen('tone')
  }

  if (screen === 'start') return <section className="tfrun tfrun--start">
    <div className="tfrun-start__hero">
      <header className="tfrun-start__head"><span>TONE FOUNDRY / 01</span><b>{locale === 'zh' ? '乐器研究' : 'INSTRUMENT STUDY'}</b></header>
      <div className="tfrun-start__instrument" aria-hidden="true">
        <AssemblyGuitarPreview platform={platform} config={config} stage="body" stageIndex={0} focusing={false} trialing={false} />
        <span className="tfrun-start__tag tfrun-start__tag--left">{locale === 'zh' ? '未组装' : 'UNASSEMBLED'}</span>
        <span className="tfrun-start__tag tfrun-start__tag--right">05 {locale === 'zh' ? '个模块' : 'MODULES'}</span>
      </div>
      <div className="tfrun-start__copy">
        <p className="tfrun-kicker">{locale === 'zh' ? '模块化吉他游戏' : 'A MODULAR GUITAR GAME'}</p><h2>{c.title}</h2><p className="tfrun-lead">{c.intro}</p>
        <button className="tfrun-primary" type="button" onClick={beginRun}>{c.start}<i aria-hidden="true" /></button>
        <div className="tfrun-start__links"><button type="button" onClick={() => setScreen('collection')}>{c.collection}<span>{save.collection.length}</span></button><i /><button type="button" onClick={() => setScreen('wall')}>{c.wall}<span>{wall.loaded ? publicWallCount : '…'}</span></button></div>
        <details className="tfrun-odds"><summary>{c.odds}</summary><b>{c.oddsLine}</b></details>
      </div>
    </div>
  </section>

  if (screen === 'collection') return <section className="tfrun tfrun--collection">
    <header className="tfrun-pagehead"><button type="button" onClick={() => setScreen('start')}>{c.backStart}</button><div><h2>{c.collection}</h2></div><button type="button" onClick={() => setScreen('wall')}>{c.wall}</button></header>
    {save.collection.length === 0 ? <p className="tfrun-empty">{c.empty}</p> : <div className="tfrun-rack">{save.collection.map((guitar) => <article key={guitar.id}><div><GuitarPreview platform={guitar.platform} config={guitar.config} /></div><span>{guitar.id}</span><h3>{partLabel(guitar.config.body)}</h3><p>{c.gradeScore} · {guitar.rarityScore}</p><button type="button" onClick={() => {setCompleted(guitar);setPlatform(guitar.platform);setConfig(guitar.config);setGrades(guitar.grades);setRemixSource(null);setEffects([]);updateRiff(emptyRiff());setSaved(true);setScreen('complete')}}>{c.view}</button></article>)}</div>}
  </section>

  if (screen === 'wall') return <PublicWall community={wall.entries} mine={save.published} likedGuitarIds={save.likedGuitarIds} loaded={wall.loaded} onBack={() => setScreen('collection')} onToggleLike={(entry)=>save.toggleLike(entry.guitar.id)} onRemix={remixEntry} onView={(guitar,entry) => { setCompleted(guitar); setPlatform(guitar.platform); setConfig(guitar.config); setGrades(guitar.grades); setEffects(guitar.effects ?? []); updateRiff(guitar.riff); setSaved(save.collection.some((item) => item.id === guitar.id)); setDetailEntry(entry); setScreen('detail') }} />

  if (screen === 'detail' && detailEntry) { const self=detailEntry.userId==='self'||(!!telegramId&&detailEntry.userId===String(telegramId)); const liked=save.likedGuitarIds.includes(detailEntry.guitar.id); const likeCount=(detailEntry.likeCount??0)+(liked?1:0); return <GuitarWallDetail entry={detailEntry} guitar={guitarFromBuild(detailEntry.guitar.platform,detailEntry.guitar.config)} parts={BUILD_STAGES.map(item=>({label:c.stages[item],value:partLabel(detailEntry.guitar.config[item])}))} playing={playhead>=0} liked={liked} likeCount={likeCount} onPlay={()=>void toggleRiffPlayback()} onToggleLike={self?undefined:()=>save.toggleLike(detailEntry.guitar.id)} onRemix={self?undefined:()=>remixEntry(detailEntry)} onBack={()=>{stopRiffPlayback();setScreen('wall')}} /> }

  if (screen === 'tone' && completed) return <section className="tfrun tfrun--tone">
    <header className="tfrun-pagehead"><button type="button" onClick={()=>setScreen('complete')}>{locale==='zh'?'稍后再调':'Not now'}</button><div><h2>{locale==='zh'?'调音步骤':'Tone fitting'}</h2></div></header>
    <div className="tfrun-tone__stage"><ModularGuitarViewport className="tfrun-tone__viewer" label={locale==='zh'?'吉他查看器':'Instrument viewer'}><GuitarPreview platform={platform} config={config}/></ModularGuitarViewport></div>
    <div className="tfrun-tone__panel"><p className="tfrun-kicker">{completed.id} / TONE FITTING</p><h1>{c.tuneTitle}</h1><p>{c.tuneNote}</p><div className="tfrun-tone__meters">{(Object.keys(toneLabels) as ToneMetric[]).map(metric=><p key={metric}><span>{toneLabels[metric][locale]}</span><i><em style={{width:`${selectedSource.tone[metric]}%`}}/></i><b>{selectedSource.tone[metric]}</b></p>)}</div><button className="tfrun-tone__play" type="button" onClick={()=>void auditionBuild()}><InspectIcon kind={auditioning?'stop':'play'}/><span>{c.audition}</span></button><section className="tfrun-effects" aria-label={locale==='zh'?'效果器链':'Effects chain'}><header><h2>{locale==='zh'?'效果器链':'Pedal chain'}</h2><span>{effects.length?effects.map(effect=>EFFECTS[effect].short).join(' → '):(locale==='zh'?'直通':'DRY')}</span></header><div>{(Object.keys(EFFECTS) as EffectId[]).map(effect=><EffectPedal key={effect} effect={effect} active={effects.includes(effect)} onToggle={()=>void toggleEffect(effect)}/>)}</div></section><section className="tfrun-tone__parts" aria-label={c.refit}>{BUILD_STAGES.map(item=><div key={item}><h2>{c.stages[item]}</h2><div>{(choiceBank[item] ?? []).map(offer=>{const compatible=isOfferCompatible(item,platform,config,offer.part);const active=config[item]===offer.part;return <button type="button" key={offer.id} className={`${active?'is-active':''} ${offer.grade==='archive'?'is-archive':''}`} disabled={!compatible} aria-pressed={active} onClick={()=>void tryTonePart(item,offer)}><b>{partLabel(offer.part)}</b><span>{gradeLabel(offer.grade)}</span></button>})}</div></div>)}</section><button className="tfrun-primary" type="button" onClick={()=>setScreen('complete')}>{c.tuneContinue}</button></div>
  </section>

  const riffStepCount=riff.steps[0]?.length ?? 16
  const riffBarCount=Math.max(1,Math.ceil(riffStepCount/4))
  const riffBarGroupStart=Math.floor(measure/4)*4
  const visibleBars=Array.from({length:Math.min(4,riffBarCount-riffBarGroupStart)},(_,index)=>riffBarGroupStart+index)
  const presetProfile=RIFF_PRESETS.find(item=>item.name===riff.name.replace('REMIX / ',''))

  if (screen === 'riff') return <section className="tfrun tfrun--riff">
    <header className="tfrun-pagehead"><button type="button" onClick={() => {stopRiffPlayback();setScreen('complete')}}>{c.back}</button><div><h2>{c.riffTitle}</h2></div></header>
    <p className="tfrun-riff__note"><b>{riff.name} · {riffStepCount} {locale==='zh'?'步':'STEPS'}{presetProfile&&<> · {presetProfile.effects.length?presetProfile.effects.map(effect=>EFFECTS[effect].short).join(' → '):(locale==='zh'?'直通':'DRY')}</>}</b>{c.riffNote}</p>
    <div className="tfrun-riff__tools"><button type="button" onClick={() => updateRiff((current) => ({ ...current, bpm: current.bpm === 90 ? 120 : current.bpm === 120 ? 150 : 90 }))}>{riff.bpm} BPM</button><button type="button" onClick={loadRandomRiff}>{c.preset}</button></div>
    <nav className={`tfrun-measures ${riffBarCount>4?'is-paged':''}`} aria-label={locale === 'zh' ? '选择小节' : 'Choose measure'}>{riffBarCount>4&&<button type="button" className="tfrun-measures__page" disabled={riffBarGroupStart===0} onClick={()=>setMeasure(Math.max(0,measure-4))} aria-label={locale==='zh'?'前四小节':'Previous four bars'}><span>‹</span></button>}{visibleBars.map(index=>{const label=['I','II','III','IV','V','VI','VII','VIII'][index]??String(index+1);return <button type="button" key={label} className={measure===index?'is-current':''} aria-pressed={measure===index} onClick={()=>setMeasure(index)}>{c.measure} {label}</button>})}{riffBarCount>4&&<button type="button" className="tfrun-measures__page" disabled={riffBarGroupStart+4>=riffBarCount} onClick={()=>setMeasure(Math.min(riffBarCount-1,measure+4))} aria-label={locale==='zh'?'后四小节':'Next four bars'}><span>›</span></button>}</nav>
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
    <div className="tfrun-build__preview"><div className="tfrun-build__halo" aria-hidden="true" /><ModularGuitarViewport className="tfrun-build__viewport" label={locale==='zh'?'乐器查看器':'Instrument viewer'} maxZoom={2.1}><div className="tfrun-build__camera"><AssemblyGuitarPreview platform={platform} config={previewConfig} stage={stage} stageIndex={stageIndex} focusing={screen === 'choose'} trialing={Boolean(selectedOffer)} /></div></ModularGuitarViewport><div className="tfrun-preview-tools"><button type="button" className="is-sound" onClick={()=>void auditionBuild()} disabled={stageIndex===0&&!selectedOffer} aria-label={c.audition}><InspectIcon kind={auditioning?'stop':'play'}/></button></div>{selectedOffer && <div className="tfrun-trial"><span>{partLabel(selectedOffer.part)}</span><b>{gradeLabel(selectedOffer.grade)}</b></div>}</div>
    <div className="tfrun-build__panel">
      <div className="tfrun-build__folio" aria-hidden="true"><span>SPECIMEN BUILD</span><b>{`${String(stageIndex+1).padStart(2,'0')} / 05`}</b></div>
      <div className="tfrun-build__prompt"><h2>{screen === 'sealed' ? c.sealed : c.chooseTitle[stage]}</h2><p>{screen === 'sealed' ? c.sealedNote : c.chooseDetail[stage]}</p></div>
      {screen === 'sealed' ? <button className="tfrun-case" type="button" onClick={openCase}>
        <span className="tfrun-case__number" aria-hidden="true">{String(stageIndex + 1).padStart(2, '0')}</span>
        <span className="tfrun-case__copy">
          <small>{locale === 'zh' ? `密封部件 · ${c.stages[stage]}` : `SEALED SPECIMEN · ${c.stages[stage].toUpperCase()}`}</small>
          <b>{c.open}</b>
        </span>
        <i className="tfrun-case__seal" aria-hidden="true" />
      </button> : <>
        <div className="tfrun-offers"><p className="tfrun-offers__draw"><b>{c.drawLabel} · {offers.length} {locale==='zh'?'件':'ITEMS'}</b><span>{c.drawNote}</span></p>{offers.map((offer)=><button type="button" key={offer.id} className={`tfrun-offer tfrun-offer--${offer.grade} ${selectedOffer?.id===offer.id?'is-selected':''}`} onClick={()=>{engineRef.current?.stopAll();if(auditionTimerRef.current!==null)window.clearTimeout(auditionTimerRef.current);auditionTimerRef.current=null;setAuditioning(false);setSelectedOffer(offer)}} aria-pressed={selectedOffer?.id===offer.id}><span className="tfrun-offer__serial">{offer.serial}</span><b>{partLabel(offer.part)}</b><small>{gradeLabel(offer.grade)}</small><i aria-hidden="true" /></button>)}</div>
        <button className="tfrun-primary" type="button" onClick={mountPart} disabled={!selectedOffer}>{c.mount}</button>
      </>}
    </div>
  </section>
}
