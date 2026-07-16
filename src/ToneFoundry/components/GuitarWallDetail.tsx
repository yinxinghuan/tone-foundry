import { useState } from 'react'
import { isInAigram, openAigramProfile, telegramId } from '@shared/runtime'
import { locale } from '../i18n'
import type { GuitarSpec, ToneMetric } from '../types'
import type { WallEntry } from '../gameplay/save'
import { ModularGuitarPreview } from './ModularGuitarPreview'

interface Props { entry:WallEntry; guitar:GuitarSpec; parts:Array<{label:string;value:string}>; playing:boolean; onPlay:()=>void; onBack:()=>void }
const metricNames:Record<ToneMetric,{zh:string;en:string}>={warmth:{zh:'温暖',en:'Warmth'},brightness:{zh:'明亮',en:'Brightness'},attack:{zh:'起音',en:'Attack'},sustain:{zh:'延音',en:'Sustain'},drive:{zh:'驱动',en:'Drive'},space:{zh:'空间',en:'Space'}}

function DetailIcon({kind}:{kind:'in'|'out'|'reset'|'play'|'stop'}) { return <svg viewBox="0 0 24 24" aria-hidden="true">{kind==='play'?<path d="M8 5.5v13l10-6.5z"/>:kind==='stop'?<rect x="7" y="7" width="10" height="10" rx="1"/>:kind==='in'||kind==='out'?<><circle cx="10.5" cy="10.5" r="5.5" fill="none"/><path d="M14.7 14.7 20 20M7.5 10.5h6" fill="none"/>{kind==='in'&&<path d="M10.5 7.5v6" fill="none"/>}</>:<><path d="M5 9a7.5 7.5 0 1 1 1.4 7.7" fill="none"/><path d="M5 4v5h5" fill="none"/></>}</svg> }

export function GuitarWallDetail({entry,guitar,parts,playing,onPlay,onBack}:Props) {
  const [zoom,setZoom]=useState(1)
  const self=entry.userId==='self'||(!!telegramId&&entry.userId===String(telegramId))
  return <section className="tfrun tfrun--detail">
    <header className="tfrun-pagehead"><button type="button" onClick={onBack}>{locale==='zh'?'返回琴墙':'Back to wall'}</button><div><h2>{locale==='zh'?'声音档案':'Sound archive'}</h2></div></header>
    <div className="tfrun-detail__stage">
      <div className="tfrun-detail__instrument" style={{transform:`scale(${zoom})`}}><ModularGuitarPreview platform={entry.guitar.platform} config={entry.guitar.config}/></div>
      <div className="tfrun-detail__zoom"><button type="button" onClick={()=>setZoom(v=>Math.max(.8,+(v-.2).toFixed(1)))} disabled={zoom<=.8} aria-label={locale==='zh'?'缩小':'Zoom out'}><DetailIcon kind="out"/></button><button type="button" onClick={()=>setZoom(1)} aria-label={locale==='zh'?'复位视图':'Reset view'}>{Math.round(zoom*100)}</button><button type="button" onClick={()=>setZoom(v=>Math.min(2,+(v+.2).toFixed(1)))} disabled={zoom>=2} aria-label={locale==='zh'?'放大':'Zoom in'}><DetailIcon kind="in"/></button></div>
    </div>
    <div className="tfrun-detail__sheet">
      <div className="tfrun-detail__title"><div><span>{entry.guitar.id}</span><h1>{entry.guitar.riff.name}</h1><p>{entry.guitar.riff.bpm} BPM · SCORE {entry.guitar.rarityScore}</p></div>{self?<span className="tfrun-detail__self">{locale==='zh'?'你':'YOU'}</span>:<button type="button" className="tfrun-detail__author" disabled={!isInAigram} onClick={()=>{if(isInAigram)openAigramProfile(entry.userId)}}><span>{entry.userAvatarUrl?<img src={entry.userAvatarUrl} alt="" draggable={false}/>:<i>{(entry.userName||'?')[0]?.toUpperCase()}</i>}</span><b>{entry.userName||'·'}</b></button>}</div>
      <button className="tfrun-detail__play" type="button" onClick={onPlay}><DetailIcon kind={playing?'stop':'play'}/><span>{playing?(locale==='zh'?'停止 First Riff':'Stop First Riff'):(locale==='zh'?'播放 First Riff':'Play First Riff')}</span></button>
      <section className="tfrun-detail__parts"><h2>{locale==='zh'?'制琴清单':'Build manifest'}</h2><div>{parts.map(item=><p key={item.label}><span>{item.label}</span><b>{item.value}</b></p>)}</div></section>
      <section className="tfrun-detail__tone"><h2>{locale==='zh'?'音色指纹':'Tone fingerprint'}</h2><div>{(Object.keys(metricNames) as ToneMetric[]).map(key=><p key={key}><span>{metricNames[key][locale]}</span><i><em style={{width:`${guitar.tone[key]}%`}}/></i><b>{guitar.tone[key]}</b></p>)}</div></section>
      <section className="tfrun-detail__riff"><h2>{locale==='zh'?'First Riff 纸带':'First Riff tape'}</h2><div>{entry.guitar.riff.steps.map((row,stringIndex)=><span key={stringIndex}>{row.map((cell,index)=><i key={index} className={cell?`is-on is-${cell}`:''}/>)}</span>)}</div></section>
    </div>
  </section>
}
