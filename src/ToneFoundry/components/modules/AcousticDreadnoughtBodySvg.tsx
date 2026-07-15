import { ACOUSTIC_DREADNOUGHT_GEOMETRY as GEO } from '../../guitar-system/acousticDreadnoughtGeometry'

export function AcousticDreadnoughtBodySvg({ prefix }: { prefix: string }) {
  return (
    <g data-guitar-module="acoustic-soundboard-bridge">
      <g data-guitar-part="soundhole-rosette">
        <circle cx="300" cy="785" r="59" fill="#17120f" stroke="#7f5732" strokeWidth="2" />
        <circle cx="300" cy="785" r="67" fill="none" stroke="#2b211b" strokeWidth="7" />
        <circle cx="300" cy="785" r="73" fill="none" stroke="#d6bb81" strokeWidth="2.2" />
        <circle cx="300" cy="785" r="77" fill="none" stroke="#4d2a1c" strokeWidth="2.1" />
        <circle cx="300" cy="785" r="81" fill="none" stroke="#d6bb81" strokeWidth="1.2" />
        <ellipse cx="286" cy="763" rx="24" ry="13" fill="#725038" opacity=".12" />
      </g>

      <path d="M346 759 C378 766 402 787 410 816 C413 845 397 878 372 902 C354 884 346 855 344 823 C342 795 342 775 346 759 Z" fill={`url(#${prefix}-pickguard)`} stroke="#3f221a" strokeWidth="1" opacity=".92" vectorEffect="non-scaling-stroke" data-guitar-part="tortoise-pickguard" />

      <g data-guitar-part="belly-bridge-pins">
        <path d="M229 923 C250 911 350 911 371 923 L363 974 C342 984 258 984 237 974 Z" fill={`url(#${prefix}-ebony)`} stroke="#171310" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M252 916 Q300 909 348 916 L347 928 Q300 923 253 928 Z" fill="#e7dfcc" stroke="#6f685d" strokeWidth=".7" />
        {GEO.saddleX.map((x, index) => <g key={x}>
          <circle cx={x} cy={GEO.bridgePinY} r="5.3" fill="#eee7d8" stroke="#5c574f" strokeWidth=".65" />
          <circle cx={x} cy={GEO.bridgePinY - .6} r="1.25" fill="#27231f" />
          <path d={`M${x} ${GEO.bridgePinY - 6} V${GEO.saddleY + (index < 3 ? 0 : -1)}`} stroke="#918b7f" strokeWidth={1.55 - index * .11} />
        </g>)}
        <path d="M239 970 Q300 980 361 970" fill="none" stroke="#5b4737" strokeWidth="1" opacity=".6" />
      </g>
    </g>
  )
}
