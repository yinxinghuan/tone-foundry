import { useMemo, useState } from 'react'
import {
  BODY_BRIDGES,
  BODY_PICKUPS,
  MODULAR_PRESETS,
  type ModularBodyId,
  type ModularBoltOnConfig,
  type ModularBridgeId,
  type ModularFinishId,
  type ModularNeckId,
  type ModularPickupId,
} from '../guitar-system/modularBoltOnPlatform'
import {
  MODULAR_SET_PRESETS,
  SET_BODY_BRIDGES,
  SET_BODY_PICKUPS,
  type ModularSetBodyId,
  type ModularSetBridgeId,
  type ModularSetFinishId,
  type ModularSetNeckConfig,
  type ModularSetNeckId,
  type ModularSetPickupId,
} from '../guitar-system/modularSetNeckPlatform'
import {
  ACOUSTIC_BODY_BRIDGES,
  ACOUSTIC_BODY_PICKUPS,
  MODULAR_ACOUSTIC_PRESETS,
  type ModularAcousticBodyId,
  type ModularAcousticBridgeId,
  type ModularAcousticConfig,
  type ModularAcousticFinishId,
  type ModularAcousticNeckId,
  type ModularAcousticPickupId,
} from '../guitar-system/modularAcousticPlatform'
import { locale } from '../i18n'
import { ModularBoltOnGuitarSvg } from './ModularBoltOnGuitarSvg'
import { ModularSetNeckGuitarSvg } from './ModularSetNeckGuitarSvg'
import { ModularAcousticGuitarSvg } from './ModularAcousticGuitarSvg'
import './AssemblyLab.less'

type PlatformId = 'bolt-on' | 'set-neck' | 'acoustic'
type SlotId = 'body' | 'neck' | 'pickups' | 'bridge' | 'finish'
type PanelMode = 'parts' | 'recipes'

