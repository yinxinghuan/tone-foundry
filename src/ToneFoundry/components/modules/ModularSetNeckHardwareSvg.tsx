import type { ModularSetBodyId, ModularSetBridgeId, ModularSetPickupId } from '../../guitar-system/modularSetNeckPlatform'

interface Props { prefix:string; body:ModularSetBodyId; pickups:ModularSetPickupId; bridge:ModularSetBridgeId }

function Fastener({prefix,x,y,r=3}:{prefix:string;x:number;y:number;r?:number}) { return <g><circle cx={x} cy={y} r={r} fill={`url(#${prefix}-set-nickel)`} stroke="#555" strokeWidth=".55"/><path d={`M${x-r*.55} ${y} H${x+r*.55}`} stroke="#53534f" strokeWidth=".75"/></g> }

function Pickup({prefix,kind,y}:{prefix:string;kind:'covered'|'soapbar'|'mini';y:number}) {
  const width=kind==='mini'?78:96; const height=kind==='soapbar'?32:40
  return <g data-guitar-part={`pickup-${kind}`}>
    <rect x={300-width/2+2} y={y-height/2+3} width={width} height={height} rx="5" fill="#090909" opacity=".32"/>
    <rect x={300-width/2} y={y-height/2} width={width} height={height} rx={kind==='soapbar'?7:5} fill={kind==='soapbar'?`url(#${prefix}-set-plastic)`:`url(#${prefix}-set-nickel)`} stroke={kind==='soapbar'?'#5f554b':'#565954'} strokeWidth="1"/>
    {kind!=='soapbar' && <path d={`M${305-width/2} ${y-height/2+6} H${295+width/2}`} stroke="#fff" strokeWidth="1.2" opacity=".24"/>}
    {[0,1,2,3,4,5].map(index=><circle key={index} cx={270+index*12} cy={y+(kind==='covered'?7:0)} r="2.4" fill={kind==='soapbar'?'#aaa18e':'#666862'} stroke={kind==='soapbar'?'#4c443a':'#e8e2d5'} strokeWidth=".45"/>)}
    <Fastener prefix={prefix} x={300-width/2-7} y={y}/><Fastener prefix={prefix} x={300+width/2+7} y={y}/>
  </g>
}

function Knob({prefix,x,y}:{prefix:string;x:number;y:number}) { return <g data-guitar-part="top-hat-knob"><circle cx={x+2} cy={y+3} r="17" fill="#050505" opacity=".34"/><circle cx={x} cy={y} r="16" fill={`url(#${prefix}-set-knob)`} stroke="#b29562" strokeWidth="1"/>{Array.from({length:16},(_,index)=>{const a=index*Math.PI*2/16;return <line key={index} x1={x+Math.cos(a)*12} y1={y+Math.sin(a)*12} x2={x+Math.cos(a)*15} y2={y+Math.sin(a)*15} stroke="#8d7959" strokeWidth=".65"/>})}<circle cx={x-4} cy={y-5} r="3.8" fill="#fff" opacity=".18"/><path d={`M${x} ${y-8} V${y-13}`} stroke="#e5d3a9" strokeWidth="1.2"/></g> }

function TuneOMatic({prefix, archtop = false}:{prefix:string; archtop?:boolean}) {
  if (archtop) return <g data-guitar-part="floating-archtop-bridge"><path d="M249 896 Q300 879 351 896 L344 918 Q300 905 256 918 Z" fill="#542b17" stroke="#24140d" strokeWidth="1.2"/><path d="M258 895 Q300 886 342 895" fill="none" stroke="#e5c17b" strokeWidth="3"/><path d="M265 906 H335" stroke="#1b120e" strokeWidth="1.2" opacity=".75"/>{[0,1,2,3,4,5].map(index=><circle key={index} cx={270+index*12} cy="899" r="1.7" fill="#d6b36a"/>)}<path d="M259 919 L265 933 H335 L341 919" fill="#2b160e" opacity=".8"/></g>
  return <g data-guitar-part="tune-o-matic"><rect x="251" y="891" width="98" height="23" rx="5" fill="#080808" opacity=".3" transform="translate(2 3)"/><rect x="251" y="890" width="98" height="22" rx="5" fill={`url(#${prefix}-set-nickel)`} stroke="#555854"/>{[0,1,2,3,4,5].map(index=><g key={index}><rect x={259+index*15} y="894" width="10" height="14" rx="2" fill="#aaaca6" stroke="#656863" strokeWidth=".6"/><circle cx={264+index*15} cy="901" r="1.8" fill="#565954"/></g>)}<Fastener prefix={prefix} x={248} y={901} r={4}/><Fastener prefix={prefix} x={352} y={901} r={4}/></g>
}

