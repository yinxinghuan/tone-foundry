import { mkdir, writeFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { GUITARS } from '../src/ToneFoundry/catalog'
import {
  CenterblockSemiGuitarSvg,
  ConcertNylonGuitarSvg,
  ContourSssGuitarSvg,
  ThinDoubleHornGuitarSvg,
} from '../src/ToneFoundry/components/AdditionalCalibrationMastersSvg'

const output = new URL('../_qa/svg/', import.meta.url)
await mkdir(output, { recursive: true })

const renderers = {
  'contour-sss': ContourSssGuitarSvg,
  'centerblock-semi': CenterblockSemiGuitarSvg,
  'thin-double-horn': ThinDoubleHornGuitarSvg,
  'concert-nylon': ConcertNylonGuitarSvg,
} as const

for (const [id, Component] of Object.entries(renderers)) {
  const guitar = GUITARS.find((entry) => entry.id === id)
  if (!guitar) throw new Error(`Missing guitar ${id}`)
  const markup = renderToStaticMarkup(<Component guitar={guitar} onPluck={() => undefined} />)
  await writeFile(new URL(`${id}.svg`, output), `<?xml version="1.0" encoding="UTF-8"?>${markup}`)
}
