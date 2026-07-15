import { mkdir, writeFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ModularSetNeckGuitarSvg } from '../src/ToneFoundry/components/ModularSetNeckGuitarSvg'
import { MODULAR_SET_PRESETS } from '../src/ToneFoundry/guitar-system/modularSetNeckPlatform'

const output = new URL('../_qa/set-neck/', import.meta.url)
await mkdir(output, { recursive: true })

for (const preset of MODULAR_SET_PRESETS) {
  const markup = renderToStaticMarkup(<ModularSetNeckGuitarSvg config={preset.config} />)
  await writeFile(new URL(`${preset.id}.svg`, output), `<?xml version="1.0" encoding="UTF-8"?>${markup}`)
}
