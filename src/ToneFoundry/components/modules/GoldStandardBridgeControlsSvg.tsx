import { GOLD_STANDARD_GEOMETRY } from '../../guitar-system/goldStandardGeometry'

interface GoldStandardBridgeControlsSvgProps {
  prefix: string
}

const PICKUP_MOUNTS = [[267, 861], [339, 869], [335, 900]]
const SADDLES = [{ x: 279, y: 918 }, { x: 303, y: 922 }, { x: 327, y: 917 }]
const BRIDGE_MOUNTS = [266, 290, 314, 338]
const KNOB_Y = [918, 967]

export function GoldStandardBridgeControlsSvg({ prefix }: GoldStandardBridgeControlsSvgProps) {
  const bridgeX = GOLD_STANDARD_GEOMETRY.bridgeX

  return (
    <g data-guitar-module="tele-bridge-controls">
      <g data-guitar-part="neck-pickup">
        <rect x="267" y="755" width="72" height="27" rx="13.5" fill="#111" opacity=".46" transform="translate(2.5 3.5)" />
        <rect x="266" y="753" width="72" height="27" rx="13.5" fill={`url(#${prefix}-plate-metal)`} stroke="#464844" strokeWidth="1.05" vectorEffect="non-scaling-stroke" />
        <path d="M275 758 C291 754 315 755 330 759" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".22" />
        <circle cx="258" cy="766.5" r="3.2" fill={`url(#${prefix}-screw)`} />
        <circle cx="346" cy="766.5" r="3.2" fill={`url(#${prefix}-screw)`} />
      </g>

      <g data-guitar-part="three-saddle-bridge">
        <rect x="257" y="850" width="90" height="111" rx="5" fill="#070707" opacity=".5" transform="translate(3 5)" />
        <rect x="256" y="848" width="90" height="111" rx="5" fill={`url(#${prefix}-plate-metal)`} stroke="#3f423f" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path d="M260 854 H342" fill="none" stroke="#f4f1e8" strokeWidth="1" opacity=".25" vectorEffect="non-scaling-stroke" />
        <path d="M260 855 V952 M342 855 V952" fill="none" stroke="#343633" strokeWidth="1.5" opacity=".48" />
        <path d="M264 854 V952" fill="none" stroke="#fff" strokeWidth="1" opacity=".16" />
        <path d="M258 951 L344 951 L341 957 L261 957 Z" fill="#3f4340" opacity=".26" />
        <path d="M261 951 H341" fill="none" stroke="#f2eee3" strokeWidth=".7" opacity=".22" vectorEffect="non-scaling-stroke" />
        <path d="M264 860 C285 850 318 853 338 871" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".13" />
        <g transform="rotate(8 303 879)">
          <rect x="262" y="865" width="82" height="28" rx="14" fill="#111210" stroke="#70726d" strokeWidth="1.2" />
          {bridgeX.map((x) => <circle key={x} cx={x} cy="879" r="3.2" fill="#d7d2c5" />)}
        </g>
        {PICKUP_MOUNTS.map(([x, y]) => (
          <g key={`pickup-${x}-${y}`}>
            <circle cx={x} cy={y} r="3.1" fill={`url(#${prefix}-screw)`} />
            <path d={`M${x - 1.8} ${y} H${x + 1.8}`} stroke="#30322f" strokeWidth=".8" />
          </g>
        ))}
        {SADDLES.map(({ x, y }) => (
          <g key={x}>
            <rect x={x - 11} y={y} width="22" height="9" rx="4.5" fill={`url(#${prefix}-brass)`} stroke="#5f431d" strokeWidth=".8" />
            <path d={`M${x - 7.5} ${y + 1.8} H${x + 7.5}`} stroke="#fff3b1" strokeWidth=".7" opacity=".42" strokeLinecap="round" />
            <circle cx={x - 6} cy={y + 4.5} r="1.2" fill="#3d2b14" />
            <circle cx={x + 6} cy={y + 4.5} r="1.2" fill="#3d2b14" />
            <path d={`M${x} ${y + 9} V945`} stroke="#686862" strokeWidth="1.2" />
            <circle cx={x} cy="946" r="2.3" fill="#353734" />
          </g>
        ))}
        <path d="M270 907 H326" stroke="#f4efe4" strokeWidth="1.3" opacity=".22" />
        {BRIDGE_MOUNTS.map((x) => (
          <g key={`bridge-mount-${x}`}>
            <circle cx={x} cy="953" r="3.5" fill={`url(#${prefix}-screw)`} />
            <path d={`M${x - 2} 953 H${x + 2}`} stroke="#30322f" strokeWidth=".8" />
          </g>
        ))}
      </g>

      <g data-guitar-part="control-plate">
        <rect x="376" y="831" width="35" height="174" rx="17.5" fill="#050505" opacity=".48" transform="translate(3 5)" />
        <rect x="375" y="829" width="35" height="174" rx="17.5" fill={`url(#${prefix}-plate-metal)`} stroke="#40433f" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        <path d="M381 846 C389 868 391 920 384 982" fill="none" stroke="#fff" strokeWidth="1.1" opacity=".13" />
        <path d="M405 849 C409 898 409 953 403 983" fill="none" stroke="#383b38" strokeWidth="1" opacity=".24" />
        <circle cx="393" cy="839" r="3.1" fill={`url(#${prefix}-screw)`} />
        <path d="M391 839 H395" stroke="#30322f" strokeWidth=".8" />
        <circle cx="393" cy="993" r="3.1" fill={`url(#${prefix}-screw)`} />
        <path d="M391 993 H395" stroke="#30322f" strokeWidth=".8" />
        <path d="M383 852 L402 882" stroke="#303330" strokeWidth="5.2" strokeLinecap="round" />
        <path d="M385 853 L399 875" stroke="#b8bbb6" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="379.5" y="848.5" width="15" height="9" rx="2.2" fill="#171816" stroke="#3f413e" strokeWidth=".8" transform="rotate(52 387 853)" vectorEffect="non-scaling-stroke" />
        <path d="M383.2 849.8 L390.5 859.2" stroke="#fff" strokeWidth=".65" opacity=".12" strokeLinecap="round" />
        {KNOB_Y.map((y) => (
          <g key={y}>
            <circle cx="394.5" cy={y + 2} r="14.2" fill="#161815" opacity=".36" />
            <circle cx="393" cy={y} r="14" fill={`url(#${prefix}-plate-metal)`} stroke="#3a3e3b" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <circle cx="393" cy={y} r="12.2" fill="none" stroke="#4c504d" strokeWidth="2.1" strokeDasharray="1.15 1.7" opacity=".72" />
            <circle cx="393" cy={y - .7} r="10.4" fill={`url(#${prefix}-knob)`} stroke="#555a56" strokeWidth=".75" vectorEffect="non-scaling-stroke" />
            <path d={`M386.5 ${y - 5.3} C389 ${y - 8.4} 395 ${y - 9.2} 398.5 ${y - 6.4}`} fill="none" stroke="#fff" strokeWidth="1.2" opacity=".28" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </g>
  )
}
