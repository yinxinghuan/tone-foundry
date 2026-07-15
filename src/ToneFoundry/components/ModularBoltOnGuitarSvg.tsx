import { useId } from 'react'
import {
  MODULAR_BOLT_ON_GEOMETRY as GEO,
  MODULAR_FINISHES,
  type ModularBoltOnConfig,
} from '../guitar-system/modularBoltOnPlatform'
import { ModularBoltOnBodySvg } from './modules/ModularBoltOnBodySvg'
import { ModularBoltOnHardwareSvg } from './modules/ModularBoltOnHardwareSvg'
import { ModularBoltOnNeckSvg } from './modules/ModularBoltOnNeckSvg'

export function ModularBoltOnGuitarSvg({ config, showAnchors = false }: { config: ModularBoltOnConfig; showAnchors?: boolean }) {
  const rawId = useId()
  const prefix = `tf-modular-${rawId.replace(/:/g, '')}`
  const finish = MODULAR_FINISHES[config.finish]
  return (
    <svg className="tf-guitar tf-guitar--modular" viewBox={GEO.viewBox} role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`}>
      <title id={`${prefix}-title`}>Modular 25.5 inch bolt-on guitar</title>
      <desc id={`${prefix}-desc`}>{`${config.body} body, ${config.neck} neck, ${config.pickups} pickup pack, ${config.bridge} bridge and ${config.finish} finish`}</desc>
      <defs>
        <radialGradient id={`${prefix}-body-top`} cx="44%" cy="43%" r="68%"><stop stopColor={finish.top} /><stop offset=".55" stopColor={finish.mid} /><stop offset="1" stopColor={finish.edge} /></radialGradient>
        <linearGradient id={`${prefix}-body-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={finish.top} /><stop offset=".5" stopColor={finish.edge} /><stop offset="1" stopColor="#1a100c" /></linearGradient>
        <linearGradient id={`${prefix}-body-side`} x1="180" y1="650" x2="460" y2="1090" gradientUnits="userSpaceOnUse"><stop stopColor={finish.side} /><stop offset="1" stopColor="#170f0c" /></linearGradient>
        <linearGradient id={`${prefix}-maple`} x1="260" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#9f6937" /><stop offset=".18" stopColor="#d9a55f" /><stop offset=".52" stopColor="#e9bd75" /><stop offset=".82" stopColor="#c68c4c" /><stop offset="1" stopColor="#80502e" /></linearGradient>
        <linearGradient id={`${prefix}-maple-board`} x1="275" y1="0" x2="325" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#c88e4e" /><stop offset=".5" stopColor="#e1b36f" /><stop offset="1" stopColor="#b8783f" /></linearGradient>
        <linearGradient id={`${prefix}-rosewood`} x1="275" y1="0" x2="325" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#241615" /><stop offset=".25" stopColor="#4d2c27" /><stop offset=".58" stopColor="#35201d" /><stop offset="1" stopColor="#1c1211" /></linearGradient>
        <linearGradient id={`${prefix}-guard`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={finish.guard === '#171615' ? '#302f2c' : '#f4ecd8'} /><stop offset=".55" stopColor={finish.guard} /><stop offset="1" stopColor={finish.guard === '#171615' ? '#090909' : '#a89e87'} /></linearGradient>
        <linearGradient id={`${prefix}-nickel`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#585b57" /><stop offset=".2" stopColor="#e3e1d8" /><stop offset=".43" stopColor="#929590" /><stop offset=".69" stopColor="#f0ece3" /><stop offset="1" stopColor="#555853" /></linearGradient>
        <linearGradient id={`${prefix}-fret`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f2efe7" /><stop offset=".5" stopColor="#999b96" /><stop offset="1" stopColor="#51544f" /></linearGradient>
        <linearGradient id={`${prefix}-brass`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f0c760" /><stop offset=".46" stopColor="#b7842f" /><stop offset="1" stopColor="#69491c" /></linearGradient>
        <radialGradient id={`${prefix}-knob`} cx="35%" cy="28%"><stop stopColor="#f1eee6" /><stop offset=".35" stopColor="#a7aaa5" /><stop offset="1" stopColor="#565954" /></radialGradient>
        <radialGradient id={`${prefix}-shadow`}><stop stopColor="#000" stopOpacity=".52" /><stop offset=".58" stopColor="#000" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>

      <ModularBoltOnBodySvg prefix={prefix} body={config.body} />
      <ModularBoltOnNeckSvg prefix={prefix} neck={config.neck} />
      <ModularBoltOnHardwareSvg prefix={prefix} body={config.body} pickups={config.pickups} bridge={config.bridge} />
      <g className="tf-guitar__strings" data-guitar-module="shared-six-string-path">
        {GEO.bridgeX.map((bridgeX, index) => {
          const [tx, ty] = GEO.tunerPoints[index]
          return <g key={bridgeX}><path d={`M${bridgeX} 964 L${bridgeX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke="#17120f" strokeWidth={2.3-index*.15} opacity=".24" transform="translate(1.1 1.2)" /><path d={`M${bridgeX} 964 L${bridgeX} ${GEO.saddleY} L${GEO.nutX[index]} ${GEO.nutY} L${tx} ${ty}`} fill="none" stroke={index < 3 ? '#858075' : '#bab4a8'} strokeWidth={1.8-index*.15} /></g>
        })}
      </g>

      {showAnchors && <g className="tf-modular-anchors" aria-hidden="true">
        {[
          { y: GEO.nutY, label: 'NUT' },
          { y: GEO.neckPocketY, label: 'POCKET' },
          { y: GEO.saddleY, label: 'SADDLE' },
        ].map(({ y, label }) => <g key={label}><path d={`M85 ${y} H515`} stroke="#e5b85c" strokeWidth=".8" strokeDasharray="4 6" opacity=".48" vectorEffect="non-scaling-stroke" /><circle cx="300" cy={y} r="4.2" fill="#e5b85c" stroke="#22170e" strokeWidth="1" /><text x="505" y={y - 7} textAnchor="end" fill="#d5a950" fontSize="10" fontFamily="monospace" letterSpacing="1.2">{label}</text></g>)}
      </g>}
    </svg>
  )
}
