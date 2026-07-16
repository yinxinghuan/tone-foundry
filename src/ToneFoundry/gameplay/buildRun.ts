import {
  BODY_BRIDGES,
  BODY_PICKUPS,
  MODULAR_PRESETS,
  type ModularBoltOnConfig,
} from '../guitar-system/modularBoltOnPlatform'
import {
  MODULAR_SET_PRESETS,
  SET_BODY_BRIDGES,
  SET_BODY_PICKUPS,
  type ModularSetNeckConfig,
} from '../guitar-system/modularSetNeckPlatform'

export type BuildPlatform = 'bolt-on' | 'set-neck'
export type BuildStage = 'body' | 'neck' | 'pickups' | 'bridge' | 'finish'
export type BuildGrade = 'workshop' | 'select' | 'archive'
export type BuildConfig = ModularBoltOnConfig | ModularSetNeckConfig

export interface PartOffer {
  id: string
  part: string
  grade: BuildGrade
  serial: string
}

export interface CompletedBuild {
  id: string
  platform: BuildPlatform
  config: BuildConfig
  grades: Partial<Record<BuildStage, BuildGrade>>
  rarityScore: number
  createdAt: number
}

export const BUILD_STAGES: BuildStage[] = ['body', 'neck', 'pickups', 'bridge', 'finish']
export const GRADE_SCORE: Record<BuildGrade, number> = { workshop: 1, select: 3, archive: 8 }

function randomUnit(): number {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0] / 0x100000000
}

function randomIndex(length: number): number {
  return Math.min(length - 1, Math.floor(randomUnit() * length))
}

function shuffle<T>(values: T[]): T[] {
  const next = [...values]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1)
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

function drawGrade(): BuildGrade {
  const roll = randomUnit()
  if (roll < 0.05) return 'archive'
  if (roll < 0.32) return 'select'
  return 'workshop'
}

export function createRunSeed(): { id: string; platform: BuildPlatform; config: BuildConfig } {
  const platform: BuildPlatform = randomUnit() < 0.5 ? 'bolt-on' : 'set-neck'
  const id = Array.from(crypto.getRandomValues(new Uint8Array(5))).map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
  return {
    id,
    platform,
    config: platform === 'bolt-on' ? { ...MODULAR_PRESETS[0].config } : { ...MODULAR_SET_PRESETS[0].config },
  }
}

function poolFor(stage: BuildStage, platform: BuildPlatform, config: BuildConfig): string[] {
  if (platform === 'bolt-on') {
    const bolt = config as ModularBoltOnConfig
    if (stage === 'body') return ['slab', 'contour', 'offset']
    if (stage === 'neck') return ['maple-inline', 'rosewood-inline']
    if (stage === 'pickups') return BODY_PICKUPS[bolt.body]
    if (stage === 'bridge') return BODY_BRIDGES[bolt.body]
    return ['blonde', 'sunburst', 'black', 'surf']
  }
  const setNeck = config as ModularSetNeckConfig
  if (stage === 'body') return ['carved', 'centerblock', 'thin-horn']
  if (stage === 'neck') return ['dot-bound', 'trapezoid-bound']
  if (stage === 'pickups') return SET_BODY_PICKUPS[setNeck.body]
  if (stage === 'bridge') return SET_BODY_BRIDGES[setNeck.body]
  return ['cherry', 'gold', 'ebony', 'natural']
}

export function isOfferCompatible(stage: BuildStage, platform: BuildPlatform, config: BuildConfig, part: string): boolean {
  return poolFor(stage, platform, config).includes(part)
}

export function drawOffers(stage: BuildStage, platform: BuildPlatform, config: BuildConfig, runId: string): PartOffer[] {
  const pool = poolFor(stage, platform, config)
  const target = stage === 'body' ? 3 : stage === 'neck' ? 2 : Math.min(3, Math.max(2, pool.length))
  const parts = pool.length >= target
    ? shuffle(pool).slice(0, target)
    : Array.from({ length: target }, (_, index) => pool[index % pool.length])
  const forcedGrades: BuildGrade[] = ['workshop', 'select', 'archive']
  return parts.map((part, index) => ({
    id: `${runId}-${stage}-${index}-${part}`,
    part,
    grade: pool.length === 1 ? forcedGrades[index] : drawGrade(),
    serial: `${stage.slice(0, 2).toUpperCase()}-${runId.slice(-4)}-${String(index + 1).padStart(2, '0')}`,
  }))
}

export function applyOffer(config: BuildConfig, stage: BuildStage, offer: PartOffer): BuildConfig {
  const next = { ...config, [stage]: offer.part } as BuildConfig
  if (stage === 'body' && 'body' in next) {
    if (offer.part === 'slab' || offer.part === 'contour' || offer.part === 'offset') {
      const bolt = next as ModularBoltOnConfig
      return {
        ...bolt,
        pickups: BODY_PICKUPS[bolt.body].includes(bolt.pickups) ? bolt.pickups : BODY_PICKUPS[bolt.body][0],
        bridge: BODY_BRIDGES[bolt.body].includes(bolt.bridge) ? bolt.bridge : BODY_BRIDGES[bolt.body][0],
      }
    }
    const setNeck = next as ModularSetNeckConfig
    return {
      ...setNeck,
      pickups: SET_BODY_PICKUPS[setNeck.body].includes(setNeck.pickups) ? setNeck.pickups : SET_BODY_PICKUPS[setNeck.body][0],
      bridge: SET_BODY_BRIDGES[setNeck.body].includes(setNeck.bridge) ? setNeck.bridge : SET_BODY_BRIDGES[setNeck.body][0],
    }
  }
  return next
}

export function finishBuild(id: string, platform: BuildPlatform, config: BuildConfig, grades: Partial<Record<BuildStage, BuildGrade>>): CompletedBuild {
  return {
    id: `TF-${id}`,
    platform,
    config: { ...config },
    grades: { ...grades },
    rarityScore: BUILD_STAGES.reduce((total, stage) => total + GRADE_SCORE[grades[stage] ?? 'workshop'], 0),
    createdAt: Date.now(),
  }
}
