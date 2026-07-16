import { MODULAR_BODY_PATHS, type ModularBodyId, type ModularFinishId } from '../../guitar-system/modularBoltOnPlatform'

export function ModularBoltOnBodySvg({ prefix, body, finish }: { prefix: string; body: ModularBodyId; finish: ModularFinishId }) {
  const path = MODULAR_BODY_PATHS[body]
  return (
    <g className="tf-module-body" data-guitar-module={`bolt-on-body-${body}`}>
      <defs>
        <clipPath id={`${prefix}-side-window`}>
          <path d="M300 670 H520 V1135 H95 V850 H300 Z" />
        </clipPath>
        <clipPath id={`${prefix}-body-clip`}><path d={path} /></clipPath>
      </defs>
      <ellipse cx="302" cy="1104" rx="186" ry="34" fill={`url(#${prefix}-shadow)`} />
      <path d={path} transform="translate(8 10)" clipPath={`url(#${prefix}-side-window)`} fill={`url(#${prefix}-body-side)`} />
      <path d={path} fill={`url(#${prefix}-body-top)`} stroke={`url(#${prefix}-body-edge)`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <g clipPath={`url(#${prefix}-body-clip)`}>
        {[-110, -82, -54, -26, 2, 30, 58, 86, 114].map((dx, index) => <path key={dx} d={`M${300 + dx} 620 C${292 + dx} 760 ${309 + dx} 928 ${296 + dx} 1115`} fill="none" stroke={index % 2 ? '#2c1c12' : '#fff0c7'} strokeWidth={index % 2 ? 1.2 : .75} opacity={index % 2 ? .12 : .085} />)}
        <path d="M125 724 C184 645 250 635 322 655 C244 687 196 779 181 891 C167 997 214 1069 281 1100 C193 1090 133 1044 117 970 C100 888 103 790 125 724 Z" fill="#fff" opacity=".065" />
        <path d="M352 642 C425 670 454 732 430 798 C412 847 422 920 468 1000 C448 1055 399 1083 348 1094 C404 1020 409 913 392 817 C380 749 365 686 352 642 Z" fill="#120b08" opacity=".11" />
        {finish === 'copper' && <g fill="#ffe1b3" opacity=".28">{Array.from({ length: 44 }, (_, index) => <circle key={index} cx={154 + (index * 37) % 286} cy={692 + (index * 61) % 365} r={index % 4 === 0 ? 1.6 : .75} />)}</g>}
        {finish === 'ice' && <><path d="M151 721 C226 681 343 671 428 722" fill="none" stroke="#f7ffff" strokeWidth="9" opacity=".13" strokeLinecap="round"/><path d="M153 969 C242 1012 360 1001 448 948" fill="none" stroke="#17435a" strokeWidth="7" opacity=".08" strokeLinecap="round"/></>}
        {finish === 'walnut' && <g fill="none" stroke="#26130d" strokeWidth="2" opacity=".22">{[0,1,2,3,4].map((index) => <path key={index} d={`M${160 + index * 49} 676 C${185 + index * 29} 800 ${143 + index * 48} 940 ${180 + index * 45} 1073`} />)}</g>}
        {finish === 'ivory' && <><path d="M154 720 C175 714 193 723 204 741" fill="none" stroke="#8a6137" strokeWidth="2" opacity=".36"/><path d="M420 996 C436 985 446 970 450 951" fill="none" stroke="#8a6137" strokeWidth="2" opacity=".3"/><path d="M161 1018 C178 1039 196 1049 216 1056" fill="none" stroke="#fffbe6" strokeWidth="3" opacity=".24"/></>}
        {body === 'thinline' && <>
          <path d="M206 757 C185 780 184 817 200 842 C207 854 207 868 197 885 C190 896 190 909 202 916 C216 924 232 911 235 891 C238 868 229 850 223 834 C217 818 221 795 235 775" fill="none" stroke="#24130e" strokeWidth="8" strokeLinecap="round" />
          <path d="M211 758 C193 783 194 814 207 835" fill="none" stroke="#f0c57d" strokeWidth="1.2" opacity=".55" strokeLinecap="round" />
          <path d="M379 751 C399 782 400 819 383 847" fill="none" stroke="#2a160f" strokeWidth="5" opacity=".45" strokeLinecap="round" />
          <path d="M156 732 C197 670 259 661 304 678" fill="none" stroke="#fff0bd" strokeWidth="4" opacity=".12" />
        </>}
        {body === 'reverse' && <>
          <path d="M153 620 C180 602 208 622 230 656 C249 685 265 708 286 713" fill="none" stroke="#f7dfad" strokeWidth="6" opacity=".14" strokeLinecap="round" />
          <path d="M420 651 C445 676 443 709 426 737 C411 761 401 786 404 811" fill="none" stroke="#1a0f0b" strokeWidth="10" opacity=".12" strokeLinecap="round" />
          <path d="M128 922 C151 985 198 1043 274 1065" fill="none" stroke="#fff3d3" strokeWidth="7" opacity=".07" strokeLinecap="round" />
        </>}
      </g>
      <path d={path} fill="none" stroke="#f0dfbd" strokeWidth=".7" opacity=".22" vectorEffect="non-scaling-stroke" />
    </g>
  )
}
