import { useEffect, useMemo, useRef, useState } from 'react'
import { Layers, Zap, Eye, Search, Star, X, Volume2, Snail, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { LESSONS } from './data.js'
import { VOCAB, POS, EMOJI } from './vocab.js'
import { useStored, say, getStats, bumpStat } from './lib.js'

const cx = (...a) => a.filter(Boolean).join(' ')

const STATUS = {
  new: { label: 'Chưa gặp', cls: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700', dot: 'bg-slate-300' },
  learning: { label: 'Đang học', cls: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30', dot: 'bg-amber-400' },
  hard: { label: 'Chưa thuộc', cls: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30', dot: 'bg-rose-500' },
  known: { label: 'Đã thuộc', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30', dot: 'bg-emerald-500' },
}

export default function Vocab({ notify, goTab }) {
  const [lesson, setLesson] = useStored('cn-vocab-lesson', 'all')
  const [show, setShow] = useStored('cn-vocab-show', { img: false, mean: true, pinyin: true, hv: false })
  const [stars, setStars] = useStored('cn-star', {})
  const [known, setKnown] = useStored('cn-known', {})
  const [hard, setHard] = useStored('cn-hard', {})
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(null) // index trong list
  const [stats, setStats] = useState(getStats)
  const menuRef = useRef(null)

  useEffect(() => {
    const f = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenu(false)
    addEventListener('mousedown', f); return () => removeEventListener('mousedown', f)
  }, [])

  const status = (w) => (known[w.h] ? 'known' : hard[w.h] ? 'hard' : stats[w.h]?.seen ? 'learning' : 'new')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return VOCAB.filter((w) => (lesson === 'all' || w.b === lesson)
      && (filter === 'all' || (filter === 'star' && stars[w.h]) || (filter !== 'star' && status(w) === filter))
      && (!s || [w.h, w.p, w.m, w.v, w.pos, POS[w.pos]].join(' ').toLowerCase().includes(s)))
  }, [lesson, filter, q, stars, known, hard, stats]) // eslint-disable-line

  const count = (st) => VOCAB.filter((w) => (lesson === 'all' || w.b === lesson) && (st === 'star' ? stars[w.h] : status(w) === st)).length
  const lessonOpts = LESSONS.filter((l) => VOCAB.some((v) => v.b === l.id))
  const toggleStar = (h) => setStars((s) => { const n = { ...s }; n[h] ? delete n[h] : (n[h] = 1); return n })
  const openCard = (i) => { bumpStat(list[i].h, { seen: 1 }); setStats(getStats()); setOpen(i) }
  const mark = (h, ok) => {
    setKnown((k) => { const n = { ...k }; ok ? (n[h] = 1) : delete n[h]; return n })
    setHard((k) => { const n = { ...k }; ok ? delete n[h] : (n[h] = 1); return n })
    notify(ok ? '😀 Đã đánh dấu: thuộc' : '😕 Đã thêm vào “chưa thuộc”')
  }

  return (
    <div>
      {/* Thanh công cụ */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => goTab('the')} className="inline-flex items-center gap-2 rounded-xl border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300"><Layers size={16} /> Flash Card</button>
        <button onClick={() => goTab('quiz')} className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300"><Zap size={16} /> Games</button>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenu(!menu)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"><Eye size={16} /> Hiển thị</button>
          {menu && (
            <div className="pop absolute left-0 top-12 z-30 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 px-1 text-sm font-semibold">Hiển thị trên thẻ</div>
              {[['img', 'Hình'], ['pinyin', 'Pinyin'], ['mean', 'Nghĩa'], ['hv', 'Hán Việt']].map(([k, label]) => (
                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input type="checkbox" checked={!!show[k]} onChange={(e) => setShow({ ...show, [k]: e.target.checked })} className="size-4 accent-blue-600" />{label}
                </label>
              ))}
            </div>
          )}
        </div>
        <select value={lesson} onChange={(e) => setLesson(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900">
          <option value="all">Tất cả bài ({VOCAB.length} từ)</option>
          {lessonOpts.map((l) => <option key={l.id} value={l.id}>{l.label.toUpperCase()} – {l.title}</option>)}
        </select>
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chữ Hán, pinyin, loại từ hoặc nghĩa…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900" />
        </div>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="mb-5 flex flex-wrap gap-2 text-sm">
        {[['all', 'Tất cả', list.length], ['star', '★ Đánh dấu', count('star')], ['new', 'Chưa gặp', count('new')], ['learning', 'Đang học', count('learning')], ['hard', 'Chưa thuộc', count('hard')], ['known', 'Đã thuộc', count('known')]].map(([k, label, n]) => (
          <button key={k} onClick={() => setFilter(k)} className={cx('rounded-full px-3 py-1 ring-1 transition',
            filter === k ? 'bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700')}>
            {label} {k !== 'all' && <span className="opacity-60">{n}</span>}
          </button>
        ))}
      </div>

      {/* Lưới thẻ */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">Không có từ nào khớp.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((w, i) => {
            const st = STATUS[status(w)]
            return (
              <div key={w.h} onClick={() => openCard(i)} className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50">
                <button onClick={(e) => { e.stopPropagation(); toggleStar(w.h) }} className="absolute right-4 top-4" title="Đánh dấu">
                  <Star size={24} className={stars[w.h] ? 'fill-blue-600 text-blue-600' : 'text-slate-300 group-hover:text-slate-400'} />
                </button>
                <div className="flex items-start gap-3 pr-8">
                  {show.img && <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 text-3xl dark:bg-slate-800">{EMOJI[w.h] || '🔤'}</div>}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-han text-3xl font-bold leading-tight">{w.h}</span>
                      <span title={POS[w.pos]} className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30">{w.pos}</span>
                    </div>
                    {show.pinyin && <div className="mt-1 font-medium text-blue-600 dark:text-blue-400">{w.p}</div>}
                    {show.mean && <div className="mt-1 text-slate-700 dark:text-slate-300">{w.m}</div>}
                    {show.hv && <div className="mt-1 text-sm text-slate-400">HV: {w.v}</div>}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"><span className={cx('size-2 rounded-full', st.dot)} />{st.label}<span className="ml-auto">{LESSONS.find((l) => l.id === w.b)?.label}</span></div>
              </div>
            )
          })}
        </div>
      )}

      {open != null && list[open] && (
        <WordModal w={list[open]} st={status(list[open])} stat={stats[list[open].h]} starred={!!stars[list[open].h]}
          onStar={() => toggleStar(list[open].h)} onClose={() => setOpen(null)}
          onPrev={open > 0 ? () => openCard(open - 1) : null} onNext={open < list.length - 1 ? () => openCard(open + 1) : null}
          onMark={(ok) => mark(list[open].h, ok)} notify={notify} />
      )}
    </div>
  )
}

function WordModal({ w, st, stat = {}, starred, onStar, onClose, onPrev, onNext, onMark, notify }) {
  const s = STATUS[st]
  const speak = (t, rate) => say(t, () => notify('Máy chưa có giọng tiếng Trung → mở Google Dịch'), rate)
  useEffect(() => {
    const f = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft' && onPrev) onPrev(); if (e.key === 'ArrowRight' && onNext) onNext() }
    addEventListener('keydown', f); return () => removeEventListener('keydown', f)
  })
  const acc = stat.total ? Math.round((stat.right / stat.total) * 100) + '%' : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="pop relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4">
          <button onClick={onStar} title="Đánh dấu"><Star size={26} className={starred ? 'fill-blue-600 text-blue-600' : 'text-slate-300 hover:text-slate-400'} /></button>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={22} /></button>
        </div>

        {/* Đầu thẻ */}
        <div className="mt-3 flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white px-6 py-5 dark:border-slate-800 dark:from-blue-500/10 dark:to-slate-900">
          <div className="flex items-center gap-4">
            {EMOJI[w.h] && <div className="text-5xl">{EMOJI[w.h]}</div>}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-han text-5xl font-bold text-blue-700 dark:text-blue-400">{w.h}</span>
                <span title={POS[w.pos]} className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30">{w.pos}</span>
              </div>
              <div className="mt-1 text-xl font-medium text-blue-600 dark:text-blue-400">{w.p}</div>
            </div>
          </div>
          <span className={cx('shrink-0 rounded-lg px-2.5 py-1 text-sm ring-1', s.cls)}>{s.label}</span>
        </div>

        <Section title="Nghĩa">
          <div className="text-xl font-medium">{w.m}</div>
          <ul className="mt-1 list-disc pl-5 text-slate-600 dark:text-slate-300">
            <li>Hán Việt: <b>{w.v}</b></li>
            <li>Loại từ: {POS[w.pos]} ({w.pos})</li>
          </ul>
        </Section>

        <Section title="Phát âm">
          <div className="space-y-2.5">
            <button onClick={() => speak(w.h, 0.8)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left shadow-sm hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:bg-blue-500/10">
              <span className="rounded-md bg-red-600 px-2 py-0.5 text-sm font-bold text-white">普通话</span>
              <span className="text-lg">{w.p}</span>
              <Volume2 size={22} className="ml-auto text-red-600" />
            </button>
            <button onClick={() => speak(w.h, 0.45)} className="flex w-full items-center gap-3 rounded-xl border border-blue-200 px-4 py-3 text-left shadow-sm ring-2 ring-blue-500/10 hover:bg-blue-50/50 dark:border-blue-500/30 dark:hover:bg-blue-500/10">
              <span className="rounded-md bg-blue-700 px-2 py-0.5 text-sm font-bold text-white">Chậm</span>
              <span className="text-lg">{w.p.split(/\s+/).join(' · ')}</span>
              <Snail size={22} className="ml-auto text-blue-700 dark:text-blue-400" />
            </button>
          </div>
        </Section>

        {w.ex && (
          <Section title="Ví dụ">
            <button onClick={() => speak(w.ex, 0.75)} className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-left hover:bg-amber-100/70 dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="flex items-start gap-2">
                <div className="font-han text-xl">{w.ex}</div>
                <Volume2 size={18} className="ml-auto mt-1 shrink-0 text-amber-600" />
              </div>
              <div className="mt-1 italic text-slate-600 dark:text-slate-300">{w.exp}</div>
              <div className="mt-1 text-amber-800 dark:text-amber-200">{w.exv}</div>
            </button>
          </Section>
        )}

        <Section title="Tiến độ ôn tập">
          <div className="grid grid-cols-2 gap-3">
            <Box label="Đã xem" value={`${stat.seen || 0} lần`} />
            <Box label="Độ chính xác" value={acc} />
            <Box label="Trả lời đúng" value={`${stat.right || 0}/${stat.total || 0}`} />
            <Box label="Trạng thái" value={s.label} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => onMark(false)} className="rounded-xl border border-rose-200 bg-rose-50 py-2.5 font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">😕 Chưa thuộc</button>
            <button onClick={() => onMark(true)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 font-semibold text-white hover:opacity-90"><Check size={17} /> Đã thuộc</button>
          </div>
        </Section>

        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <button disabled={!onPrev} onClick={onPrev} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"><ChevronLeft size={16} /> Trước</button>
          <span className="text-xs text-slate-400">← → để chuyển · Esc để đóng</span>
          <button disabled={!onNext} onClick={onNext} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800">Sau <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, children }) => (
  <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
    <div className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{title}</div>
    {children}
  </div>
)
const Box = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
    <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-1 text-lg font-bold">{value}</div>
  </div>
)
