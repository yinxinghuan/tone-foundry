import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { GuitarSpec } from '../types'
import {
  ACOUSTIC_DREADNOUGHT_BODY_PATH as BODY,
  ACOUSTIC_DREADNOUGHT_GEOMETRY as GEO,
  ACOUSTIC_DREADNOUGHT_SIDE_PATH as BODY_SIDE,
} from '../guitar-system/acousticDreadnoughtGeometry'
import { AcousticDreadnoughtBodySvg } from './modules/AcousticDreadnoughtBodySvg'
import { AcousticDreadnoughtNeckSvg } from './modules/AcousticDreadnoughtNeckSvg'

interface Props { guitar: GuitarSpec; onPluck: (stringIndex: number) => void }

export function AcousticDreadnoughtGuitarSvg({ guitar, onPluck }: Props) {
  const [ringing, setRinging] = useState<number[]>([])
  const sweepingRef = useRef(false)
  const lastStringRef = useRef<number | null>(null)
  const prefix = 'tf-acoustic-dreadnought-gold'

  const trigger = useCallback((index: number) => {
    if (index < 0 || index > 5 || lastStringRef.current === index) return
    lastStringRef.current = index
    onPluck(index)
    setRinging((current) => [...new Set([...current, index])])
    window.setTimeout(() => setRinging((current) => current.filter((value) => value !== index)), 230)
  }, [onPluck])

  const locateString = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const point = event.currentTarget.createSVGPoint()
    point.x = event.clientX; point.y = event.clientY
    const inverse = event.currentTarget.getScreenCTM()?.inverse()
    if (!inverse) return null
    const local = point.matrixTransform(inverse)
    if (local.y < GEO.nutY || local.y > GEO.bridgePinY || local.x < 245 || local.x > 355) return null
    let closest = 0; let distance = Number.POSITIVE_INFINITY
    GEO.saddleX.forEach((saddleX, index) => {
      const x = GEO.nutX[index] + ((saddleX - GEO.nutX[index]) * (local.y - GEO.nutY)) / GEO.scaleLength
      const next = Math.abs(local.x - x)
      if (next < distance) { distance = next; closest = index }
    })
    return distance < 13 ? closest : null
  }, [])

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    const index = locateString(event)
    if (index === null) return
    event.preventDefault(); sweepingRef.current = true; lastStringRef.current = null
    event.currentTarget.setPointerCapture(event.pointerId); trigger(index)
  }
  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => { if (sweepingRef.current) { const index = locateString(event); if (index !== null) trigger(index) } }
  const stopSweep = (event: ReactPointerEvent<SVGSVGElement>) => {
    sweepingRef.current = false; lastStringRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <svg className="tf-guitar tf-guitar--acoustic-dreadnought tf-guitar--gold-standard" viewBox={GEO.viewBox} role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopSweep} onPointerCancel={stopSweep}>
      <title id={`${prefix}-title`}>{guitar.name.en}</title>
      <desc id={`${prefix}-desc`}>Fourteen-fret spruce and mahogany dreadnought acoustic with round soundhole, ebony bridge and three-a-side tuners</desc>
      <defs>
        <linearGradient id={`${prefix}-spruce`} x1="160" y1="620" x2="445" y2="1110" gradientUnits="userSpaceOnUse"><stop stopColor="#e4bd78" /><stop offset=".48" stopColor="#d39a50" /><stop offset="1" stopColor="#ad6833" /></linearGradient>
        <linearGradient id={`${prefix}-side`} x1="170" y1="620" x2="470" y2="1120" gradientUnits="userSpaceOnUse"><stop stopColor="#7a4630" /><stop offset=".55" stopColor="#532a20" /><stop offset="1" stopColor="#2d1714" /></linearGradient>
        <linearGradient id={`${prefix}-mahogany`} x1="260" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#4a291f" /><stop offset=".18" stopColor="#7f4a32" /><stop offset=".52" stopColor="#9a5a3a" /><stop offset=".82" stopColor="#693923" /><stop offset="1" stopColor="#3b211a" /></linearGradient>
        <linearGradient id={`${prefix}-headplate`} x1="260" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#241817" /><stop offset=".48" stopColor="#503029" /><stop offset="1" stopColor="#211515" /></linearGradient>
        <linearGradient id={`${prefix}-ebony`} x1="270" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#171411" /><stop offset=".35" stopColor="#342a22" /><stop offset=".62" stopColor="#211b17" /><stop offset="1" stopColor="#100e0d" /></linearGradient>
        <linearGradient id={`${prefix}-nickel`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#595b57" /><stop offset=".2" stopColor="#e3e1d8" /><stop offset=".46" stopColor="#8f928d" /><stop offset=".7" stopColor="#efebe2" /><stop offset="1" stopColor="#555753" /></linearGradient>
        <linearGradient id={`${prefix}-fret`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f1eee6" /><stop offset=".45" stopColor="#9c9d98" /><stop offset="1" stopColor="#555752" /></linearGradient>
        <radialGradient id={`${prefix}-pickguard`} cx="35%" cy="25%"><stop stopColor="#7c3c27" /><stop offset=".36" stopColor="#3a201b" /><stop offset=".7" stopColor="#672d20" /><stop offset="1" stopColor="#241614" /></radialGradient>
        <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".55" /><stop offset=".58" stopColor="#000" stopOpacity=".2" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        <clipPath id={`${prefix}-body-clip`}><path d={BODY} /></clipPath>
      </defs>

      <ellipse cx="301" cy="1137" rx="196" ry="34" fill={`url(#${prefix}-shadow)`} />
      <path d={BODY_SIDE} transform="translate(10 10)" fill={`url(#${prefix}-side)`} />
      <path d={BODY} fill={`url(#${prefix}-spruce)`} stroke="#493023" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={BODY} fill="none" stroke="#e8d8ad" strokeWidth="5" opacity=".9" vectorEffect="non-scaling-stroke" />
      <g clipPath={`url(#${prefix}-body-clip)`}>
        {[-120,-96,-72,-48,-24,0,24,48,72,96,120].map((dx, index) => <path key={dx} d={`M${300 + dx} 585 C${294 + dx} 755 ${306 + dx} 953 ${298 + dx} 1140`} fill="none" stroke={index % 2 ? '#7d4d2d' : '#f4d79b'} strokeWidth={index % 2 ? 1.15 : .7} opacity={index % 2 ? .16 : .2} />)}
        <path d="M135 700 C188 629 260 615 325 629 C245 658 198 744 184 862 C172 965 205 1054 275 1126 C190 1113 135 1061 117 988 C98 910 111 775 135 700 Z" fill="#fff5d8" opacity=".075" />
        <path d="M365 608 C429 631 466 684 451 747 C439 797 447 841 478 903 C500 947 493 1024 449 1077 C414 1119 374 1129 350 1132 C405 1072 426 1001 420 922 C414 828 386 742 365 608 Z" fill="#6b321f" opacity=".11" />
      </g>

      <AcousticDreadnoughtNeckSvg prefix={prefix} />
      <AcousticDreadnoughtBodySvg prefix={prefix} />

      <g className="tf-guitar__strings">
        {GEO.saddleX.map((saddleX, index) => {
          const [tx, ty] = GEO.tunerPoints[index]
          const active = ringing.includes(index)
          return <g key={saddleX} className={active ? 'tf-guitar__string tf-guitar__string--active' : 'tf-guitar__string'} style={{ '--tf-string-index': index } as CSSProperties}>
            <path d={`M${saddleX} ${GEO.bridgePinY} L${saddleX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke="#17120f" strokeWidth={2.5-index*.17} opacity=".25" transform="translate(1.1 1.3)" />
            <path d={`M${saddleX} ${GEO.bridgePinY} L${saddleX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke={index < 3 ? '#827d72' : '#b5afa3'} strokeWidth={1.95-index*.17} />
          </g>
        })}
      </g>
      <path d="M144 724 C185 645 255 617 323 632" fill="none" stroke="#fff4d2" strokeWidth="4" opacity=".1" />
      <rect x="242" y="200" width="116" height="765" fill="transparent" className="tf-guitar__string-hit" />
    </svg>
  )
}
