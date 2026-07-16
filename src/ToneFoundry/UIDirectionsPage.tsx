import { useState, type CSSProperties } from 'react'
import type { ModularBoltOnConfig } from './guitar-system/modularBoltOnPlatform'
import { ModularGuitarPreview } from './components/ModularGuitarPreview'
import './UIDirectionsPage.less'

type DirectionId = 'nocturne' | 'groove' | 'index'
type PreviewState = 'start' | 'build' | 'archive'

const bodies: Array<{ id: ModularBoltOnConfig['body']; zh: string; en: string }> = [
  { id: 'slab', zh: '板式单切', en: 'SLAB' },
  { id: 'contour', zh: '轮廓双切', en: 'CONTOUR' },
  { id: 'offset', zh: '偏移琴体', en: 'OFFSET' },
]

const baseConfig: ModularBoltOnConfig = {
  body: 'contour',
  neck: 'rosewood-inline',
  pickups: 'hss',
  bridge: 'tremolo',
  finish: 'sunburst',
}

const directionMeta = {
  nocturne: { label: 'A', name: '夜间制琴室', en: 'NOCTURNE ATELIER', note: '安静 / 收藏级 / 现代精品' },
  groove: { label: 'B', name: '模块唱片社', en: 'MODULAR GROOVE', note: '鲜活 / 图形化 / 音乐出版物' },
  index: { label: 'C', name: '声音标本馆', en: 'SONIC INDEX', note: '明亮 / 编辑设计 / 工业目录' },
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
}

