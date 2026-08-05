import { useEffect, useMemo, useState } from 'react'
import SectionTitle from './ui/SectionTitle'
import Skeleton from './ui/Skeleton'
import { PlayIcon, StackIcon, CloseIcon, ChevronLeft, ChevronRight } from './ui/Icons'
import { useCollection } from '../hooks/useCollection'
import type { GalleryItem } from '../types/models'

const CATEGORIES = ['הכל', 'שיעורים', 'כולל', 'חסד', 'אירועים', 'נוער']

/** Album cover: explicit cover image, else the first photo entry's image. */
const coverOf = (g: GalleryItem): string =>
  g.image || g.media?.find((m) => m.type === 'photo' && m.image)?.image || ''

/**
 * Gallery — filterable media grid with a keyboard-navigable lightbox.
 * Items are single photos/videos or albums (a set of media paged in the
 * lightbox). Reads from the data provider so admin edits reflect live.
 */
export default function Gallery() {
  const { items: galleryData, loading } = useCollection<GalleryItem>('gallery')
  const [filter, setFilter] = useState('הכל')
  const [lightbox, setLightbox] = useState<number | null>(null) // index within `items`
  const [albumPage, setAlbumPage] = useState(0) // index within the open album's media

  const items = useMemo(
    () => (filter === 'הכל' ? galleryData : galleryData.filter((g) => g.category === filter)),
    [filter, galleryData],
  )

  // reset lightbox if the filter removes the open item
  useEffect(() => {
    setLightbox(null)
  }, [filter])

  // start each opened item at its first album page
  useEffect(() => {
    setAlbumPage(0)
  }, [lightbox])

  const active = lightbox != null ? items[lightbox] : null
  const albumMedia = active?.type === 'album' ? (active.media ?? []) : []
  const currentMedia = albumMedia[albumPage]

  const move = (dir: number) =>
    setLightbox((i) => (i == null ? i : (i + dir + items.length) % items.length))

  // arrows/keyboard page within the album's media, else across gallery items
  const go = (dir: number) => {
    if (active?.type === 'album' && albumMedia.length > 0) {
      setAlbumPage((p) => (p + dir + albumMedia.length) % albumMedia.length)
    } else {
      move(dir)
    }
  }

  // keyboard controls
  useEffect(() => {
    if (lightbox == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') go(1) // RTL: left = next
      if (e.key === 'ArrowRight') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, items.length, albumMedia.length, active?.type])

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

        {/* Loading skeletons (cold Firestore read) */}
        {loading && galleryData.length === 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square !rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state (loaded, nothing in this filter) */}
        {!loading && items.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gold/30 bg-white/50 px-6 py-12 text-center text-ink-muted">
            אין עדיין פריטים בגלריה.
          </div>
        )}

        {/* Grid */}
        {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g, i) => {
            const isAlbum = g.type === 'album'
            const cover = isAlbum ? coverOf(g) : g.image
            const count = g.media?.length ?? 0
            return (
            <button
              key={g.id}
              onClick={() => setLightbox(i)}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/5 transition-all hover:shadow-card-hover"
              style={{ background: g.gradient }}
            >
              {/* Stacked-cards hint for albums */}
              {isAlbum && (
                <span className="pointer-events-none absolute -top-1.5 right-2 left-2 h-3 rounded-t-xl bg-white/25" />
              )}

              {cover ? (
                <img src={cover} alt={g.title} className="absolute inset-0 h-full w-full object-cover" />
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

              {/* Album count badge */}
              {isAlbum && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  <StackIcon className="h-3.5 w-3.5" />
                  {count}
                </span>
              )}

              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-right">
                <span className="block truncate text-sm font-semibold text-white">{g.title}</span>
                <span className="text-[11px] text-gold-light">{isAlbum ? 'אלבום' : g.category}</span>
              </span>
            </button>
            )
          })}
        </div>
        )}
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
            onClick={(e) => { e.stopPropagation(); go(1) }}
            aria-label="הבא"
          >
            <ChevronRight />
          </button>
          <button
            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); go(-1) }}
            aria-label="הקודם"
          >
            <ChevronLeft />
          </button>

          <div
            className="w-full max-w-4xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === 'album' ? (
              currentMedia?.type === 'video' && currentMedia.videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                  <iframe
                    src={currentMedia.videoUrl}
                    title={active.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : currentMedia?.image ? (
                <img
                  src={currentMedia.image}
                  alt={currentMedia.caption || active.title}
                  className="max-h-[80vh] w-full rounded-2xl object-contain"
                />
              ) : (
                <div
                  className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-2xl"
                  style={{ background: active.gradient }}
                >
                  <span className="font-heading text-[12rem] text-white/10">ב</span>
                </div>
              )
            ) : active.type === 'video' ? (
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
              {active.type === 'album' ? (
                <p className="text-sm text-gold-light">
                  {currentMedia?.caption ? `${currentMedia.caption} · ` : ''}
                  {albumMedia.length > 0 ? `${albumPage + 1} / ${albumMedia.length}` : ''}
                </p>
              ) : (
                <p className="text-sm text-gold-light">{active.category}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
