export type ModularAcousticBodyId = 'grand-concert' | 'grand-auditorium' | 'dreadnought' | 'super-jumbo'
export type ModularAcousticNeckId = 'mahogany-open-gear' | 'maple-open-gear' | 'slotted-12'
export type ModularAcousticPickupId = 'pure-acoustic' | 'undersaddle' | 'soundhole-magnetic' | 'contact-transducer'
export type ModularAcousticBridgeId = 'belly-pins' | 'straight-pins' | 'moustache-pins'
export type ModularAcousticFinishId = 'natural-spruce' | 'aged-amber' | 'tobacco-burst' | 'koa-gloss' | 'mahogany-satin' | 'ebony-top'

export interface ModularAcousticConfig {
  body: ModularAcousticBodyId
  neck: ModularAcousticNeckId
  pickups: ModularAcousticPickupId
  bridge: ModularAcousticBridgeId
  finish: ModularAcousticFinishId
}

export const ACOUSTIC_BODY_BRIDGES: Record<ModularAcousticBodyId, ModularAcousticBridgeId[]> = {
  'grand-concert': ['straight-pins', 'belly-pins'],
  'grand-auditorium': ['belly-pins', 'straight-pins'],
  dreadnought: ['belly-pins', 'straight-pins'],
  'super-jumbo': ['moustache-pins', 'belly-pins'],
}

export const ACOUSTIC_BODY_PICKUPS: Record<ModularAcousticBodyId, ModularAcousticPickupId[]> = {
  'grand-concert': ['pure-acoustic', 'undersaddle', 'contact-transducer'],
  'grand-auditorium': ['pure-acoustic', 'undersaddle', 'soundhole-magnetic', 'contact-transducer'],
  dreadnought: ['pure-acoustic', 'undersaddle', 'soundhole-magnetic'],
  'super-jumbo': ['pure-acoustic', 'undersaddle', 'contact-transducer'],
}

export const MODULAR_ACOUSTIC_FINISHES: Record<ModularAcousticFinishId, { label: string; center: string; mid: string; edge: string; side: string; binding: string; grain: string; guard: string; gloss: number }> = {
  'natural-spruce': { label: 'Natural spruce', center: '#f2c978', mid: '#d89243', edge: '#8a461f', side: '#5b2d20', binding: '#f7dfaa', grain: '#8f4e23', guard: '#4b241a', gloss: .25 },
  'aged-amber': { label: 'Aged amber', center: '#f0b74e', mid: '#b76627', edge: '#66301d', side: '#4d241b', binding: '#e7c77e', grain: '#6e311b', guard: '#3d2119', gloss: .36 },
  'tobacco-burst': { label: 'Tobacco burst', center: '#e7a646', mid: '#91431d', edge: '#251512', side: '#392019', binding: '#d6b46d', grain: '#6d2c18', guard: '#251715', gloss: .43 },
  'koa-gloss': { label: 'Curly koa gloss', center: '#d88836', mid: '#8a391d', edge: '#432016', side: '#351a16', binding: '#e6bc66', grain: '#f2bb68', guard: '#2c1713', gloss: .58 },
  'mahogany-satin': { label: 'Mahogany satin', center: '#a14a29', mid: '#6e2e1e', edge: '#321814', side: '#281411', binding: '#c6975a', grain: '#e0925c', guard: '#241411', gloss: .14 },
  'ebony-top': { label: 'Ebony top', center: '#3e3631', mid: '#201b19', edge: '#0e0d0c', side: '#1d1512', binding: '#e7d3a3', grain: '#958172', guard: '#0a0909', gloss: .42 },
}

export const MODULAR_ACOUSTIC_PRESETS: Array<{ id: string; era: string; name: { zh: string; en: string }; config: ModularAcousticConfig }> = [
  { id: 'parlor-sunroom', era: '1930s · small room', name: { zh: '午后小厅', en: 'Sunroom Parlor' }, config: { body: 'grand-concert', neck: 'mahogany-open-gear', pickups: 'pure-acoustic', bridge: 'straight-pins', finish: 'koa-gloss' } },
  { id: 'auditorium-session', era: 'modern · balanced', name: { zh: '均衡录音室', en: 'Balanced Session' }, config: { body: 'grand-auditorium', neck: 'maple-open-gear', pickups: 'undersaddle', bridge: 'belly-pins', finish: 'aged-amber' } },
  { id: 'dreadnought-workhorse', era: '1940s · projection', name: { zh: '旧日投射', en: 'Open Road Dread' }, config: { body: 'dreadnought', neck: 'mahogany-open-gear', pickups: 'soundhole-magnetic', bridge: 'belly-pins', finish: 'natural-spruce' } },
  { id: 'jumbo-stage', era: '1950s · stage', name: { zh: '日落巨箱', en: 'Sunset Jumbo' }, config: { body: 'super-jumbo', neck: 'mahogany-open-gear', pickups: 'contact-transducer', bridge: 'moustache-pins', finish: 'tobacco-burst' } },
  { id: 'ebony-night', era: 'archive · midnight', name: { zh: '黑檀夜曲', en: 'Ebony Night' }, config: { body: 'grand-auditorium', neck: 'maple-open-gear', pickups: 'undersaddle', bridge: 'straight-pins', finish: 'ebony-top' } },
  { id: 'satin-voice', era: '1960s · folk', name: { zh: '桃花心民谣', en: 'Satin Folk Voice' }, config: { body: 'dreadnought', neck: 'mahogany-open-gear', pickups: 'pure-acoustic', bridge: 'belly-pins', finish: 'mahogany-satin' } },
]
