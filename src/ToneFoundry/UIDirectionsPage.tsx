import { useState, type CSSProperties } from 'react'
import type { ModularBoltOnConfig } from './guitar-system/modularBoltOnPlatform'
import { ModularGuitarPreview } from './components/ModularGuitarPreview'
import './UIDirectionsPage.less'

type DirectionId = 'nocturne' | 'groove' | 'index'
type PreviewState = 'start' | 'build' | 'archive'
type ReviewLocale = 'en' | 'zh'

const bodies: Array<{ id: ModularBoltOnConfig['body']; zh: string; en: string }> = [
  { id: 'slab', zh: '板式单切', en: 'Slab single-cut' },
  { id: 'contour', zh: '轮廓双切', en: 'Contour double-cut' },
  { id: 'offset', zh: '偏移琴体', en: 'Offset body' },
]

const baseConfig: ModularBoltOnConfig = {
  body: 'contour',
  neck: 'rosewood-inline',
  pickups: 'hss',
  bridge: 'tremolo',
  finish: 'sunburst',
}

const directionMeta = {
  nocturne: { label: 'A', zh: '夜间制琴室', en: 'Nocturne Atelier', noteZh: '安静 / 收藏级 / 现代精品', noteEn: 'Quiet / Collectible / Premium' },
  groove: { label: 'B', zh: '模块唱片社', en: 'Modular Groove', noteZh: '鲜活 / 图形化 / 音乐出版物', noteEn: 'Vivid / Graphic / Musical' },
  index: { label: 'C', zh: '声音标本馆', en: 'Sonic Index', noteZh: '明亮 / 编辑设计 / 工业目录', noteEn: 'Editorial / Precise / Expandable' },
} as const

const reviewCopy = {
  en: {
    title: 'Tone Foundry\nEnglish UI Review',
    intro: 'Direction C is now the selected product direction. This view checks whether its hierarchy, labels and typography work with English as the primary language.',
    directionNav: 'Choose interface direction',
    stateNav: 'Switch review state',
    states: { start: 'Entry', build: 'Build', archive: 'Archive' },
    view: 'View direction',
    noteTitle: 'What to review',
    note: 'Read the build screen first: the instrument should stay dominant while every label remains clear at mobile size. Then check whether the archive feels worth collecting.',
    descriptions: {
      nocturne: 'Best for instrument luxury and collectible value.',
      groove: 'Best for blind-box energy, combinations and playfulness.',
      index: 'Selected direction: strongest for modular knowledge, guitar culture and long-term expansion.',
    },
  },
  zh: {
    title: 'Tone Foundry\n英文界面评审',
    intro: 'C 方案已经成为正式方向。本页用于检查以英文为主时，信息层级、按钮长度和排版是否依然成立。',
    directionNav: '选择界面方向',
    stateNav: '切换评审状态',
    states: { start: '入口', build: '制琴', archive: '档案' },
    view: '选择查看',
    noteTitle: '评审重点',
    note: '先看制琴页面：吉他应当始终是主角，同时英文标签在手机尺寸下依然清楚。再看档案是否具有收藏价值。',
    descriptions: {
      nocturne: '适合强调收藏价值与乐器质感。',
      groove: '适合强调盲盒、组合与音乐游戏感。',
      index: '已选方向：最适合承载模块知识、吉他文化与长期扩展。',
    },
  },
} as const

function Icon({ kind }: { kind: 'play' | 'tone' | 'plus' | 'minus' | 'arrow' }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    {kind === 'play' ? <path d="M8 5.5v13l10-6.5z" /> :
      kind === 'tone' ? <path d="M4 16V9m4 10V5m4 11V8m4 10V6m4 8v-4" fill="none" /> :
        kind === 'plus' ? <path d="M12 5v14M5 12h14" fill="none" /> :
          kind === 'minus' ? <path d="M5 12h14" fill="none" /> :
            <path d="m9 5 7 7-7 7" fill="none" />}
  </svg>
}

