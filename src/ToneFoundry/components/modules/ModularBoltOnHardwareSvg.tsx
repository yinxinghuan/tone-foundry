import type { ModularBodyId, ModularBridgeId, ModularPickupId } from '../../guitar-system/modularBoltOnPlatform'

interface Props {
  prefix: string
  body: ModularBodyId
  pickups: ModularPickupId
  bridge: ModularBridgeId
}

function Pickup({ prefix, kind, y, angle = 0 }: { prefix: string; kind: 'single' | 'wide' | 'humbucker'; y: number; angle?: number }) {
  if (kind === 'humbucker') return <g transform={`rotate(${angle} 300 ${y})`}><rect x="250" y={y - 23} width="100" height="46" rx="4" fill={`url(#${prefix}-nickel)`} stroke="#50534f" strokeWidth="1" /><rect x="259" y={y - 15} width="82" height="30" rx="3" fill="#d8d5cb" stroke="#737570" strokeWidth=".6" />{[270,282,294,306,318,330].map((x) => <circle key={x} cx={x} cy={y} r="2.2" fill="#636661" />)}</g>
  const width = kind === 'wide' ? 104 : 86
  const height = kind === 'wide' ? 35 : 27
  return <g transform={`rotate(${angle} 300 ${y})`}><rect x={300 - width / 2} y={y - height / 2} width={width} height={height} rx={kind === 'wide' ? 6 : 13.5} fill={kind === 'wide' ? `url(#${prefix}-guard)` : '#e4dfd2'} stroke="#565852" strokeWidth=".8" />{[273,284,295,306,317,328].map((x) => <circle key={x} cx={x} cy={y} r="2.15" fill="#4e504c" />)}</g>
}

