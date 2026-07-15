import { OFFSET_CURRENT_GEOMETRY as GEO } from '../../guitar-system/offsetCurrentGeometry'

const FRET_Y = [248, 281, 312, 341, 369, 395, 420, 444, 467, 489, 510, 530, 549, 568, 586, 603, 620, 636, 652, 668, 684]
const BLOCK_Y = [296, 355, 407, 456, 500, 540, 578, 612, 645]

export function OffsetCurrentNeckSvg({ prefix }: { prefix: string }) {
  return (
    <g data-guitar-module="offset-painted-neck-21">
      {GEO.tunerPoints.map(([x, y]) => (
        <g key={`${x}-${y}-key`}>
          <path d={`M${x} ${y} H260`} stroke="#24221e" strokeWidth="4" opacity=".36" />
          <path d={`M258 ${y - 7} Q247 ${y} 258 ${y + 7} L267 ${y + 5} L267 ${y - 5} Z`} fill={`url(#${prefix}-chrome)`} stroke="#555955" strokeWidth=".7" />
        </g>
      ))}
      <path d="M274 214 L268 91 C266 63 279 42 304 35 C329 29 351 42 355 60 C359 77 347 90 329 92 C325 119 323 146 322 170 L326 211 Z" fill={`url(#${prefix}-maple)`} stroke="#3f291c" strokeWidth="1.4" />
      <path d="M279 208 L274 94 C272 71 283 53 305 47 C325 42 343 52 347 64 C350 75 341 82 324 84 C321 111 319 139 318 164 L320 208 Z" fill="#54847d" stroke="#d2b77b" strokeWidth="1" />
      <path d="M267 704 L274 206 L326 206 L333 704 Z" fill={`url(#${prefix}-maple)`} stroke="#52351f" strokeWidth="1.1" />
      <path d="M271 705 L279 214 L321 214 L329 705 Z" fill="#d5c8a7" />
      <path d="M274 705 L282 214 L318 214 L326 705 Z" fill={`url(#${prefix}-rosewood)`} stroke="#1d1211" strokeWidth=".7" />
      <path d="M279 214 H321" stroke="#eee2c8" strokeWidth="7" />
      {FRET_Y.map((y, index) => {
        const half = 19 + index / 20 * 7
        return <line key={y} x1={300 - half} y1={y} x2={300 + half} y2={y} stroke="#beb9b0" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      })}
      {BLOCK_Y.map((y, index) => (
        <g key={y} fill="#dedbd0" stroke="#9b9890" strokeWidth=".5">
          {index === 7 ? <><rect x="284" y={y - 6} width="12" height="12" rx="1" /><rect x="304" y={y - 6} width="12" height="12" rx="1" /></> : <rect x="288" y={y - 7} width="24" height="14" rx="1" />}
        </g>
      ))}
      {GEO.tunerPoints.map(([x, y]) => (
        <g key={`${x}-${y}-front`}>
          <circle cx={x} cy={y} r="6.8" fill={`url(#${prefix}-chrome)`} stroke="#505450" strokeWidth=".6" />
          <polygon points={`${x},${y - 4.4} ${x + 3.8},${y - 2.2} ${x + 3.8},${y + 2.2} ${x},${y + 4.4} ${x - 3.8},${y + 2.2} ${x - 3.8},${y - 2.2}`} fill="#aaa9a4" stroke="#565954" strokeWidth=".5" />
          <circle cx={x} cy={y} r="2.1" fill="#747773" />
        </g>
      ))}
    </g>
  )
}
