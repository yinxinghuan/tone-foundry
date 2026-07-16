import { EFFECTS, type EffectId } from '../audio/effects'
import { locale } from '../i18n'

interface Props { effect:EffectId; active:boolean; onToggle:()=>void }

export function EffectPedal({effect,active,onToggle}:Props) {
  const item=EFFECTS[effect]
  return <button type="button" className={`tfrun-pedal ${active?'is-active':''}`} onClick={onToggle} aria-pressed={active} aria-label={`${active?(locale==='zh'?'移除':'Remove'):(locale==='zh'?'添加':'Add')} ${item[locale]}`}>
    <svg viewBox="0 0 112 152" aria-hidden="true"><defs><linearGradient id={`${effect}-face`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={item.color}/><stop offset="1" stopColor={item.dark}/></linearGradient></defs><rect x="5" y="4" width="102" height="144" rx="9" fill={`url(#${effect}-face)`} stroke="#181917" strokeWidth="2"/><rect x="12" y="12" width="88" height="120" rx="5" fill="none" stroke="rgba(255,255,255,.36)"/><circle cx="28" cy="28" r="5" fill={active?'#b8d63d':'#181917'} stroke="#faf9f5"/><text x="56" y="38" fill="#faf9f5" fontSize="14" fontWeight="800" textAnchor="middle">{item.short}</text><text x="56" y="57" fill="#faf9f5" fontSize="8" fontWeight="700" textAnchor="middle">{item.en.toUpperCase()}</text><circle cx="37" cy="82" r="14" fill="#ebe9df" stroke="#181917" strokeWidth="2"/><circle cx="75" cy="82" r="14" fill="#ebe9df" stroke="#181917" strokeWidth="2"/><path d="M37 68v8M75 68v8" stroke="#181917" strokeWidth="2" strokeLinecap="round"/><rect x="31" y="108" width="50" height="20" rx="3" fill="#d8d7cd" stroke="#181917" strokeWidth="2"/><path d="M35 118h42" stroke="#8b8c84" strokeWidth="2"/></svg>
    <span>{item[locale]}</span>
  </button>
}
