import { CARVED_CROWN_GEOMETRY as GEO } from '../../guitar-system/carvedCrownGeometry'

const FRET_Y = [237, 267, 296, 324, 351, 377, 402, 426, 449, 471, 492, 512, 531, 549, 566, 583, 599, 614, 629, 643, 657, 671]
const INLAY_Y = [280, 337, 389, 437, 481, 521, 557, 591, 622, 650]

export function CarvedCrownNeckSvg({ prefix }: { prefix: string }) {
  return (
    <g data-guitar-module="carved-crown-set-neck-22">
      <path d="M270 700 L273 195 L327 195 L330 700 Z" fill={`url(#${prefix}-mahogany)`} stroke="#261112" strokeWidth="1.2" />
      <path d="M271 704 L278 205 L322 205 L329 704 Z" fill={`url(#${prefix}-cream)`} />
      <path d="M274 704 L281 205 L319 205 L326 704 Z" fill={`url(#${prefix}-rosewood)`} stroke="#1d1010" strokeWidth=".8" />
      <path d="M280 205 H320" stroke="#efe2be" strokeWidth="7" />
      <g opacity=".34" stroke="#8d5d4c" strokeWidth=".65">
        <path d="M284 210 C292 320 283 445 292 690" /><path d="M312 210 C304 346 316 500 309 694" />
      </g>
      <g>
        {FRET_Y.map((y, index) => {
          const t = index / 21
          const half = 20 + t * 6
          return <line key={y} x1={300 - half} y1={y} x2={300 + half} y2={y} stroke="#c1bbb0" strokeWidth="1.35" vectorEffect="non-scaling-stroke" />
        })}
        {INLAY_Y.map((y, index) => index === 8 ? (
          <g key={y} fill="#e7dfcc" stroke="#a9a393" strokeWidth=".55"><path d={`M287 ${y - 6} L297 ${y - 5} L295 ${y + 6} L288 ${y + 5} Z`} /><path d={`M303 ${y - 5} L313 ${y - 6} L312 ${y + 5} L305 ${y + 6} Z`} /></g>
        ) : <path key={y} d={`M287 ${y - 6} L313 ${y - 6} L308 ${y + 6} L292 ${y + 6} Z`} fill="#e7dfcc" stroke="#a9a393" strokeWidth=".55" />)}
      </g>

      {GEO.tunerPoints.map(([x, y], index) => {
        const left = index < 3
        const edgeX = left ? x - 30 : x + 30
        return <g key={`${x}-${y}`}><path d={`M${x} ${y} H${edgeX}`} stroke="#2a2119" strokeWidth="4" opacity=".45" /><path d={left ? `M${edgeX + 4} ${y - 8} Q${edgeX - 7} ${y} ${edgeX + 4} ${y + 8} L${edgeX + 13} ${y + 5} L${edgeX + 13} ${y - 5} Z` : `M${edgeX - 4} ${y - 8} Q${edgeX + 7} ${y} ${edgeX - 4} ${y + 8} L${edgeX - 13} ${y + 5} L${edgeX - 13} ${y - 5} Z`} fill={`url(#${prefix}-cream)`} stroke="#70634e" strokeWidth=".8" /></g>
      })}
      <path d="M275 205 L266 184 L265 68 C264 53 274 43 289 44 Q300 55 311 44 C326 43 336 53 335 68 L334 184 L325 205 Z" fill={`url(#${prefix}-mahogany)`} stroke="#271011" strokeWidth="1.5" />
      <path d="M278 199 L270 178 L271 71 C270 60 277 51 289 51 Q300 61 311 51 C323 51 330 60 329 71 L330 178 L322 199 Z" fill="#241719" stroke="#d9b976" strokeWidth="1.2" />
      <path d="M286 177 C291 161 294 148 300 141 C306 148 309 161 314 177 L308 167 L300 181 L292 167 Z" fill="#151113" stroke="#c9b88f" strokeWidth=".8" />
      <path d="M287 66 Q300 55 313 66 L309 81 Q300 75 291 81 Z" fill="#d6c7a0" opacity=".78" />
      {GEO.tunerPoints.map(([x, y]) => <g key={`${x}-${y}-front`}><circle cx={x} cy={y} r="7" fill={`url(#${prefix}-nickel)`} stroke="#535652" strokeWidth=".7" /><polygon points={`${x},${y - 4.6} ${x + 4},${y - 2.3} ${x + 4},${y + 2.3} ${x},${y + 4.6} ${x - 4},${y + 2.3} ${x - 4},${y - 2.3}`} fill="#aaa9a4" stroke="#565854" strokeWidth=".55" /><circle cx={x} cy={y} r="2.2" fill="#777975" /></g>)}
    </g>
  )
}
