import { useId } from 'react'
import { MODULAR_SET_FINISHES, MODULAR_SET_NECK_GEOMETRY as GEO, type ModularSetNeckConfig } from '../guitar-system/modularSetNeckPlatform'
import { ModularSetNeckBodySvg } from './modules/ModularSetNeckBodySvg'
import { ModularSetNeckHardwareSvg } from './modules/ModularSetNeckHardwareSvg'
import { ModularSetNeckNeckSvg } from './modules/ModularSetNeckNeckSvg'

export function ModularSetNeckGuitarSvg({config,showAnchors=false}:{config:ModularSetNeckConfig;showAnchors?:boolean}) {
  const rawId=useId(); const prefix=`tf-set-${rawId.replace(/:/g,'')}`; const finish=MODULAR_SET_FINISHES[config.finish]
  const stringStart=config.bridge==='stopbar'?982:config.bridge==='trapeze'?1060:1027
  return <svg className="tf-guitar tf-guitar--modular tf-guitar--set-neck" viewBox={GEO.viewBox} role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`}>
    <title id={`${prefix}-title`}>Modular 24.75 inch set-neck guitar</title>
    <desc id={`${prefix}-desc`}>{`${config.body} body, ${config.neck} neck, ${config.pickups}, ${config.bridge}, ${config.finish} finish`}</desc>
    <defs>
      <radialGradient id={`${prefix}-set-body-top`} cx="42%" cy="40%" r="72%"><stop stopColor={finish.top}/><stop offset=".54" stopColor={finish.mid}/><stop offset="1" stopColor={finish.edge}/></radialGradient>
      <linearGradient id={`${prefix}-set-body-side`} x1="160" y1="600" x2="460" y2="1115" gradientUnits="userSpaceOnUse"><stop stopColor={finish.side}/><stop offset="1" stopColor="#160b0b"/></linearGradient>
      <linearGradient id={`${prefix}-set-binding`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff6dc"/><stop offset=".5" stopColor={finish.binding}/><stop offset="1" stopColor="#9f8a68"/></linearGradient>
      <linearGradient id={`${prefix}-set-mahogany`} x1="255" y1="0" x2="345" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#421817"/><stop offset=".22" stopColor="#844234"/><stop offset=".55" stopColor="#9a513d"/><stop offset=".83" stopColor="#652b25"/><stop offset="1" stopColor="#351514"/></linearGradient>
      <linearGradient id={`${prefix}-set-rosewood`} x1="275" y1="0" x2="325" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#211312"/><stop offset=".28" stopColor="#4c2b26"/><stop offset=".58" stopColor="#321d1a"/><stop offset=".82" stopColor="#4b2a25"/><stop offset="1" stopColor="#1c1110"/></linearGradient>
      <linearGradient id={`${prefix}-set-nickel`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#555854"/><stop offset=".2" stopColor="#e7e4dc"/><stop offset=".43" stopColor="#90938e"/><stop offset=".7" stopColor="#f0ece3"/><stop offset="1" stopColor="#565954"/></linearGradient>
      <linearGradient id={`${prefix}-set-fret`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eeeae2"/><stop offset=".5" stopColor="#999b96"/><stop offset="1" stopColor="#50534f"/></linearGradient>
      <linearGradient id={`${prefix}-set-guard`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={finish.guard==='#171719'?'#353437':'#f2e9d5'}/><stop offset=".55" stopColor={finish.guard}/><stop offset="1" stopColor={finish.guard==='#171719'?'#080809':'#9f9581'}/></linearGradient>
      <linearGradient id={`${prefix}-set-plastic`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={config.finish==='ebony'?'#f2ead8':'#393331'}/><stop offset=".5" stopColor={config.finish==='ebony'?'#d7cdb8':'#171515'}/><stop offset="1" stopColor={config.finish==='ebony'?'#9d9483':'#070707'}/></linearGradient>
      <radialGradient id={`${prefix}-set-knob`} cx="34%" cy="27%"><stop stopColor="#665849"/><stop offset=".25" stopColor="#2c2621"/><stop offset=".75" stopColor="#11100f"/><stop offset="1" stopColor="#050505"/></radialGradient>
      <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".55"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <ModularSetNeckBodySvg prefix={prefix} body={config.body}/>
    <ModularSetNeckNeckSvg prefix={prefix} neck={config.neck}/>
    <ModularSetNeckHardwareSvg prefix={prefix} body={config.body} pickups={config.pickups} bridge={config.bridge}/>
    <g className="tf-guitar__strings" data-guitar-module="set-neck-six-string-path">
      {GEO.bridgeX.map((bridgeX,index)=>{const [tx,ty]=GEO.tunerPoints[index];return <g key={bridgeX}><path d={`M${bridgeX} ${stringStart} L${bridgeX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke="#160d0b" strokeWidth={2.3-index*.15} opacity=".25" transform="translate(1 1)"/><path d={`M${bridgeX} ${stringStart} L${bridgeX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke={index<3?'#888279':'#bab3a8'} strokeWidth={1.85-index*.15}/></g>})}
    </g>
    {showAnchors && <g className="tf-modular-anchors" aria-hidden="true">{[{y:GEO.nutY,label:'NUT 24.75'},{y:GEO.neckJointY,label:'SET JOINT'},{y:GEO.saddleY,label:'SADDLE'}].map(({y,label})=><g key={label}><path d={`M85 ${y} H515`} stroke="#e5b85c" strokeWidth=".8" strokeDasharray="4 6" opacity=".48" vectorEffect="non-scaling-stroke"/><circle cx="300" cy={y} r="4.2" fill="#e5b85c" stroke="#22170e"/><text x="505" y={y-7} textAnchor="end" fill="#d5a950" fontSize="10" fontFamily="monospace" letterSpacing="1.2">{label}</text></g>)}</g>}
  </svg>
}