const copy = {
  zh: {
    brand: 'TONE FOUNDRY / CUSTOM DEPT.', order: '制琴工单', station: '装配工位 02',
    socket: '25.5 英寸螺栓颈', setSocket: '24.75 英寸胶合颈', acousticSocket: '25.4 英寸原声平面板',
    boltPlatform: '25.5 / BOLT-ON', setPlatform: '24.75 / SET-NECK', acousticPlatform: '25.4 / ACOUSTIC',
    platform: '结构平台', parts: '零件抽屉', recipes: '文化配方', mounted: '已装配', mismatch: '不兼容',
    instruction: '选择一个真实兼容部件，吉他会在原位重新装配。',
    body: '琴体', neck: '琴颈', pickups: '拾音器', bridge: '琴桥', finish: '饰面',
    bodies: { slab: '板式单切', contour: '轮廓双切', offset: '偏移琴体', thinline: '薄空心单切', reverse: '反向偏移' },
    necks: { 'maple-inline': '一体枫木六联', 'rosewood-inline': '深色指板六联' },
    pickupPacks: { 'dual-single': '双单线圈', sss: 'SSS 三单', hss: 'HSS 热改', 'wide-dual': '双宽单线圈' },
    bridges: { 'three-saddle': '三鞍桥板', tremolo: '同步颤音', hardtail: '六鞍硬尾', floating: '浮动颤音' },
    finishes: { blonde: '陈年金黄', sunburst: '三色渐变', black: '旧黑', surf: '海玻璃绿', copper: '铜火金属漆', ice: '冰蓝金属漆', walnut: '透明胡桃', ivory: '旧象牙' },
    setBodies: { carved: '雕面单切', centerblock: '中心块半空心', 'thin-horn': '薄双角', 'v-wing': 'V 翼实心', angular: '前卫角型', archtop: '全空心拱面' },
    setNecks: { 'dot-bound': '圆点包边指板', 'trapezoid-bound': '梯形包边指板' },
    setPickupPacks: { 'covered-humbuckers': '双封闭线圈', 'soapbar-p90': '双皂条单线圈', 'mini-humbuckers': '双迷你线圈' },
    setBridges: { stopbar: '止弦尾件', trapeze: '梯形尾件', 'short-vibrola': '短板颤音' },
    setFinishes: { cherry: '深樱桃红', gold: '陈年金色', ebony: '黑檀漆面', natural: '自然枫木', wine: '酒红漆', silver: '银雾金属漆', tobacco: '烟草渐变', cream: '奶油旧漆' },
    acousticBodies: { 'grand-concert': '小型音乐会', 'grand-auditorium': '大礼堂', dreadnought: '十四品无畏', 'super-jumbo': '超级巨箱' },
    acousticNecks: { 'mahogany-open-gear': '桃花心木开放弦钮', 'maple-open-gear': '枫木开放弦钮', 'slotted-12': '十二品开槽琴头' },
    acousticPickupPacks: { 'pure-acoustic': '纯原声', undersaddle: '下弦枕拾音', 'soundhole-magnetic': '音孔磁拾音', 'contact-transducer': '面板接触式' },
    acousticBridges: { 'belly-pins': '腰形弦钉桥', 'straight-pins': '直式弦钉桥', 'moustache-pins': '八字胡弦钉桥' },
    acousticFinishes: { 'natural-spruce': '天然云杉', 'aged-amber': '陈年琥珀', 'tobacco-burst': '烟草渐变', 'koa-gloss': '卷纹相思木亮漆', 'mahogany-satin': '桃花心木缎面', 'ebony-top': '黑檀面板' },
    combinations: '兼容组合', combinationValue: '320', setCombinationValue: '336', acousticCombinationValue: '348',
  },
  en: {
    brand: 'TONE FOUNDRY / CUSTOM DEPT.', order: 'BUILD ORDER', station: 'ASSEMBLY BAY 02',
    socket: '25.5 IN BOLT-ON', setSocket: '24.75 IN SET-NECK', acousticSocket: '25.4 IN ACOUSTIC FLAT-TOP',
    boltPlatform: '25.5 / BOLT-ON', setPlatform: '24.75 / SET-NECK', acousticPlatform: '25.4 / ACOUSTIC',
    platform: 'Construction', parts: 'Parts drawers', recipes: 'Culture recipes', mounted: 'Mounted', mismatch: 'Mismatch',
    instruction: 'Choose a physically compatible part. The guitar is rebuilt in place.',
    body: 'Body', neck: 'Neck', pickups: 'Pickups', bridge: 'Bridge', finish: 'Finish',
    bodies: { slab: 'Slab single-cut', contour: 'Contour double-cut', offset: 'Offset body', thinline: 'Thinline single-cut', reverse: 'Reverse offset' },
    necks: { 'maple-inline': 'One-piece maple inline', 'rosewood-inline': 'Dark-board inline' },
    pickupPacks: { 'dual-single': 'Dual single', sss: 'SSS triple', hss: 'HSS hot rod', 'wide-dual': 'Dual wide single' },
    bridges: { 'three-saddle': 'Three-saddle plate', tremolo: 'Synchronized trem', hardtail: 'Six-saddle hardtail', floating: 'Floating vibrato' },
    finishes: { blonde: 'Aged blonde', sunburst: 'Three-tone burst', black: 'Worn black', surf: 'Sea glass', copper: 'Copper fire metallic', ice: 'Ice blue metallic', walnut: 'Translucent walnut', ivory: 'Aged ivory' },
    setBodies: { carved: 'Carved single-cut', centerblock: 'Centerblock semi', 'thin-horn': 'Thin double-horn', 'v-wing': 'V-wing solid', angular: 'Angular solid', archtop: 'Full hollow archtop' },
    setNecks: { 'dot-bound': 'Bound dot board', 'trapezoid-bound': 'Bound trapezoid board' },
    setPickupPacks: { 'covered-humbuckers': 'Covered humbuckers', 'soapbar-p90': 'Soapbar singles', 'mini-humbuckers': 'Mini humbuckers' },
    setBridges: { stopbar: 'Stop bar', trapeze: 'Trapeze tail', 'short-vibrola': 'Short vibrola' },
    setFinishes: { cherry: 'Deep cherry', gold: 'Aged gold', ebony: 'Ebony lacquer', natural: 'Natural maple', wine: 'Wine nitro', silver: 'Silver mist metallic', tobacco: 'Tobacco burst', cream: 'Aged cream' },
    acousticBodies: { 'grand-concert': 'Grand concert', 'grand-auditorium': 'Grand auditorium', dreadnought: '14-fret dreadnought', 'super-jumbo': 'Super jumbo' },
    acousticNecks: { 'mahogany-open-gear': 'Mahogany open-gear', 'maple-open-gear': 'Maple open-gear', 'slotted-12': 'Slotted twelve-fret' },
    acousticPickupPacks: { 'pure-acoustic': 'Pure acoustic', undersaddle: 'Under-saddle', 'soundhole-magnetic': 'Soundhole magnetic', 'contact-transducer': 'Top contact' },
    acousticBridges: { 'belly-pins': 'Belly bridge', 'straight-pins': 'Straight bridge', 'moustache-pins': 'Moustache bridge' },
    acousticFinishes: { 'natural-spruce': 'Natural spruce', 'aged-amber': 'Aged amber', 'tobacco-burst': 'Tobacco burst', 'koa-gloss': 'Curly koa gloss', 'mahogany-satin': 'Mahogany satin', 'ebony-top': 'Ebony top' },
    combinations: 'Compatible builds', combinationValue: '320', setCombinationValue: '336', acousticCombinationValue: '348',
  },
} as const

