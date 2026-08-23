import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react'
import SectionTitle from './ui/SectionTitle'
import { ChevronLeft, ChevronRight, CloseIcon } from './ui/Icons'
import { useCollection } from '../hooks/useCollection'
import { useSectionText } from '../hooks/useSectionText'
import type { Notice } from '../types/models'

/**
 * Noticeboard (לוח מודעות) — a carousel of poster images the gabbaim upload
 * from the admin. Posters come in mixed aspect ratios (square-ish flyers, A4
 * pages), so each slide letterboxes its image inside a fixed-height stage —
 * that keeps the carousel from jumping in height between slides.
 *
 * The whole section HIDES ITSELF while the collection is empty, so an
 * institution with nothing to announce simply doesn't show a board.
 */
export default function Noticeboard() {
  const { items } = useCollection<Notice>('noticeboard')
  const text = useSectionText('noticeboard')
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomed, setZoomed] = useState<Notice | null>(null)
  const touchX = useRef<number | null>(null)

  const count = items.length
  const go = useCallback((next: number) => setIndex(count ? (next + count) % count : 0), [count])

  // Keep the index valid when notices are added/removed in the admin.
  useEffect(() => {
    if (count > 0 && index >= count) setIndex(0)
  }, [count, index])

  // Auto-advance (paused on hover/focus, while zoomed, or for a single notice).
  useEffect(() => {
    if (paused || zoomed || count < 2) return
    const t = setInterval(() => go(index + 1), 6000)
    return () => clearInterval(t)
  }, [index, paused, zoomed, count, go])

  // Zoom overlay: Esc closes, arrows page, body scroll locked.
  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(null)
      if (e.key === 'ArrowLeft') go(index + 1)
      if (e.key === 'ArrowRight') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoomed, index, go])

  // Follow the carousel while the overlay is open.
  useEffect(() => {
    if (zoomed) setZoomed(items[index] ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    // RTL: swipe left → next, swipe right → previous
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  // Nothing to announce → no section at all (also covers the cold-load window).
  if (count === 0) return null

  const current = items[index]

  return (
    <section id="noticeboard" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        <div
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Transparent stage — each poster carries its own rounded frame + shadow. */}
          <div className="overflow-hidden rounded-3xl">
            {/* Slides track */}
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${index * 100}%)` }}
            >
              {items.map((n) => {
                const Poster = (
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    className="max-h-full max-w-full rounded-2xl object-contain shadow-card-hover"
                  />
                )
                return (
                  <div key={n.id} className="min-w-full">
                    <div className="flex h-[26rem] items-center justify-center p-3 sm:h-[34rem] sm:p-5">
                      {n.image ? (
                        n.link ? (
                          <a
                            href={n.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-full w-full items-center justify-center"
                            aria-label={n.title}
                          >
                            {Poster}
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setZoomed(n)}
                            className="flex h-full w-full cursor-zoom-in items-center justify-center"
                            aria-label={`הגדלת המודעה: ${n.title}`}
                          >
                            {Poster}
                          </button>
                        )
                      ) : (
                        <span className="font-heading text-2xl text-ink-muted">{n.title}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Arrows (hidden for a single notice) */}
            {count > 1 && (
              <>
                <button
                  onClick={() => go(index + 1)}
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-card ring-1 ring-ink/5 transition hover:bg-cream"
                  aria-label="המודעה הבאה"
                >
                  <ChevronRight />
                </button>
                <button
                  onClick={() => go(index - 1)}
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-card ring-1 ring-ink/5 transition hover:bg-cream"
                  aria-label="המודעה הקודמת"
                >
                  <ChevronLeft />
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          {(current?.caption || current?.title) && (
            <p className="mt-4 text-center text-base font-medium text-ink">
              {current.caption || current.title}
            </p>
          )}

          {/* Dots */}
          {count > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {items.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-6 bg-gold' : 'w-2 bg-ink/20 hover:bg-ink/40'
                  }`}
                  aria-label={`מעבר למודעה ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-size view */}
      {zoomed?.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setZoomed(null)}
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.title}
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setZoomed(null)}
            aria-label="סגירה"
          >
            <CloseIcon />
          </button>

          {count > 1 && (
            <>
              <button
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  go(index + 1)
                }}
                aria-label="המודעה הבאה"
              >
                <ChevronRight />
              </button>
              <button
                className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  go(index - 1)
                }}
                aria-label="המודעה הקודמת"
              >
                <ChevronLeft />
              </button>
            </>
          )}

          <img
            src={zoomed.image}
            alt={zoomed.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full animate-scale-in rounded-xl object-contain"
          />
        </div>
      )}
    </section>
  )
}
