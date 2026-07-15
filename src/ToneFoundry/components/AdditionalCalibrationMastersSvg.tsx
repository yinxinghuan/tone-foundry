import { useCallback, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import type { GuitarSpec } from '../types'

type MasterKind = 'contour' | 'semi' | 'doubleHorn' | 'nylon'
interface Props { guitar: GuitarSpec; onPluck: (stringIndex: number) => void }

const MASTER_GEOMETRY: Record<MasterKind, {
  nutY: number; saddleY: number; stringEndY: number; boardEndY: number; frets: number
  nutX: number[]; saddleX: number[]; tuners: Array<[number, number]>
}> = {
  contour: { nutY: 210, saddleY: 923, stringEndY: 988, boardEndY: 690, frets: 22, nutX: [278,287,296,304,313,322], saddleX: [272,283,294,306,317,328], tuners: [[254,178],[247,152],[241,126],[238,100],[242,75],[253,53]] },
  semi: { nutY: 220, saddleY: 910, stringEndY: 982, boardEndY: 702, frets: 22, nutX: [278,287,296,304,313,322], saddleX: [272,283,294,306,317,328], tuners: [[258,176],[257,137],[262,98],[342,98],[343,137],[342,176]] },
  doubleHorn: { nutY: 220, saddleY: 910, stringEndY: 982, boardEndY: 674, frets: 22, nutX: [278,287,296,304,313,322], saddleX: [272,283,294,306,317,328], tuners: [[258,176],[257,137],[262,98],[342,98],[343,137],[342,176]] },
  nylon: { nutY: 190, saddleY: 905, stringEndY: 970, boardEndY: 550, frets: 19, nutX: [270,282,294,306,318,330], saddleX: [260,276,292,308,324,340], tuners: [[260,158],[259,124],[260,90],[340,90],[341,124],[340,158]] },
}

function Frets({ kind }: { kind: MasterKind; prefix: string }) {
  const g = MASTER_GEOMETRY[kind]
  const endWidth = kind === 'nylon' ? 104 : 76
  return <g data-guitar-part="frets">
    {Array.from({ length: g.frets }, (_, i) => {
      const n = i + 1
      const y = g.nutY + (g.saddleY - g.nutY) * (1 - 2 ** (-n / 12))
      if (y > g.boardEndY) return null
      const t = (y - g.nutY) / (g.boardEndY - g.nutY)
      const half = (kind === 'nylon' ? 31 : 24) + ((endWidth / 2 - (kind === 'nylon' ? 31 : 24)) * t)
      return <g key={n}><line x1={300-half} x2={300+half} y1={y+.8} y2={y+.8} stroke="#393833" strokeWidth="2.3" opacity=".55" vectorEffect="non-scaling-stroke"/><line x1={300-half} x2={300+half} y1={y} y2={y} stroke="#c9c6bc" strokeWidth="1.35" vectorEffect="non-scaling-stroke" /></g>
    })}
  </g>
}

function SixInlineHead({ prefix }: { prefix: string }) {
  const g = MASTER_GEOMETRY.contour
  return <g data-guitar-module="contour-six-inline-neck">
    <path d="M274 218 L264 185 C257 160 244 142 236 120 C226 92 231 54 250 31 C268 10 294 17 305 37 C316 58 301 82 286 103 L280 210 Z" fill={`url(#${prefix}-maple)`} stroke="#60452d" strokeWidth="1.4" />
    <path d="M272 205 C261 157 246 122 245 86 C244 58 255 39 271 29" fill="none" stroke="#f4d397" strokeWidth="2" opacity=".22"/><path d="M280 207 C275 169 263 130 264 92" fill="none" stroke="#724625" opacity=".25"/>
    {g.tuners.map(([x,y],i)=><g key={i}><path d={`M${x-2} ${y} L${x-19} ${y+4}`} stroke="#777974" strokeWidth="5" /><ellipse cx={x-23} cy={y+5} rx="9" ry="6.5" fill={`url(#${prefix}-metal)`} stroke="#555"/><circle cx={x} cy={y} r="7.5" fill={`url(#${prefix}-metal)`} stroke="#666"/><circle cx={x} cy={y} r="3" fill="#777"/></g>)}
    <path d="M270 172 h22" stroke={`url(#${prefix}-metal)`} strokeWidth="3"/><rect x="273" y="167" width="17" height="7" rx="2" fill={`url(#${prefix}-metal)`}/>
  </g>
}

function ThreeAsideHead({ prefix, kind }: { prefix: string; kind: 'semi'|'doubleHorn'|'nylon' }) {
  const slotted=kind==='nylon'
  const g = MASTER_GEOMETRY[kind]
  return <g data-guitar-module={slotted ? 'classical-slotted-head' : 'set-neck-three-aside-head'}>
    <path d={slotted ? 'M264 193 L255 52 Q300 18 345 52 L336 193 Z' : kind==='semi' ? 'M270 220 L250 52 Q300 18 350 52 L330 220 Z' : 'M270 220 L246 49 Q300 14 354 49 L330 220 Z'} fill={`url(#${prefix}-${slotted ? 'rosewood' : 'mahogany'})`} stroke="#44291f" strokeWidth="1.5" />
    {slotted && <><rect x="270" y="64" width="14" height="91" rx="7" fill="#171310" stroke="#6b4635"/><rect x="316" y="64" width="14" height="91" rx="7" fill="#171310" stroke="#6b4635"/><path d="M277 76 V145 M323 76 V145" stroke="#b5a68b" strokeWidth="3" opacity=".65"/>{[90,124,158].map(y=><g key={y}><circle cx="277" cy={y} r="3.2" fill={`url(#${prefix}-metal)`}/><circle cx="323" cy={y} r="3.2" fill={`url(#${prefix}-metal)`}/></g>)}</>}
    {!slotted && <><path d="M300 60 l13 17 -13 15 -13-15 Z" fill="#dfd7bd" opacity={kind==='semi'?.82:.42}/><path d="M292 181 L308 181 L313 210 L287 210 Z" fill="#151313" stroke="#b3a895"/><Fastener x={300} y={189} prefix={prefix} r={2.5}/></>}
    {g.tuners.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={slotted?4.5:8} fill={`url(#${prefix}-metal)`} stroke="#555"/><circle cx={x} cy={y} r="2.5" fill="#74756f"/><path d={`M${x+(i<3?-1:1)*7} ${y} L${x+(i<3?-1:1)*20} ${y}`} stroke="#777974" strokeWidth="4"/><ellipse cx={x+(i<3?-1:1)*26} cy={y} rx={slotted?8:9} ry={slotted?5.5:6.5} fill={slotted?'#e6d7ad':`url(#${prefix}-metal)`} stroke="#65655f"/></g>)}
  </g>
}

