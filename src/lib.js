import { useEffect, useState } from 'react'

// State lưu vào localStorage (giữ tiến độ khi đóng web)
export function useStored(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s == null ? init : JSON.parse(s) } catch { return init }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}

export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]] } return a }

// Giọng đọc tiếng Trung: ưu tiên giọng Neural của Edge
let voice = null
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices() || []
  voice = vs.find((v) => /zh[-_]CN/i.test(v.lang) && /Xiaoxiao|Natural|Online/i.test(v.name))
    || vs.find((v) => /zh[-_]CN/i.test(v.lang)) || vs.find((v) => /^zh/i.test(v.lang)) || null
}
if ('speechSynthesis' in window) { pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice }

export function say(text, onNoVoice, rate = 0.8) {
  if (!voice) { pickVoice() }
  if (!voice) {
    window.open('https://translate.google.com/?sl=zh-CN&tl=vi&text=' + encodeURIComponent(text), '_blank')
    onNoVoice?.()
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.voice = voice; u.lang = voice.lang; u.rate = rate
  window.speechSynthesis.speak(u)
}

export async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true } catch {
    const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select()
    const ok = document.execCommand('copy'); ta.remove(); return ok
  }
}

// Thống kê từng từ: { [hán]: { seen, right, total } } — ghi thẳng localStorage
export function getStats() { try { return JSON.parse(localStorage.getItem('cn-stats')) || {} } catch { return {} } }
export function bumpStat(h, d) {
  const all = getStats(); const s = all[h] || { seen: 0, right: 0, total: 0 }
  for (const k in d) s[k] = (s[k] || 0) + d[k]
  all[h] = s; localStorage.setItem('cn-stats', JSON.stringify(all))
}