export function ModularSetNeckHardwareSvg({prefix,body,pickups,bridge}:Props) {
  const pickupKind=pickups==='covered-humbuckers'?'covered':pickups==='soapbar-p90'?'soapbar':'mini'
  const controls = body==='v-wing'
    ? [[390,925],[432,952]]
    : body==='angular'
      ? [[394,884],[432,912],[414,955]]
      : body==='archtop'
        ? [[388,925],[427,951]]
        : [[body==='thin-horn'?389:386,884],[body==='thin-horn'?432:430,891],[body==='thin-horn'?389:386,950],[body==='thin-horn'?432:430,958]]
  const selector = body==='v-wing' ? [205,812] : body==='angular' ? [432,808] : body==='archtop' ? [420,846] : [418,808]
  return <g className="tf-module-hardware" data-guitar-module={`set-neck-hardware-${pickups}-${bridge}`}>
    <g data-guitar-part={`set-neck-pickguard-${body}`}>
      {body==='carved' && <path d="M238 706 C214 735 205 779 216 822 L239 874 C252 884 264 879 272 866 L267 731 Z" fill={`url(#${prefix}-set-guard)`} stroke="#423b33" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
      {body==='thin-horn' && <path d="M251 688 C220 718 212 780 230 840 L240 970 C257 1001 346 1003 366 972 L375 811 C375 754 348 706 330 688 Z" fill={`url(#${prefix}-set-guard)`} stroke="#514b48" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
      {body==='centerblock' && <path d="M225 702 C210 738 208 780 219 817 L240 864 C250 872 262 870 271 860 L268 718 Z" fill={`url(#${prefix}-set-guard)`} stroke="#4c4239" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
      {body==='archtop' && <path d="M343 712 C372 731 387 763 385 801 L375 865 C369 878 357 877 350 866 L355 738 Z" fill={`url(#${prefix}-set-guard)`} stroke="#4c4239" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
    </g>
    <Pickup prefix={prefix} kind={pickupKind} y={body==='centerblock'?766:758}/>
    <Pickup prefix={prefix} kind={pickupKind} y={body==='thin-horn'?850:856}/>
    <TuneOMatic prefix={prefix} archtop={body==='archtop'}/>
    <g data-guitar-part={`set-neck-tailpiece-${bridge}`}>
      {bridge==='stopbar' && <g><path d="M253 964 Q300 954 347 964 L342 982 Q300 974 258 982 Z" fill={`url(#${prefix}-set-nickel)`} stroke="#565954"/><Fastener prefix={prefix} x={250} y={973} r={4}/><Fastener prefix={prefix} x={350} y={973} r={4}/></g>}
      {bridge==='trapeze' && <g><path d="M260 928 L245 1044 Q300 1072 355 1044 L340 928" fill="none" stroke={`url(#${prefix}-set-nickel)`} strokeWidth="5"/><path d="M245 1044 Q300 1028 355 1044 L348 1062 Q300 1050 252 1062 Z" fill={`url(#${prefix}-set-nickel)`} stroke="#565954"/><Fastener prefix={prefix} x={300} y={1060} r={4}/></g>}
      {bridge==='short-vibrola' && <g><path d="M258 944 H342 L352 1026 Q300 1040 248 1026 Z" fill={`url(#${prefix}-set-nickel)`} stroke="#565954"/><path d="M265 960 H335 M260 976 H340" stroke="#fff" opacity=".22"/><path d="M338 979 C372 955 389 931 397 902" fill="none" stroke={`url(#${prefix}-set-nickel)`} strokeWidth="4" strokeLinecap="round"/><ellipse cx="399" cy="898" rx="5" ry="8" fill="#ddd8ca"/><Fastener prefix={prefix} x={261} y={1017}/><Fastener prefix={prefix} x={339} y={1017}/></g>}
    </g>
    <g data-guitar-part="set-neck-controls">
      {controls.map(([x,y]) => <Knob key={`${x}-${y}`} prefix={prefix} x={x} y={y}/>)}
      <circle cx={selector[0]} cy={selector[1]} r="12" fill="#211816" stroke="#d9c6a5"/><path d={`M${selector[0]} ${selector[1]} L${selector[0]+10} ${selector[1]-12}`} stroke="#eadcc2" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </g>
}
