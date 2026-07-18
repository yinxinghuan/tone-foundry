import { MODULAR_BOLT_ON_GEOMETRY as GEO, type ModularNeckId } from '../../guitar-system/modularBoltOnPlatform'

const frets = Array.from({ length: 21 }, (_, index) => GEO.nutY + GEO.scaleLength * (1 - 2 ** (-(index + 1) / 12)))

export function ModularBoltOnNeckSvg({ prefix, neck }: { prefix: string; neck: ModularNeckId }) {
  const darkBoard = neck === 'rosewood-inline'
  return (
    <g className="tf-module-neck" data-guitar-module={`bolt-on-neck-${neck}`}>
      <path d="M267 738 L274 202 L326 202 L333 738 Z" fill={`url(#${prefix}-maple)`} stroke="#58361f" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
      <g data-guitar-part="six-inline-tuner-backs">
        {GEO.tunerPoints.map(([x, y]) => <g key={`${x}-${y}-key`}><path d={`M${x - 4} ${y - 9} Q${x - 20} ${y} ${x - 4} ${y + 9} L${x + 6} ${y + 6} L${x + 6} ${y - 6} Z`} fill={`url(#${prefix}-nickel)`} stroke="#555954" strokeWidth=".8" /><path d={`M${x-13} ${y-5} Q${x-20} ${y} ${x-13} ${y+5}`} fill="none" stroke="#f0ede3" strokeWidth=".7" opacity=".7"/></g>)}
      </g>
      <path d="M278 206 L268 194 C264 188 267 174 272 156 C277 134 284 109 292 87 C300 64 309 43 322 31 C334 20 348 24 353 35 C359 48 350 63 344 78 C338 96 338 120 335 145 C332 169 329 190 327 206 Z" fill={`url(#${prefix}-maple)`} stroke="#58361f" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
      {GEO.tunerPoints.map(([x, y]) => <g key={`${x}-${y}-front`} data-guitar-part="six-inline-tuner"><circle cx={x} cy={y} r="8.4" fill={`url(#${prefix}-nickel)`} stroke="#555954" strokeWidth=".7" /><polygon points={`${x},${y - 5.4} ${x + 4.8},${y - 2.7} ${x + 4.8},${y + 2.7} ${x},${y + 5.4} ${x - 4.8},${y + 2.7} ${x - 4.8},${y - 2.7}`} fill="#9a9d98" /><circle cx={x} cy={y} r="2.2" fill="#656863" /><circle cx={x-1.7} cy={y-2.1} r="1.2" fill="#fff" opacity=".65" /></g>)}
      <path d="M276 738 L279 207 L321 207 L324 738 Z" fill={darkBoard ? `url(#${prefix}-rosewood)` : `url(#${prefix}-maple-board)`} stroke={darkBoard ? '#211511' : '#8b5c2f'} strokeWidth=".55" vectorEffect="non-scaling-stroke" />
      <rect x="278" y="204" width="44" height="5" rx="1" fill="#e7ddc8" stroke="#756d61" strokeWidth=".55" />
      {frets.map((y, index) => {
        const half = 21 + ((y - GEO.nutY) / (GEO.neckHeelY - GEO.nutY)) * 5.5
        const fret = index + 1
        const marker = [3, 5, 7, 9, 12, 15, 17, 19].includes(fret)
        return <g key={y}><path d={`M${300 - half} ${y} H${300 + half}`} stroke={`url(#${prefix}-fret)`} strokeWidth="1.35" vectorEffect="non-scaling-stroke" />{marker && (fret === 12 ? <><circle cx="292" cy={y - 12} r="3.2" fill={darkBoard ? '#d8d2c3' : '#33251b'} /><circle cx="308" cy={y - 12} r="3.2" fill={darkBoard ? '#d8d2c3' : '#33251b'} /></> : <circle cx="300" cy={y - 12} r="3.3" fill={darkBoard ? '#d8d2c3' : '#33251b'} />)}</g>
      })}
    </g>
  )
}
