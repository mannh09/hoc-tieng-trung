import { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Volume2, FileText } from 'lucide-react'
import { LESSONS } from './data.js'
import { useStored, say } from './lib.js'

// Nhúng toàn bộ file .md lúc build → mở được offline, không cần server
const RAW = import.meta.glob(
  '../giaotrinh/*.md',
  { query: '?raw', import: 'default', eager: true },
)
export const DOCS = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k.replace(/^(\.\.\/)+/, ''), v]))

const GT_DIR = 'giaotrinh/'
const CJK = /[㐀-鿿]+/g

function resolve(base, rel) {
  const parts = base.split('/').slice(0, -1)
  for (const seg of rel.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg && seg !== '.') parts.push(seg)
  }
  return parts.join('/')
}

export default function DocViewer({ path, go, notify }) {
  const ref = useRef(null)
  const [learned, setLearned] = useStored('cn-learned', {})
  const md = DOCS[path]
  const name = path.split('/').pop().replace(/\.md$/, '')
  const li = LESSONS.findIndex((l) => path === GT_DIR + l.file + '.md')
  const lesson = li >= 0 ? LESSONS[li] : null
  const isPlaybook = path.startsWith('00_Playbooks/')
  const back = 'home'

  useEffect(() => { scrollTo({ top: 0 }) }, [path])

  // Bấm vào chữ Hán (hoặc bôi đen) để nghe
  const onClick = (e) => {
    if (e.target.closest('a,summary,button')) return
    const sel = String(window.getSelection() || '').trim()
    const src = sel && CJK.test(sel) ? sel : e.target.textContent || ''
    CJK.lastIndex = 0
    const hz = (src.match(CJK) || []).join('，')
    if (hz && hz.length <= 40) say(hz, () => notify('Máy chưa có giọng tiếng Trung → mở Google Dịch'))
  }

  if (!md) return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      <p className="mb-4">Không tìm thấy <code>{path}</code>.</p>
      <p className="text-sm text-slate-500">Bài này chưa có.</p>
      <button onClick={() => go(back)} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">Quay lại</button>
    </div>
  )

  const link = (href) => {
    if (!href || /^(https?:|mailto:|#)/.test(href)) return href
    const [p, hash] = href.split('#')
    if (p.endsWith('.md')) return '#doc/' + resolve(path, decodeURIComponent(p)) + (hash ? '' : '')
    if (p.endsWith('/')) { const t = resolve(path, p + '0_README.md'); return DOCS[t] ? '#doc/' + t : undefined }
    return undefined
  }

  const Nav = () => lesson && (
    <div className="flex items-center justify-between gap-3">
      {li > 0 ? <a href={`#doc/${GT_DIR}${LESSONS[li - 1].file}.md`} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft size={16} />{LESSONS[li - 1].title}</a> : <span />}
      {li < LESSONS.length - 1 && <a href={`#doc/${GT_DIR}${LESSONS[li + 1].file}.md`} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">{LESSONS[li + 1].title}<ChevronRight size={16} /></a>}
    </div>
  )

  const done = lesson && learned[lesson.id]
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => go(back)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"><ArrowLeft size={16} />{isPlaybook ? 'Trang chủ' : 'Tiếng Trung'}</button>
        <span className="inline-flex items-center gap-1.5 truncate text-xs text-slate-400"><FileText size={13} />{path}</span>
        {lesson && (
          <button onClick={() => { setLearned({ ...learned, [lesson.id]: !done }); notify(done ? 'Đã bỏ đánh dấu' : '🎉 Xong ' + lesson.label) }}
            className={'ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm ' + (done ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white')}>
            <Check size={16} />{done ? 'Đã học xong' : 'Đánh dấu học xong'}
          </button>
        )}
      </div>

      {lesson && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2.5 text-sm text-orange-800 dark:bg-orange-500/10 dark:text-orange-200">
          <Volume2 size={16} /> Mẹo: <b>bấm vào dòng có chữ Hán</b> (hoặc bôi đen) để nghe phát âm.
        </div>
      )}

      <article ref={ref} onClick={onClick} className="doc prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:prose-invert dark:border-slate-800 dark:bg-slate-900">
        <Markdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ href, children }) => {
              const h = link(href)
              return h ? <a href={h} target={/^https?:/.test(h) ? '_blank' : undefined} rel="noreferrer">{children}</a> : <span className="font-medium">{children}</span>
            },
            table: ({ children }) => <div className="not-prose my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700"><table className="w-full text-sm">{children}</table></div>,
          }}
        >{md}</Markdown>
      </article>

      <div className="mt-6"><Nav /></div>
      <p className="mt-6 text-center text-xs text-slate-400">Bài: {name}</p>
    </div>
  )
}
