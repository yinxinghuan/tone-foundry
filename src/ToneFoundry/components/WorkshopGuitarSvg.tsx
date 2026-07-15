import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { GuitarSpec } from '../types'
import {
  GOLD_STANDARD_BODY_PATH as BODY,
  GOLD_STANDARD_BODY_SIDE_PATH as BODY_SIDE,
  GOLD_STANDARD_GEOMETRY,
} from '../guitar-system/goldStandardGeometry'
import { GoldStandardMapleNeckSvg } from './modules/GoldStandardMapleNeckSvg'
import { GoldStandardBridgeControlsSvg } from './modules/GoldStandardBridgeControlsSvg'

interface WorkshopGuitarSvgProps {
  guitar: GuitarSpec
  onPluck: (stringIndex: number) => void
}

// Orthographic front-view calibration: the 25.5 in speaking length runs from
// nut to saddle contact (about 711 SVG units), not to the string-through holes.
// The outer-string spread grows from roughly 1.39 in at the nut to 2.08 in at the bridge.
const BRIDGE_X = GOLD_STANDARD_GEOMETRY.bridgeX
const NUT_X = GOLD_STANDARD_GEOMETRY.nutX
const TUNER_POINTS = GOLD_STANDARD_GEOMETRY.tunerPoints
const STRING_GUIDE_POINTS = GOLD_STANDARD_GEOMETRY.stringGuidePoints

