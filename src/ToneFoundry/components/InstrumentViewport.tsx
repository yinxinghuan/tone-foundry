import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import type { GuitarSpec } from '../types'
import { t } from '../i18n'
import { GuitarSvg } from './GuitarSvg'

type ViewMode = 'inspect' | 'play'
type Point = { x: number; y: number }

interface InstrumentViewportProps {
  guitar: GuitarSpec
  onPluck: (stringIndex: number) => void
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3.5
const ZOOM_STEP = .35
const DRAG_THRESHOLD = 10

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function InspectIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m14.5 14.5 4 4M8.5 10.5h4M10.5 8.5v4" /></svg>
}

function PlayStringsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16M10.5 4v16M14 4v16M17.5 4v16M4.5 9.5c4.2 2.2 10.8 2.2 15 0" /></svg>
}

function ZoomIcon({ kind }: { kind: 'in' | 'out' | 'reset' }) {
  if (kind === 'reset') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4" /><path d="M8 12h8" /></svg>
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m14.5 14.5 4 4M8 10.5h5" />
      {kind === 'in' && <path d="M10.5 8v5" />}
    </svg>
  )
}

export function InstrumentViewport({ guitar, onPluck }: InstrumentViewportProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const pointersRef = useRef(new Map<number, Point>())
  const dragStartRef = useRef<{ point: Point; pan: Point } | null>(null)
  const pinchRef = useRef<{ distance: number; zoom: number; midpoint: Point; pan: Point } | null>(null)
  const [mode, setMode] = useState<ViewMode>('inspect')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const constrainPan = useCallback((next: Point, nextZoom = zoom) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    if (!rect || nextZoom <= 1) return { x: 0, y: 0 }
    const maxX = ((nextZoom - 1) * rect.width) / 2 + 48
    const maxY = ((nextZoom - 1) * rect.height) / 2 + 48
    return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) }
  }, [zoom])

  const applyZoom = useCallback((nextZoom: number, anchor?: Point) => {
    const bounded = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
    setZoom((current) => {
      if (anchor && surfaceRef.current && bounded !== current) {
        const rect = surfaceRef.current.getBoundingClientRect()
        const center = { x: rect.width / 2, y: rect.height / 2 }
        const ratio = bounded / current
        setPan((currentPan) => constrainPan({
          x: anchor.x - center.x - (anchor.x - center.x - currentPan.x) * ratio,
          y: anchor.y - center.y - (anchor.y - center.y - currentPan.y) * ratio,
        }, bounded))
      } else {
        setPan((currentPan) => constrainPan(currentPan, bounded))
      }
      return bounded
    })
  }, [constrainPan])

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => resetView(), [guitar.id, resetView])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (mode !== 'inspect') return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointersRef.current.size === 1) {
      dragStartRef.current = { point: { x: event.clientX, y: event.clientY }, pan }
    } else if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()]
      pinchRef.current = {
        distance: Math.hypot(b.x - a.x, b.y - a.y),
        zoom,
        midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        pan,
      }
      setDragging(true)
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (mode !== 'inspect' || !pointersRef.current.has(event.pointerId)) return
    event.preventDefault()
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const [a, b] = [...pointersRef.current.values()]
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y))
      const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const nextZoom = clamp(pinchRef.current.zoom * distance / pinchRef.current.distance, MIN_ZOOM, MAX_ZOOM)
      setZoom(nextZoom)
      setPan(constrainPan({
        x: pinchRef.current.pan.x + midpoint.x - pinchRef.current.midpoint.x,
        y: pinchRef.current.pan.y + midpoint.y - pinchRef.current.midpoint.y,
      }, nextZoom))
      return
    }
    const start = dragStartRef.current
    if (!start || zoom <= 1) return
    const dx = event.clientX - start.point.x
    const dy = event.clientY - start.point.y
    if (!dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    setDragging(true)
    setPan(constrainPan({ x: start.pan.x + dx, y: start.pan.y + dy }))
  }

  const stopPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (pointersRef.current.size < 2) pinchRef.current = null
    if (pointersRef.current.size === 1) {
      const point = [...pointersRef.current.values()][0]
      dragStartRef.current = { point, pan }
    } else if (pointersRef.current.size === 0) {
      dragStartRef.current = null
      setDragging(false)
    }
  }

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (mode !== 'inspect') return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    applyZoom(zoom + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP), {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const switchMode = (next: ViewMode) => {
    pointersRef.current.clear()
    setDragging(false)
    setMode(next)
  }

  return (
    <div className={`tf-inspector tf-inspector--${mode}`}>
      <div className="tf-inspector__toolbar" aria-label={t('viewControls')}>
        <div className="tf-inspector__modes">
          <button type="button" className={mode === 'inspect' ? 'is-active' : ''} onClick={() => switchMode('inspect')} aria-pressed={mode === 'inspect'}>
            <InspectIcon /><span>{t('inspectMode')}</span>
          </button>
          <button type="button" className={mode === 'play' ? 'is-active' : ''} onClick={() => switchMode('play')} aria-pressed={mode === 'play'}>
            <PlayStringsIcon /><span>{t('playMode')}</span>
          </button>
        </div>
        <div className="tf-inspector__zoom">
          <button type="button" onClick={() => applyZoom(zoom - ZOOM_STEP)} aria-label={t('zoomOut')} disabled={zoom <= MIN_ZOOM}><ZoomIcon kind="out" /></button>
          <output aria-live="polite">{Math.round(zoom * 100)}%</output>
          <button type="button" onClick={() => applyZoom(zoom + ZOOM_STEP)} aria-label={t('zoomIn')} disabled={zoom >= MAX_ZOOM}><ZoomIcon kind="in" /></button>
          <button type="button" onClick={resetView} aria-label={t('resetView')} disabled={zoom === 1 && pan.x === 0 && pan.y === 0}><ZoomIcon kind="reset" /></button>
        </div>
      </div>
      <div
        ref={surfaceRef}
        className={`tf-inspector__surface ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopPointer}
        onPointerCancel={stopPointer}
        onWheel={onWheel}
        onDoubleClick={() => mode === 'inspect' && (zoom > 1 ? resetView() : applyZoom(2))}
      >
        <div className="tf-inspector__transform" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <GuitarSvg key={guitar.id} guitar={guitar} onPluck={onPluck} />
        </div>
      </div>
      <p className="tf-inspector__hint">{mode === 'inspect' ? t('inspectHint') : t('stringHint')}</p>
    </div>
  )
}
