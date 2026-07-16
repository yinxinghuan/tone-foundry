import { MODULAR_SET_BODY_PATHS, type ModularSetBodyId, type ModularSetFinishId } from '../../guitar-system/modularSetNeckPlatform'

export function ModularSetNeckBodySvg({ prefix, body, finish }: { prefix:string; body:ModularSetBodyId; finish:ModularSetFinishId }) {
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
      {body==='v-wing' && <>
        <path d="M181 578 L300 1029 L419 578" fill="none" stroke="#160b0b" strokeWidth="16" opacity=".12" strokeLinejoin="round"/>
        <path d="M183 575 L250 792 L141 1052" fill="none" stroke="#fff0c2" strokeWidth="4" opacity=".23" strokeLinejoin="round"/>
        <path d="M417 575 L350 792 L459 1052" fill="none" stroke="#280b0d" strokeWidth="7" opacity=".18" strokeLinejoin="round"/>
        <path d="M212 994 L300 1029 L388 994" fill="none" stroke="#fff0c9" strokeWidth="3" opacity=".1"/>
      </>}
      {body==='angular' && <>
        <path d="M188 612 L270 734 L136 946 L240 1065" fill="none" stroke="#ffe0a5" strokeWidth="4" opacity=".16" strokeLinejoin="round"/>
        <path d="M329 702 L423 738 L467 794 L475 1015" fill="none" stroke="#1c0b0b" strokeWidth="11" opacity=".16" strokeLinejoin="round"/>
        <path d="M147 1007 L239 1068 L281 1043" fill="none" stroke="#fff0c2" strokeWidth="3" opacity=".1"/>
      </>}
      {body==='archtop' && <>
        {[726,774,824,877,934,992,1045].map((y,index)=><path key={y} d={`M${149+index*3} ${y} C210 ${y-31} 260 ${y-5} 302 ${y-24} C350 ${y-47} 411 ${y-24} ${453-index*4} ${y+2}`} fill="none" stroke={index%2?'#ffdc94':'#602116'} strokeWidth={index%2?1.15:2} opacity=".2"/>)}
        <path d="M209 755 C188 780 187 816 203 841 C211 854 210 870 200 886 C192 898 194 912 207 918 C221 923 235 908 238 888 C241 864 232 847 225 830 C219 811 223 790 238 772" fill="none" stroke="#26120f" strokeWidth="8" strokeLinecap="round"/>
        <path d="M391 752 C413 779 414 814 400 838 C392 851 392 866 402 882 C410 894 407 908 395 915 C382 922 369 908 366 888 C363 865 372 848 378 830 C384 811 379 789 364 770" fill="none" stroke="#26120f" strokeWidth="8" strokeLinecap="round"/>
        <path d="M214 755 C197 781 198 809 210 829 M386 753 C403 779 402 808 391 828" fill="none" stroke="#f2bf76" strokeWidth="1.15" opacity=".6" strokeLinecap="round"/>
      </>}
      {finish==='silver' && <g fill="#f8f8ef" opacity=".24">{Array.from({length:42},(_,index)=><circle key={index} cx={151+(index*41)%292} cy={668+(index*67)%382} r={index%5===0?1.4:.65}/>)}</g>}
      {finish==='wine' && <path d="M159 711 C223 676 359 674 439 725" fill="none" stroke="#ffd0c0" strokeWidth="8" opacity=".1" strokeLinecap="round"/>}
      {finish==='tobacco' && <><path d="M146 965 C205 1006 248 1017 300 1010 C357 1003 405 987 454 950" fill="none" stroke="#27100c" strokeWidth="11" opacity=".13"/><path d="M165 702 C231 676 365 677 427 713" fill="none" stroke="#ffe1a4" strokeWidth="4" opacity=".13"/></>}
      {finish==='cream' && <><path d="M158 736 C178 719 197 714 216 724" fill="none" stroke="#8b663c" strokeWidth="2" opacity=".34"/><path d="M421 989 C442 974 448 955 447 937" fill="none" stroke="#8b663c" strokeWidth="2" opacity=".3"/></>}
    </g>
    {(body==='carved'||body==='centerblock'||body==='archtop') && <path d={path} fill="none" stroke={`url(#${prefix}-set-binding)`} strokeWidth={body==='centerblock'?5:4} opacity=".9" vectorEffect="non-scaling-stroke"/>}
  </g>
}
