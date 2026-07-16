import { GUITARS } from '../catalog'
import type { GuitarSpec, ToneMetric } from '../types'
import type { BuildConfig, BuildPlatform } from './buildRun'

type SynthKey = keyof GuitarSpec['synthesis']
type Deltas = Partial<Record<SynthKey, number>>

const PART_DELTAS: Record<string, Deltas> = {
  'maple-inline': { brightness:.07, pickupPosition:.04 }, 'rosewood-inline': { brightness:-.04, damping:.04, bodyResonance:.03 },
  'dot-bound': { brightness:.02, room:.02 }, 'trapezoid-bound': { damping:.05, bodyResonance:.04 },
  'dual-single': { brightness:.07, pickupPosition:.08, output:-.04 }, sss: { brightness:.1, pickupPosition:.06, output:-.06 },
  hss: { brightness:.03, output:.1, drive:.12 }, 'wide-dual': { brightness:.01, bodyResonance:.06, room:.1 },
  'covered-humbuckers': { brightness:-.08, damping:.06, output:.12, drive:.1 }, 'soapbar-p90': { brightness:.04, output:.07, drive:.06 },
  'mini-humbuckers': { brightness:.08, pickupPosition:.05, output:.04 },
  'three-saddle': { brightness:.05, damping:-.05, bodyResonance:-.03 }, tremolo: { damping:.01, room:.05 },
  hardtail: { damping:.07, bodyResonance:.03 }, floating: { brightness:.03, damping:.02, room:.16 },
  stopbar: { damping:.09, output:.04 }, trapeze: { damping:-.02, bodyResonance:.06, room:.14 }, 'short-vibrola': { brightness:.02, room:.1 },
  blonde: { brightness:.03, bodyResonance:.02 }, sunburst: { brightness:-.02, damping:.03 }, black: { brightness:-.04, damping:.04 }, surf: { room:.04 },
  cherry: { bodyResonance:.04, damping:.02 }, gold: { brightness:-.03, drive:.03 }, ebony: { brightness:-.05, damping:.05 }, natural: { brightness:.04, bodyResonance:.04 },
}

const clamp01 = (value:number) => Math.max(.04,Math.min(.98,value))
const clamp100 = (value:number) => Math.max(0,Math.min(100,Math.round(value)))

function baseId(platform:BuildPlatform,body:string):GuitarSpec['id'] {
  if (platform==='bolt-on') return body==='contour'?'contour-sss':body==='offset'?'offset-current':'workshop-slab'
  return body==='centerblock'?'centerblock-semi':body==='thin-horn'?'thin-double-horn':'carved-crown'
}

export function guitarFromBuild(platform:BuildPlatform,config:BuildConfig):GuitarSpec {
  const base=GUITARS.find((guitar)=>guitar.id===baseId(platform,config.body)) ?? GUITARS[0]
  const synthesis={...base.synthesis}
  for (const part of [config.neck,config.pickups,config.bridge,config.finish]) {
    const deltas=PART_DELTAS[part] ?? {}
    for (const key of Object.keys(deltas) as SynthKey[]) synthesis[key]=clamp01(synthesis[key]+(deltas[key] ?? 0))
  }
  const tone:Record<ToneMetric,number>={
    warmth:clamp100((1-synthesis.brightness)*62+synthesis.bodyResonance*46),
    brightness:clamp100(synthesis.brightness*100),
    attack:clamp100((synthesis.pickupPosition*.62+synthesis.brightness*.38)*100),
    sustain:clamp100(synthesis.damping*100),
    drive:clamp100((synthesis.drive*.7+synthesis.output*.3)*100),
    space:clamp100(synthesis.room*100),
  }
  return {...base,tone,synthesis}
}
