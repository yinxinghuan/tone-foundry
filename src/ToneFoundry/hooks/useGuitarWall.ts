import { useCallback, useEffect, useState } from 'react'
import { callAigramAPI, isInAigram, telegramId, type AigramResponse } from '@shared/runtime'
import { getGameUuid } from '@shared/runtime/game-id'
import type { ToneFoundrySave, WallEntry } from '../gameplay/save'

interface SaveRow {
  user_id: string
  resource_data?: string
}

export function useGuitarWall() {
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [nonce, setNonce] = useState(0)
  const refresh = useCallback(() => setNonce((value) => value + 1), [])

  useEffect(() => {
    const sessionId = getGameUuid()
    if (!isInAigram || !sessionId) {
      setLoaded(true)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const response = await callAigramAPI<AigramResponse<SaveRow[]>>(
          `/note/aigram/ai/game/get/data/list?session_id=${encodeURIComponent(sessionId)}`,
          'GET',
        )
        const rows = Array.isArray(response?.data) ? response.data : []
        const pairs: Array<{ userId: string; guitar: ToneFoundrySave['published'][number] }> = []
        const remoteLikes = new Map<string, number>()
        for (const row of rows) {
          if (!row.user_id || !row.resource_data) continue
          try {
            const save = JSON.parse(row.resource_data) as ToneFoundrySave
            if (row.user_id !== String(telegramId ?? '')) {
              for (const guitarId of new Set(save.likedGuitarIds ?? [])) remoteLikes.set(guitarId, (remoteLikes.get(guitarId) ?? 0) + 1)
            }
            // Flatten the complete archive for every visible author. Taking
            // published[0] here would silently erase each author's history.
            for (const guitar of save.published || []) {
              if (guitar?.id && guitar?.config) pairs.push({ userId: row.user_id, guitar })
            }
          } catch { /* skip corrupt saves */ }
        }
        pairs.sort((a, b) => b.guitar.publishedAt - a.guitar.publishedAt)
        const limited = pairs.slice(0, 36)
        const ids = [...new Set(limited.map((pair) => pair.userId))]
        const profiles = await Promise.all(ids.map(async (userId) => {
          try {
            const profile = await callAigramAPI<AigramResponse<{ name?: string; head_url?: string }>>(
              `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(userId)}`,
              'GET',
            )
            return [userId, profile?.data ?? null] as const
          } catch {
            return [userId, null] as const
          }
        }))
        const profileMap = new Map(profiles)
        if (!cancelled) setEntries(limited.map(({ userId, guitar }) => {
          const profile = profileMap.get(userId)
          return { userId, userName: profile?.name, userAvatarUrl: profile?.head_url, guitar, likeCount: remoteLikes.get(guitar.id) ?? 0 }
        }))
      } catch {
        if (!cancelled) setEntries([])
      } finally {
        if (!cancelled) setLoaded(true)
      }
    })()
    return () => { cancelled = true }
  }, [nonce])

  return { entries, loaded, refresh }
}