const bodyIds: ModularBodyId[] = ['slab', 'contour', 'offset', 'thinline', 'reverse']
const neckIds: ModularNeckId[] = ['maple-inline', 'rosewood-inline']
const pickupIds: ModularPickupId[] = ['dual-single', 'sss', 'hss', 'wide-dual']
const bridgeIds: ModularBridgeId[] = ['three-saddle', 'tremolo', 'hardtail', 'floating']
const finishIds: ModularFinishId[] = ['blonde', 'sunburst', 'black', 'surf', 'copper', 'ice', 'walnut', 'ivory']
const setBodyIds: ModularSetBodyId[] = ['carved', 'centerblock', 'thin-horn', 'v-wing', 'angular', 'archtop']
const setNeckIds: ModularSetNeckId[] = ['dot-bound', 'trapezoid-bound']
const setPickupIds: ModularSetPickupId[] = ['covered-humbuckers', 'soapbar-p90', 'mini-humbuckers']
const setBridgeIds: ModularSetBridgeId[] = ['stopbar', 'trapeze', 'short-vibrola']
const setFinishIds: ModularSetFinishId[] = ['cherry', 'gold', 'ebony', 'natural', 'wine', 'silver', 'tobacco', 'cream']
const acousticBodyIds: ModularAcousticBodyId[] = ['grand-concert', 'grand-auditorium', 'dreadnought', 'super-jumbo']
const acousticNeckIds: ModularAcousticNeckId[] = ['mahogany-open-gear', 'maple-open-gear', 'slotted-12']
const acousticPickupIds: ModularAcousticPickupId[] = ['pure-acoustic', 'undersaddle', 'soundhole-magnetic', 'contact-transducer']
const acousticBridgeIds: ModularAcousticBridgeId[] = ['belly-pins', 'straight-pins', 'moustache-pins']
const acousticFinishIds: ModularAcousticFinishId[] = ['natural-spruce', 'aged-amber', 'tobacco-burst', 'koa-gloss', 'mahogany-satin', 'ebony-top']

