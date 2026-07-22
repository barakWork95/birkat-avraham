import { useCallback, useEffect, useRef, useState } from 'react'
import { impactSlides } from '../data/mockData'
import { ChevronLeft, ChevronRight } from './ui/Icons'

/**
 * ImpactCarousel — auto-advancing, swipeable carousel showing where
 * donations go. Pauses on hover/focus; supports dots + arrows.
 */
export default function ImpactCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const count = impactSlides.length

  const go = useCallback((next) => setIndex((i) => (next + count) % count), [count])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(index + 1), 4500)
    return () => clearInterval(t)
  }, [index, paused, go])

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    // RTL: swipe left → next, swipe right → prev
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-ink/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      >
        {impactSlides.map((s) => (
          <div key={s.id} className="relative min-w-full">
            <div className="aspect-[4/3] w-full sm:aspect-[16/10]" style={{ background: s.gradient }}>
              {/* watermark hebrew letter */}
              <span className="pointer-events-none absolute inset-0 grid place-items-center font-heading text-[10rem] text-white/5 sm:text-[14rem]">
                ב
              </span>
            </div>
            {/* Caption overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">{s.title}</h3>
                  <p className="mt-1 max-w-md text-sm text-white/80 sm:text-base">{s.caption}</p>
                </div>
                <div className="hidden shrink-0 text-left sm:block">
                  <div className="font-heading text-4xl font-black text-gold-light">{s.stat}</div>
                  <div className="text-xs text-white/70">{s.statLabel}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-card backdrop-blur transition hover:bg-white"
        aria-label="השקופית הבאה"
      >
        <ChevronRight />
      </button>
      <button
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-card backdrop-blur transition hover:bg-white"
        aria-label="השקופית הקודמת"
      >
        <ChevronLeft />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {impactSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-gold-light' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`מעבר לשקופית ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
