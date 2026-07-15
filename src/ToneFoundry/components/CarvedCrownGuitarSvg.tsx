import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { GuitarSpec } from '../types'
import {
  CARVED_CROWN_BODY_PATH as BODY,
  CARVED_CROWN_GEOMETRY as GEO,
  CARVED_CROWN_SIDE_PATH as BODY_SIDE,
} from '../guitar-system/carvedCrownGeometry'
import { CarvedCrownNeckSvg } from './modules/CarvedCrownNeckSvg'
import { CarvedCrownHardwareSvg } from './modules/CarvedCrownHardwareSvg'

interface Props {
  guitar: GuitarSpec
  onPluck: (stringIndex: number) => void
}

export function CarvedCrownGuitarSvg({ guitar, onPluck }: Props) {
  const [ringing, setRinging] = useState<number[]>([])
  const sweepingRef = useRef(false)
  const lastStringRef = useRef<number | null>(null)
  const prefix = 'tf-carved-crown-gold'

  const trigger = useCallback((index: number) => {
    if (index < 0 || index > 5 || lastStringRef.current === index) return
    lastStringRef.current = index
    onPluck(index)
    setRinging((current) => [...new Set([...current, index])])
    window.setTimeout(() => setRinging((current) => current.filter((value) => value !== index)), 220)
  }, [onPluck])

  const locateString = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const point = event.currentTarget.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const inverse = event.currentTarget.getScreenCTM()?.inverse()
    if (!inverse) return null
    const local = point.matrixTransform(inverse)
    if (local.y < 205 || local.y > 960 || local.x < 255 || local.x > 345) return null
    let closest = 0
    let distance = Number.POSITIVE_INFINITY
    GEO.bridgeX.forEach((bridgeX, index) => {
      const x = GEO.nutX[index] + ((bridgeX - GEO.nutX[index]) * (local.y - GEO.nutY)) / GEO.scaleLength
      const next = Math.abs(local.x - x)
      if (next < distance) { distance = next; closest = index }
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
      className="tf-guitar tf-guitar--carved-crown tf-guitar--gold-standard"
      viewBox={GEO.viewBox}
      role="img"
      aria-labelledby={`${prefix}-title ${prefix}-desc`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopSweep}
      onPointerCancel={stopSweep}
    >
      <title id={`${prefix}-title`}>{guitar.name.en}</title>
      <desc id={`${prefix}-desc`}>Carved maple single-cut, set neck, twin covered coils and stop tailpiece</desc>
      <defs>
        <linearGradient id={`${prefix}-side`} x1="155" y1="650" x2="452" y2="1088" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6d211b" /><stop offset=".48" stopColor="#3b1514" /><stop offset="1" stopColor="#1d0c0d" />
        </linearGradient>
        <radialGradient id={`${prefix}-burst`} cx="47%" cy="52%" r="62%">
          <stop offset="0" stopColor="#e7a744" /><stop offset=".38" stopColor="#d48231" /><stop offset=".7" stopColor="#a73329" /><stop offset=".9" stopColor="#6a1f22" /><stop offset="1" stopColor="#43151a" />
        </radialGradient>
        <linearGradient id={`${prefix}-carve`} x1="170" y1="680" x2="420" y2="1045" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff5d2" stopOpacity=".24" /><stop offset=".25" stopColor="#fff" stopOpacity=".035" /><stop offset=".62" stopColor="#50100d" stopOpacity=".02" /><stop offset="1" stopColor="#160508" stopOpacity=".24" />
        </linearGradient>
        <linearGradient id={`${prefix}-mahogany`} x1="260" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4b1816" /><stop offset=".18" stopColor="#7a2c23" /><stop offset=".55" stopColor="#8d3828" /><stop offset=".83" stopColor="#632018" /><stop offset="1" stopColor="#391315" />
        </linearGradient>
        <linearGradient id={`${prefix}-rosewood`} x1="275" y1="0" x2="325" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#261614" /><stop offset=".22" stopColor="#4a2923" /><stop offset=".55" stopColor="#38201d" /><stop offset=".82" stopColor="#4d2c27" /><stop offset="1" stopColor="#211313" />
        </linearGradient>
        <linearGradient id={`${prefix}-cream`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff5d9" /><stop offset=".55" stopColor="#e6d4a9" /><stop offset="1" stopColor="#bba476" />
        </linearGradient>
        <linearGradient id={`${prefix}-nickel`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5b5d5a" /><stop offset=".18" stopColor="#e6e4dc" /><stop offset=".38" stopColor="#9b9d98" /><stop offset=".62" stopColor="#f0ede4" /><stop offset=".82" stopColor="#888b87" /><stop offset="1" stopColor="#555854" />
        </linearGradient>
        <linearGradient id={`${prefix}-pickup`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#777975" /><stop offset=".16" stopColor="#dad8d0" /><stop offset=".43" stopColor="#9d9e99" /><stop offset=".7" stopColor="#eeeae1" /><stop offset="1" stopColor="#696c68" />
        </linearGradient>
        <radialGradient id={`${prefix}-knob`} cx="35%" cy="28%">
          <stop stopColor="#ffe08c" stopOpacity=".92" /><stop offset=".3" stopColor="#c5791d" stopOpacity=".8" /><stop offset=".72" stopColor="#6a310e" stopOpacity=".72" /><stop offset="1" stopColor="#25120a" stopOpacity=".88" />
        </radialGradient>
        <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".52" /><stop offset=".55" stopColor="#000" stopOpacity=".22" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <clipPath id={`${prefix}-body-clip`}><path d={BODY} /></clipPath>
      </defs>

      <ellipse cx="300" cy="1101" rx="177" ry="35" fill={`url(#${prefix}-shadow)`} />
      <path d={BODY_SIDE} transform="translate(9 10)" fill={`url(#${prefix}-side)`} />
      <path d={BODY} fill={`url(#${prefix}-burst)`} stroke="#271012" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <path d={BODY} fill="none" stroke="#ead29a" strokeWidth="5" opacity=".95" vectorEffect="non-scaling-stroke" />

      <g clipPath={`url(#${prefix}-body-clip)`}>
        <path d={BODY} fill={`url(#${prefix}-carve)`} />
        <g fill="none" strokeLinecap="round">
          <path d="M170 702 C221 677 262 697 300 683 C342 668 382 677 418 704" stroke="#5c1815" strokeWidth="2" opacity=".28" />
          <path d="M149 765 C208 731 258 756 302 738 C349 719 399 729 439 763" stroke="#f2ba61" strokeWidth="1.5" opacity=".23" />
          <path d="M132 835 C199 798 252 824 302 804 C355 782 414 798 459 839" stroke="#671714" strokeWidth="2.1" opacity=".24" />
          <path d="M124 908 C192 874 255 900 304 879 C360 856 424 881 467 919" stroke="#f1b258" strokeWidth="1.35" opacity=".2" />
          <path d="M135 991 C203 955 257 980 306 960 C361 938 420 961 451 1002" stroke="#641613" strokeWidth="2" opacity=".25" />
          <path d="M170 1056 C225 1024 273 1040 316 1026 C360 1012 399 1025 423 1049" stroke="#efb354" strokeWidth="1.4" opacity=".18" />
        </g>
        <path d="M143 795 C178 719 239 674 307 678 C241 713 201 793 187 894 C176 970 202 1035 252 1085 C192 1064 151 1014 138 954 C125 894 128 833 143 795 Z" fill="#fff6d9" opacity=".075" />
        <path d="M344 651 C397 665 425 711 411 757 C401 791 410 814 438 849 C461 879 470 927 458 978 C446 1026 414 1064 372 1083 C409 1039 424 985 419 925 C414 861 389 813 369 777 C352 747 350 705 344 651 Z" fill="#25080b" opacity=".13" />
      </g>

      <CarvedCrownNeckSvg prefix={prefix} />
      <CarvedCrownHardwareSvg prefix={prefix} />

      {/* Strings follow the 24.75 inch speaking length, then fan to 3+3 posts. */}
      <g className="tf-guitar__strings">
        {GEO.bridgeX.map((bridgeX, index) => {
          const [tx, ty] = GEO.tunerPoints[index]
          const active = ringing.includes(index)
          return <g key={bridgeX} className={active ? 'tf-guitar__string tf-guitar__string--active' : 'tf-guitar__string'} style={{ '--tf-string-index': index } as CSSProperties}>
            <path d={`M${bridgeX} 960 L${bridgeX} 900 L${GEO.nutX[index]} 205 L${tx} ${ty}`} fill="none" stroke="#170d0b" strokeWidth={2.3 - index * .16} opacity=".26" transform="translate(1.1 1.2)" />
            <path d={`M${bridgeX} 960 L${bridgeX} 900 L${GEO.nutX[index]} 205 L${tx} ${ty}`} fill="none" stroke={index < 3 ? '#8e887d' : '#b8b2a7'} strokeWidth={1.85 - index * .16} />
          </g>
        })}
      </g>

      <path d="M142 881 C155 828 181 783 219 752" fill="none" stroke="#fff3d0" strokeWidth="4" opacity=".09" />
      <path d="M160 1006 C199 1056 269 1078 336 1062" fill="none" stroke="#ffe3a5" strokeWidth="3" opacity=".055" />
      <rect x="250" y="195" width="100" height="780" fill="transparent" className="tf-guitar__string-hit" />
    </svg>
  )
}
