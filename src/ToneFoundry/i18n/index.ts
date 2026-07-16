export type Locale = 'zh' | 'en'

function detectLocale(): Locale {
  const override = localStorage.getItem('game_locale')
  if (override === 'zh' || override === 'en') return override
  return 'en'
}

export const locale = detectLocale()

const copy = {
  zh: {
    eyebrow: 'TONE FOUNDRY · 乐器内容验证台',
    title: '听见一把琴的形状',
    intro: '从真实结构开始装一把琴，再进入试音间听见木材、拾音器与桥尾如何改变回应。',
    buildWorkspace: '制琴台',
    testWorkspace: '试音间',
    audioLocked: '触弦启声',
    audioReady: '声音已就绪',
    audioError: '声音没有启动，点此重试',
    playRiff: '播放标准试听',
    stopRiff: '停止试听',
    clean: '清音',
    drive: '驱动',
    channel: '放大通道',
    stringHint: '点按琴弦拨奏 · 横向划过完成扫弦',
    viewControls: '乐器查看控制',
    inspectMode: '检视',
    playMode: '演奏',
    inspectHint: '拖动查看细节 · 双指或滚轮缩放 · 双击快速放大 / 复位',
    zoomIn: '放大',
    zoomOut: '缩小',
    resetView: '复位视图',
    inspection: '制琴检验记录',
    toneProfile: '音色指纹',
    warmth: '温暖',
    brightness: '明亮',
    attack: '起音',
    sustain: '延音',
    driveMetric: '驱动',
    space: '空间',
    selectInstrument: '测试样本',
    compare: 'A/B 比较将在下一轮加入',
    prototype: 'VISUAL + TONE PROTOTYPE · NOT A FINAL GAME',
  },
  en: {
    eyebrow: 'TONE FOUNDRY · INSTRUMENT CONTENT LAB',
    title: 'Hear the shape of a guitar',
    intro: 'Build from real structures, then enter the tone room to hear how wood, pickups, and bridge systems change the response.',
    buildWorkspace: 'Build desk',
    testWorkspace: 'Tone room',
    audioLocked: 'Touch a string to enable sound',
    audioReady: 'Audio ready',
    audioError: 'Audio did not start. Tap to retry',
    playRiff: 'Play reference riff',
    stopRiff: 'Stop reference riff',
    clean: 'Clean',
    drive: 'Drive',
    channel: 'Amp channel',
    stringHint: 'Tap a string to pluck · sweep across to strum',
    viewControls: 'Instrument view controls',
    inspectMode: 'Inspect',
    playMode: 'Play',
    inspectHint: 'Drag to inspect · pinch or wheel to zoom · double-click for quick zoom / reset',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetView: 'Reset view',
    inspection: 'Luthier inspection record',
    toneProfile: 'Tone fingerprint',
    warmth: 'Warmth',
    brightness: 'Brightness',
    attack: 'Attack',
    sustain: 'Sustain',
    driveMetric: 'Drive',
    space: 'Space',
    selectInstrument: 'Test instruments',
    compare: 'A/B comparison arrives in the next pass',
    prototype: 'VISUAL + TONE PROTOTYPE · NOT A FINAL GAME',
  },
} as const

export type CopyKey = keyof typeof copy.en

export function t(key: CopyKey): string {
  return copy[locale][key]
}
