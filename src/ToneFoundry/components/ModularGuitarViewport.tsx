import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent as ReactWheelEvent } from 'react'

type Point = { x:number; y:number }

interface Props {
  children: ReactNode
  className?: string
  label: string
  minZoom?: number
  maxZoom?: number
}

const clamp = (value:number,min:number,max:number) => Math.min(max,Math.max(min,value))

function ViewIcon({kind}:{kind:'in'|'out'|'reset'}) {
  if (kind==='reset') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9a7.5 7.5 0 1 1 1.4 7.7" fill="none"/><path d="M5 4v5h5" fill="none"/></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" fill="none"/><path d="M14.7 14.7 20 20M7.5 10.5h6" fill="none"/>{kind==='in'&&<path d="M10.5 7.5v6" fill="none"/>}</svg>
}

export function ModularGuitarViewport({children,className='',label,minZoom=.8,maxZoom=2.4}:Props) {
  const surfaceRef=useRef<HTMLDivElement|null>(null)
  const pointersRef=useRef(new Map<number,Point>())
  const dragStartRef=useRef<{point:Point;pan:Point}|null>(null)
  const pinchRef=useRef<{distance:number;zoom:number;midpoint:Point;pan:Point}|null>(null)
  const [zoom,setZoom]=useState(1)
  const [pan,setPan]=useState<Point>({x:0,y:0})
  const [dragging,setDragging]=useState(false)

  const constrainPan=useCallback((next:Point,nextZoom=zoom) => {
    const rect=surfaceRef.current?.getBoundingClientRect()
    if (!rect || nextZoom<=1) return {x:0,y:0}
    const maxX=((nextZoom-1)*rect.width)/2+34
    const maxY=((nextZoom-1)*rect.height)/2+34
    return {x:clamp(next.x,-maxX,maxX),y:clamp(next.y,-maxY,maxY)}
  },[zoom])

  const applyZoom=useCallback((next:number,anchor?:Point) => {
    const bounded=clamp(next,minZoom,maxZoom)
    setZoom(current=>{
      if (anchor && surfaceRef.current && bounded!==current) {
        const rect=surfaceRef.current.getBoundingClientRect()
        const center={x:rect.width/2,y:rect.height/2}
        const ratio=bounded/current
        setPan(currentPan=>constrainPan({x:anchor.x-center.x-(anchor.x-center.x-currentPan.x)*ratio,y:anchor.y-center.y-(anchor.y-center.y-currentPan.y)*ratio},bounded))
      } else setPan(currentPan=>constrainPan(currentPan,bounded))
      return bounded
    })
  },[constrainPan,maxZoom,minZoom])

  const reset=()=>{setZoom(1);setPan({x:0,y:0})}
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{
    event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);pointersRef.current.set(event.pointerId,{x:event.clientX,y:event.clientY})
    if (pointersRef.current.size===1) dragStartRef.current={point:{x:event.clientX,y:event.clientY},pan}
    if (pointersRef.current.size===2) { const [a,b]=[...pointersRef.current.values()];pinchRef.current={distance:Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),zoom,midpoint:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},pan};setDragging(true) }
  }
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if (!pointersRef.current.has(event.pointerId)) return
    event.preventDefault();pointersRef.current.set(event.pointerId,{x:event.clientX,y:event.clientY})
    if (pointersRef.current.size>=2 && pinchRef.current) { const [a,b]=[...pointersRef.current.values()];const distance=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y));const midpoint={x:(a.x+b.x)/2,y:(a.y+b.y)/2};const nextZoom=clamp(pinchRef.current.zoom*distance/pinchRef.current.distance,minZoom,maxZoom);setZoom(nextZoom);setPan(constrainPan({x:pinchRef.current.pan.x+midpoint.x-pinchRef.current.midpoint.x,y:pinchRef.current.pan.y+midpoint.y-pinchRef.current.midpoint.y},nextZoom));return }
    const start=dragStartRef.current
    if (!start || zoom<=1) return
    const dx=event.clientX-start.point.x;const dy=event.clientY-start.point.y
    if (Math.hypot(dx,dy)<6 && !dragging) return
    setDragging(true);setPan(constrainPan({x:start.pan.x+dx,y:start.pan.y+dy}))
  }
  const stopPointer=(event:ReactPointerEvent<HTMLDivElement>)=>{
    pointersRef.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (pointersRef.current.size<2) pinchRef.current=null
    if (pointersRef.current.size===1) { const point=[...pointersRef.current.values()][0];dragStartRef.current={point,pan} } else { dragStartRef.current=null;setDragging(false) }
  }
  const onWheel=(event:ReactWheelEvent<HTMLDivElement>)=>{event.preventDefault();const rect=event.currentTarget.getBoundingClientRect();applyZoom(zoom+(event.deltaY<0?.2:-.2),{x:event.clientX-rect.left,y:event.clientY-rect.top})}
  return <div className={`tfmod-viewer ${className}`} aria-label={label}>
    <div ref={surfaceRef} className={`tfmod-viewer__surface ${dragging?'is-dragging':''}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopPointer} onPointerCancel={stopPointer} onWheel={onWheel} onDoubleClick={()=>zoom>1?reset():applyZoom(2)}>
      <div className="tfmod-viewer__transform" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>{children}</div>
    </div>
    <div className="tfmod-viewer__controls" aria-label={label}>
      <button type="button" onClick={()=>applyZoom(zoom-.2)} disabled={zoom<=minZoom} aria-label="Zoom out"><ViewIcon kind="out"/></button><button type="button" onClick={reset} aria-label="Reset view" disabled={zoom===1&&pan.x===0&&pan.y===0}>{Math.round(zoom*100)}</button><button type="button" onClick={()=>applyZoom(zoom+.2)} disabled={zoom>=maxZoom} aria-label="Zoom in"><ViewIcon kind="in"/></button>
    </div>
  </div>
}
