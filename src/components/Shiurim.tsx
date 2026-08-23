import { useEffect, useMemo, useState, type SyntheticEvent } from 'react'
import SectionTitle from './ui/SectionTitle'
import { ChevronLeft, ChevronRight, CloseIcon, PlayIcon } from './ui/Icons'
import { useCollection } from '../hooks/useCollection'
import { useSectionText } from '../hooks/useSectionText'
import { youTubeEmbedUrl, youTubeThumbnail } from '../lib/youtube'
import type { Shiur } from '../types/models'

const ALL = 'הכל'

/** Poster frame for a tile: an uploaded cover, else YouTube's own frame. */
const coverOf = (s: Shiur): string | null => s.image || youTubeThumbnail(s.videoUrl)

/**
 * Older uploads have no maxres frame. YouTube answers those with a 120×90 grey
 * placeholder — and Chrome *renders* it (firing `load`, not `error`, despite
 * the 404), so the giveaway is the decoded width, not a failed request. Either
 * signal swaps the tile to hqdefault, which exists for every video.
 */
const swapToHqFrame = (s: Shiur, img: HTMLImageElement) => {
  if (s.image || img.dataset.fallback) return
  const hq = youTubeThumbnail(s.videoUrl, 'hq')
  if (!hq) return
  img.dataset.fallback = '1'
  img.src = hq
}

const onCoverLoad = (s: Shiur) => (e: SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.naturalWidth <= 120) swapToHqFrame(s, e.currentTarget)
}

const onCoverError = (s: Shiur) => (e: SyntheticEvent<HTMLImageElement>) =>
  swapToHqFrame(s, e.currentTarget)

/**
 * Shiurim — the rav's video shiurim (שיעורי הרב). A filterable grid of video
 * cards that open in a lightbox player, fed from the data provider so gabbaim
 * publish a new shiur by pasting a YouTube link in the admin.
 *
 * Like the notice board, the whole section hides itself while empty.
 */
export default function Shiurim() {
  const { items } = useCollection<Shiur>('shiurim')
  const text = useSectionText('shiurim')
  const [filter, setFilter] = useState(ALL)
  const [playing, setPlaying] = useState<number | null>(null)

  // Only offer chips for topics that actually have shiurim.
  const categories = useMemo(() => {
    const used: string[] = []
    items.forEach((s) => {
      if (s.category && !used.includes(s.category)) used.push(s.category)
    })
    return used.length > 1 ? [ALL, ...used] : []
  }, [items])

  const shown = useMemo(
    () => (filter === ALL ? items : items.filter((s) => s.category === filter)),
    [items, filter],
  )

  // Reset the player if the visible list changes under it (filter, admin edit).
  useEffect(() => {
    setPlaying(null)
  }, [filter, items.length])

  // Lightbox: Esc closes, arrows page through the filtered list.
  useEffect(() => {
    if (playing === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(null)
      if (e.key === 'ArrowLeft') setPlaying((i) => ((i ?? 0) + 1) % shown.length)
      if (e.key === 'ArrowRight') setPlaying((i) => ((i ?? 0) - 1 + shown.length) % shown.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [playing, shown.length])

  // No shiurim yet → no section (also covers the cold-load window).
  if (items.length === 0) return null

  const go = (dir: 1 | -1) => setPlaying((i) => ((i ?? 0) + dir + shown.length) % shown.length)
  const active = playing === null ? null : shown[playing]

  return (
    <section id="shiurim" className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        {/* Topic filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === c
                    ? 'bg-gold text-white shadow-gold'
                    : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s, i) => {
            const cover = coverOf(s)
            return (
              <button
                key={s.id}
                onClick={() => setPlaying(i)}
                className="card group overflow-hidden p-0 text-right transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Poster */}
                <div className="relative aspect-video w-full overflow-hidden bg-ink">
                  {cover ? (
                    <img
                      src={cover}
                      alt={s.title}
                      loading="lazy"
                      onLoad={onCoverLoad(s)}
                      onError={onCoverError(s)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="pointer-events-none absolute inset-0 grid place-items-center font-heading text-6xl text-white/10">
                      ב
                    </span>
                  )}
                  <span className="absolute inset-0 bg-ink/10 transition-colors group-hover:bg-ink/30" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-transform group-hover:scale-110">
                      <PlayIcon className="h-6 w-6 translate-x-0.5" />
                    </span>
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 p-4">
                  <h3 className="line-clamp-2 font-semibold leading-snug text-ink">{s.title}</h3>
                  <p className="text-xs text-ink-muted">
                    {[s.category, s.date].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Player */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setPlaying(null)}
            aria-label="סגירה"
          >
            <CloseIcon />
          </button>

          {shown.length > 1 && (
            <>
              <button
                className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                aria-label="השיעור הבא"
              >
                <ChevronRight />
              </button>
              <button
                className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                aria-label="השיעור הקודם"
              >
                <ChevronLeft />
              </button>
            </>
          )}

          <div className="w-full max-w-4xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <iframe
                key={active.id}
                src={youTubeEmbedUrl(active.videoUrl)}
                title={active.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="font-heading text-lg font-bold text-white">{active.title}</h3>
              <p className="text-sm text-white/60">
                {[active.category, active.date].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
