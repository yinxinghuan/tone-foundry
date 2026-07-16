export type EffectId = 'boost' | 'overdrive' | 'chorus' | 'tape-echo'

export const EFFECTS: Record<EffectId, { zh:string; en:string; short:string; color:string; dark:string }> = {
  boost:{zh:'增益推子',en:'Boost',short:'B',color:'#d9c83e',dark:'#665d17'},
  overdrive:{zh:'过载',en:'Overdrive',short:'OD',color:'#d75b34',dark:'#6d2318'},
  chorus:{zh:'合唱',en:'Chorus',short:'CH',color:'#4f9aa0',dark:'#1d5359'},
  'tape-echo':{zh:'磁带回声',en:'Tape Echo',short:'TE',color:'#6f668f',dark:'#302b4f'},
}
