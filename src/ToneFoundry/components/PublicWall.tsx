import { useMemo } from 'react'
import { isInAigram, openAigramProfile, telegramId } from '@shared/runtime'
import { locale } from '../i18n'
import type { PublishedGuitar, WallEntry } from '../gameplay/save'
import { ModularGuitarPreview } from './ModularGuitarPreview'

interface Props {
  community: WallEntry[]
  mine: PublishedGuitar[]
  loaded: boolean
  onBack: () => void
  onView: (guitar: PublishedGuitar) => void
}

export function PublicWall({ community, mine, loaded, onBack, onView }: Props) {
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
      <div><span>PUBLIC SIGNAL / {entries.length}</span><h2>{locale === 'zh' ? '公共琴墙' : 'Public guitar wall'}</h2></div>
    </header>
    {!loaded ? <p className="tfrun-empty">…</p> : entries.length === 0 ? <p className="tfrun-empty">{locale === 'zh' ? '还没有公开作品。发布第一段 riff，成为这里的第一把琴。' : 'No public instruments yet. Publish the first riff.'}</p> :
      <div className="tfrun-wall__grid">{entries.map((entry) => {
        const self = entry.userId === 'self' || (!!telegramId && entry.userId === String(telegramId))
        return <article className="tfrun-wall__card" key={entry.guitar.id} onClick={() => onView(entry.guitar)}>
          <div className="tfrun-wall__instrument"><ModularGuitarPreview platform={entry.guitar.platform} config={entry.guitar.config} /></div>
          <div className="tfrun-wall__meta"><span>{entry.guitar.id}</span><b>{entry.guitar.riff.name}</b><small>{entry.guitar.riff.bpm} BPM · SCORE {entry.guitar.rarityScore}</small></div>
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
        </article>
      })}</div>}
  </section>
}
