import { useCallback, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { GuitarSpec } from '../types'
import { OFFSET_CURRENT_BODY_PATH as BODY, OFFSET_CURRENT_GEOMETRY as GEO, OFFSET_CURRENT_SIDE_PATH as BODY_SIDE } from '../guitar-system/offsetCurrentGeometry'
import { OffsetCurrentNeckSvg } from './modules/OffsetCurrentNeckSvg'
import { OffsetCurrentHardwareSvg } from './modules/OffsetCurrentHardwareSvg'

interface Props { guitar: GuitarSpec; onPluck: (stringIndex: number) => void }

export function OffsetCurrentGuitarSvg({ guitar, onPluck }: Props) {
  const [ringing, setRinging] = useState<number[]>([])
  const sweepingRef = useRef(false)
  const lastStringRef = useRef<number | null>(null)
  const prefix = 'tf-offset-current-gold'
  const trigger = useCallback((index: number) => {
    if (index < 0 || index > 5 || lastStringRef.current === index) return
    lastStringRef.current = index; onPluck(index)
    setRinging((current) => [...new Set([...current, index])])
    window.setTimeout(() => setRinging((current) => current.filter((value) => value !== index)), 210)
  }, [onPluck])
  const locateString = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
    const point = event.currentTarget.createSVGPoint(); point.x = event.clientX; point.y = event.clientY
    const inverse = event.currentTarget.getScreenCTM()?.inverse(); if (!inverse) return null
    const local = point.matrixTransform(inverse)
    if (local.y < GEO.nutY || local.y > 1010 || local.x < 252 || local.x > 348) return null
    let closest = 0; let distance = Infinity
    GEO.bridgeX.forEach((bridgeX, index) => { const x = GEO.nutX[index] + ((bridgeX - GEO.nutX[index]) * (local.y - GEO.nutY)) / GEO.scaleLength; const next = Math.abs(local.x - x); if (next < distance) { distance = next; closest = index } })
    return distance < 12 ? closest : null
  }, [])
  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => { const index = locateString(event); if (index === null) return; event.preventDefault(); sweepingRef.current = true; lastStringRef.current = null; event.currentTarget.setPointerCapture(event.pointerId); trigger(index) }
  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => { if (!sweepingRef.current) return; const index = locateString(event); if (index !== null) trigger(index) }
  const stopSweep = (event: ReactPointerEvent<SVGSVGElement>) => { sweepingRef.current = false; lastStringRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }

  return <svg className="tf-guitar tf-guitar--offset-current tf-guitar--gold-standard" viewBox={GEO.viewBox} role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopSweep} onPointerCancel={stopSweep}>
    <title id={`${prefix}-title`}>{guitar.name.en}</title><desc id={`${prefix}-desc`}>Long-scale offset guitar with broad single coils and floating vibrato</desc>
    <defs>
      <linearGradient id={`${prefix}-side`} x1="130" y1="650" x2="470" y2="1080" gradientUnits="userSpaceOnUse"><stop stopColor="#315e58"/><stop offset=".55" stopColor="#1f403d"/><stop offset="1" stopColor="#102524"/></linearGradient>
      <linearGradient id={`${prefix}-sea`} x1="140" y1="655" x2="450" y2="1065" gradientUnits="userSpaceOnUse"><stop stopColor="#9bc6bd"/><stop offset=".3" stopColor="#78a99f"/><stop offset=".72" stopColor="#5f9189"/><stop offset="1" stopColor="#46746e"/></linearGradient>
      <linearGradient id={`${prefix}-coat`} x1="145" y1="670" x2="440" y2="1050" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" stopOpacity=".22"/><stop offset=".22" stopColor="#fff" stopOpacity=".025"/><stop offset=".72" stopColor="#173b38" stopOpacity=".02"/><stop offset="1" stopColor="#0b2322" stopOpacity=".2"/></linearGradient>
      <linearGradient id={`${prefix}-maple`} x1="266" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#b9793d"/><stop offset=".2" stopColor="#d39a56"/><stop offset=".55" stopColor="#dda965"/><stop offset=".85" stopColor="#c68a49"/><stop offset="1" stopColor="#a96736"/></linearGradient>
      <linearGradient id={`${prefix}-rosewood`} x1="274" y1="0" x2="326" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#241817"/><stop offset=".25" stopColor="#4c302b"/><stop offset=".62" stopColor="#39231f"/><stop offset="1" stopColor="#211515"/></linearGradient>
      <linearGradient id={`${prefix}-cream`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8df"/><stop offset=".58" stopColor="#ded4b8"/><stop offset="1" stopColor="#afa58d"/></linearGradient>
      <linearGradient id={`${prefix}-chrome`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#626562"/><stop offset=".18" stopColor="#ece9e0"/><stop offset=".4" stopColor="#999c98"/><stop offset=".68" stopColor="#e2e0d8"/><stop offset="1" stopColor="#5b5f5c"/></linearGradient>
      <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".5"/><stop offset=".55" stopColor="#000" stopOpacity=".2"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
      <clipPath id={`${prefix}-body-clip`}><path d={BODY}/></clipPath>
    </defs>
    <ellipse cx="302" cy="1092" rx="186" ry="35" fill={`url(#${prefix}-shadow)`}/>
    <path d={BODY_SIDE} transform="translate(9 10)" fill={`url(#${prefix}-side)`}/>
    <path d={BODY} fill={`url(#${prefix}-sea)`} stroke="#203b39" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
    <g clipPath={`url(#${prefix}-body-clip)`}><path d={BODY} fill={`url(#${prefix}-coat)`}/><path d="M125 760 C205 687 332 670 448 732" fill="none" stroke="#fff" strokeWidth="18" opacity=".065"/><path d="M126 1019 C229 960 350 967 467 914" fill="none" stroke="#123d39" strokeWidth="35" opacity=".13"/></g>

    <OffsetCurrentNeckSvg prefix={prefix} />
    <OffsetCurrentHardwareSvg prefix={prefix} />

    <g className="tf-guitar__strings">{GEO.bridgeX.map((bridgeX,index)=>{const [tx,ty]=GEO.tunerPoints[index];const active=ringing.includes(index);return <g key={bridgeX} className={active?'tf-guitar__string tf-guitar__string--active':'tf-guitar__string'} style={{'--tf-string-index':index} as CSSProperties}><path d={`M${bridgeX} 1010 L${bridgeX} 925 L${GEO.nutX[index]} 214 L${tx} ${ty}`} fill="none" stroke="#160f0e" strokeWidth={2.2-index*.15} opacity=".25" transform="translate(1 1)"/><path d={`M${bridgeX} 1010 L${bridgeX} 925 L${GEO.nutX[index]} 214 L${tx} ${ty}`} fill="none" stroke={index<3?'#8b867d':'#b6b1a7'} strokeWidth={1.8-index*.15}/></g>})}</g>
    <path d="M134 907 C157 973 209 1021 272 1035" fill="none" stroke="#e5fff5" strokeWidth="4" opacity=".055"/>
    <rect x="248" y="205" width="104" height="820" fill="transparent" className="tf-guitar__string-hit"/>
  </svg>
}