export function WorkshopGuitarSvg({ guitar, onPluck }: WorkshopGuitarSvgProps) {
  const [ringing, setRinging] = useState<number[]>([])
  const sweepingRef = useRef(false)
  const lastStringRef = useRef<number | null>(null)
  const prefix = `tf-gold-${guitar.id}`

  const trigger = useCallback((index: number) => {
    if (index < 0 || index > 5 || lastStringRef.current === index) return
    lastStringRef.current = index
    onPluck(index)
    setRinging((current) => [...new Set([...current, index])])
    window.setTimeout(() => setRinging((current) => current.filter((value) => value !== index)), 210)
  }, [onPluck])

  const locateString = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const point = event.currentTarget.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const inverse = event.currentTarget.getScreenCTM()?.inverse()
    if (!inverse) return null
    const local = point.matrixTransform(inverse)
    if (local.y < 110 || local.y > 976 || local.x < 260 || local.x > 346) return null
    let closest = 0
    let distance = Number.POSITIVE_INFINITY
    BRIDGE_X.forEach((x, index) => {
      const stringX = NUT_X[index] + ((x - NUT_X[index]) * (local.y - 210)) / 755
      const next = Math.abs(local.x - stringX)
      if (next < distance) {
        distance = next
        closest = index
      }
    })
    return distance < 12 ? closest : null
  }, [])

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const index = locateString(event)
    if (index === null) return
    event.preventDefault()
    sweepingRef.current = true
    lastStringRef.current = null
    event.currentTarget.setPointerCapture(event.pointerId)
    trigger(index)
  }

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!sweepingRef.current) return
    const index = locateString(event)
    if (index !== null) trigger(index)
  }

  const stopSweep = (event: ReactPointerEvent<SVGSVGElement>) => {
    sweepingRef.current = false
    lastStringRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <svg
      className="tf-guitar tf-guitar--workshop-slab tf-guitar--gold-standard"
      viewBox={GOLD_STANDARD_GEOMETRY.viewBox}
      role="img"
      aria-labelledby={`${prefix}-title ${prefix}-desc`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopSweep}
      onPointerCancel={stopSweep}
    >
      <title id={`${prefix}-title`}>{guitar.name.en}</title>
      <desc id={`${prefix}-desc`}>{guitar.family.en}; hand-detailed modular SVG instrument</desc>
      <defs>
        <linearGradient id={`${prefix}-body-side`} x1="180" y1="660" x2="410" y2="1050" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8e5d2d" />
          <stop offset=".48" stopColor="#5b391f" />
          <stop offset="1" stopColor="#352117" />
        </linearGradient>
        <linearGradient id={`${prefix}-blonde`} x1="156" y1="655" x2="438" y2="1036" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0d28c" />
          <stop offset=".22" stopColor="#ddb768" />
          <stop offset=".68" stopColor="#cf9f4f" />
          <stop offset="1" stopColor="#bc8340" />
        </linearGradient>
        <linearGradient id={`${prefix}-clearcoat`} x1="155" y1="680" x2="420" y2="1000" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff9df" stopOpacity=".32" />
          <stop offset=".17" stopColor="#fff" stopOpacity=".04" />
          <stop offset=".62" stopColor="#7a3e18" stopOpacity=".03" />
          <stop offset="1" stopColor="#32180c" stopOpacity=".13" />
        </linearGradient>
        <linearGradient id={`${prefix}-upper-glint`} x1="154" y1="661" x2="274" y2="729" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff8de" stopOpacity=".14" />
          <stop offset=".48" stopColor="#fff8de" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff8de" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${prefix}-low-reflection`} x1="275" y1="986" x2="294" y2="1091" gradientUnits="userSpaceOnUse">
          <stop stopColor="#35180b" stopOpacity=".02" />
          <stop offset=".42" stopColor="#35180b" stopOpacity=".075" />
          <stop offset="1" stopColor="#211008" stopOpacity=".15" />
        </linearGradient>
        <linearGradient id={`${prefix}-maple`} x1="268" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c68b50" />
          <stop offset=".1" stopColor="#d8a060" />
          <stop offset=".48" stopColor="#dfaa69" />
          <stop offset=".82" stopColor="#d39a59" />
          <stop offset="1" stopColor="#bd7b45" />
        </linearGradient>
        <linearGradient id={`${prefix}-maple-board`} x1="280" y1="0" x2="325" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c99b60" />
          <stop offset=".12" stopColor="#d5aa6d" />
          <stop offset=".5" stopColor="#dfb578" />
          <stop offset=".84" stopColor="#d7ad71" />
          <stop offset="1" stopColor="#c8965a" />
        </linearGradient>
        <linearGradient id={`${prefix}-black-plastic`} x1="205" y1="690" x2="355" y2="940" gradientUnits="userSpaceOnUse">
          <stop stopColor="#363532" />
          <stop offset=".18" stopColor="#151514" />
          <stop offset=".68" stopColor="#090909" />
          <stop offset="1" stopColor="#242321" />
        </linearGradient>
        <linearGradient id={`${prefix}-chrome`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#555854" />
          <stop offset=".2" stopColor="#aeb0ab" />
          <stop offset=".4" stopColor="#ece9e1" />
          <stop offset=".62" stopColor="#8b8e89" />
          <stop offset=".82" stopColor="#c9c8c1" />
          <stop offset="1" stopColor="#5d605c" />
        </linearGradient>
        <linearGradient id={`${prefix}-plate-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#737773" />
          <stop offset=".28" stopColor="#d5d4ce" />
          <stop offset=".58" stopColor="#9da09b" />
          <stop offset=".82" stopColor="#c7c6c0" />
          <stop offset="1" stopColor="#747773" />
        </linearGradient>
        <linearGradient id={`${prefix}-tuner-key-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#666a68" />
          <stop offset=".23" stopColor="#c7c8c4" />
          <stop offset=".52" stopColor="#9a9e9b" />
          <stop offset=".75" stopColor="#d9d7d0" />
          <stop offset="1" stopColor="#5f6361" />
        </linearGradient>
        <radialGradient id={`${prefix}-screw`} cx="35%" cy="30%">
          <stop stopColor="#faf6eb" />
          <stop offset=".25" stopColor="#a4a49f" />
          <stop offset=".75" stopColor="#555753" />
          <stop offset="1" stopColor="#272926" />
        </radialGradient>
        <radialGradient id={`${prefix}-knob`} cx="30%" cy="22%">
          <stop stopColor="#f5f1e7" />
          <stop offset=".16" stopColor="#d1d2ce" />
          <stop offset=".43" stopColor="#888d89" />
          <stop offset=".66" stopColor="#c6c5bf" />
          <stop offset=".84" stopColor="#747975" />
          <stop offset="1" stopColor="#464b48" />
        </radialGradient>
        <radialGradient id={`${prefix}-floor-shadow`} cx="50%" cy="50%" r="50%">
          <stop stopColor="#000" stopOpacity=".52" />
          <stop offset=".48" stopColor="#000" stopOpacity=".28" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${prefix}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff0a8" />
          <stop offset=".2" stopColor="#c99b3e" />
          <stop offset=".58" stopColor="#876024" />
          <stop offset=".82" stopColor="#d8ad4d" />
          <stop offset="1" stopColor="#6a471b" />
        </linearGradient>
        <clipPath id={`${prefix}-body-clip`}><path d={BODY} /></clipPath>
      </defs>

      <ellipse cx="307" cy="1093" rx="174" ry="34" fill={`url(#${prefix}-floor-shadow)`} />
      <ellipse cx="307" cy="1088" rx="118" ry="18" fill="#000" opacity=".18" />

      {/* Rear-mounted strap buttons are partially occluded by the slab body. */}
      <g>
        <path d="M205 654 L207 646 L205 642 Q211 639 217 642 L215 646 L217 654 Z" fill="#171714" opacity=".34" transform="translate(1 1.2)" />
        <path d="M205 653 L207 645 L205.5 642 Q211 640 216.5 642 L215 645 L217 653 Z" fill={`url(#${prefix}-plate-metal)`} stroke="#484b48" strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <path d="M207 642.4 Q211 641 215 642.4" fill="none" stroke="#fff" strokeWidth=".55" opacity=".3" vectorEffect="non-scaling-stroke" />
        <path d="M297.5 1085 L299 1091 Q302 1095 305 1091 L306.5 1085 Z" fill="#151512" opacity=".38" transform="translate(1 1)" />
        <path d="M297.5 1085 L299.3 1091 Q302 1094 304.7 1091 L306.5 1085 Z" fill={`url(#${prefix}-plate-metal)`} stroke="#484b48" strokeWidth=".65" vectorEffect="non-scaling-stroke" />
      </g>

      {/* Body thickness, top and routed edge */}
      <path d={BODY_SIDE} fill={`url(#${prefix}-body-side)`} />
      <path d={BODY} fill={`url(#${prefix}-blonde)`} stroke="#3f2919" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <g clipPath={`url(#${prefix}-body-clip)`}>
        <g fill="none" strokeLinecap="round">
          <path d="M185 650 C160 718 177 776 190 821 C205 870 176 931 194 1003 C201 1033 216 1058 231 1073" stroke="#6f4825" strokeWidth="1.8" opacity=".2" />
          <path d="M194 650 C174 720 189 776 201 819 C214 865 190 927 207 997 C214 1027 226 1051 240 1071" stroke="#f3d99b" strokeWidth="1.2" opacity=".26" />
          <path d="M228 653 C251 711 239 762 231 806 C221 854 241 901 251 950 C261 997 250 1043 258 1078" stroke="#76502c" strokeWidth="1.6" opacity=".18" />
          <path d="M276 657 C263 715 289 763 280 821 C270 879 292 936 285 999 C282 1032 290 1061 300 1080" stroke="#f4d89a" strokeWidth="1.1" opacity=".22" />
          <path d="M323 661 C347 719 329 773 340 832 C353 897 330 950 346 1014 C351 1039 361 1060 373 1071" stroke="#714722" strokeWidth="1.9" opacity=".19" />
          <path d="M334 663 C357 722 341 775 351 830 C363 891 344 946 359 1007 C365 1034 374 1052 385 1066" stroke="#efd093" strokeWidth="1.1" opacity=".2" />
          <path d="M384 670 C404 729 383 787 397 848 C411 909 388 964 402 1025" stroke="#67401f" strokeWidth="1.7" opacity=".17" />
        </g>
        <path d="M129 668 C196 630 316 626 405 657 C363 683 303 706 242 728 C190 747 148 725 129 668 Z" fill={`url(#${prefix}-upper-glint)`} />
        <path d="M119 1038 C202 1003 311 1002 469 966 C474 1002 473 1058 459 1094 L117 1094 C116 1075 116 1057 119 1038 Z" fill={`url(#${prefix}-low-reflection)`} />
        <path d={BODY} fill={`url(#${prefix}-clearcoat)`} />
      </g>
      <path d="M268 653 C236 635 198 637 169 659 C142 680 132 708 142 738" fill="none" stroke="#f6dca4" strokeWidth="1" opacity=".46" />
      <path d="M178 1050 C220 1078 278 1086 334 1069 C389 1052 430 1012 449 960" fill="none" stroke="#6d431f" strokeWidth="1" opacity=".7" />
      <path d="M180 1066 C225 1096 290 1103 347 1085 C403 1067 445 1026 463 975" fill="none" stroke="#a56b32" strokeWidth=".85" opacity=".38" />

      {/* The guard is screwed to the body below the neck and fingerboard. */}
      <g>
        <path d="M274 650 L274 714 C250 717 228 729 211 748 C202 766 198 790 198 817 C198 837 204 850 216 850 L254 850 L254 848 L346 848 L346 850 L370 850 C378 818 389 786 401 759 C413 734 425 710 435 689 C441 675 434 664 425 660 C411 663 395 672 386 685 C380 699 381 714 389 724 C381 733 371 739 360 740 C349 739 339 735 330 734 C312 734 292 729 284 718 L284 650 Z" fill={`url(#${prefix}-black-plastic)`} stroke="#282724" strokeWidth=".75" vectorEffect="non-scaling-stroke" />
        <path d="M199 803 C227 755 274 732 318 730 C341 728 356 709 363 684" fill="none" stroke="#fff" strokeWidth="3" opacity=".05" />
        <g fill="none" stroke="#e8e2d6" strokeLinecap="round" opacity=".055">
          <path d="M215 756 C245 739 284 738 316 746" strokeWidth=".8" />
          <path d="M194 814 C231 793 282 795 330 812" strokeWidth=".65" />
          <path d="M216 830 C251 816 292 818 327 830" strokeWidth=".55" />
        </g>
      </g>

      <GoldStandardMapleNeckSvg prefix={prefix} />

      <GoldStandardBridgeControlsSvg prefix={prefix} />

      {/* Pickguard screws and subtle contact shadows */}
      {[[222, 722], [180, 824], [247, 838], [369, 831], [401, 678]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x + 1.5} cy={y + 2} r="5" fill="#000" opacity=".38" />
          <circle cx={x} cy={y} r="4.2" fill={`url(#${prefix}-screw)`} />
          <path d={`M${x - 2.2} ${y} H${x + 2.2}`} stroke="#30322f" strokeWidth="1" />
        </g>
      ))}

      {/* Visible front hardware: face washer, hex nut and string post only. */}
      <g>
        {TUNER_POINTS.map(([x, y]) => (
          <g key={y}>
            <circle cx={x + .7} cy={y + .9} r="7" fill="#241f1a" opacity=".28" />
            <circle cx={x} cy={y} r="6.8" fill={`url(#${prefix}-chrome)`} stroke="#555854" strokeWidth=".65" vectorEffect="non-scaling-stroke" />
            <polygon points={`${x},${y - 4.5} ${x + 3.9},${y - 2.25} ${x + 3.9},${y + 2.25} ${x},${y + 4.5} ${x - 3.9},${y + 2.25} ${x - 3.9},${y - 2.25}`} fill="#b8b8b3" stroke="#555854" strokeWidth=".6" vectorEffect="non-scaling-stroke" />
            <circle cx={x} cy={y} r="2.35" fill="#7f817d" stroke="#d8d6cf" strokeWidth=".55" vectorEffect="non-scaling-stroke" />
            <circle cx={x - .7} cy={y - .8} r=".7" fill="#fff" opacity=".38" />
          </g>
        ))}
      </g>

      {/* Strings: bridge to nut, then individually routed to posts */}
      <g className="tf-guitar__strings">
        {BRIDGE_X.map((bridgeX, index) => {
          const tuner = TUNER_POINTS[index]
          return (
            <g key={`shadow-${bridgeX}`} opacity={index < 3 ? .24 : .16}>
              <path d={`M${bridgeX + 1.6} 946 L${NUT_X[index] + .8} 211`} fill="none" stroke="#160f0a" strokeWidth={2.35 - index * .15} />
              <path d={STRING_GUIDE_POINTS[index]
                ? `M${NUT_X[index] + .8} 211 L${STRING_GUIDE_POINTS[index][0] + .8} ${STRING_GUIDE_POINTS[index][1] + .8} L${tuner[0] + .8} ${tuner[1] + 1}`
                : `M${NUT_X[index] + .8} 211 L${tuner[0] + .8} ${tuner[1] + 1}`}
                fill="none" stroke="#160f0a" strokeWidth={1.55 - index * .08} />
            </g>
          )
        })}
        {BRIDGE_X.map((bridgeX, index) => {
          const tuner = TUNER_POINTS[index]
          const active = ringing.includes(index)
          return (
            <g key={bridgeX} className={active ? 'tf-guitar__string tf-guitar__string--active' : 'tf-guitar__string'} style={{ '--tf-string-index': index } as CSSProperties}>
              <path d={`M${bridgeX} 946 L${NUT_X[index]} 211`} fill="none" stroke={index < 3 ? '#8c867b' : '#aaa59b'} strokeWidth={2 - index * .18} />
              <path d={STRING_GUIDE_POINTS[index]
                ? `M${NUT_X[index]} 211 L${STRING_GUIDE_POINTS[index][0]} ${STRING_GUIDE_POINTS[index][1]} L${tuner[0]} ${tuner[1]}`
                : `M${NUT_X[index]} 211 L${tuner[0]} ${tuner[1]}`}
                fill="none" stroke={index < 3 ? '#8c867b' : '#aaa59b'} strokeWidth={1.4 - index * .1} />
            </g>
          )
        })}
      </g>

      {/* Wound string turns and short clipped tails remain visible above the posts. */}
      <g fill="none" strokeLinecap="round">
        {TUNER_POINTS.map(([x, y], index) => (
          <g key={`wrap-${y}`} stroke={index < 3 ? '#7f7a70' : '#aaa59b'}>
            <ellipse cx={x} cy={y} rx="3.25" ry="2.15" strokeWidth={1.05 - index * .06} opacity=".82" />
            <path d={`M${x - 2.6} ${y + 1.2} C${x - 1} ${y + 3.1} ${x + 2.2} ${y + 3.1} ${x + 3.2} ${y + .8}`} strokeWidth={.85 - index * .04} opacity=".74" />
            <path d={`M${x + 1.2} ${y - 1.4} L${x + 4.8} ${y - 6.2}`} strokeWidth={.75 - index * .04} opacity=".68" />
          </g>
        ))}
      </g>

      {/* Modern stamped string tree from the photographed front-view reference. */}
      <g>
        <rect x="308.5" y="158.5" width="11" height="8" rx="1.4" fill="#181916" opacity=".35" transform="translate(.8 1)" />
        <rect x="308" y="158" width="11" height="8" rx="1.4" fill={`url(#${prefix}-chrome)`} stroke="#494b47" strokeWidth=".65" vectorEffect="non-scaling-stroke" />
        <path d="M309 160.2 H318" stroke="#fff" strokeWidth=".7" opacity=".36" vectorEffect="non-scaling-stroke" />
        <path d="M309.2 164.2 H317.8" stroke="#424440" strokeWidth=".8" opacity=".62" vectorEffect="non-scaling-stroke" />
        <circle cx="311.5" cy="164.2" r=".7" fill="#2f312e" />
        <circle cx="315.5" cy="164.2" r=".7" fill="#2f312e" />
        <circle cx="313.5" cy="162" r="1.25" fill={`url(#${prefix}-screw)`} />
      </g>

      {/* Finish glints and restrained wear */}
      <path d="M159 691 C181 663 225 653 271 669 C243 676 203 690 174 720 C166 713 161 702 159 691 Z" fill={`url(#${prefix}-upper-glint)`} opacity=".4" />
      <path d="M146 927 C171 972 215 1002 264 1014 C220 1012 176 990 151 956 C147 947 145 937 146 927 Z" fill="#fff0c0" opacity=".055" />
      <path d="M161 751 C153 775 152 801 158 824" fill="none" stroke="#6d3e20" strokeWidth="3.2" opacity=".16" />
      <g fill="none" stroke="#4b2816" strokeLinecap="round" opacity=".14">
        <path d="M183 810 l24 7" /><path d="M179 823 l27 8" /><path d="M193 838 l18 4" />
      </g>
      <rect x="260" y="110" width="86" height="870" fill="transparent" className="tf-guitar__string-hit" />
    </svg>
  )
}
