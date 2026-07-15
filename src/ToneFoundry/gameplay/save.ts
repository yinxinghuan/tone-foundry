import type { CompletedBuild } from './buildRun'

export type RiffCell = 0 | 1 | 2 | 3

export interface RiffPattern {
  name: string
  bpm: number
  steps: RiffCell[][]
}

export interface PublishedGuitar extends CompletedBuild {
  riff: RiffPattern
  publishedAt: number
}

export interface ToneFoundrySave {
  collection: CompletedBuild[]
  published: PublishedGuitar[]
  _lastActive?: number
}

export interface WallEntry {
  userId: string
  userName?: string
  userAvatarUrl?: string
  guitar: PublishedGuitar
}

export const EMPTY_SAVE: ToneFoundrySave = { collection: [], published: [] }

export function emptyRiff(): RiffPattern {
  return {
    name: 'FIRST RIFF',
    bpm: 120,
    steps: Array.from({ length: 6 }, () => Array<RiffCell>(16).fill(0)),
  }
}
