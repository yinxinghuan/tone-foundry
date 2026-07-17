import type { CompletedBuild } from './buildRun'
import type { EffectId } from '../audio/effects'

export type RiffCell = 0 | 1 | 2 | 3

export interface RiffPattern {
  name: string
  bpm: number
  steps: RiffCell[][]
}

export interface RemixSource {
  sourceEntryId: string
  sourceGuitarId: string
  sourceAuthor?: string
  sourceAuthorId?: string
}

export interface PublishedGuitar extends CompletedBuild {
  riff: RiffPattern
  publishedAt: number
  remix?: RemixSource
  effects?: EffectId[]
}

export interface ToneFoundrySave {
  collection: CompletedBuild[]
  published: PublishedGuitar[]
  likedGuitarIds: string[]
  _lastActive?: number
}

export interface WallEntry {
  userId: string
  userName?: string
  userAvatarUrl?: string
  guitar: PublishedGuitar
  likeCount?: number
}

export const EMPTY_SAVE: ToneFoundrySave = { collection: [], published: [], likedGuitarIds: [] }

export function emptyRiff(stepCount = 16): RiffPattern {
  return {
    name: 'FIRST RIFF',
    bpm: 120,
    steps: Array.from({ length: 6 }, () => Array<RiffCell>(stepCount).fill(0)),
  }
}