function Guitar({ config, ghost = false }: { config: ModularBoltOnConfig; ghost?: boolean }) {
  return <div className={`tfdir-guitar ${ghost ? 'is-ghost' : ''}`}>
    <ModularGuitarPreview platform="bolt-on" config={config} />
  </div>
}

interface PreviewProps {
  state: PreviewState
  setState: (state: PreviewState) => void
  lang: ReviewLocale
}

function NocturnePreview({ state, setState, lang }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('contour')
  const config = { ...baseConfig, body, pickups: body === 'offset' ? 'wide-dual' : body === 'slab' ? 'dual-single' : 'hss', bridge: body === 'offset' ? 'floating' : body === 'slab' ? 'three-saddle' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--nocturne tfdir-start">
    <div className="tfdir-noc__brand">TONE / FOUNDRY <span>01</span></div>
    <Guitar config={config} ghost />
    <div className="tfdir-noc__startcopy"><small>PRIVATE BUILD SESSION</small><h2>{lang === 'en' ? <>Build a guitar<br />that is only yours</> : <>造一把<br />只属于你的琴</>}</h2><p>{lang === 'en' ? 'Five choices. One distinct voice.' : '五次选择，留下一个声音。'}</p><button type="button" onClick={() => setState('build')}>{lang === 'en' ? 'Enter the atelier' : '进入制琴室'} <Icon kind="arrow" /></button></div>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--nocturne tfdir-archive">
    <header><button type="button" onClick={() => setState('build')}>{lang === 'en' ? 'BACK' : '返回'}</button><span>ARCHIVE / TF-73A9</span></header>
    <Guitar config={config} />
    <div className="tfdir-noc__archive">
      <small>YOUR INSTRUMENT</small><h2>Afterglow No. 7</h2><p>HSS · TREMOLO · SUNBURST</p>
      <button className="tfdir-roundplay" type="button"><Icon kind="play" /></button>
      <div><span>{lang === 'en' ? 'BRIGHT 82' : '明亮 82'}</span><i style={{ '--value': '82%' } as CSSProperties} /><span>{lang === 'en' ? 'SUSTAIN 68' : '延音 68'}</span><i style={{ '--value': '68%' } as CSSProperties} /></div>
    </div>
  </div>
  return <div className="tfdir-phone tfdir-phone--nocturne tfdir-build">
    <header><span>02 / 05</span><b>BODY PROFILE</b><button type="button" onClick={() => setState('archive')}>{lang === 'en' ? 'ARCHIVE' : '档案'}</button></header>
    <div className="tfdir-noc__stage"><Guitar config={config} /><div className="tfdir-noc__tools"><button aria-label={lang === 'en' ? 'Tone test' : '音色测试'}><Icon kind="tone" /></button><button aria-label={lang === 'en' ? 'Play' : '试听'}><Icon kind="play" /></button><button aria-label={lang === 'en' ? 'Zoom out' : '缩小'}><Icon kind="minus" /></button><button aria-label={lang === 'en' ? 'Zoom in' : '放大'}><Icon kind="plus" /></button></div></div>
    <div className="tfdir-noc__tray"><div><small>CHOOSE THE SILHOUETTE</small><h2>{lang === 'en' ? 'Define its outline' : '决定它的轮廓'}</h2></div><div className="tfdir-noc__choices">{bodies.map(item => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>{item.id.toUpperCase()}</span><b>{item[lang]}</b></button>)}</div><button className="tfdir-noc__keep" type="button">{lang === 'en' ? 'KEEP THIS PART' : '确认这一件'}</button></div>
  </div>
}

function GroovePreview({ state, setState, lang }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('offset')
  const config = { ...baseConfig, body, finish: body === 'offset' ? 'surf' : body === 'slab' ? 'blonde' : 'sunburst', pickups: body === 'offset' ? 'wide-dual' : body === 'slab' ? 'dual-single' : 'sss', bridge: body === 'offset' ? 'floating' : body === 'slab' ? 'three-saddle' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--groove tfdir-start">
    <div className="tfdir-groove__disc"><span>TF</span><i /></div>
    <p className="tfdir-groove__issue">BUILD SERIES / 01</p>
    <h2>MAKE<br /><em>YOUR</em><br />NOISE</h2>
    <Guitar config={config} ghost />
    <button className="tfdir-groove__start" type="button" onClick={() => setState('build')}>{lang === 'en' ? 'START BUILDING' : '开始制琴'} <Icon kind="arrow" /></button>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--groove tfdir-archive">
    <div className="tfdir-groove__archive-title"><span>07</span><div><small>NEW PRESSING</small><h2>SEA STATIC</h2></div></div>
    <div className="tfdir-groove__archive-stage"><Guitar config={config} /><button type="button"><Icon kind="play" /></button></div>
    <div className="tfdir-groove__stats"><b>84</b><span>TONE<br />SCORE</span><p>OFFSET / WIDE DUAL<br />FLOATING / SURF</p></div>
    <button className="tfdir-groove__back" type="button" onClick={() => setState('build')}>BACK TO BUILD</button>
  </div>
  return <div className="tfdir-phone tfdir-phone--groove tfdir-build">
    <header><b>TONE FOUNDRY</b><span>BODY / 01</span></header>
    <div className="tfdir-groove__stage"><span className="tfdir-groove__number">02</span><Guitar config={config} /><div className="tfdir-groove__tone"><button aria-label={lang === 'en' ? 'Play' : '试听'}><Icon kind="play" /></button><div><b>BRIGHT</b><i><em style={{ width: '76%' }} /></i><b>WARM</b><i><em style={{ width: '54%' }} /></i></div></div></div>
    <div className="tfdir-groove__prompt"><small>PICK ONE / KEEP MOVING</small><h2>{lang === 'en' ? 'Choose a profile' : '选一个轮廓'}</h2></div>
    <div className="tfdir-groove__choices">{bodies.map((item, index) => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>0{index + 1}</span><b>{item[lang]}</b></button>)}</div>
    <button className="tfdir-groove__keep" type="button" onClick={() => setState('archive')}>LOCK IT IN</button>
  </div>
}

function IndexPreview({ state, setState, lang }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('slab')
  const config = { ...baseConfig, body, finish: body === 'slab' ? 'black' : body === 'offset' ? 'surf' : 'sunburst', pickups: body === 'slab' ? 'hss' : body === 'offset' ? 'wide-dual' : 'sss', bridge: body === 'slab' ? 'hardtail' : body === 'offset' ? 'floating' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--index tfdir-start">
    <header><b>TF</b><span>INSTRUMENT STUDIES<br />VOLUME 01</span></header>
    <div className="tfdir-index__plate"><span>FIG. 001</span><Guitar config={config} ghost /><i className="tfdir-index__line tfdir-index__line--a" /><i className="tfdir-index__line tfdir-index__line--b" /></div>
    <div className="tfdir-index__startcopy"><small>A MODULAR GUITAR GAME</small><h2>{lang === 'en' ? <>Make sound<br />into an object</> : <>把声音<br />做成一件物品</>}</h2><button type="button" onClick={() => setState('build')}>{lang === 'en' ? 'BEGIN A NEW SPECIMEN' : '开始一份新标本'} <Icon kind="arrow" /></button></div>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--index tfdir-archive">
    <header><button type="button" onClick={() => setState('build')}>← INDEX</button><span>SPECIMEN 014</span></header>
    <div className="tfdir-index__archive-grid"><div className="tfdir-index__archive-guitar"><Guitar config={config} /></div><div className="tfdir-index__archive-copy"><small>TF-73A9-014</small><h2>Black Current</h2><p>SLAB / HSS / HARDTAIL</p><button type="button"><Icon kind="play" /> PLAY FIRST RIFF</button></div></div>
    <div className="tfdir-index__metrics">{[['WARMTH','61'],['BRIGHT','84'],['ATTACK','78'],['SUSTAIN','70']].map(([label,value]) => <div key={label}><span>{label}</span><i><em style={{ width: `${value}%` }} /></i><b>{value}</b></div>)}</div>
  </div>
  return <div className="tfdir-phone tfdir-phone--index tfdir-build">
    <header><b>TF / BUILD 014</b><span>01—05</span></header>
    <div className="tfdir-index__stage"><span className="tfdir-index__fig">FIG. 02 / BODY</span><Guitar config={config} /><div className="tfdir-index__callout"><i /><b>{body.toUpperCase()}</b><span>{lang === 'en' ? 'selected profile' : '当前轮廓'}</span></div><div className="tfdir-index__tools"><button aria-label={lang === 'en' ? 'Play tone' : '试听'}><Icon kind="play" /></button><button aria-label={lang === 'en' ? 'Tone profile' : '音色'}><Icon kind="tone" /></button></div></div>
    <div className="tfdir-index__panel"><div><small>QUESTION 01</small><h2>{lang === 'en' ? <>Which silhouette<br />should remain?</> : <>哪一种轮廓<br />值得被留下？</>}</h2></div><div className="tfdir-index__choices">{bodies.map((item,index) => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>0{index + 1}</span><b>{item[lang]}</b><i /></button>)}</div><button className="tfdir-index__keep" type="button" onClick={() => setState('archive')}>{lang === 'en' ? 'SAVE THIS SELECTION' : '保存此选择'}</button></div>
  </div>
}

export function UIDirectionsPage() {
  const [selected, setSelected] = useState<DirectionId>('index')
  const [state, setState] = useState<PreviewState>('build')
  const [lang, setLang] = useState<ReviewLocale>(() => new URLSearchParams(window.location.search).get('lang') === 'zh' ? 'zh' : 'en')
  const rc = reviewCopy[lang]
  const previews = {
    nocturne: <NocturnePreview state={state} setState={setState} lang={lang} />,
    groove: <GroovePreview state={state} setState={setState} lang={lang} />,
    index: <IndexPreview state={state} setState={setState} lang={lang} />,
  }
  return <main className="tfdir">
    <header className="tfdir-review-head">
      <div><p>SONIC INDEX / LANGUAGE CHECK</p><h1>{rc.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1></div>
      <div className="tfdir-review-head__side"><p>{rc.intro}</p><div className="tfdir-lang"><button type="button" className={lang === 'en' ? 'is-selected' : ''} onClick={() => setLang('en')}>EN</button><button type="button" className={lang === 'zh' ? 'is-selected' : ''} onClick={() => setLang('zh')}>中文</button></div></div>
    </header>
    <nav className="tfdir-direction-nav" aria-label={rc.directionNav}>
      {(Object.keys(directionMeta) as DirectionId[]).map(id => <button type="button" className={selected === id ? 'is-selected' : ''} onClick={() => setSelected(id)} key={id}><b>{directionMeta[id].label}</b><span>{directionMeta[id][lang]}</span></button>)}
    </nav>
    <nav className="tfdir-state-nav" aria-label={rc.stateNav}>
      {(['start','build','archive'] as const).map(id => <button type="button" className={state === id ? 'is-selected' : ''} onClick={() => setState(id)} key={id}>{rc.states[id]}</button>)}
    </nav>
    <section className="tfdir-grid">
      {(Object.keys(directionMeta) as DirectionId[]).map(id => <article className={`tfdir-card tfdir-card--${id} ${selected === id ? 'is-selected' : ''}`} key={id}>
        <header><div><span>{directionMeta[id].label}</span><div><h2>{directionMeta[id][lang]}</h2><p>{id === 'index' ? 'SELECTED DIRECTION' : 'ALTERNATE DIRECTION'}</p></div></div><small>{lang === 'en' ? directionMeta[id].noteEn : directionMeta[id].noteZh}</small></header>
        <div className="tfdir-device">{previews[id]}</div>
        <footer><button type="button" onClick={() => setSelected(id)}>{rc.view}</button><p>{rc.descriptions[id]}</p></footer>
      </article>)}
    </section>
    <aside className="tfdir-review-note"><b>{rc.noteTitle}</b><p>{rc.note}</p></aside>
  </main>
}
