import { MODULAR_SET_BODY_PATHS, type ModularSetBodyId } from '../../guitar-system/modularSetNeckPlatform'

export function ModularSetNeckBodySvg({ prefix, body }: { prefix:string; body:ModularSetBodyId }) {
  const path = MODULAR_SET_BODY_PATHS[body]
  return <g className="tf-module-body" data-guitar-module={`set-neck-body-${body}`}>
    <defs>
      <clipPath id={`${prefix}-set-body-clip`}><path d={path}/></clipPath>
      <clipPath id={`${prefix}-set-side-window`}><path d="M300 560 H520 V1140 H80 V820 H300 Z"/></clipPath>
    </defs>
    <ellipse cx="300" cy="1110" rx={body==='centerblock'?205:180} ry="34" fill={`url(#${prefix}-shadow)`}/>
    <path d={path} transform="translate(8 10)" clipPath={`url(#${prefix}-set-side-window)`} fill={`url(#${prefix}-set-body-side)`}/>
    <path d={path} fill={`url(#${prefix}-set-body-top)`} stroke="#321315" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
    <g clipPath={`url(#${prefix}-set-body-clip)`}>
      {[-108,-78,-48,-18,18,48,78,108].map((dx,index)=><path key={dx} d={`M${300+dx} 570 C${289+dx} 740 ${310+dx} 930 ${298+dx} 1112`} fill="none" stroke={index%2?'#ffcb89':'#38100d'} strokeWidth={index%2?.8:1.2} opacity={index%2?.075:.1}/>) }
      {body==='carved' && <>
        {[704,770,838,914,990,1050].map((y,index)=><path key={y} d={`M${135+index*5} ${y} C220 ${y-32} 260 ${y-5} 304 ${y-25} C360 ${y-50} 420 ${y-24} ${455-index*7} ${y+4}`} fill="none" stroke={index%2?'#ffca6d':'#661813'} strokeWidth={index%2?1.3:2} opacity=".2"/>) }
        <path d="M143 795 C178 719 239 674 307 678 C241 713 201 793 187 894 C176 970 202 1035 252 1085 C192 1064 151 1014 138 954 C125 894 128 833 143 795 Z" fill="#fff4d1" opacity=".075"/>
      </>}
      {body==='centerblock' && <>
        <path d="M157 657 C190 617 251 624 286 662 M443 657 C410 617 349 624 314 662" fill="none" stroke="#fff1d3" strokeWidth="4" opacity=".1"/>
        <path d="M210 775 C190 808 191 847 207 878 C218 899 216 922 205 946 M229 777 C220 790 221 804 231 814 M195 846 L215 842" fill="none" stroke="#241514" strokeWidth="7" strokeLinecap="round"/>
        <path d="M390 775 C410 808 409 847 393 878 C382 899 384 922 395 946 M371 777 C380 790 379 804 369 814 M405 846 L385 842" fill="none" stroke="#241514" strokeWidth="7" strokeLinecap="round"/>
      </>}
      {body==='thin-horn' && <>
        <path d="M278 655 C255 646 245 620 235 595 C221 573 204 566 191 570 C198 598 193 629 169 666 C209 643 247 659 278 691 Z M322 655 C345 646 355 620 365 595 C379 573 396 566 409 570 C402 598 407 629 431 666 C391 643 353 659 322 691 Z" fill="#ef765e" opacity=".13"/>
        <path d="M151 842 C134 922 164 1022 247 1069" fill="none" stroke="#fff0d2" strokeWidth="12" strokeLinecap="round" opacity=".055"/>
      </>}
    </g>
    {(body==='carved'||body==='centerblock') && <path d={path} fill="none" stroke={`url(#${prefix}-set-binding)`} strokeWidth={body==='centerblock'?5:4} opacity=".9" vectorEffect="non-scaling-stroke"/>}
  </g>
}
