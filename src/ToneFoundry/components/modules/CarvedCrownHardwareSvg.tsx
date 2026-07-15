import { CARVED_CROWN_GEOMETRY as GEO } from '../../guitar-system/carvedCrownGeometry'

export function CarvedCrownHardwareSvg({ prefix }: { prefix: string }) {
  return (
    <g data-guitar-module="carved-crown-abr-stop-controls">
      <path d="M338 712 L392 737 C405 772 408 811 394 846 L365 889 L348 899 L339 887 C350 858 357 829 355 799 C353 764 347 736 338 712 Z" fill={`url(#${prefix}-cream)`} stroke="#8d7b5d" strokeWidth="1" />

      {[755, 850].map((y) => <g key={y} data-guitar-part="covered-humbucker">
        <rect x="250" y={y - 7} width="100" height="66" rx="3" fill="#160b09" opacity=".28" transform="translate(2 3)" />
        <rect x="247" y={y - 10} width="106" height="68" rx="3" fill={`url(#${prefix}-cream)`} stroke="#8f8064" strokeWidth=".8" />
        <rect x="257" y={y} width="86" height="48" rx="4" fill={`url(#${prefix}-pickup)`} stroke="#555854" strokeWidth="1.1" />
        <path d={`M263 ${y + 7} H337`} stroke="#fff" strokeWidth="1" opacity=".32" />
        {GEO.bridgeX.map((x) => <circle key={x} cx={x} cy={y + 24} r="2.4" fill="#716e68" stroke="#ddd9d0" strokeWidth=".55" />)}
        {[[252, y - 4], [348, y + 52]].map(([x, sy]) => <circle key={`${x}-${sy}`} cx={x} cy={sy} r="3" fill={`url(#${prefix}-nickel)`} />)}
      </g>)}

      <g data-guitar-part="abr-bridge-stop-tail">
        <rect x="247" y="891" width="106" height="22" rx="4" fill="#160b09" opacity=".3" transform="translate(2 3)" />
        <circle cx="250" cy="902" r="5" fill={`url(#${prefix}-nickel)`} stroke="#535652" strokeWidth=".6" /><circle cx="350" cy="902" r="5" fill={`url(#${prefix}-nickel)`} stroke="#535652" strokeWidth=".6" />
        <rect x="251" y="891" width="98" height="21" rx="3" fill={`url(#${prefix}-nickel)`} stroke="#4f524e" strokeWidth="1" />
        <path d="M256 894 H344" stroke="#fff" strokeWidth=".75" opacity=".36" /><path d="M256 909 H344" stroke="#454845" strokeWidth=".85" opacity=".5" />
        {GEO.bridgeX.map((x, index) => <g key={x}><rect x={x - 4} y={894 + (index % 2)} width="8" height="14" rx="1.2" fill="#aaa9a4" stroke="#62645f" strokeWidth=".55" /><path d={`M${x - 2} ${897 + (index % 2)} L${x + 2} ${904 + (index % 2)}`} stroke="#535652" strokeWidth=".7" /><circle cx={x} cy={906 + (index % 2)} r="1.2" fill="#5b5e5a" /></g>)}
        <path d="M256 947 C274 941 326 941 344 947 L341 961 C323 965 277 965 259 961 Z" fill="#160b09" opacity=".28" transform="translate(2 3)" />
        <circle cx="258" cy="954" r="6" fill={`url(#${prefix}-nickel)`} stroke="#555854" strokeWidth=".65" /><circle cx="342" cy="954" r="6" fill={`url(#${prefix}-nickel)`} stroke="#555854" strokeWidth=".65" />
        <path d="M258 947 C275 942 325 942 342 947 L340 961 C323 964 277 964 260 961 Z" fill={`url(#${prefix}-nickel)`} stroke="#4f524e" strokeWidth="1" />
        <path d="M266 949 C284 946 316 946 334 949" stroke="#fff" strokeWidth=".8" opacity=".34" />
      </g>

      <g data-guitar-part="selector-four-controls">
        <circle cx="200" cy="710" r="25" fill={`url(#${prefix}-cream)`} stroke="#9f8b66" strokeWidth="1" />
        <circle cx="200" cy="710" r="9" fill={`url(#${prefix}-nickel)`} /><path d="M200 710 L195 689" stroke="#a9aaa5" strokeWidth="4" strokeLinecap="round" /><ellipse cx="194" cy="686" rx="6" ry="9" fill="#c88125" stroke="#704211" strokeWidth=".8" />
        {[[382, 907], [414, 941], [376, 976], [409, 1013]].map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x + 2} cy={y + 3} r="17" fill="#180b08" opacity=".28" /><circle cx={x} cy={y} r="16" fill={`url(#${prefix}-knob)`} stroke="#8b5b1f" strokeWidth="1" /><circle cx={x} cy={y} r="8" fill="none" stroke="#e2aa47" strokeWidth="1" opacity=".55" /><path d={`M${x} ${y - 13} V${y - 8}`} stroke="#f8d27a" strokeWidth="1.2" /></g>)}
      </g>
    </g>
  )
}
