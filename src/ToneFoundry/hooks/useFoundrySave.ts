import { useEffect, useState } from 'react'
import { useGameSave } from '@shared/save'
import type { CompletedBuild } from '../gameplay/buildRun'
import { EMPTY_SAVE, type PublishedGuitar, type ToneFoundrySave } from '../gameplay/save'

export function useFoundrySave() {
  const { savedData, persist, loaded } = useGameSave<ToneFoundrySave>('tone-foundry')
  // useGameSave.savedData does not echo persist() calls. This local mirror is
  // the only read/write source after the one-time initial seed.
  const [mirror, setMirror] = useState<ToneFoundrySave | undefined>(undefined)

  useEffect(() => {
    if (mirror === undefined && savedData !== undefined) {
      // Older published saves predate likes. Normalize once at the boundary so
      // every later read-modify-write preserves the new field.
      setMirror({
        ...EMPTY_SAVE,
        ...(savedData ?? EMPTY_SAVE),
        collection: savedData?.collection ?? [],
        published: savedData?.published ?? [],
        likedGuitarIds: savedData?.likedGuitarIds ?? [],
      })
    }
  }, [mirror, savedData])

  const commit = (next: ToneFoundrySave) => {
    setMirror(next)
    persist(next)
  }

  const saveBuild = (build: CompletedBuild) => {
    if (!mirror || mirror.collection.some((item) => item.id === build.id)) return
    commit({ ...mirror, collection: [build, ...mirror.collection].slice(0, 24) })
  }

  const publish = (guitar: PublishedGuitar) => {
    if (!mirror) return
    const withoutDuplicate = mirror.published.filter((item) => item.id !== guitar.id)
    commit({
      ...mirror,
      collection: mirror.collection.some((item) => item.id === guitar.id)
        ? mirror.collection
        : [guitar, ...mirror.collection].slice(0, 24),
      published: [guitar, ...withoutDuplicate].slice(0, 20),
    })
  }

  const toggleLike = (guitarId: string) => {
    if (!mirror) return
    const liked = mirror.likedGuitarIds ?? []
    commit({ ...mirror, likedGuitarIds: liked.includes(guitarId) ? liked.filter((id) => id !== guitarId) : [...liked, guitarId] })
  }

  return {
    ready: loaded && mirror !== undefined,
    collection: mirror?.collection ?? [],
    published: mirror?.published ?? [],
    likedGuitarIds: mirror?.likedGuitarIds ?? [],
    saveBuild,
    publish,
    toggleLike,
  }
}
