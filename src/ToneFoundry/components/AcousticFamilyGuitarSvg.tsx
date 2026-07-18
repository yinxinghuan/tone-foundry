import { useCallback, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { GuitarSpec } from '../types'

type Family = 'grand-concert' | 'grand-auditorium' | 'super-jumbo'

interface Props { guitar: GuitarSpec; onPluck: (stringIndex: number) => void; family: Family }

const PROFILES: Record<Family, {
  body: string; side: string; upperY: number; soundholeY: number; bridgeY: number; endY: number; boardEndY: number
  scale: number; frets: number; pickguard: string; bridge: 'belly' | 'moustache'; label: string
}> = {
  'grand-concert': {
    body: 'M268 613 C224 606 185 628 167 666 C151 699 160 733 185 766 C155 804 141 856 147 918 C153 990 198 1046 263 1061 C290 1068 318 1068 346 1061 C411 1046 457 990 463 918 C469 856 445 804 415 766 C440 733 449 699 433 666 C415 628 376 606 332 613 L323 638 L277 638 Z',
    side: 'M463 918 C469 856 445 804 415 766 C440 733 449 699 433 666', upperY: 613, soundholeY: 760, bridgeY: 902, endY: 1062, boardEndY: 745, scale: 620, frets: 20,
    pickguard: 'M247 777 C221 802 211 845 224 877 C236 900 257 903 273 880 C285 858 283 815 268 789 Z', bridge: 'belly', label: '24.9 inch compact steel-string grand concert',
  },
  'grand-auditorium': {
    body: 'M263 594 C209 589 166 620 151 664 C138 704 153 744 183 778 C145 823 125 884 132 950 C139 1030 194 1089 270 1108 C291 1113 316 1113 337 1108 C413 1089 468 1030 475 950 C482 884 455 823 417 778 C447 744 462 704 449 664 C434 620 391 589 337 594 L323 622 L277 622 Z',
    side: 'M475 950 C482 884 455 823 417 778 C447 744 462 704 449 664', upperY: 594, soundholeY: 756, bridgeY: 916, endY: 1109, boardEndY: 736, scale: 648, frets: 20,
    pickguard: 'M241 775 C211 806 203 851 221 885 C236 911 263 914 281 888 C295 865 291 816 270 788 Z', bridge: 'belly', label: '25.5 inch balanced grand auditorium steel-string',
  },
  'super-jumbo': {
    body: 'M253 578 C189 573 139 610 127 665 C118 708 137 748 172 783 C126 829 102 900 112 978 C122 1070 190 1135 280 1149 C294 1151 306 1151 320 1149 C410 1135 478 1070 488 978 C498 900 474 829 428 783 C463 748 482 708 473 665 C461 610 411 573 347 578 L323 608 L277 608 Z',
    side: 'M488 978 C498 900 474 829 428 783 C463 748 482 708 473 665', upperY: 578, soundholeY: 751, bridgeY: 932, endY: 1150, boardEndY: 724, scale: 648, frets: 20,
    pickguard: 'M236 768 C199 803 191 853 213 894 C235 928 274 931 296 895 C314 865 302 806 266 777 Z', bridge: 'moustache', label: '25.5 inch super jumbo with moustache bridge and broad lower bout',
  },
}

function Metal({ prefix }: { prefix: string }) {
  return <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4f514e"/><stop offset=".2" stopColor="#f0ede2"/><stop offset=".48" stopColor="#8f918d"/><stop offset=".74" stopColor="#dedbd0"/><stop offset="1" stopColor="#565854"/></linearGradient>
}

function AcousticBody({ family, prefix }: { family: Family; prefix: string }) {
  const p = PROFILES[family]
  const outline = `url(#${prefix}-top)`
  return <g className="tf-module-body" data-guitar-module={`acoustic-${family}-soundboard`}>
    <path d={p.body} transform="translate(8 10)" fill="#392018" opacity=".74"/>
    <path d={p.body} fill={outline} stroke="#563120" strokeWidth="2.2" strokeLinejoin="round"/>
    <path d={p.side} transform="translate(-4 7)" fill="none" stroke="#44261c" strokeWidth="12" opacity=".82"/>
    <path d={p.body} fill="none" stroke="#f0c677" strokeWidth="4" opacity=".58"/>
    <path d={p.body} fill="none" stroke="#3e241b" strokeWidth="1.2" opacity=".88" transform="scale(.975 .978) translate(8 14)"/>
    <path d={`M183 ${p.upperY+58} C163 ${p.soundholeY-8} 181 ${p.bridgeY+70} 234 ${p.endY-38} M229 ${p.upperY+23} C212 ${p.soundholeY-40} 228 ${p.bridgeY+37} 271 ${p.endY-20} M327 ${p.upperY+20} C355 ${p.soundholeY-38} 369 ${p.bridgeY+31} 331 ${p.endY-19} M375 ${p.upperY+53} C402 ${p.soundholeY-8} 420 ${p.bridgeY+66} 370 ${p.endY-40}`} fill="none" stroke="#6f3e23" strokeWidth="1.2" opacity=".32"/>
    <path d={`M204 ${p.upperY+45} C180 ${p.soundholeY-5} 196 ${p.bridgeY+52} 252 ${p.endY-42} M348 ${p.upperY+43} C372 ${p.soundholeY-4} 356 ${p.bridgeY+55} 348 ${p.endY-38}`} fill="none" stroke="#f6dba2" strokeWidth=".85" opacity=".34"/>
    <path d={p.pickguard} fill="#261711" opacity=".92"/>
    <path d={p.pickguard} fill="none" stroke="#8f674a" strokeWidth="1" opacity=".58"/>
    <circle cx="300" cy={p.soundholeY} r={family==='super-jumbo'?59:family==='grand-auditorium'?53:48} fill="#160f0d"/>
    {[1,2,3,4].map((ring)=> <circle key={ring} cx="300" cy={p.soundholeY} r={(family==='super-jumbo'?59:family==='grand-auditorium'?53:48)+ring*4} fill="none" stroke={ring%2?"#e5bd71":"#49241c"} strokeWidth={ring===4?2:1.7} opacity={ring===4?.9:.82}/>) }
    <circle cx="300" cy={p.soundholeY} r={(family==='super-jumbo'?57:family==='grand-auditorium'?51:46)} fill="none" stroke="#f7dfab" strokeWidth="1" opacity=".42"/>
    {p.bridge==='moustache' ? <g data-guitar-part="moustache-bridge"><path d={`M222 ${p.bridgeY+6} Q254 ${p.bridgeY-22} 285 ${p.bridgeY-2} Q300 ${p.bridgeY+9} 315 ${p.bridgeY-2} Q346 ${p.bridgeY-22} 378 ${p.bridgeY+6} L366 ${p.bridgeY+51} Q334 ${p.bridgeY+44} 300 ${p.bridgeY+57} Q266 ${p.bridgeY+44} 234 ${p.bridgeY+51} Z`} fill="#261713" stroke="#130d0b" strokeWidth="2"/><path d={`M243 ${p.bridgeY+8} Q300 ${p.bridgeY-3} 357 ${p.bridgeY+8}`} fill="none" stroke="#eee2c6" strokeWidth="7"/><path d={`M244 ${p.bridgeY+11} Q300 ${p.bridgeY} 356 ${p.bridgeY+11}`} fill="none" stroke="#8d7c66" strokeWidth="1.4"/></g> : <g data-guitar-part="belly-bridge"><path d={`M234 ${p.bridgeY} Q300 ${p.bridgeY-15} 366 ${p.bridgeY} L361 ${p.bridgeY+52} Q300 ${p.bridgeY+42} 239 ${p.bridgeY+52} Z`} fill="#2a1914" stroke="#120d0b" strokeWidth="2"/><path d={`M247 ${p.bridgeY+11} Q300 ${p.bridgeY+4} 353 ${p.bridgeY+11}`} fill="none" stroke="#eee4cc" strokeWidth="7"/><path d={`M248 ${p.bridgeY+14} Q300 ${p.bridgeY+7} 352 ${p.bridgeY+14}`} fill="none" stroke="#99856e" strokeWidth="1.4"/></g>}
    {[0,1,2,3,4,5].map((index)=><g key={index} data-guitar-part="bridge-pin"><circle cx={260+index*16} cy={p.bridgeY+32} r="5.4" fill="#1b1411" stroke="#7d6c59"/><circle cx={260+index*16} cy={p.bridgeY+30.5} r="1.2" fill="#e5d3ae" opacity=".8"/></g>)}
    <circle cx="300" cy={p.endY-5} r="5" fill="#271813" stroke="#cbb183" strokeWidth="1.2"/>
  </g>
}

export function AcousticFamilyGuitarSvg({ guitar, onPluck, family }: Props) {
  const [ringing, setRinging] = useState<number[]>([])
  const sweeping = useRef(false)
  const last = useRef<number | null>(null)
  const rawId = useId(); const prefix=`tf-${family}-${rawId.replace(/:/g,'')}`
  const p=PROFILES[family]
  const nutY=236; const nutX=[278,287,296,304,313,322]; const saddleX=[264,278,292,308,322,336]
  const tunerY=[111,142,173,173,142,111]; const tunerX=[255,255,255,345,345,345]
  const fretY=(fret:number)=>nutY+p.scale*(1-2**(-fret/12))
  const trigger=useCallback((index:number)=>{if(index<0||index>5||last.current===index)return;last.current=index;onPluck(index);setRinging(v=>[...new Set([...v,index])]);window.setTimeout(()=>setRinging(v=>v.filter(n=>n!==index)),220)},[onPluck])
  const locate=useCallback((event:ReactPointerEvent<SVGSVGElement>)=>{const point=event.currentTarget.createSVGPoint();point.x=event.clientX;point.y=event.clientY;const inverse=event.currentTarget.getScreenCTM()?.inverse();if(!inverse)return null;const at=point.matrixTransform(inverse);if(at.y<nutY||at.y>p.endY)return null;let best=0;let distance=Infinity;saddleX.forEach((x,index)=>{const current=nutX[index]+(x-nutX[index])*(at.y-nutY)/(p.bridgeY-nutY);const next=Math.abs(at.x-current);if(next<distance){distance=next;best=index}});return distance<15?best:null},[p])
  const down=(event:ReactPointerEvent<SVGSVGElement>)=>{const string=locate(event);if(string===null)return;event.preventDefault();sweeping.current=true;last.current=null;event.currentTarget.setPointerCapture(event.pointerId);trigger(string)}
  const move=(event:ReactPointerEvent<SVGSVGElement>)=>{if(sweeping.current){const string=locate(event);if(string!==null)trigger(string)}}
  const stop=(event:ReactPointerEvent<SVGSVGElement>)=>{sweeping.current=false;last.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}
  return <svg className={`tf-guitar tf-guitar--${family} tf-guitar--gold-standard`} viewBox="0 0 600 1200" role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`} onPointerDown={down} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}>
    <title id={`${prefix}-title`}>{guitar.name.en}</title><desc id={`${prefix}-desc`}>{p.label}</desc>
    <defs>
      <linearGradient id={`${prefix}-top`} x1="155" y1={p.upperY} x2="453" y2={p.endY} gradientUnits="userSpaceOnUse"><stop stopColor={guitar.colors.accent}/><stop offset=".34" stopColor="#e7b965"/><stop offset=".71" stopColor={guitar.colors.body}/><stop offset="1" stopColor={guitar.colors.edge}/></linearGradient>
      <linearGradient id={`${prefix}-neck`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a9603e"/><stop offset=".44" stopColor="#6a3527"/><stop offset="1" stopColor="#351b17"/></linearGradient>
      <linearGradient id={`${prefix}-board`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4a2d25"/><stop offset=".48" stopColor="#251712"/><stop offset="1" stopColor="#140d0b"/></linearGradient>
      <Metal prefix={prefix}/><radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".48"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="300" cy="1158" rx={family==='super-jumbo'?208:family==='grand-auditorium'?194:175} ry="28" fill={`url(#${prefix}-shadow)`}/>
    <AcousticBody family={family} prefix={prefix}/>
    <g className="tf-module-neck" data-guitar-module={`acoustic-${family}-neck`}>
      <path d={`M272 ${nutY} L328 ${nutY} L346 ${p.boardEndY+25} L254 ${p.boardEndY+25} Z`} fill={`url(#${prefix}-neck)`}/>
      <path d="M270 238 L250 56 Q300 23 350 56 L330 238 Z" fill={`url(#${prefix}-neck)`} stroke="#3e211a" strokeWidth="1.8"/>
      <path d="M278 231 L322 231 L337 184 L263 184 Z" fill="#1d120f" opacity=".72"/>
      <path d="M276 72 Q300 51 324 72" fill="none" stroke="#e0bd78" strokeWidth="2.2" opacity=".65"/>
      <path d={`M276 ${nutY} L324 ${nutY} L${family==='grand-concert'?341:339} ${p.boardEndY} L${family==='grand-concert'?259:261} ${p.boardEndY} Z`} fill={`url(#${prefix}-board)`} stroke="#1a100d" strokeWidth="1.4"/>
      <line x1="276" x2="324" y1={nutY} y2={nutY} stroke="#eee3c7" strokeWidth="4"/>
      {Array.from({length:p.frets},(_,index)=>{const y=fretY(index+1);if(y>=p.boardEndY)return null;const t=(y-nutY)/(p.boardEndY-nutY);const half=24+17*t;return <g key={index}><line x1={300-half} x2={300+half} y1={y+1} y2={y+1} stroke="#211714" strokeWidth="3" opacity=".5"/><line x1={300-half} x2={300+half} y1={y} y2={y} stroke="#c4beb0" strokeWidth="1.3"/></g>})}
      {[3,5,7,9,12,15,17,19].map((fret)=>{const y=fretY(fret)-8;if(y>=p.boardEndY)return null;return fret===12?<g key={fret}><circle cx="290" cy={y} r="3.4" fill="#e2d5b8"/><circle cx="310" cy={y} r="3.4" fill="#e2d5b8"/></g>:<circle key={fret} cx="300" cy={y} r="3.5" fill="#e2d5b8"/>})}
      {tunerY.map((y,index)=>{const left=index<3;const x=tunerX[index];return <g key={index} data-guitar-part="sealed-tuner"><circle cx={x} cy={y} r="6.5" fill={`url(#${prefix}-metal)`} stroke="#565751"/><circle cx={x} cy={y} r="2.3" fill="#6e706c"/><path d={`M${x+(left?-7:7)} ${y} H${x+(left?-21:21)}`} stroke="#777973" strokeWidth="3.4"/><ellipse cx={x+(left?-27:27)} cy={y} rx="8.5" ry="5.7" fill={`url(#${prefix}-metal)`} stroke="#5b5d58"/></g>})}
    </g>
    <g className="tf-guitar__strings" data-guitar-module="shared-six-string-path">{saddleX.map((x,index)=>{const active=ringing.includes(index);const targetX=tunerX[index];const targetY=tunerY[index];const path=`M${x} ${p.endY-7} L${x} ${p.bridgeY+11} L${nutX[index]} ${nutY} L${targetX} ${targetY}`;return <g key={index} className={active?'tf-guitar__string tf-guitar__string--active':'tf-guitar__string'} style={{'--tf-string-index':index} as CSSProperties}><path d={path} fill="none" stroke="#160f0d" strokeWidth={2.3-index*.18} opacity=".26" transform="translate(1 1)"/><path d={path} fill="none" stroke={index<3?'#817b72':'#d0c7bb'} strokeWidth={1.75-index*.13}/></g>})}</g>
    <rect x="232" y={nutY} width="136" height={p.endY-nutY} fill="transparent" className="tf-guitar__string-hit"/>
  </svg>
}
