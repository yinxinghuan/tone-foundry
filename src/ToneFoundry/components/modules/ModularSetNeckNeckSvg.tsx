import { MODULAR_SET_NECK_GEOMETRY as GEO, type ModularSetNeckId } from '../../guitar-system/modularSetNeckPlatform'

const frets = Array.from({length:22},(_,index)=>GEO.nutY+GEO.scaleLength*(1-2**(-(index+1)/12)))

export function ModularSetNeckNeckSvg({prefix,neck}:{prefix:string;neck:ModularSetNeckId}) {
  const dots=neck==='dot-bound'
  return <g className="tf-module-neck" data-guitar-module={`set-neck-neck-${neck}`}>
    <path d="M264 706 L270 199 L330 199 L336 706 Z" fill={`url(#${prefix}-set-mahogany)`} stroke="#371512" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
    <g data-guitar-part="three-aside-tuner-backs">
      {GEO.tunerPoints.map(([x,y],index)=>{const side=index<3?-1:1;return <g key={`${x}-${y}`}><path d={`M${x+side*3} ${y} H${x+side*20}`} stroke="#767873" strokeWidth="5"/><path d={`M${x+side*18} ${y-7} Q${x+side*31} ${y} ${x+side*18} ${y+7} L${x+side*10} ${y+5} L${x+side*10} ${y-5} Z`} fill={`url(#${prefix}-set-nickel)`} stroke="#555954" strokeWidth=".7"/></g>})}
    </g>
    <path d="M270 205 L250 54 Q270 34 290 42 Q300 51 310 42 Q330 34 350 54 L330 205 Z" fill="#171514" stroke="#090807" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
    <path d="M262 58 Q278 44 290 48 Q300 57 310 48 Q322 44 338 58 L331 188 C315 173 285 173 269 188 Z" fill="#6f5545" opacity=".16"/>
    <path d="M300 57 l12 15 -12 14 -12-14 Z" fill="#dfd4b8" opacity=".72"/>
    <path d="M291 171 H309 L314 201 H286 Z" fill="#151313" stroke="#b7ab91" strokeWidth="1"/><circle cx="300" cy="184" r="2.2" fill={`url(#${prefix}-set-nickel)`}/>
    {GEO.tunerPoints.map(([x,y])=><g key={`${x}-${y}-front`}><circle cx={x} cy={y} r="7.3" fill={`url(#${prefix}-set-nickel)`} stroke="#555954" strokeWidth=".65"/><polygon points={`${x},${y-4.2} ${x+3.7},${y-2.1} ${x+3.7},${y+2.1} ${x},${y+4.2} ${x-3.7},${y+2.1} ${x-3.7},${y-2.1}`} fill="#8c8f89"/><circle cx={x} cy={y} r="1.7" fill="#555854"/></g>)}
    <path d="M276 706 L278 205 H322 L324 706 Z" fill={`url(#${prefix}-set-binding)`}/>
    <path d="M279 704 L281 207 H319 L321 704 Z" fill={`url(#${prefix}-set-rosewood)`} stroke="#201211" strokeWidth=".7" vectorEffect="non-scaling-stroke"/>
    <rect x="278" y="202" width="44" height="6" rx="1" fill="#e7ddc8" stroke="#746b5f" strokeWidth=".6"/>
    {frets.map((y,index)=>{const fret=index+1;if(y>704)return null;const t=(y-GEO.nutY)/(GEO.boardEndY-GEO.nutY);const half=20+t*2.5;const marker=[3,5,7,9,12,15,17,19,21].includes(fret);return <g key={fret}><path d={`M${300-half} ${y+.8} H${300+half}`} stroke="#393833" strokeWidth="2.1" opacity=".55" vectorEffect="non-scaling-stroke"/><path d={`M${300-half} ${y} H${300+half}`} stroke={`url(#${prefix}-set-fret)`} strokeWidth="1.25" vectorEffect="non-scaling-stroke"/>{marker && (dots?<g>{fret===12?<><circle cx="292" cy={y-11} r="3.4" fill="#d8d0b9"/><circle cx="308" cy={y-11} r="3.4" fill="#d8d0b9"/></>:<circle cx="300" cy={y-11} r="3.6" fill="#d8d0b9"/>}</g>:<path d={`M${fret===12?276:282} ${y-16} H${fret===12?324:318} L${fret===12?316:312} ${y-5} H${fret===12?284:288} Z`} fill="#ded4bb" opacity=".9"/> )}</g>})}
  </g>
}
