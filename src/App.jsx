import { useEffect, useState } from 'react'
import {
  Languages, BookOpenText, Library, Copy, Check, Volume2, Sparkles, Layers, ListChecks, MessageCircleQuestion,
  Trophy, ChevronRight, Flame, RotateCcw, Send, Moon, Sun,
} from 'lucide-react'
import { GT, LESSONS, VOCAB } from './data.js'
import { useStored, shuffle, say, copyText, bumpStat } from './lib.js'
import Vocab from './Vocab.jsx'
import DocViewer from './DocViewer.jsx'

const cx = (...a) => a.filter(Boolean).join(' ')
// Bản chia sẻ: không có máy chủ Claude → nút "Hỏi" chỉ copy câu hỏi
const useRunner = () => ({ canRun: false, run: async () => false })

export default function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || 'home')
  const [dark, setDark] = useStored('ui-dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [toast, setToast] = useState(null)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => { const f = () => setRoute(location.hash.slice(1) || 'home'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const go = (id) => { location.hash = id === 'home' ? '' : id; if (id === 'home') setRoute('home'); scrollTo({ top: 0 }) }
  const notify = (t) => { setToast({ t, k: Date.now() }); setTimeout(() => setToast((x) => (x && Date.now() - x.k >= 2000 ? null : x)), 2100) }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 md:px-8">
          <button onClick={() => go('home')} className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-lg text-white">中</span>
            Học tiếng Trung · HSK1
          </button>
          <button onClick={() => setDark(!dark)} className="ml-auto rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đổi giao diện">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6 md:px-8">
        {route.startsWith('doc/') ? <DocViewer path={route.slice(4)} go={go} notify={notify} /> : <ChinesePage notify={notify} />}
      </main>
      <footer className="pb-8 text-center text-xs text-slate-400">Giáo trình HSK1 tự soạn bằng tiếng Việt · Tiến độ học được lưu trên trình duyệt của bạn</footer>
      {toast && <div key={toast.k} className="pop fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white shadow-xl dark:bg-white dark:text-slate-900">{toast.t}</div>}
    </div>
  )
}

