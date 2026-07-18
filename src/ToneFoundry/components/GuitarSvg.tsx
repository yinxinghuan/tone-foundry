import type { GuitarSpec } from '../types'
import { WorkshopGuitarSvg } from './WorkshopGuitarSvg'
import { CarvedCrownGuitarSvg } from './CarvedCrownGuitarSvg'
import { OffsetCurrentGuitarSvg } from './OffsetCurrentGuitarSvg'
import { AcousticDreadnoughtGuitarSvg } from './AcousticDreadnoughtGuitarSvg'
import { ModularAcousticGuitarSvg } from './ModularAcousticGuitarSvg'
import {
  CenterblockSemiGuitarSvg,
  ConcertNylonGuitarSvg,
  ContourSssGuitarSvg,
  ThinDoubleHornGuitarSvg,
} from './AdditionalCalibrationMastersSvg'

interface GuitarSvgProps {
  guitar: GuitarSpec
  onPluck: (stringIndex: number) => void
}

export function GuitarSvg({ guitar, onPluck }: GuitarSvgProps) {
  if (guitar.id === 'workshop-slab') return <WorkshopGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'carved-crown') return <CarvedCrownGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'offset-current') return <OffsetCurrentGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'timber-dreadnought') return <AcousticDreadnoughtGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'grand-concert-koa') return <ModularAcousticGuitarSvg guitarName={guitar.name.en} onPluck={onPluck} config={{ body: 'grand-concert', neck: 'mahogany-open-gear', pickups: 'pure-acoustic', bridge: 'straight-pins', finish: 'koa-gloss' }} />
  if (guitar.id === 'grand-auditorium') return <ModularAcousticGuitarSvg guitarName={guitar.name.en} onPluck={onPluck} config={{ body: 'grand-auditorium', neck: 'maple-open-gear', pickups: 'undersaddle', bridge: 'belly-pins', finish: 'aged-amber' }} />
  if (guitar.id === 'sunburst-jumbo') return <ModularAcousticGuitarSvg guitarName={guitar.name.en} onPluck={onPluck} config={{ body: 'super-jumbo', neck: 'mahogany-open-gear', pickups: 'contact-transducer', bridge: 'moustache-pins', finish: 'tobacco-burst' }} />
  if (guitar.id === 'contour-sss') return <ContourSssGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'centerblock-semi') return <CenterblockSemiGuitarSvg guitar={guitar} onPluck={onPluck} />
  if (guitar.id === 'thin-double-horn') return <ThinDoubleHornGuitarSvg guitar={guitar} onPluck={onPluck} />
  return <ConcertNylonGuitarSvg guitar={guitar} onPluck={onPluck} />
}