function Neck({ kind, prefix }: { kind: MasterKind; prefix: string }) {
  const g = MASTER_GEOMETRY[kind]
  const boardTop = kind === 'nylon' ? 269 : 276
  const boardBottom = kind === 'nylon' ? 331 : 324
  return <g data-guitar-module={`${kind}-neck`}>
    {kind === 'contour' ? <SixInlineHead prefix={prefix}/> : <ThreeAsideHead prefix={prefix} kind={kind}/>} 
    <path d={`M${boardTop} ${g.nutY-1} L${boardBottom} ${g.nutY-1} L${kind==='nylon'?352:338} ${g.boardEndY+25} L${kind==='nylon'?248:262} ${g.boardEndY+25} Z`} fill={kind==='contour'?`url(#${prefix}-maple)`:`url(#${prefix}-mahogany)`} />
    {kind==='semi'||kind==='doubleHorn'?<path d={`M${boardTop-2} ${g.nutY} L${boardBottom+2} ${g.nutY} L340 ${g.boardEndY+2} L260 ${g.boardEndY+2} Z`} fill="#e4d7b8"/>:null}
    <path d={`M${boardTop} ${g.nutY} L${boardBottom} ${g.nutY} L${kind==='nylon'?350:337} ${g.boardEndY} L${kind==='nylon'?250:263} ${g.boardEndY} Z`} fill={`url(#${prefix}-rosewood)`} stroke="#211713" strokeWidth="1.2" />
    <line x1={boardTop} x2={boardBottom} y1={g.nutY} y2={g.nutY} stroke="#eee2c7" strokeWidth={kind==='nylon'?6:4}/>
    <Frets kind={kind} prefix={prefix}/>
    {kind!=='nylon' && [3,5,7,9,12,15,17,19,21].map(n=>{const y=g.nutY+(g.saddleY-g.nutY)*(1-2**(-n/12))-10;if(y>=g.boardEndY)return null;if(kind==='contour'||kind==='semi')return <g key={n}>{n===12?<><circle cx="289" cy={y} r="4.2" fill="#d8d0b9"/><circle cx="311" cy={y} r="4.2" fill="#d8d0b9"/></>:<circle cx="300" cy={y} r="4.2" fill="#d8d0b9"/>}</g>;const w=n===12?24:18;return <path key={n} d={`M${300-w} ${y-5} L${300+w} ${y-5} L${300+w-7} ${y+6} L${300-w+7} ${y+6} Z`} fill="#d9d0b8" opacity=".9"/>})}
  </g>
}