function ChinesePage({ notify }) {
  const [tab, setTab] = useStored('cn-tab', 'bai')
  const TABS = [
    { id: 'bai', label: 'Bài học', icon: <BookOpenText size={16} /> },
    { id: 'tuvung', label: 'Từ vựng', icon: <Library size={16} /> },
    { id: 'the', label: 'Thẻ từ', icon: <Layers size={16} /> },
    { id: 'quiz', label: 'Trắc nghiệm', icon: <ListChecks size={16} /> },
  ]
  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 p-6 text-white shadow-lg md:p-8">
        <div className="flex items-center gap-3"><Languages size={28} /><h1 className="text-2xl font-bold md:text-3xl">Tiếng Trung HSK1</h1></div>
        <p className="mt-2 max-w-2xl text-white/90">3 bài nhập môn + 10 bài HSK1, có pinyin, Hán Việt, hội thoại, bài tập. Bấm vào chữ Hán để nghe phát âm.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href={`${GT}00_DOC_TRUOC.md`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 ring-1 ring-white/25 hover:bg-white/25"><BookOpenText size={14} /> Đọc trước khi học</a>
          <a href={`${GT}01_NGUON_THAM_KHAO.md`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 ring-1 ring-white/25 hover:bg-white/25"><Library size={14} /> Nguồn tham khảo</a>
        </div>
      </div>
      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cx('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition',
            tab === t.id ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      {tab === 'bai' && <Lessons notify={notify} />}
      {tab === 'tuvung' && <Vocab notify={notify} goTab={setTab} />}
      {tab === 'the' && <Flashcards notify={notify} />}
      {tab === 'quiz' && <Quiz notify={notify} />}
    </div>
  )
}

function Lessons({ notify }) {
  const [learned, setLearned] = useStored('cn-learned', {})
  const [asking, setAsking] = useState(null)
  const [q, setQ] = useState('')
  const n = LESSONS.filter((l) => learned[l.id]).length
  const next = LESSONS.find((l) => !learned[l.id])
  const { canRun, run } = useRunner()
  const ask = async () => {
    const label = asking.id.startsWith('N') ? `Nhập môn ${asking.id.slice(1)}` : `HSK1-${asking.id.padStart(2, '0')}`
    if (!q.trim()) return
    if (canRun) { if (await run('hoi-bai', [label, q.trim()], { label: `Hỏi bài ${label}` })) { setAsking(null); setQ('') } return }
    if (await copyText(`hỏi bài ${label}: ${q.trim()}`)) { notify('✓ Đã copy câu hỏi — dán vào ChatGPT, Claude hoặc hỏi thầy cô'); setAsking(null); setQ('') }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-2.5">
        {LESSONS.map((l, i) => {
          const ok = !!learned[l.id]
          return (
            <div key={l.id} className={cx('flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition dark:bg-slate-900',
              next?.id === l.id ? 'border-orange-400 ring-4 ring-orange-500/10' : 'border-slate-200 dark:border-slate-800')}>
              <button onClick={() => { setLearned({ ...learned, [l.id]: !ok }); notify(ok ? 'Đã bỏ đánh dấu' : '🎉 Xong bài ' + l.label) }}
                className={cx('grid size-9 shrink-0 place-items-center rounded-full border-2 transition', ok ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-slate-400 hover:border-emerald-400 dark:border-slate-600')}>
                {ok ? <Check size={18} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-400">{l.label}{next?.id === l.id && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">Học tiếp</span>}</div>
                <a href={`${GT}${l.file}.md`} className={cx('font-semibold hover:underline', ok && 'text-slate-400 line-through')}>{l.title}</a>
              </div>
              <button onClick={() => setAsking(l)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <MessageCircleQuestion size={16} /><span className="hidden sm:inline">Hỏi</span>
              </button>
            </div>
          )
        })}
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Ring pct={n / LESSONS.length} />
          <div className="mt-2 font-semibold">{n}/{LESSONS.length} bài</div>
          <div className="text-sm text-slate-500">{next ? <>Tiếp theo: <b>{next.title}</b></> : 'Hoàn thành HSK1! 🎉'}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 font-semibold">Cách học mỗi bài</div>
          <ol className="list-decimal space-y-1 pl-4 text-slate-600 dark:text-slate-300">
            <li>Mở bài, nghe từ mới 🔊 (tab Thẻ từ)</li><li>Đọc ngữ pháp + hội thoại</li><li>Làm bài tập, rồi xem đáp án</li><li>Không hiểu → bấm <b>Hỏi</b></li><li>Tick ✔ khi xong</li>
          </ol>
        </div>
      </aside>

      {asking && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setAsking(null)}>
          <div className="pop w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs text-slate-400">{asking.label}</div>
            <h3 className="text-lg font-bold">{asking.title} — bạn chưa hiểu chỗ nào?</h3>
            <textarea autoFocus value={q} onChange={(e) => setQ(e.target.value)} rows={4} placeholder="VD: sao 二 với 两 khác nhau?"
              className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-4 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setAsking(null)} className="rounded-xl px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Huỷ</button>
              <button onClick={ask} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white">{canRun ? <><Send size={15} /> Hỏi Claude</> : <><Copy size={15} /> Copy câu hỏi</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Ring({ pct }) {
  const r = 42, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="mx-auto size-28 -rotate-90">
      <circle cx="50" cy="50" r={r} strokeWidth="10" className="fill-none stroke-slate-100 dark:stroke-slate-800" />
      <circle cx="50" cy="50" r={r} strokeWidth="10" strokeLinecap="round" className="fill-none stroke-orange-500 transition-all duration-700" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      <text x="50" y="50" className="rotate-90 fill-current text-lg font-bold" style={{ transformOrigin: '50px 50px' }} textAnchor="middle" dominantBaseline="central">{Math.round(pct * 100)}%</text>
    </svg>
  )
}

function LessonPicker({ value, onChange }) {
  const opts = LESSONS.filter((l) => VOCAB.some((v) => v.b === l.id))
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900">
      <option value="all">Tất cả bài ({VOCAB.length} từ)</option>
      {opts.map((l) => <option key={l.id} value={l.id}>{l.label} – {l.title}</option>)}
    </select>
  )
}

function Flashcards({ notify }) {
  const [lesson, setLesson] = useStored('cn-fc-lesson', 'all')
  const [onlyHard, setOnlyHard] = useState(false)
  const [hard, setHard] = useStored('cn-hard', {})
  const [known, setKnown] = useStored('cn-known', {})
  const [deck, setDeck] = useState([])
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)

  const build = () => {
    let p = lesson === 'all' ? VOCAB : VOCAB.filter((v) => v.b === lesson)
    if (onlyHard) p = p.filter((v) => hard[v.h])
    setDeck(shuffle(p)); setI(0); setFlip(false)
  }
  useEffect(build, [lesson, onlyHard]) // eslint-disable-line

  const card = deck[i]
  const answer = (ok) => {
    if (!card) return
    setHard((h) => { const n = { ...h }; ok ? delete n[card.h] : (n[card.h] = 1); return n })
    setKnown((k) => { const n = { ...k }; ok ? (n[card.h] = 1) : delete n[card.h]; return n })
    if (i + 1 >= deck.length) { notify('🎉 Hết bộ thẻ — xáo lại'); build() } else { setI(i + 1); setFlip(false) }
  }
  const speak = () => card && say(card.h, () => notify('Máy chưa có giọng tiếng Trung → mở Google Dịch'))
  const turn = () => { if (!flip) { speak(); card && bumpStat(card.h, { seen: 1 }) } setFlip(!flip) }

  useEffect(() => {
    const f = (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return
      if (e.code === 'Space') { e.preventDefault(); turn() }
      if (e.key === 'ArrowRight') answer(true)
      if (e.key === 'ArrowLeft') answer(false)
    }
    addEventListener('keydown', f); return () => removeEventListener('keydown', f)
  })

  const nHard = Object.keys(hard).length
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LessonPicker value={lesson} onChange={setLesson} />
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={onlyHard} onChange={(e) => setOnlyHard(e.target.checked)} className="size-4 accent-orange-500" /> Chỉ từ chưa nhớ ({nHard})
        </label>
        <span className="ml-auto text-sm text-slate-400">{deck.length ? `${i + 1} / ${deck.length}` : ''}</span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all" style={{ width: deck.length ? `${((i + 1) / deck.length) * 100}%` : 0 }} /></div>

      {!card ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center text-slate-500 dark:border-slate-700">Không có thẻ nào 🎉</div>
      ) : (
        <div className="flip h-80 cursor-pointer select-none" onClick={turn}>
          <div className={cx('flip-inner relative h-full', flip && 'flipped')}>
            <div className="face absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="font-han text-8xl">{card.h}</div>
              <div className="mt-6 text-sm text-slate-400">Bấm để lật · Space</div>
            </div>
            <div className="face face-back absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 p-6 text-center text-white shadow-xl">
              <div className="font-han text-6xl">{card.h}</div>
              <div className="mt-3 text-3xl font-semibold">{card.p}</div>
              <div className="mt-2 text-xl">{card.m}</div>
              <div className="mt-3 rounded-full bg-white/20 px-3 py-1 text-sm">Hán Việt: {card.v} · bài {card.b}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => answer(false)} className="rounded-2xl border border-rose-200 bg-rose-50 py-3 font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">😕 Chưa nhớ <span className="text-xs opacity-60">←</span></button>
        <button onClick={speak} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"><Volume2 size={18} /> Nghe</button>
        <button onClick={() => answer(true)} className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-semibold text-white hover:opacity-90">😀 Nhớ rồi <span className="text-xs opacity-70">→</span></button>
      </div>
      <button onClick={build} className="mx-auto mt-4 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600"><RotateCcw size={14} /> Xáo lại</button>
    </div>
  )
}

function Quiz({ notify }) {
  const [lesson, setLesson] = useStored('cn-quiz-lesson', 'all')
  const [mode, setMode] = useStored('cn-quiz-mode', 'm')
  const [stats, setStats] = useStored('cn-quiz', { right: 0, total: 0 })
  const [, setHard] = useStored('cn-hard', {})
  const [session, setSession] = useState({ right: 0, total: 0 })
  const [q, setQ] = useState(null)
  const [picked, setPicked] = useState(null)

  const newQ = () => {
    const p = lesson === 'all' ? VOCAB : VOCAB.filter((v) => v.b === lesson)
    const c = p[(Math.random() * p.length) | 0]
    const wrong = shuffle(VOCAB.filter((x) => x.h !== c.h && x.m !== c.m && x.p !== c.p)).slice(0, 3)
    setQ({ c, opts: shuffle([c, ...wrong]) }); setPicked(null)
  }
  useEffect(newQ, [lesson, mode]) // eslint-disable-line

  if (!q) return null
  const label = (o) => (mode === 'm' ? o.m : mode === 'h' ? o.h : o.p)
  const pick = (o) => {
    if (picked) return
    const ok = o.h === q.c.h
    setPicked(o)
    setSession((s) => ({ right: s.right + ok, total: s.total + 1 }))
    setStats((s) => ({ right: s.right + ok, total: s.total + 1 }))
    bumpStat(q.c.h, { seen: 1, total: 1, right: ok ? 1 : 0 })
    if (!ok) setHard((h) => ({ ...h, [q.c.h]: 1 }))
    say(q.c.h, () => {})
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LessonPicker value={lesson} onChange={setLesson} />
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="m">Chữ Hán → Nghĩa</option><option value="h">Nghĩa → Chữ Hán</option><option value="p">Chữ Hán → Pinyin</option>
        </select>
        <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Đúng {session.right}/{session.total}</span>
      </div>
      <div className="flex min-h-48 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {mode === 'h' ? <div className="text-center text-3xl font-semibold">{q.c.m}</div> : <div className="font-han text-7xl">{q.c.h}</div>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {q.opts.map((o) => {
          const isRight = picked && o.h === q.c.h, isWrong = picked && o === picked && o.h !== q.c.h
          return (
            <button key={o.h} onClick={() => pick(o)} disabled={!!picked}
              className={cx('rounded-2xl border-2 p-4 text-lg font-medium transition', mode === 'h' && 'font-han text-3xl',
                isRight ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : isWrong ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                    : 'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
                picked && !isRight && !isWrong && 'opacity-50')}>
              {label(o)}
            </button>
          )
        })}
      </div>
      {picked && (
        <div className="pop mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
          <div><span className="font-han text-2xl">{q.c.h}</span> <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">{q.c.p}</span> · {q.c.m} <span className="text-sm text-slate-500">· HV: {q.c.v}</span></div>
          <button onClick={newQ} autoFocus className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white">Câu tiếp <ChevronRight size={16} /></button>
        </div>
      )}
      <p className="mt-4 text-center text-xs text-slate-400">Tổng từ trước tới nay: đúng {stats.right}/{stats.total} · câu sai được thêm vào “từ chưa nhớ”</p>
    </div>
  )
}
