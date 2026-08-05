import { useEffect, useMemo, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Skeleton from './ui/Skeleton'
import { BookIcon, DownloadIcon, ChevronLeft, CloseIcon } from './ui/Icons'
import { useCollection } from '../hooks/useCollection'
import type { Bulletin } from '../types/models'

const formatDate = (d?: string): string => {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  try {
    return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(dt)
  } catch {
    return d
  }
}

/**
 * WeeklyBulletin — the weekly Torah bulletin (העלון השבועי). Shows the newest
 * issue as a cover card with a reader (desktop modal / mobile new tab) and a
 * download; previous issues collect into a compact archive. Reads from the data
 * provider so gabbaim publish a new PDF each week from the admin.
 */
export default function WeeklyBulletin() {
  const { items, loading } = useCollection<Bulletin>('bulletins')
  const [reader, setReader] = useState<Bulletin | null>(null)

  // Newest issue first (by date; items with no/invalid date keep their order).
  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const da = Date.parse(a.date ?? '')
        const db = Date.parse(b.date ?? '')
        if (isNaN(da) && isNaN(db)) return 0
        if (isNaN(da)) return 1
        if (isNaN(db)) return -1
        return db - da
      }),
    [items],
  )

  const current = sorted[0]
  const archive = sorted.slice(1)

  // Reader modal: Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!reader) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReader(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [reader])

  return (
    <section id="bulletin" className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow="פרסום שבועי"
          title="העלון השבועי"
          subtitle="דבר תורה, הלכה וחדשות הקהילה — מדי שבוע מבית מוסדות ״ברכת אברהם״."
        />

        {loading && items.length === 0 ? (
          <div className="mx-auto max-w-3xl">
            <Skeleton className="h-64 w-full !rounded-3xl" />
          </div>
        ) : !current ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gold/30 bg-white/50 px-6 py-12 text-center">
            <BookIcon className="mx-auto mb-3 h-8 w-8 text-gold" />
            <p className="font-semibold text-ink">העלון יעלה בקרוב</p>
            <p className="mt-1 text-sm text-ink-muted">גיליון חדש יתפרסם כאן מדי שבוע.</p>
          </div>
        ) : (
          <>
            {/* Current issue */}
            <div className="card mx-auto flex max-w-3xl flex-col overflow-hidden p-0 sm:flex-row">
              {/* Cover */}
              <div className="relative aspect-[3/4] w-full shrink-0 sm:w-52">
                {current.cover ? (
                  <img src={current.cover} alt={current.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div
                    className="absolute inset-0 grid place-items-center"
                    style={{ background: 'linear-gradient(135deg,#1A1110,#4a2f1e 55%,#B8860B)' }}
                  >
                    <BookIcon className="h-16 w-16 text-white/80" />
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  עלון
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
                <div>
                  <span className="eyebrow">הגיליון הנוכחי</span>
                  <h3 className="font-heading text-2xl font-bold text-ink">{current.title}</h3>
                  {formatDate(current.date) && (
                    <p className="mt-1 text-sm text-gold-hover">{formatDate(current.date)}</p>
                  )}
                </div>

                {current.pdf ? (
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    {/* Mobile → native viewer (new tab); desktop → in-page reader */}
                    <a
                      href={current.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary sm:hidden"
                    >
                      <BookIcon className="h-5 w-5" />
                      קריאת העלון
                    </a>
                    <button onClick={() => setReader(current)} className="btn-primary hidden sm:inline-flex">
                      <BookIcon className="h-5 w-5" />
                      קריאת העלון
                    </button>
                    <a
                      href={current.pdf}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <DownloadIcon className="h-5 w-5" />
                      הורדה
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-ink-muted">הקובץ יעלה בקרוב.</p>
                )}
              </div>
            </div>

            {/* Archive */}
            {archive.length > 0 && (
              <div className="mx-auto mt-8 max-w-3xl">
                <h4 className="mb-3 text-center font-heading text-lg font-bold text-ink">גיליונות קודמים</h4>
                <div className="flex flex-col gap-2">
                  {archive.map((b) => (
                    <a
                      key={b.id}
                      href={b.pdf || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`card flex items-center justify-between gap-3 p-3 transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
                        b.pdf ? '' : 'pointer-events-none opacity-60'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
                          <BookIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{b.title}</p>
                          {formatDate(b.date) && <p className="truncate text-xs text-ink-muted">{formatDate(b.date)}</p>}
                        </div>
                      </div>
                      <ChevronLeft className="h-5 w-5 shrink-0 text-gold" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop reader modal */}
      {reader && reader.pdf && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-ink/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setReader(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 pb-3 text-white">
            <h3 className="min-w-0 truncate font-heading text-lg font-bold">{reader.title}</h3>
            <div className="flex shrink-0 items-center gap-3">
              <a
                href={reader.pdf}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gold-light hover:underline"
              >
                פתיחה בכרטיסייה חדשה ↗
              </a>
              <button
                onClick={() => setReader(null)}
                aria-label="סגירה"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          <iframe
            src={reader.pdf}
            title={reader.title}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-4xl flex-1 rounded-xl bg-white"
          />
        </div>
      )}
    </section>
  )
}
