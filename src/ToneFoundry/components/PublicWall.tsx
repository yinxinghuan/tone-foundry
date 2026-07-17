import { useMemo } from 'react'
import { isInAigram, openAigramProfile, telegramId } from '@shared/runtime'
import { locale } from '../i18n'
import type { PublishedGuitar, WallEntry } from '../gameplay/save'
import { ModularGuitarPreview } from './ModularGuitarPreview'

interface Props {
  community: WallEntry[]
  mine: PublishedGuitar[]
  likedGuitarIds: string[]
  loaded: boolean
  onBack: () => void
  onView: (guitar: PublishedGuitar, entry: WallEntry) => void
  onToggleLike: (entry: WallEntry) => void
  onRemix: (entry: WallEntry) => void
}

function HeartIcon({ filled=false }:{filled?:boolean}) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S4.5 15.2 4.5 9.8C4.5 7 6.5 5.2 9 5.2c1.5 0 2.5.8 3 1.7.5-.9 1.5-1.7 3-1.7 2.5 0 4.5 1.8 4.5 4.6C19.5 15.2 12 20 12 20Z" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg> }

export function PublicWall({ community, mine, likedGuitarIds, loaded, onBack, onView, onToggleLike, onRemix }: Props) {
  const entries = useMemo(() => {
    const merged: WallEntry[] = [
      ...mine.map((guitar) => ({ userId: 'self', userName: locale === 'zh' ? '你' : 'YOU', guitar })),
      ...community.filter((entry) => !telegramId || entry.userId !== String(telegramId)),
    ]
    const seen = new Set<string>()
    return merged
      .sort((a, b) => b.guitar.publishedAt - a.guitar.publishedAt)
      .filter((entry) => !seen.has(entry.guitar.id) && !!seen.add(entry.guitar.id))
  }, [community, mine])

  return <section className="tfrun tfrun--wall">
    <header className="tfrun-pagehead">
      <button type="button" onClick={onBack}>{locale === 'zh' ? '返回琴架' : 'Back to rack'}</button>
      <div><h2>{locale === 'zh' ? '公共琴墙' : 'Public guitar wall'}</h2><small>{locale === 'zh' ? `${entries.length} 把公开乐器 · 试听、点赞或改编` : `${entries.length} public instruments · listen, like, remix`}</small></div>
    </header>
    {!loaded ? <p className="tfrun-empty">…</p> : entries.length === 0 ? <p className="tfrun-empty">{locale === 'zh' ? '还没有公开作品。发布第一段 riff，成为这里的第一把琴。' : 'No public instruments yet. Publish the first riff.'}</p> :
      <div className="tfrun-wall__grid">{entries.map((entry) => {
        const self = entry.userId === 'self' || (!!telegramId && entry.userId === String(telegramId))
        const liked = likedGuitarIds.includes(entry.guitar.id)
        const likeCount = (entry.likeCount ?? 0) + (liked ? 1 : 0)
        return <article className="tfrun-wall__card" key={entry.guitar.id} onClick={() => onView(entry.guitar, entry)}>
          <div className="tfrun-wall__instrument"><ModularGuitarPreview platform={entry.guitar.platform} config={entry.guitar.config} /></div>
          <div className="tfrun-wall__meta"><span>{entry.guitar.id}</span><b>{entry.guitar.riff.name}</b><small>{entry.guitar.riff.bpm} BPM · SCORE {entry.guitar.rarityScore}</small>{entry.guitar.effects?.length?<em>{entry.guitar.effects.map(effect=>effect==='overdrive'?'OD':effect==='tape-echo'?'TE':effect==='chorus'?'CH':'B').join(' → ')}</em>:<em>DRY</em>}{entry.guitar.remix&&<em>{locale==='zh'?`改编 · ${entry.guitar.remix.sourceAuthor || entry.guitar.remix.sourceGuitarId}`:`REMIX · ${entry.guitar.remix.sourceAuthor || entry.guitar.remix.sourceGuitarId}`}</em>}</div>
          {self ? <span className="tfrun-wall__self">{locale === 'zh' ? '你' : 'YOU'}</span> : <button
            type="button"
            className="tfrun-wall__author"
            disabled={!isInAigram}
            onClick={(event) => { event.stopPropagation(); if (isInAigram) openAigramProfile(entry.userId) }}
            aria-label={`${locale === 'zh' ? '打开用户主页' : 'Open profile'} ${entry.userName ?? ''}`}
          >
            <span className="tfrun-wall__avatar" aria-hidden>{entry.userAvatarUrl ? <img src={entry.userAvatarUrl} alt="" draggable={false} /> : <i>{(entry.userName || '?')[0]?.toUpperCase()}</i>}</span>
            <span className="tfrun-wall__name">{entry.userName || '·'}</span>
          </button>}
          <div className="tfrun-wall__actions">{self?<span>{locale==='zh'?'自己的作品':'YOUR WORK'}</span>:<><button type="button" className={liked?'is-liked':''} onClick={(event)=>{event.stopPropagation();onToggleLike(entry)}} aria-pressed={liked} aria-label={locale==='zh'?'点赞作品':'Like instrument'}><HeartIcon filled={liked}/><b>{likeCount}</b></button><button type="button" onClick={(event)=>{event.stopPropagation();onRemix(entry)}}>{locale==='zh'?'改编':'REMIX'}</button></>}</div>
        </article>
      })}</div>}
  </section>
}
