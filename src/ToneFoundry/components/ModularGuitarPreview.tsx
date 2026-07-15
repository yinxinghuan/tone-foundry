import type { BuildConfig, BuildPlatform } from '../gameplay/buildRun'
import type { ModularBoltOnConfig } from '../guitar-system/modularBoltOnPlatform'
import type { ModularSetNeckConfig } from '../guitar-system/modularSetNeckPlatform'
import { ModularBoltOnGuitarSvg } from './ModularBoltOnGuitarSvg'
import { ModularSetNeckGuitarSvg } from './ModularSetNeckGuitarSvg'

export function ModularGuitarPreview({ platform, config }: { platform: BuildPlatform; config: BuildConfig }) {
  return platform === 'bolt-on'
    ? <ModularBoltOnGuitarSvg config={config as ModularBoltOnConfig} />
    : <ModularSetNeckGuitarSvg config={config as ModularSetNeckConfig} />
}