function Pickup({ x, y, angle=0, covered=false, prefix }: { x:number;y:number;angle?:number;covered?:boolean;prefix:string }) {
  const h=covered?34:24
  return <g transform={`rotate(${angle} ${x} ${y})`} data-guitar-part={covered?'covered-humbucker':'single-coil'}>
    <rect x={x-45} y={y-h/2-3} width="90" height={h+6} rx="5" fill="#171513" opacity=".34" transform="translate(2 3)"/>
    <rect x={x-43} y={y-h/2} width="86" height={h} rx={covered?5:10} fill={covered?`url(#${prefix}-metal)`:`url(#${prefix}-plastic)`} stroke={covered?'#555650':'#8f8a79'} strokeWidth="1.2"/>
    {covered && <path d={`M${x-40} ${y-h/2+5} H${x+40}`} stroke="#fff" opacity=".28"/>}
    <g fill={covered?'#666861':'#67665e'} stroke="#e6e1d5" strokeWidth=".45">{[0,1,2,3,4,5].map(i=><circle key={i} cx={x-29+i*11.6} cy={y+(covered?6:0)} r="2.8"/>)}</g>
    <circle cx={x-49} cy={y} r="3.6" fill={`url(#${prefix}-metal)`}/><circle cx={x+49} cy={y} r="3.6" fill={`url(#${prefix}-metal)`}/>
  </g>
}

function Fastener({ x,y,prefix,r=3 }: {x:number;y:number;prefix:string;r?:number}) { return <g data-guitar-part="fastener"><circle cx={x} cy={y} r={r} fill={`url(#${prefix}-metal)`} stroke="#555" strokeWidth=".6"/><path d={`M${x-r*.55} ${y} H${x+r*.55}`} stroke="#53534f" strokeWidth=".8"/></g> }

function Knob({ x,y,prefix,light=false }: {x:number;y:number;prefix:string;light?:boolean}) {
  return <g data-guitar-part="control-knob"><circle cx={x+2} cy={y+3} r="18" fill="#000" opacity=".3"/><circle cx={x} cy={y} r="17" fill={light?'#e8e0c9':`url(#${prefix}-knob)`} stroke={light?'#8b877a':'#b7a27b'} strokeWidth="1.2"/>{Array.from({length:18},(_,i)=>{const a=i*Math.PI*2/18;return <line key={i} x1={x+Math.cos(a)*13} y1={y+Math.sin(a)*13} x2={x+Math.cos(a)*16} y2={y+Math.sin(a)*16} stroke={light?'#a8a291':'#8d7c60'} strokeWidth=".7"/>})}<circle cx={x-4} cy={y-5} r="4" fill="#fff" opacity=".2"/><path d={`M${x} ${y-8} V${y-14}`} stroke={light?'#77746b':'#e4d1aa'} strokeWidth="1.4"/></g>
}

