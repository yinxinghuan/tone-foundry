import type { BuildConfig, BuildPlatform, BuildStage } from '../gameplay/buildRun'
import { ModularGuitarPreview as GuitarPreview } from './ModularGuitarPreview'

interface Props {
  platform: BuildPlatform
  config: BuildConfig
  stage: BuildStage
  stageIndex: number
  focusing: boolean
  trialing: boolean
}

export function AssemblyGuitarPreview({ platform, config, stage, stageIndex, focusing, trialing }: Props) {
  const classes = [
    'tfrun-assembly',
    focusing ? 'is-focusing' : '',
    focusing ? `is-focus-${stage}` : '',
    stageIndex > 0 || (stage === 'body' && trialing) ? 'has-body' : '',
    stageIndex > 1 || (stage === 'neck' && trialing) ? 'has-neck' : '',
    stageIndex > 2 || (stage === 'pickups' && trialing) ? 'has-pickups' : '',
    stageIndex > 3 || (stage === 'bridge' && trialing) ? 'has-bridge' : '',
    stage === 'finish' && trialing ? 'has-finish' : '',
  ].filter(Boolean).join(' ')

  return <div className={classes}>
    <div className="tfrun-assembly__ghost" aria-hidden="true"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-assembly__material"><GuitarPreview platform={platform} config={config} /></div>
    <div className="tfrun-assembly__reticle" aria-hidden="true"><i /><i /><i /><i /></div>
  </div>
}
