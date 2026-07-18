export type GuitarId =
  | 'workshop-slab'
  | 'carved-crown'
  | 'offset-current'
  | 'timber-dreadnought'
  | 'grand-concert-koa'
  | 'grand-auditorium'
  | 'sunburst-jumbo'
  | 'contour-sss'
  | 'centerblock-semi'
  | 'thin-double-horn'
  | 'concert-nylon'
export type AmpChannel = 'clean' | 'drive'

export type ToneMetric = 'warmth' | 'brightness' | 'attack' | 'sustain' | 'drive' | 'space'

export interface GuitarSpec {
  id: GuitarId
  name: { zh: string; en: string }
  family: { zh: string; en: string }
  year: string
  serial: string
  tags: { zh: string[]; en: string[] }
  note: { zh: string; en: string }
  colors: {
    body: string
    edge: string
    accent: string
    guard: string
    metal: string
  }
  tone: Record<ToneMetric, number>
  synthesis: {
    brightness: number
    damping: number
    bodyResonance: number
    pickupPosition: number
    output: number
    room: number
    drive: number
  }
}
