import { ACOUSTIC_DREADNOUGHT_GEOMETRY as GEO, ACOUSTIC_FRET_Y } from '../../guitar-system/acousticDreadnoughtGeometry'

export function AcousticDreadnoughtNeckSvg({ prefix }: { prefix: string }) {
  const markerFrets = new Set([3, 5, 7, 9, 12, 15, 17])
  return (
    <g data-guitar-module="acoustic-dreadnought-neck-20">
      <path d="M267 614 L274 197 L326 197 L333 614 Z" fill={`url(#${prefix}-mahogany)`} stroke="#3a2118" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />

      <g data-guitar-part="open-gear-tuner-backs">
        {GEO.tunerPoints.map(([x, y], index) => {
          const left = index < 3
          const edgeX = left ? 252 : 348
          return <g key={`${x}-${y}-back`}>
            <path d={`M${x} ${y} H${edgeX}`} stroke="#3c3228" strokeWidth="4.6" opacity=".45" />
            <path d={left
              ? `M${edgeX + 5} ${y - 8} Q${edgeX - 8} ${y} ${edgeX + 5} ${y + 8} L${edgeX + 15} ${y + 5} L${edgeX + 15} ${y - 5} Z`
              : `M${edgeX - 5} ${y - 8} Q${edgeX + 8} ${y} ${edgeX - 5} ${y + 8} L${edgeX - 15} ${y + 5} L${edgeX - 15} ${y - 5} Z`}
              fill={`url(#${prefix}-nickel)`} stroke="#575954" strokeWidth=".7" />
          </g>
        })}
      </g>

      <path d="M270 201 L259 185 L254 52 Q254 34 272 31 L328 31 Q346 34 346 52 L341 185 L330 201 Z" fill={`url(#${prefix}-headplate)`} stroke="#2c1b16" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <path d="M268 187 C278 181 322 181 332 187" fill="none" stroke="#b9874f" strokeWidth="1" opacity=".55" />
      {GEO.tunerPoints.map(([x, y]) => <g key={`${x}-${y}-front`}>
        <circle cx={x} cy={y} r="7" fill={`url(#${prefix}-nickel)`} stroke="#535651" strokeWidth=".65" />
        <polygon points={`${x},${y - 4.7} ${x + 4.1},${y - 2.3} ${x + 4.1},${y + 2.3} ${x},${y + 4.7} ${x - 4.1},${y + 2.3} ${x - 4.1},${y - 2.3}`} fill="#9c9e98" stroke="#565852" strokeWidth=".5" />
        <circle cx={x} cy={y} r="2.1" fill="#666964" />
      </g>)}

      <path d="M273 709 L279 202 L321 202 L327 709 Z" fill={`url(#${prefix}-ebony)`} stroke="#171311" strokeWidth=".9" vectorEffect="non-scaling-stroke" />
      <rect x="278" y="199" width="44" height="6" rx="1.2" fill="#e8dfcb" stroke="#7c7468" strokeWidth=".6" />
      {ACOUSTIC_FRET_Y.map((y, index) => {
        const ratio = (y - GEO.nutY) / (GEO.fingerboardEndY - GEO.nutY)
        const halfWidth = 21 + ratio * 6
        return <g key={y}>
          <path d={`M${300 - halfWidth} ${y + 1.2} H${300 + halfWidth}`} stroke="#0d0b0a" strokeWidth="2.2" opacity=".45" />
          <path d={`M${300 - halfWidth} ${y} H${300 + halfWidth}`} stroke={`url(#${prefix}-fret)`} strokeWidth="1.45" vectorEffect="non-scaling-stroke" />
          {markerFrets.has(index + 1) && (index + 1 === 12
            ? <><circle cx="291" cy={y - 13} r="3.4" fill="#dfd8c7" opacity=".86" /><circle cx="309" cy={y - 13} r="3.4" fill="#dfd8c7" opacity=".86" /></>
            : <circle cx="300" cy={y - 13} r="3.5" fill="#dfd8c7" opacity=".86" />)}
        </g>
      })}
      <path d="M273 709 Q300 719 327 709" fill="none" stroke="#c4aa78" strokeWidth="1.1" opacity=".55" />
    </g>
  )
}
