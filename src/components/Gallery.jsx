import { useEffect, useMemo, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import { PlayIcon, CloseIcon, ChevronLeft, ChevronRight } from './ui/Icons'
import { useCollection } from '../hooks/useCollection'

const CATEGORIES = ['הכל', 'שיעורים', 'כולל', 'חסד', 'אירועים', 'נוער']

/**
 * Gallery — filterable media grid with a keyboard-navigable lightbox.
 * Reads from the data provider so admin edits reflect live.
 */
export default function Gallery() {
  const galleryData = useCollection('gallery')
  const [filter, setFilter] = useState('הכל')
  const [lightbox, setLightbox] = useState(null) // index within `items`

  const items = useMemo(
    () => (filter === 'הכל' ? galleryData : galleryData.filter((g) => g.category === filter)),
    [filter, galleryData],
  )

  // reset lightbox if the filter removes the open item
  useEffect(() => {
    setLightbox(null)
  }, [filter])

  const active = lightbox != null ? items[lightbox] : null

  const move = (dir) =>
    setLightbox((i) => (i == null ? i : (i + dir + items.length) % items.length))

  // keyboard controls
  useEffect(() => {
    if (lightbox == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') move(1) // RTL: left = next
      if (e.key === 'ArrowRight') move(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, items.length])

  return (
    <section id="gallery" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow="גלריה"
          title="תמונות וסרטונים"
          subtitle="רגעים מבית המדרש, מהאירועים ומפעילות החסד."
        />

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filter === c
                  ? 'bg-ink text-gold-light'
                  : 'bg-white text-ink-muted ring-1 ring-ink/10 hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setLightbox(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/5 transition-all hover:shadow-card-hover"
              style={{ background: g.gradient }}
            >
              {g.image ? (
                <img src={g.image} alt={g.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="pointer-events-none absolute inset-0 grid place-items-center font-heading text-6xl text-white/10">
                  ב
                </span>
              )}
              {/* overlay */}
              <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
              {g.type === 'video' && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-transform group-hover:scale-110">
                    <PlayIcon className="h-6 w-6 translate-x-0.5" />
                  </span>
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-right">
                <span className="block truncate text-sm font-semibold text-white">{g.title}</span>
                <span className="text-[11px] text-gold-light">{g.category}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="סגירה"
          >
            <CloseIcon />
          </button>

          {/* prev / next */}
          <button
            className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); move(1) }}
            aria-label="הבא"
          >
            <ChevronRight />
          </button>
          <button
            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); move(-1) }}
            aria-label="הקודם"
          >
            <ChevronLeft />
          </button>

          <div
            className="w-full max-w-4xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === 'video' ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={active.videoUrl}
                  title={active.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : active.image ? (
              <img
                src={active.image}
                alt={active.title}
                className="max-h-[80vh] w-full rounded-2xl object-contain"
              />
            ) : (
              <div
                className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-2xl"
                style={{ background: active.gradient }}
              >
                <span className="font-heading text-[12rem] text-white/10">ב</span>
              </div>
            )}
            <div className="mt-4 text-center">
              <h3 className="font-heading text-xl font-bold text-white">{active.title}</h3>
              <p className="text-sm text-gold-light">{active.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
