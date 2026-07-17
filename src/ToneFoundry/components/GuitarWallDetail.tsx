import { isInAigram, openAigramProfile, telegramId } from '@shared/runtime'
import { locale } from '../i18n'
import type { GuitarSpec, ToneMetric } from '../types'
import type { WallEntry } from '../gameplay/save'
import { EFFECTS, type EffectId } from '../audio/effects'
import { ModularGuitarPreview } from './ModularGuitarPreview'
import { ModularGuitarViewport } from './ModularGuitarViewport'
import { EffectPedalArt } from './EffectPedal'

interface Props { entry:WallEntry; guitar:GuitarSpec; parts:Array<{label:string;value:string}>; playing:boolean; liked:boolean; likeCount:number; onPlay:()=>void; onBack:()=>void; onRemix?:()=>void; onToggleLike?:()=>void }
const metricNames:Record<ToneMetric,{zh:string;en:string}>={warmth:{zh:'温暖',en:'Warmth'},brightness:{zh:'明亮',en:'Brightness'},attack:{zh:'起音',en:'Attack'},sustain:{zh:'延音',en:'Sustain'},drive:{zh:'驱动',en:'Drive'},space:{zh:'空间',en:'Space'}}

function DetailIcon({kind}:{kind:'play'|'stop'}) { return <svg viewBox="0 0 24 24" aria-hidden="true">{kind==='play'?<path d="M8 5.5v13l10-6.5z"/>:<rect x="7" y="7" width="10" height="10" rx="1"/>}</svg> }
function HeartIcon({filled}:{filled:boolean}) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S4.5 15.2 4.5 9.8C4.5 7 6.5 5.2 9 5.2c1.5 0 2.5.8 3 1.7.5-.9 1.5-1.7 3-1.7 2.5 0 4.5 1.8 4.5 4.6C19.5 15.2 12 20 12 20Z" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg> }

export function GuitarWallDetail({entry,guitar,parts,playing,liked,likeCount,onPlay,onBack,onRemix,onToggleLike}:Props) {
  const self=entry.userId==='self'||(!!telegramId&&entry.userId===String(telegramId))
  return <section className="tfrun tfrun--detail">
    <header className="tfrun-pagehead"><button type="button" onClick={onBack}>{locale==='zh'?'返回琴墙':'Back to wall'}</button><div><h2>{locale==='zh'?'声音档案':'Sound archive'}</h2></div></header>
    <div className="tfrun-detail__stage">
      <ModularGuitarViewport className="tfrun-detail__viewer" label={locale==='zh'?'吉他查看器':'Instrument viewer'}><ModularGuitarPreview platform={entry.guitar.platform} config={entry.guitar.config}/></ModularGuitarViewport>
    </div>
    <div className="tfrun-detail__sheet">
      <div className="tfrun-detail__title"><div><span>{entry.guitar.id}</span><h1>{entry.guitar.riff.name}</h1><p>{entry.guitar.riff.bpm} BPM · SCORE {entry.guitar.rarityScore}</p></div>{self?<span className="tfrun-detail__self">{locale==='zh'?'你':'YOU'}</span>:<button type="button" className="tfrun-detail__author" disabled={!isInAigram} onClick={()=>{if(isInAigram)openAigramProfile(entry.userId)}}><span>{entry.userAvatarUrl?<img src={entry.userAvatarUrl} alt="" draggable={false}/>:<i>{(entry.userName||'?')[0]?.toUpperCase()}</i>}</span><b>{entry.userName||'·'}</b></button>}</div>
      <button className="tfrun-detail__play" type="button" onClick={onPlay}><DetailIcon kind={playing?'stop':'play'}/><span>{playing?(locale==='zh'?'停止 First Riff':'Stop First Riff'):(locale==='zh'?'播放 First Riff':'Play First Riff')}</span></button>
      {!self&&<button className={`tfrun-detail__like ${liked?'is-liked':''}`} type="button" onClick={onToggleLike} aria-pressed={liked}><HeartIcon filled={liked}/><span>{locale==='zh'?'点赞这把琴':'Like this instrument'}</span><b>{likeCount}</b></button>}
      {entry.guitar.remix && <p className="tfrun-detail__remix-source">{locale==='zh'?`改编自 ${entry.guitar.remix.sourceAuthor || entry.guitar.remix.sourceGuitarId}`:`REMIX OF ${entry.guitar.remix.sourceAuthor || entry.guitar.remix.sourceGuitarId}`}</p>}
      {onRemix && <button className="tfrun-detail__remix" type="button" onClick={onRemix}>{locale==='zh'?'用这段 Riff 开始改编':'Remix this riff'}</button>}
      <section className="tfrun-detail__parts"><h2>{locale==='zh'?'制琴清单':'Build manifest'}</h2><div>{parts.map(item=><p key={item.label}><span>{item.label}</span><b>{item.value}</b></p>)}</div></section>
      <section className="tfrun-detail__effects"><header><h2>{locale==='zh'?'发布时效果器链':'Published pedal chain'}</h2><span>{entry.guitar.effects?.length?entry.guitar.effects.map(effect=>EFFECTS[effect].short).join(' → '):(locale==='zh'?'直通':'DRY')}</span></header>{entry.guitar.effects?.length?<div>{entry.guitar.effects.map((effect:EffectId,index)=><article key={effect}><div><EffectPedalArt effect={effect} active/><i>{index+1}</i></div><b>{EFFECTS[effect][locale]}</b></article>)}</div>:<p>{locale==='zh'?'这把琴以原始直通信号发布。':'This instrument was published dry.'}</p>}</section>
      <section className="tfrun-detail__tone"><h2>{locale==='zh'?'音色指纹':'Tone fingerprint'}</h2><div>{(Object.keys(metricNames) as ToneMetric[]).map(key=><p key={key}><span>{metricNames[key][locale]}</span><i><em style={{width:`${guitar.tone[key]}%`}}/></i><b>{guitar.tone[key]}</b></p>)}</div></section>
      <section className="tfrun-detail__riff"><h2>{locale==='zh'?'First Riff 纸带':'First Riff tape'}</h2><div>{entry.guitar.riff.steps.map((row,stringIndex)=><span key={stringIndex}>{row.map((cell,index)=><i key={index} className={cell?`is-on is-${cell}`:''}/>)}</span>)}</div></section>
    </div>
  </section>
}