export function ModularBoltOnHardwareSvg({ prefix, body, pickups, bridge }: Props) {
  return (
    <g data-guitar-module={`bolt-on-hardware-${pickups}-${bridge}`}>
      <g data-guitar-part={`pickguard-${body}`}>
        {body === 'slab' && <path d="M273 666 L273 735 C241 738 213 758 201 790 C193 816 196 845 211 857 L255 857 L255 844 L347 844 L347 857 L377 857 C383 820 394 782 410 748 C424 718 435 691 425 673 C414 663 397 670 385 684 C375 699 375 716 385 730 C371 741 354 742 338 735 L326 720 L326 666 Z" fill={`url(#${prefix}-guard)`} stroke="#3e3c37" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        {body === 'contour' && <path d="M270 666 C231 674 199 699 187 738 C176 775 188 812 213 836 L238 872 L236 940 C257 956 333 958 367 940 L365 852 C391 828 407 791 409 753 C410 720 394 692 369 679 C351 670 335 674 325 691 L325 666 Z" fill={`url(#${prefix}-guard)`} stroke="#66635b" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        {body === 'offset' && <path d="M276 690 C244 690 218 682 199 670 C187 693 189 721 205 747 C218 770 219 796 207 823 C193 854 197 884 225 906 L242 930 C277 946 341 946 378 925 L382 861 C404 831 414 794 415 761 C416 735 405 713 386 705 C363 695 344 704 330 720 C318 734 307 734 296 724 C284 713 280 699 276 690 Z" fill={`url(#${prefix}-guard)`} stroke="#716c60" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
      </g>

      <g data-guitar-part={`pickup-pack-${pickups}`}>
        {pickups === 'dual-single' && <><Pickup prefix={prefix} kind="single" y={766} /><Pickup prefix={prefix} kind="single" y={875} angle={-8} /></>}
        {pickups === 'sss' && <><Pickup prefix={prefix} kind="single" y={760} /><Pickup prefix={prefix} kind="single" y={825} /><Pickup prefix={prefix} kind="single" y={886} angle={-7} /></>}
        {pickups === 'hss' && <><Pickup prefix={prefix} kind="single" y={762} /><Pickup prefix={prefix} kind="single" y={824} /><Pickup prefix={prefix} kind="humbucker" y={884} angle={-6} /></>}
        {pickups === 'wide-dual' && <><Pickup prefix={prefix} kind="wide" y={775} /><Pickup prefix={prefix} kind="wide" y={872} /></>}
      </g>

      <g data-guitar-part={`bridge-${bridge}`}>
        {bridge === 'three-saddle' && <g><path d="M253 887 H347 V962 H253 Z" fill={`url(#${prefix}-nickel)`} stroke="#4e514d" strokeWidth="1.1" /><path d="M263 887 L337 887 L347 962 H253 Z" fill="none" stroke="#f0ede4" strokeWidth=".8" opacity=".4" />{[278,300,322].map((x) => <g key={x}><rect x={x - 14} y="914" width="28" height="10" rx="5" fill={`url(#${prefix}-brass)`} stroke="#5d421d" strokeWidth=".7" /><circle cx={x} cy="919" r="2" fill="#6a4a22" /></g>)}</g>}
        {bridge === 'tremolo' && <g><rect x="250" y="895" width="100" height="83" rx="4" fill={`url(#${prefix}-nickel)`} stroke="#4e514d" strokeWidth="1.1" />{[270,282,294,306,318,330].map((x) => <g key={x}><rect x={x - 5} y="914" width="10" height="18" rx="2" fill="#a8aaa5" stroke="#5d605b" strokeWidth=".5" /><circle cx={x} cy="943" r="2.5" fill="#5c5f5a" /></g>)}<path d="M344 929 C373 954 386 985 382 1014" fill="none" stroke={`url(#${prefix}-nickel)`} strokeWidth="4" strokeLinecap="round" /><ellipse cx="381" cy="1017" rx="5" ry="8" fill="#ddd8ca" /></g>}
        {bridge === 'hardtail' && <g><rect x="250" y="900" width="100" height="61" rx="3" fill={`url(#${prefix}-nickel)`} stroke="#4e514d" strokeWidth="1.1" />{[270,282,294,306,318,330].map((x) => <g key={x}><rect x={x - 5} y="914" width="10" height="18" rx="2" fill="#a8aaa5" stroke="#5d605b" strokeWidth=".5" /><circle cx={x} cy="949" r="2.5" fill="#565954" /></g>)}</g>}
        {bridge === 'floating' && <g><rect x="250" y="900" width="100" height="30" rx="4" fill={`url(#${prefix}-nickel)`} stroke="#4e514d" strokeWidth="1" />{[270,282,294,306,318,330].map((x) => <rect key={x} x={x - 4.5} y="907" width="9" height="15" rx="2" fill="#a3a59f" stroke="#565954" strokeWidth=".5" />)}<path d="M250 968 C270 962 330 962 350 968 L346 1025 C329 1035 271 1035 254 1025 Z" fill={`url(#${prefix}-nickel)`} stroke="#4e514d" strokeWidth="1.1" /><path d="M342 985 C371 964 389 941 399 914" fill="none" stroke={`url(#${prefix}-nickel)`} strokeWidth="4" strokeLinecap="round" /><ellipse cx="401" cy="910" rx="5" ry="8" fill="#ddd8ca" /></g>}
      </g>

      <g data-guitar-part="controls">
        {body === 'slab' ? <g><rect x="377" y="833" width="34" height="168" rx="17" fill={`url(#${prefix}-nickel)`} stroke="#474a46" strokeWidth="1" />{[920,970].map((y) => <circle key={y} cx="394" cy={y} r="13" fill={`url(#${prefix}-knob)`} stroke="#4e514d" strokeWidth=".8" />)}<path d="M388 862 L401 844" stroke="#979994" strokeWidth="3" strokeLinecap="round" /></g> : <g>{[body === 'offset' ? 397 : 384, body === 'offset' ? 414 : 412].map((x, index) => <circle key={x} cx={x} cy={index ? 933 : 892} r="13" fill={`url(#${prefix}-knob)`} stroke="#4e514d" strokeWidth=".8" />)}<path d="M380 848 L393 832" stroke="#979994" strokeWidth="3" strokeLinecap="round" /></g>}
      </g>
    </g>
  )
}