function NocturnePreview({ state, setState }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('contour')
  const config = { ...baseConfig, body, pickups: body === 'offset' ? 'wide-dual' : body === 'slab' ? 'dual-single' : 'hss', bridge: body === 'offset' ? 'floating' : body === 'slab' ? 'three-saddle' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--nocturne tfdir-start">
    <div className="tfdir-noc__brand">TONE / FOUNDRY <span>01</span></div>
    <Guitar config={config} ghost />
    <div className="tfdir-noc__startcopy"><small>PRIVATE BUILD SESSION</small><h2>造一把<br />只属于你的琴</h2><p>五次选择，留下一个声音。</p><button type="button" onClick={() => setState('build')}>进入制琴室 <Icon kind="arrow" /></button></div>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--nocturne tfdir-archive">
    <header><button type="button" onClick={() => setState('build')}>返回</button><span>ARCHIVE / TF-73A9</span></header>
    <Guitar config={config} />
    <div className="tfdir-noc__archive">
      <small>YOUR INSTRUMENT</small><h2>Afterglow No. 7</h2><p>HSS · TREMOLO · SUNBURST</p>
      <button className="tfdir-roundplay" type="button"><Icon kind="play" /></button>
      <div><span>明亮 82</span><i style={{ '--value': '82%' } as CSSProperties} /><span>延音 68</span><i style={{ '--value': '68%' } as CSSProperties} /></div>
    </div>
  </div>
  return <div className="tfdir-phone tfdir-phone--nocturne tfdir-build">
    <header><span>02 / 05</span><b>BODY PROFILE</b><button type="button" onClick={() => setState('archive')}>档案</button></header>
    <div className="tfdir-noc__stage"><Guitar config={config} /><div className="tfdir-noc__tools"><button aria-label="音色测试"><Icon kind="tone" /></button><button aria-label="试听"><Icon kind="play" /></button><button aria-label="缩小"><Icon kind="minus" /></button><button aria-label="放大"><Icon kind="plus" /></button></div></div>
    <div className="tfdir-noc__tray"><div><small>CHOOSE THE SILHOUETTE</small><h2>决定它的轮廓</h2></div><div className="tfdir-noc__choices">{bodies.map(item => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>{item.en}</span><b>{item.zh}</b></button>)}</div><button className="tfdir-noc__keep" type="button">确认这一件</button></div>
  </div>
}

function GroovePreview({ state, setState }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('offset')
  const config = { ...baseConfig, body, finish: body === 'offset' ? 'surf' : body === 'slab' ? 'blonde' : 'sunburst', pickups: body === 'offset' ? 'wide-dual' : body === 'slab' ? 'dual-single' : 'sss', bridge: body === 'offset' ? 'floating' : body === 'slab' ? 'three-saddle' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--groove tfdir-start">
    <div className="tfdir-groove__disc"><span>TF</span><i /></div>
    <p className="tfdir-groove__issue">BUILD SERIES / 01</p>
    <h2>MAKE<br /><em>YOUR</em><br />NOISE</h2>
    <Guitar config={config} ghost />
    <button className="tfdir-groove__start" type="button" onClick={() => setState('build')}>开始制琴 <Icon kind="arrow" /></button>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--groove tfdir-archive">
    <div className="tfdir-groove__archive-title"><span>07</span><div><small>NEW PRESSING</small><h2>SEA STATIC</h2></div></div>
    <div className="tfdir-groove__archive-stage"><Guitar config={config} /><button type="button"><Icon kind="play" /></button></div>
    <div className="tfdir-groove__stats"><b>84</b><span>TONE<br />SCORE</span><p>OFFSET / WIDE DUAL<br />FLOATING / SURF</p></div>
    <button className="tfdir-groove__back" type="button" onClick={() => setState('build')}>BACK TO BUILD</button>
  </div>
  return <div className="tfdir-phone tfdir-phone--groove tfdir-build">
    <header><b>TONE FOUNDRY</b><span>BODY / 01</span></header>
    <div className="tfdir-groove__stage"><span className="tfdir-groove__number">02</span><Guitar config={config} /><div className="tfdir-groove__tone"><button aria-label="试听"><Icon kind="play" /></button><div><b>BRIGHT</b><i><em style={{ width: '76%' }} /></i><b>WARM</b><i><em style={{ width: '54%' }} /></i></div></div></div>
    <div className="tfdir-groove__prompt"><small>PICK ONE / KEEP MOVING</small><h2>选一个轮廓</h2></div>
    <div className="tfdir-groove__choices">{bodies.map((item, index) => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>0{index + 1}</span><b>{item.zh}</b></button>)}</div>
    <button className="tfdir-groove__keep" type="button" onClick={() => setState('archive')}>LOCK IT IN</button>
  </div>
}

function IndexPreview({ state, setState }: PreviewProps) {
  const [body, setBody] = useState<ModularBoltOnConfig['body']>('slab')
  const config = { ...baseConfig, body, finish: body === 'slab' ? 'black' : body === 'offset' ? 'surf' : 'sunburst', pickups: body === 'slab' ? 'hss' : body === 'offset' ? 'wide-dual' : 'sss', bridge: body === 'slab' ? 'hardtail' : body === 'offset' ? 'floating' : 'tremolo' } as ModularBoltOnConfig
  if (state === 'start') return <div className="tfdir-phone tfdir-phone--index tfdir-start">
    <header><b>TF</b><span>INSTRUMENT STUDIES<br />VOLUME 01</span></header>
    <div className="tfdir-index__plate"><span>FIG. 001</span><Guitar config={config} ghost /><i className="tfdir-index__line tfdir-index__line--a" /><i className="tfdir-index__line tfdir-index__line--b" /></div>
    <div className="tfdir-index__startcopy"><small>A MODULAR GUITAR GAME</small><h2>把声音<br />做成一件物品</h2><button type="button" onClick={() => setState('build')}>开始一份新标本 <Icon kind="arrow" /></button></div>
  </div>
  if (state === 'archive') return <div className="tfdir-phone tfdir-phone--index tfdir-archive">
    <header><button type="button" onClick={() => setState('build')}>← INDEX</button><span>SPECIMEN 014</span></header>
    <div className="tfdir-index__archive-grid"><div className="tfdir-index__archive-guitar"><Guitar config={config} /></div><div className="tfdir-index__archive-copy"><small>TF-73A9-014</small><h2>Black Current</h2><p>SLAB / HSS / HARDTAIL</p><button type="button"><Icon kind="play" /> PLAY FIRST RIFF</button></div></div>
    <div className="tfdir-index__metrics">{[['WARMTH','61'],['BRIGHT','84'],['ATTACK','78'],['SUSTAIN','70']].map(([label,value]) => <div key={label}><span>{label}</span><i><em style={{ width: `${value}%` }} /></i><b>{value}</b></div>)}</div>
  </div>
  return <div className="tfdir-phone tfdir-phone--index tfdir-build">
    <header><b>TF / BUILD 014</b><span>01—05</span></header>
    <div className="tfdir-index__stage"><span className="tfdir-index__fig">FIG. 02 / BODY</span><Guitar config={config} /><div className="tfdir-index__callout"><i /><b>{body.toUpperCase()}</b><span>selected profile</span></div><div className="tfdir-index__tools"><button aria-label="试听"><Icon kind="play" /></button><button aria-label="音色"><Icon kind="tone" /></button></div></div>
    <div className="tfdir-index__panel"><div><small>QUESTION 01</small><h2>哪一种轮廓<br />值得被留下？</h2></div><div className="tfdir-index__choices">{bodies.map((item,index) => <button type="button" className={body === item.id ? 'is-selected' : ''} onClick={() => setBody(item.id)} key={item.id}><span>0{index + 1}</span><b>{item.zh}</b><i /></button>)}</div><button className="tfdir-index__keep" type="button" onClick={() => setState('archive')}>保存此选择</button></div>
  </div>
}

export function UIDirectionsPage() {
  const [selected, setSelected] = useState<DirectionId>('nocturne')
  const [state, setState] = useState<PreviewState>('build')
  const previews = {
    nocturne: <NocturnePreview state={state} setState={setState} />,
    groove: <GroovePreview state={state} setState={setState} />,
    index: <IndexPreview state={state} setState={setState} />,
  }
  return <main className="tfdir">
    <header className="tfdir-review-head">
      <div><p>UI RESET / ROUND 01</p><h1>Tone Foundry<br />三套全新界面方向</h1></div>
      <p>这里不修改正式游戏，只比较视觉世界与信息结构。请选择最值得继续做成完整产品的一套。</p>
    </header>
    <nav className="tfdir-direction-nav" aria-label="选择界面方向">
      {(Object.keys(directionMeta) as DirectionId[]).map(id => <button type="button" className={selected === id ? 'is-selected' : ''} onClick={() => setSelected(id)} key={id}><b>{directionMeta[id].label}</b><span>{directionMeta[id].name}</span></button>)}
    </nav>
    <nav className="tfdir-state-nav" aria-label="切换评审状态">
      {([['start','入口'],['build','制琴'],['archive','档案']] as const).map(([id,label]) => <button type="button" className={state === id ? 'is-selected' : ''} onClick={() => setState(id)} key={id}>{label}</button>)}
    </nav>
    <section className="tfdir-grid">
      {(Object.keys(directionMeta) as DirectionId[]).map(id => <article className={`tfdir-card tfdir-card--${id} ${selected === id ? 'is-selected' : ''}`} key={id}>
        <header><div><span>{directionMeta[id].label}</span><div><h2>{directionMeta[id].name}</h2><p>{directionMeta[id].en}</p></div></div><small>{directionMeta[id].note}</small></header>
        <div className="tfdir-device">{previews[id]}</div>
        <footer><button type="button" onClick={() => setSelected(id)}>选择查看</button><p>{id === 'nocturne' ? '适合强调收藏价值与乐器质感。' : id === 'groove' ? '适合强调盲盒、组合与音乐游戏感。' : '适合强调文化内容、模块知识与长期扩展。'}</p></footer>
      </article>)}
    </section>
    <aside className="tfdir-review-note"><b>选择建议</b><p>先看“制琴”状态是否愿意连续操作，再看“档案”是否值得收藏。字体、颜色和材质之后可以精调，但信息结构和整体性格应先选定。</p></aside>
  </main>
}