function TuneOMatic({ y,prefix }: {y:number;prefix:string}) { return <g data-guitar-part="tune-o-matic"><rect x="252" y={y-8} width="96" height="21" rx="5" fill="#151514" opacity=".28" transform="translate(2 3)"/><rect x="252" y={y-10} width="96" height="20" rx="5" fill={`url(#${prefix}-metal)`} stroke="#555"/>{[0,1,2,3,4,5].map(i=><g key={i}><rect x={260+i*15} y={y-7} width="10" height="14" rx="2" fill="#a9aaa4" stroke="#666"/><circle cx={265+i*15} cy={y} r="2" fill="#555"/></g>)}<Fastener x={249} y={y} prefix={prefix}/><Fastener x={351} y={y} prefix={prefix}/></g> }

function StopTail({ y,prefix }: {y:number;prefix:string}) { return <g data-guitar-part="stop-tail"><path d={`M254 ${y} Q300 ${y-9} 346 ${y} L341 ${y+16} Q300 ${y+8} 259 ${y+16} Z`} fill={`url(#${prefix}-metal)`} stroke="#565752"/><Fastener x={251} y={y+8} prefix={prefix} r={4}/><Fastener x={349} y={y+8} prefix={prefix} r={4}/></g> }

function Body({ kind, prefix }: { kind: MasterKind; prefix: string }) {
  if (kind==='contour') return <g data-guitar-module="contour-alder-body">
    <path d="M280 689 L279 650 C260 638 250 610 242 580 C229 557 207 565 189 589 C168 617 160 652 169 685 C177 716 190 740 190 762 C183 780 163 797 149 824 C119 880 105 954 127 1020 C151 1091 216 1125 287 1131 C368 1138 439 1102 469 1027 C494 963 480 881 455 824 C443 797 421 779 417 758 C416 738 428 717 440 692 C454 664 449 637 430 624 C409 608 382 616 363 640 C345 661 336 684 320 690 Z" fill={`url(#${prefix}-body)`} stroke="#66604f" strokeWidth="1.6"/>
    <path d="M469 1027 C494 963 480 881 455 824 C443 797 421 779 417 758" transform="translate(-3 -1)" fill="none" stroke="#686653" strokeWidth="9" opacity=".65"/>
    <path d="M159 849 C146 905 149 969 174 1023 C194 1066 226 1095 267 1115" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" opacity=".06"/>
    <path d="M176 641 C187 605 211 581 233 582" fill="none" stroke="#fff7dc" strokeWidth="4" strokeLinecap="round" opacity=".17"/>
    <path d="M266 681 C233 702 215 743 222 799 L245 955 C260 987 333 1001 369 962 L397 775 C398 724 366 690 334 681 Z" fill="#d9ddc8" stroke="#8f927f" strokeWidth="1.2"/><path d="M268 685 C238 710 227 750 233 803 L254 944" fill="none" stroke="#fff" strokeWidth="2" opacity=".35"/>
    <Pickup x={300} y={756} prefix={prefix}/><Pickup x={300} y={820} angle={-7} prefix={prefix}/><Pickup x={300} y={884} prefix={prefix}/>
    <rect x="252" y="906" width="96" height="80" rx="5" fill="#111" opacity=".25" transform="translate(2 3)"/><rect x="252" y="906" width="96" height="80" rx="5" fill={`url(#${prefix}-metal)`} stroke="#555"/><g>{[0,1,2,3,4,5].map(i=><g key={i}><rect x={259+i*14} y="923" width="11" height="29" rx="2" fill="#a7a9a3" stroke="#60615e"/><circle cx={264.5+i*14} cy="931" r="2" fill="#575853"/><path d={`M${264.5+i*14} 952 V974`} stroke="#666" strokeWidth="2"/></g>)}</g><Fastener x={261} y={916} prefix={prefix}/><Fastener x={339} y={916} prefix={prefix}/>
    <path d="M345 945 C392 970 392 1018 371 1054" fill="none" stroke="#b9bbb5" strokeWidth="4"/><circle cx="379" cy="1058" r="6" fill="#ccc"/>
    <Knob x={382} y={824} prefix={prefix} light/><Knob x={390} y={882} prefix={prefix} light/><Knob x={398} y={940} prefix={prefix} light/><path d="M368 775 l35 -18" stroke="#5f5c52" strokeWidth="3"/><path d="M384 767 l16 -8" stroke="#eee7d2" strokeWidth="5" strokeLinecap="round"/>
    {[ [252,703],[226,792],[241,956],[374,747],[397,964] ].map(([x,y],i)=><Fastener key={i} x={x} y={y} prefix={prefix} r={2.6}/>)}
  </g>
  if (kind==='semi') return <g data-guitar-module="centerblock-semi-hollow-body">
    <path d="M278 650 C254 624 239 600 205 596 C170 592 140 620 138 660 C136 696 157 722 185 744 C211 762 214 778 198 795 C170 820 145 850 130 890 C102 967 130 1053 205 1099 C252 1128 316 1137 372 1114 C453 1080 484 1002 470 918 C461 865 438 825 402 795 C386 778 389 762 415 744 C443 722 464 696 462 660 C460 620 430 592 395 596 C361 600 346 624 322 650 L320 690 L280 690 Z" transform="translate(6 8)" fill="#421715"/>
    <path d="M278 650 C254 624 239 600 205 596 C170 592 140 620 138 660 C136 696 157 722 185 744 C211 762 214 778 198 795 C170 820 145 850 130 890 C102 967 130 1053 205 1099 C252 1128 316 1137 372 1114 C453 1080 484 1002 470 918 C461 865 438 825 402 795 C386 778 389 762 415 744 C443 722 464 696 462 660 C460 620 430 592 395 596 C361 600 346 624 322 650 L320 690 L280 690 Z" fill={`url(#${prefix}-body)`} stroke="#411411" strokeWidth="2"/>
    <path d="M278 650 C254 624 239 600 205 596 C170 592 140 620 138 660 C136 696 157 722 185 744 C211 762 214 778 198 795 C170 820 145 850 130 890 C102 967 130 1053 205 1099 C252 1128 316 1137 372 1114 C453 1080 484 1002 470 918 C461 865 438 825 402 795 C386 778 389 762 415 744 C443 722 464 696 462 660 C460 620 430 592 395 596 C361 600 346 624 322 650" fill="none" stroke="#ead7b3" strokeWidth="5" opacity=".85"/>
    <path d="M157 657 C190 617 251 624 286 662 M443 657 C410 617 349 624 314 662" fill="none" stroke="#fff1d3" strokeWidth="4" opacity=".1"/>
    <g opacity=".16">{[-110,-80,-50,50,80,110].map(dx=><path key={dx} d={`M${300+dx} 610 C${288+dx} 760 ${312+dx} 955 ${300+dx} ${1110-Math.abs(dx)*.35}`} fill="none" stroke="#f1b28e" strokeWidth="1.2"/>)}</g>
    <path d="M210 775 C190 808 191 847 207 878 C218 899 216 922 205 946 M229 777 C220 790 221 804 231 814 M195 846 L215 842" fill="none" stroke="#241514" strokeWidth="7" strokeLinecap="round"/>
    <path d="M390 775 C410 808 409 847 393 878 C382 899 384 922 395 946 M371 777 C380 790 379 804 369 814 M405 846 L385 842" fill="none" stroke="#241514" strokeWidth="7" strokeLinecap="round"/>
    <Pickup x={300} y={770} covered prefix={prefix}/><Pickup x={300} y={875} covered prefix={prefix}/>
    <TuneOMatic y={918} prefix={prefix}/><StopTail y={976} prefix={prefix}/>
    <Knob x={390} y={900} prefix={prefix}/><Knob x={438} y={900} prefix={prefix}/><Knob x={390} y={974} prefix={prefix}/><Knob x={438} y={974} prefix={prefix}/>
    <circle cx="420" cy="820" r="12" fill="#241a18" stroke="#d8c2a0"/><path d="M420 820 L429 807" stroke="#e9dcc2" strokeWidth="3" strokeLinecap="round"/>
  </g>
  if (kind==='doubleHorn') return <g data-guitar-module="thin-mahogany-double-horn-body">
    <path d="M280 690 L280 660 C261 652 247 635 236 616 C221 590 198 565 180 572 C164 578 169 608 176 635 C184 664 160 689 132 710 C113 725 137 749 168 765 C196 780 206 795 194 815 C158 865 132 914 134 961 C138 1028 216 1076 300 1084 C384 1076 462 1028 466 961 C468 914 442 865 406 815 C394 795 404 780 432 765 C463 749 487 725 468 710 C440 689 416 664 424 635 C431 608 436 578 420 572 C402 565 379 590 364 616 C353 635 339 652 320 660 L320 690 Z" transform="translate(5 7)" fill="#48151a"/>
    <path d="M280 690 L280 660 C261 652 247 635 236 616 C221 590 198 565 180 572 C164 578 169 608 176 635 C184 664 160 689 132 710 C113 725 137 749 168 765 C196 780 206 795 194 815 C158 865 132 914 134 961 C138 1028 216 1076 300 1084 C384 1076 462 1028 466 961 C468 914 442 865 406 815 C394 795 404 780 432 765 C463 749 487 725 468 710 C440 689 416 664 424 635 C431 608 436 578 420 572 C402 565 379 590 364 616 C353 635 339 652 320 660 L320 690 Z" fill={`url(#${prefix}-body)`} stroke="#451319" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M278 666 C254 649 229 608 196 598 C197 625 190 653 169 681 C213 661 251 671 278 691 Z M322 666 C345 648 374 599 402 593 C399 621 406 652 434 682 C386 661 348 671 322 691 Z" fill="#e16f5a" opacity=".16"/>
    <path d="M252 688 C220 717 211 787 233 852 L244 978 C261 1006 347 1006 365 978 L374 811 C375 751 348 705 330 688 Z" fill="#171719" stroke="#5b4f4d"/><path d="M257 695 C232 730 229 783 242 830" fill="none" stroke="#fff" strokeWidth="2" opacity=".12"/>
    <Pickup x={300} y={766} covered prefix={prefix}/><Pickup x={300} y={862} covered prefix={prefix}/>
    <TuneOMatic y={914} prefix={prefix}/><StopTail y={972} prefix={prefix}/>
    <Knob x={388} y={892} prefix={prefix}/><Knob x={434} y={892} prefix={prefix}/><Knob x={388} y={960} prefix={prefix}/><Knob x={434} y={960} prefix={prefix}/>
    {[ [251,708],[235,787],[244,970],[351,708],[370,810],[360,978] ].map(([x,y],i)=><Fastener key={i} x={x} y={y} prefix={prefix} r={2.5}/>)}
  </g>
  return <g data-guitar-module="concert-nylon-body">
    <path d="M250 548 C190 550 145 594 145 656 C145 704 173 740 187 762 C136 803 113 883 128 978 C145 1078 216 1127 300 1129 C384 1127 455 1078 472 978 C487 883 464 803 413 762 C427 740 455 704 455 656 C455 594 410 550 350 548 C330 549 315 562 300 575 C285 562 270 549 250 548 Z" transform="translate(8 10)" fill="#593326"/>
    <path d="M250 548 C190 550 145 594 145 656 C145 704 173 740 187 762 C136 803 113 883 128 978 C145 1078 216 1127 300 1129 C384 1127 455 1078 472 978 C487 883 464 803 413 762 C427 740 455 704 455 656 C455 594 410 550 350 548 C330 549 315 562 300 575 C285 562 270 549 250 548 Z" fill={`url(#${prefix}-body)`} stroke="#5b3526" strokeWidth="1.8"/>
    <path d="M250 548 C190 550 145 594 145 656 C145 704 173 740 187 762 C136 803 113 883 128 978 C145 1078 216 1127 300 1129 C384 1127 455 1078 472 978 C487 883 464 803 413 762 C427 740 455 704 455 656 C455 594 410 550 350 548" fill="none" stroke="#e6d19c" strokeWidth="4" opacity=".72"/>
    <path d="M169 619 C151 686 183 731 199 753 M153 892 C143 1001 190 1081 263 1110" fill="none" stroke="#fff2c5" strokeWidth="10" strokeLinecap="round" opacity=".07"/>
    <circle cx="300" cy="748" r="70" fill="#1c1311"/><circle cx="300" cy="748" r="75" fill="none" stroke="#0f0c0b" strokeWidth="4"/><circle cx="300" cy="748" r="80" fill="none" stroke="#d6b46f" strokeWidth="3"/><circle cx="300" cy="748" r="85" fill="none" stroke="#6d2c24" strokeWidth="3"/><circle cx="300" cy="748" r="89" fill="none" stroke="#e7c77d" strokeWidth="2"/><circle cx="300" cy="748" r="94" fill="none" stroke="#3f211d" strokeWidth="3"/>
    <rect x="232" y="892" width="136" height="52" rx="7" fill="#130e0c" opacity=".25" transform="translate(2 3)"/><path d="M232 900 Q300 885 368 900 L364 946 Q300 938 236 946 Z" fill="#38221b" stroke="#1b1210"/><rect x="248" y="902" width="104" height="12" fill="#eadfc4" stroke="#8d8068"/><rect x="244" y="930" width="112" height="20" rx="3" fill="#4c2d22"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${258+i*17} 937 q7 9 0 18 q-7-9 0-18`} fill="none" stroke="#d6c49e" strokeWidth="2"/>)}
    <g opacity=".22">{[-105,-85,-65,-45,-25,0,25,45,65,85,105].map((dx,i)=><path key={dx} d={`M${300+dx} 570 C${292+dx+(i%2?3:-3)} 760 ${308+dx} 970 ${300+dx} ${1118-Math.abs(dx)*.55}`} fill="none" stroke={i%2?'#6b3f28':'#f0c984'} strokeWidth={i%2?1.1:.7}/>)}</g>
  </g>
}

function CalibrationMasterSvg({ kind, guitar, onPluck }: Props & { kind: MasterKind }) {
  const [ringing,setRinging]=useState<number[]>([])
  const sweeping=useRef(false); const last=useRef<number|null>(null)
  const rawId=useId(); const prefix=`tf-${kind}-${rawId.replace(/:/g,'')}`
  const g=MASTER_GEOMETRY[kind]
  const trigger=useCallback((index:number)=>{if(index<0||index>5||last.current===index)return;last.current=index;onPluck(index);setRinging(v=>[...new Set([...v,index])]);window.setTimeout(()=>setRinging(v=>v.filter(n=>n!==index)),220)},[onPluck])
  const locate=useCallback((event:ReactPointerEvent<SVGSVGElement>)=>{const p=event.currentTarget.createSVGPoint();p.x=event.clientX;p.y=event.clientY;const inv=event.currentTarget.getScreenCTM()?.inverse();if(!inv)return null;const q=p.matrixTransform(inv);if(q.y<g.nutY||q.y>g.stringEndY)return null;let best=0,dist=Infinity;g.saddleX.forEach((sx,i)=>{const x=g.nutX[i]+(sx-g.nutX[i])*(q.y-g.nutY)/(g.saddleY-g.nutY);const d=Math.abs(q.x-x);if(d<dist){dist=d;best=i}});return dist<14?best:null},[g])
  const down=(e:ReactPointerEvent<SVGSVGElement>)=>{const i=locate(e);if(i===null)return;e.preventDefault();sweeping.current=true;last.current=null;e.currentTarget.setPointerCapture(e.pointerId);trigger(i)}
  const move=(e:ReactPointerEvent<SVGSVGElement>)=>{if(sweeping.current){const i=locate(e);if(i!==null)trigger(i)}}
  const stop=(e:ReactPointerEvent<SVGSVGElement>)=>{sweeping.current=false;last.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}
  const descriptions:Record<MasterKind,string>={contour:'25.5 inch contoured double-cut with three single coils and synchronized tremolo',semi:'24.75 inch centerblock semi-hollow with twin f-holes and humbuckers',doubleHorn:'24.75 inch thin mahogany double-horn solid with full-face guard',nylon:'650 millimeter 12-fret concert nylon guitar with slotted headstock and tie-block bridge'}
  return <svg className={`tf-guitar tf-guitar--${kind} tf-guitar--gold-standard`} viewBox="0 0 600 1200" role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`} onPointerDown={down} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}>
    <title id={`${prefix}-title`}>{guitar.name.en}</title><desc id={`${prefix}-desc`}>{descriptions[kind]}</desc>
    <defs>
      <linearGradient id={`${prefix}-body`} x1="130" y1="610" x2="470" y2="1120" gradientUnits="userSpaceOnUse"><stop stopColor={guitar.colors.accent}/><stop offset=".48" stopColor={guitar.colors.body}/><stop offset="1" stopColor={guitar.colors.edge}/></linearGradient>
      <linearGradient id={`${prefix}-maple`}><stop stopColor="#e4bd79"/><stop offset=".5" stopColor="#b97d3f"/><stop offset="1" stopColor="#7c4c2b"/></linearGradient>
      <linearGradient id={`${prefix}-mahogany`}><stop stopColor="#945039"/><stop offset=".5" stopColor="#5c2c24"/><stop offset="1" stopColor="#351b19"/></linearGradient>
      <linearGradient id={`${prefix}-rosewood`}><stop stopColor="#4a3028"/><stop offset=".5" stopColor="#271916"/><stop offset="1" stopColor="#160f0e"/></linearGradient>
      <linearGradient id={`${prefix}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#555750"/><stop offset=".22" stopColor="#ece8dc"/><stop offset=".5" stopColor="#8d908b"/><stop offset=".75" stopColor="#d8d5cb"/><stop offset="1" stopColor="#555850"/></linearGradient>
      <linearGradient id={`${prefix}-plastic`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fbf6e7"/><stop offset=".52" stopColor="#ddd6bd"/><stop offset="1" stopColor="#aaa590"/></linearGradient>
      <radialGradient id={`${prefix}-knob`} cx="34%" cy="27%"><stop stopColor="#66594a"/><stop offset=".25" stopColor="#28231f"/><stop offset=".72" stopColor="#11100f"/><stop offset="1" stopColor="#050505"/></radialGradient>
      <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".55"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="300" cy="1142" rx={kind==='semi'?220:190} ry="31" fill={`url(#${prefix}-shadow)`}/>
    <Body kind={kind} prefix={prefix}/><Neck kind={kind} prefix={prefix}/>
    <g className="tf-guitar__strings" data-guitar-module="shared-six-string-path">{g.saddleX.map((sx,i)=>{const [tx,ty]=g.tuners[i];const active=ringing.includes(i);const d=`M${sx} ${g.stringEndY} L${sx} ${g.saddleY} L${g.nutX[i]} ${g.nutY} L${tx} ${ty}`;return <g key={i} className={active?'tf-guitar__string tf-guitar__string--active':'tf-guitar__string'} style={{'--tf-string-index':i} as CSSProperties}><path d={d} fill="none" stroke="#16130f" strokeWidth={2.4-i*.2} opacity=".25" transform="translate(1 1)"/><path d={d} fill="none" stroke={kind==='nylon'&&i>2?'#d8d0bd':i<3?'#827d74':'#b8b2a8'} strokeWidth={kind==='nylon'?1.6-i*.12:1.9-i*.16}/></g>})}</g>
    <rect x="235" y={g.nutY} width="130" height={g.stringEndY-g.nutY} fill="transparent" className="tf-guitar__string-hit"/>
  </svg>
}

export const ContourSssGuitarSvg = (props: Props): ReactNode => <CalibrationMasterSvg kind="contour" {...props}/>
export const CenterblockSemiGuitarSvg = (props: Props): ReactNode => <CalibrationMasterSvg kind="semi" {...props}/>
export const ThinDoubleHornGuitarSvg = (props: Props): ReactNode => <CalibrationMasterSvg kind="doubleHorn" {...props}/>
export const ConcertNylonGuitarSvg = (props: Props): ReactNode => <CalibrationMasterSvg kind="nylon" {...props}/>