function OptionTray<T extends string>({ code, values, selected, labels, onSelect, isDisabled }: {
  code: string; values: T[]; selected: T; labels: Record<T, string>; onSelect: (value: T) => void; isDisabled?: (value: T) => boolean
}) {
  const c = copy[locale]
  return <div className="tfb-options" role="group">{values.map((value, index) => {
    const disabled = isDisabled?.(value) ?? false
    const active = selected === value
    return <button key={value} type="button" className={active ? 'is-selected' : ''} onClick={() => onSelect(value)} disabled={disabled} aria-pressed={active}>
      <span className="tfb-options__number">{code}·{String(index + 1).padStart(2, '0')}</span>
      <b>{labels[value]}</b>
      <small>{disabled ? c.mismatch : active ? c.mounted : value}</small>
      <i aria-hidden="true" />
    </button>
  })}</div>
}

export function AssemblyLab() {
  const c = copy[locale]
  const [platform, setPlatform] = useState<PlatformId>('bolt-on')
  const [panelMode, setPanelMode] = useState<PanelMode>('parts')
  const [activeSlot, setActiveSlot] = useState<SlotId>('body')
  const [boltConfig, setBoltConfig] = useState<ModularBoltOnConfig>(MODULAR_PRESETS[0].config)
  const [setConfig, setSetConfig] = useState<ModularSetNeckConfig>(MODULAR_SET_PRESETS[0].config)
  const [acousticConfig, setAcousticConfig] = useState<ModularAcousticConfig>(MODULAR_ACOUSTIC_PRESETS[0].config)
  const activeConfig = platform === 'bolt-on' ? boltConfig : platform === 'set-neck' ? setConfig : acousticConfig
  const assemblyKey = useMemo(() => `${platform}-${Object.values(activeConfig).join('-')}`, [activeConfig, platform])

  const setBoltBody = (body: ModularBodyId) => setBoltConfig((current) => ({ ...current, body, bridge: BODY_BRIDGES[body].includes(current.bridge) ? current.bridge : BODY_BRIDGES[body][0], pickups: BODY_PICKUPS[body].includes(current.pickups) ? current.pickups : BODY_PICKUPS[body][0] }))
  const setSetBody = (body: ModularSetBodyId) => setSetConfig((current) => ({ ...current, body, bridge: SET_BODY_BRIDGES[body].includes(current.bridge) ? current.bridge : SET_BODY_BRIDGES[body][0], pickups: SET_BODY_PICKUPS[body].includes(current.pickups) ? current.pickups : SET_BODY_PICKUPS[body][0] }))
  const setAcousticBody = (body: ModularAcousticBodyId) => setAcousticConfig((current) => ({ ...current, body, bridge: ACOUSTIC_BODY_BRIDGES[body].includes(current.bridge) ? current.bridge : ACOUSTIC_BODY_BRIDGES[body][0], pickups: ACOUSTIC_BODY_PICKUPS[body].includes(current.pickups) ? current.pickups : ACOUSTIC_BODY_PICKUPS[body][0] }))

  const renderTray = () => {
    if (platform === 'bolt-on') {
      if (activeSlot === 'body') return <OptionTray code="BD" values={bodyIds} selected={boltConfig.body} labels={c.bodies} onSelect={setBoltBody} />
      if (activeSlot === 'neck') return <OptionTray code="NK" values={neckIds} selected={boltConfig.neck} labels={c.necks} onSelect={(neck) => setBoltConfig((current) => ({ ...current, neck }))} />
      if (activeSlot === 'pickups') return <OptionTray code="PU" values={pickupIds} selected={boltConfig.pickups} labels={c.pickupPacks} onSelect={(pickups) => setBoltConfig((current) => ({ ...current, pickups }))} isDisabled={(value) => !BODY_PICKUPS[boltConfig.body].includes(value)} />
      if (activeSlot === 'bridge') return <OptionTray code="BR" values={bridgeIds} selected={boltConfig.bridge} labels={c.bridges} onSelect={(bridge) => setBoltConfig((current) => ({ ...current, bridge }))} isDisabled={(value) => !BODY_BRIDGES[boltConfig.body].includes(value)} />
      return <OptionTray code="FN" values={finishIds} selected={boltConfig.finish} labels={c.finishes} onSelect={(finish) => setBoltConfig((current) => ({ ...current, finish }))} />
    }
    if (platform === 'set-neck') {
      if (activeSlot === 'body') return <OptionTray code="BD" values={setBodyIds} selected={setConfig.body} labels={c.setBodies} onSelect={setSetBody} />
      if (activeSlot === 'neck') return <OptionTray code="NK" values={setNeckIds} selected={setConfig.neck} labels={c.setNecks} onSelect={(neck) => setSetConfig((current) => ({ ...current, neck }))} />
      if (activeSlot === 'pickups') return <OptionTray code="PU" values={setPickupIds} selected={setConfig.pickups} labels={c.setPickupPacks} onSelect={(pickups) => setSetConfig((current) => ({ ...current, pickups }))} isDisabled={(value) => !SET_BODY_PICKUPS[setConfig.body].includes(value)} />
      if (activeSlot === 'bridge') return <OptionTray code="BR" values={setBridgeIds} selected={setConfig.bridge} labels={c.setBridges} onSelect={(bridge) => setSetConfig((current) => ({ ...current, bridge }))} isDisabled={(value) => !SET_BODY_BRIDGES[setConfig.body].includes(value)} />
      return <OptionTray code="FN" values={setFinishIds} selected={setConfig.finish} labels={c.setFinishes} onSelect={(finish) => setSetConfig((current) => ({ ...current, finish }))} />
    }
    if (activeSlot === 'body') return <OptionTray code="BD" values={acousticBodyIds} selected={acousticConfig.body} labels={c.acousticBodies} onSelect={setAcousticBody} />
    if (activeSlot === 'neck') return <OptionTray code="NK" values={acousticNeckIds} selected={acousticConfig.neck} labels={c.acousticNecks} onSelect={(neck) => setAcousticConfig((current) => ({ ...current, neck }))} />
    if (activeSlot === 'pickups') return <OptionTray code="VO" values={acousticPickupIds} selected={acousticConfig.pickups} labels={c.acousticPickupPacks} onSelect={(pickups) => setAcousticConfig((current) => ({ ...current, pickups }))} isDisabled={(value) => !ACOUSTIC_BODY_PICKUPS[acousticConfig.body].includes(value)} />
    if (activeSlot === 'bridge') return <OptionTray code="BR" values={acousticBridgeIds} selected={acousticConfig.bridge} labels={c.acousticBridges} onSelect={(bridge) => setAcousticConfig((current) => ({ ...current, bridge }))} isDisabled={(value) => !ACOUSTIC_BODY_BRIDGES[acousticConfig.body].includes(value)} />
    return <OptionTray code="TP" values={acousticFinishIds} selected={acousticConfig.finish} labels={c.acousticFinishes} onSelect={(finish) => setAcousticConfig((current) => ({ ...current, finish }))} />
  }

  const slots: Array<{id:SlotId;label:string;value:string}> = [
    {id:'body',label:c.body,value:activeConfig.body}, {id:'neck',label:c.neck,value:activeConfig.neck},
    {id:'pickups',label:c.pickups,value:activeConfig.pickups}, {id:'bridge',label:c.bridge,value:activeConfig.bridge},
    {id:'finish',label:c.finish,value:activeConfig.finish},
  ]
  const presets = platform === 'bolt-on' ? MODULAR_PRESETS : platform === 'set-neck' ? MODULAR_SET_PRESETS : MODULAR_ACOUSTIC_PRESETS

  return <section className="tfb-builder" aria-label={c.order}>
    <header className="tfb-builder__topbar">
      <div className="tfb-maker"><span>{c.brand}</span><b>{c.order}</b><small>{c.station}</small></div>
      <fieldset className="tfb-platform"><legend>{c.platform}</legend>
        <button type="button" className={platform === 'bolt-on' ? 'is-selected' : ''} onClick={() => setPlatform('bolt-on')} aria-pressed={platform === 'bolt-on'}><span>25.5</span><b>{c.boltPlatform}</b></button>
        <button type="button" className={platform === 'set-neck' ? 'is-selected' : ''} onClick={() => setPlatform('set-neck')} aria-pressed={platform === 'set-neck'}><span>24.75</span><b>{c.setPlatform}</b></button>
        <button type="button" className={platform === 'acoustic' ? 'is-selected' : ''} onClick={() => setPlatform('acoustic')} aria-pressed={platform === 'acoustic'}><span>25.4</span><b>{c.acousticPlatform}</b></button>
      </fieldset>
    </header>

    <div className="tfb-builder__workspace">
      <div className="tfb-stage">
        <div className="tfb-stage__label"><span>{platform === 'bolt-on' ? c.socket : platform === 'set-neck' ? c.setSocket : c.acousticSocket}</span><b>{assemblyKey.slice(0, 18).toUpperCase()}</b></div>
        <div className="tfb-stage__instrument" key={assemblyKey}>{platform === 'bolt-on' ? <ModularBoltOnGuitarSvg config={boltConfig} /> : platform === 'set-neck' ? <ModularSetNeckGuitarSvg config={setConfig} /> : <ModularAcousticGuitarSvg config={acousticConfig} />}</div>
        <div className="tfb-stage__manifest" aria-label="Build manifest"><span>{activeConfig.body}</span><span>{activeConfig.neck}</span><span>{activeConfig.pickups}</span><span>{activeConfig.bridge}</span></div>
      </div>

      <aside className="tfb-console">
        <div className="tfb-console__status"><div><span>{platform === 'bolt-on' ? 'TF / B25' : platform === 'set-neck' ? 'TF / S24' : 'TF / A25'}</span><b>{platform === 'bolt-on' ? c.socket : platform === 'set-neck' ? c.setSocket : c.acousticSocket}</b></div><div><span>{c.combinations}</span><strong>{platform === 'bolt-on' ? c.combinationValue : platform === 'set-neck' ? c.setCombinationValue : c.acousticCombinationValue}</strong></div></div>
        <div className="tfb-console__mode" role="tablist">
          <button type="button" role="tab" aria-selected={panelMode === 'parts'} className={panelMode === 'parts' ? 'is-selected' : ''} onClick={() => setPanelMode('parts')}>{c.parts}</button>
          <button type="button" role="tab" aria-selected={panelMode === 'recipes'} className={panelMode === 'recipes' ? 'is-selected' : ''} onClick={() => setPanelMode('recipes')}>{c.recipes}</button>
        </div>

        {panelMode === 'parts' ? <div className="tfb-console__content">
          <nav className="tfb-slots" aria-label={c.parts}>{slots.map((slot, index) => <button type="button" key={slot.id} className={activeSlot === slot.id ? 'is-selected' : ''} onClick={() => setActiveSlot(slot.id)} aria-pressed={activeSlot === slot.id}><span>0{index + 1}</span><b>{slot.label}</b><small>{slot.value}</small></button>)}</nav>
          <div className="tfb-drawer"><p>{c.instruction}</p>{renderTray()}</div>
        </div> : <div className="tfb-recipes">{presets.map((preset, index) => {
          const active = Object.values(activeConfig).join('-') === Object.values(preset.config).join('-')
          return <button type="button" className={active ? 'is-selected' : ''} key={preset.id} onClick={() => platform === 'bolt-on' ? setBoltConfig(preset.config as ModularBoltOnConfig) : platform === 'set-neck' ? setSetConfig(preset.config as ModularSetNeckConfig) : setAcousticConfig(preset.config as ModularAcousticConfig)} aria-pressed={active}>
            <span>R·0{index + 1}</span><div><small>{preset.era}</small><b>{preset.name[locale]}</b><em>{preset.config.body} / {preset.config.bridge}</em></div><i aria-hidden="true" />
          </button>
        })}</div>}
      </aside>
    </div>
  </section>
}
