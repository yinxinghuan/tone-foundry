import { OFFSET_CURRENT_GEOMETRY as GEO } from '../../guitar-system/offsetCurrentGeometry'

export function OffsetCurrentHardwareSvg({ prefix }: { prefix: string }) {
  return (
    <g data-guitar-module="offset-dual-circuit-floating-vibrato">
      <path d="M274 688 C245 689 221 684 200 674 C190 690 191 711 201 730 C213 751 216 774 205 798 C192 825 193 849 214 868 L238 890 L228 937 C266 952 325 954 372 934 L380 870 C402 839 413 804 415 771 C417 744 406 721 386 711 C363 700 343 704 329 719 C318 733 305 736 293 726 C282 716 279 701 274 688 Z" fill={`url(#${prefix}-cream)`} stroke="#7b7466" strokeWidth="1.3" />
      <path d="M274 691 C245 692 222 687 202 678" fill="none" stroke="#fffdf1" strokeWidth="1.1" opacity=".7" />
      <g opacity=".18" fill="none" stroke="#9d9177" strokeLinecap="round"><path d="M202 700 C250 713 326 706 381 723" /><path d="M201 772 C253 751 329 764 403 797" /><path d="M218 852 C270 834 334 846 379 878" /></g>

      {[760, 852].map((y) => (
        <g key={y} data-guitar-part="wide-single-coil">
          <rect x="250" y={y} width="100" height="55" rx="7" fill={`url(#${prefix}-cream)`} stroke="#726f65" strokeWidth="1" />
          {GEO.bridgeX.map((x) => <circle key={x} cx={x} cy={y + 27.5} r="2.5" fill="#6e6b63" stroke="#e4dfd1" strokeWidth=".5" />)}
          <circle cx="256" cy={y + 8} r="2.8" fill={`url(#${prefix}-chrome)`} /><circle cx="344" cy={y + 47} r="2.8" fill={`url(#${prefix}-chrome)`} />
        </g>
      ))}
      <g data-guitar-part="rhythm-circuit">
        <rect x="201" y="715" width="24" height="10" rx="2" fill="#272a28" stroke="#777a76" strokeWidth=".7" /><path d="M211 720 L220 716" stroke={`url(#${prefix}-chrome)`} strokeWidth="2.4" strokeLinecap="round" /><circle cx="221" cy="715.5" r="2.5" fill="#282b29" />
        {[743, 765].map((y) => <g key={y}><rect x="199" y={y} width="31" height="9" rx="3.5" fill="#222523" stroke="#777a76" strokeWidth=".6" /><path d={`M204 ${y + 2} V${y + 7} M209 ${y + 1.5} V${y + 7.5} M214 ${y + 1.5} V${y + 7.5} M219 ${y + 1.5} V${y + 7.5} M224 ${y + 2} V${y + 7}`} stroke="#b7b7b0" strokeWidth=".7" opacity=".72" /></g>)}
      </g>
      <g data-guitar-part="lead-controls">
        {[[401, 864], [414, 907]].map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x + 1} cy={y + 2} r="14" fill="#14201e" opacity=".24" /><circle cx={x} cy={y} r="14" fill={`url(#${prefix}-cream)`} stroke="#69675f" strokeWidth="1" /><circle cx={x} cy={y} r="7" fill="none" stroke="#a59b83" strokeWidth=".75" /><path d={`M${x} ${y - 11} V${y - 7}`} stroke="#484a46" strokeWidth="1.1" /></g>)}
        <path d="M392 795 L405 780" stroke={`url(#${prefix}-chrome)`} strokeWidth="3.5" strokeLinecap="round" /><ellipse cx="407" cy="778" rx="5" ry="7" fill="#e4dac1" stroke="#6d6d65" strokeWidth=".55" />
      </g>

      <g data-guitar-part="threaded-saddle-bridge">
        <rect x="249" y="913" width="102" height="28" rx="4" fill="#151918" opacity=".28" transform="translate(1.5 2.5)" />
        <rect x="249" y="913" width="102" height="28" rx="4" fill={`url(#${prefix}-chrome)`} stroke="#515552" strokeWidth="1" />
        <path d="M254 916 H346" stroke="#fff" strokeWidth=".8" opacity=".38" /><path d="M254 938 H346" stroke="#454946" strokeWidth="1" opacity=".55" />
        {GEO.bridgeX.map((x) => <g key={x}><rect x={x - 4} y="916" width="8" height="20" rx="3" fill="#999c98" stroke="#5d605d" strokeWidth=".5" /><path d={`M${x - 3} 920 H${x + 3} M${x - 3} 924 H${x + 3} M${x - 3} 928 H${x + 3} M${x - 3} 932 H${x + 3}`} stroke="#e2dfd7" strokeWidth=".5" /></g>)}
        <circle cx="253" cy="927" r="4" fill={`url(#${prefix}-chrome)`} stroke="#525653" strokeWidth=".6" /><circle cx="347" cy="927" r="4" fill={`url(#${prefix}-chrome)`} stroke="#525653" strokeWidth=".6" />
      </g>
      <g data-guitar-part="floating-vibrato">
        <path d="M252 969 C270 963 330 963 348 969 L344 1025 C330 1036 270 1036 256 1025 Z" fill="#101514" opacity=".3" transform="translate(2 3)" />
        <path d="M252 969 C270 963 330 963 348 969 L344 1025 C330 1036 270 1036 256 1025 Z" fill={`url(#${prefix}-chrome)`} stroke="#505451" strokeWidth="1.2" />
        <path d="M263 976 C280 972 320 972 337 976" stroke="#fff" strokeWidth=".9" opacity=".34" /><path d="M266 1020 Q300 1029 334 1020" fill="none" stroke="#555956" strokeWidth="7" strokeLinecap="round" /><path d="M267 1018 Q300 1026 333 1018" fill="none" stroke="#d8d7d0" strokeWidth="3.5" strokeLinecap="round" />
        {[[263, 983], [337, 983], [264, 1015], [336, 1015]].map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="3.5" fill={`url(#${prefix}-chrome)`} stroke="#555955" strokeWidth=".5" /><path d={`M${x - 1.8} ${y} H${x + 1.8}`} stroke="#4b4f4c" strokeWidth=".6" /></g>)}
        <circle cx="300" cy="994" r="8" fill="#737773" stroke="#e0ddd5" strokeWidth="1" /><circle cx="300" cy="994" r="3.5" fill="#4d514e" />
        <path d="M326 1003 C370 1012 383 976 369 943" fill="none" stroke="#696d69" strokeWidth="6.5" strokeLinecap="round" opacity=".35" transform="translate(1 1.5)" /><path d="M326 1003 C370 1012 383 976 369 943" fill="none" stroke="#c1c4bf" strokeWidth="4.5" strokeLinecap="round" /><path d="M329 1001 C351 1004 367 988 371 970" fill="none" stroke="#fff" strokeWidth=".7" opacity=".36" />
        <circle cx="369" cy="941" r="5" fill="#e3e0d8" stroke="#6c706c" strokeWidth=".6" />
      </g>
    </g>
  )
}
