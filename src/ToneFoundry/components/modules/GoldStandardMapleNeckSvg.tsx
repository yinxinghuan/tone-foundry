import { GOLD_STANDARD_GEOMETRY } from '../../guitar-system/goldStandardGeometry'

interface GoldStandardMapleNeckSvgProps {
  prefix: string
}

const FRET_Y = [252, 291, 328, 363, 395, 426, 455, 483, 509, 533, 557, 579, 599, 619, 637, 654, 671, 686, 701, 714, 727]
const SINGLE_MARKER_Y = [310, 379, 441, 496, 628, 663, 694, 720]

export function GoldStandardMapleNeckSvg({ prefix }: GoldStandardMapleNeckSvgProps) {
  const { tunerPoints, tunerKeyEdgeX } = GOLD_STANDARD_GEOMETRY

  return (
    <g data-guitar-module="maple-neck-21">
      <path d="M272 708 C286 703 319 703 333 709 L332 738 C316 742 288 742 273 737 Z" fill="#1a100a" opacity=".2" />
      <path d="M274 738 L280 202 L324 202 L331 738 Z" fill={`url(#${prefix}-maple)`} />
      <path d="M275 736 L280.5 203" fill="none" stroke="#714421" strokeWidth=".5" opacity=".28" vectorEffect="non-scaling-stroke" />
      <path d="M324 203 L330 736" fill="none" stroke="#60391f" strokeWidth=".5" opacity=".26" vectorEffect="non-scaling-stroke" />

      {/* Rear keys stay below the headstock face so their transmission is occluded. */}
      <g>
        {tunerPoints.map(([, y], index) => {
          const edgeX = tunerKeyEdgeX[index]
          const keyOutline = `M${edgeX + 2} ${y - 3.5} L${edgeX - 6.5} ${y - 7.1} L${edgeX - 18.2} ${y - 8.1} L${edgeX - 22.8} ${y - 5} L${edgeX - 22.8} ${y + 5} L${edgeX - 18.2} ${y + 8.1} L${edgeX - 6.5} ${y + 7.1} L${edgeX + 2} ${y + 3.5} Z`
          return (
            <g key={`rear-key-${y}`}>
              <path d={keyOutline} fill="#201d19" opacity=".3" transform="translate(.9 1.1)" />
              <path d={keyOutline} fill={`url(#${prefix}-tuner-key-metal)`} stroke="#484b48" strokeWidth=".8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d={`M${edgeX - 21.7} ${y - 4.5} L${edgeX - 17.8} ${y - 6.8} L${edgeX - 7.2} ${y - 5.9} L${edgeX - 3.7} ${y - 3.8} L${edgeX - 18.3} ${y - 3.1} Z`} fill="#fff" opacity=".16" />
              <path d={`M${edgeX - 22} ${y + 4.4} L${edgeX - 17.8} ${y + 7} L${edgeX - 7.1} ${y + 6} L${edgeX - 3.8} ${y + 3.9} L${edgeX - 18.3} ${y + 4.5} Z`} fill="#383c3a" opacity=".25" />
              <path d={`M${edgeX - 22.2} ${y - 4.4} L${edgeX - 22.2} ${y + 4.4}`} stroke="#f5f2e9" strokeWidth=".5" opacity=".24" vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
      </g>

      <path d="M278 206 L269 197 C265 193 264 186 267 178 C271 160 276 143 281 126 C286 108 292 90 299 73 C306 55 313 39 324 29 C333 21 344 23 351 31 C358 39 357 49 352 58 C346 69 342 82 340 98 C338 118 336 139 333 158 C329 177 327 191 327 206 Z" fill={`url(#${prefix}-maple)`} stroke="#5b351f" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
      <path d="M280 211 L275 729 Q275 738 284 738 H320 Q329 738 329 729 L324 211 Z" fill={`url(#${prefix}-maple-board)`} />
      <path d="M280 216 L276 728" stroke="#f2c77d" strokeWidth=".3" opacity=".12" vectorEffect="non-scaling-stroke" />
      <path d="M324 216 L328 728" stroke="#63391f" strokeWidth=".3" opacity=".15" vectorEffect="non-scaling-stroke" />
      <path d="M279 212 H325" stroke="#6c5135" strokeWidth="3.1" opacity=".32" vectorEffect="non-scaling-stroke" />
      <path d="M280 211 H324" stroke="#efe4cc" strokeWidth="2.35" vectorEffect="non-scaling-stroke" />
      <path d="M280.5 210.6 H323.5" stroke="#fff" strokeWidth=".4" opacity=".4" vectorEffect="non-scaling-stroke" />
      <path d="M275 198 C291 202 313 202 329 197" fill="none" stroke="#fff0c8" strokeWidth="1" opacity=".2" vectorEffect="non-scaling-stroke" />
      <g fill="none" stroke="#6b3b1e" strokeWidth=".85" opacity=".14">
        <path d="M289 57 C301 88 293 128 303 171" />
        <path d="M312 35 C304 82 317 119 313 190" />
        <path d="M292 222 C297 310 291 397 297 486 C301 568 296 648 300 721" opacity=".42" />
        <path d="M313 222 C307 305 315 393 310 481 C306 567 314 646 309 724" opacity=".34" />
      </g>

      <g>
        {FRET_Y.map((y, index) => {
          const spread = .5 + index * .2
          return (
            <g key={y}>
              <line x1={280 - spread} y1={y + .8} x2={324 + spread} y2={y + .8} stroke="#4d331f" strokeWidth=".9" opacity=".3" vectorEffect="non-scaling-stroke" />
              <line x1={280 - spread} y1={y} x2={324 + spread} y2={y} stroke="#aaa9a4" strokeWidth="1.15" opacity=".82" vectorEffect="non-scaling-stroke" />
              <line x1={280.5 - spread} y1={y - .25} x2={323.5 + spread} y2={y - .25} stroke="#fff" strokeWidth=".25" opacity=".26" vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
        {SINGLE_MARKER_Y.map((y) => <circle key={y} cx="302" cy={y} r="3.8" fill="#302d27" />)}
        <circle cx="292.5" cy="568" r="3.8" fill="#302d27" />
        <circle cx="311.5" cy="568" r="3.8" fill="#302d27" />
      </g>
    </g>
  )
}
