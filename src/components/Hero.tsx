import { useEffect, useState } from 'react'
import { HeartIcon, BookIcon, StarIcon, HandsIcon, ChevronLeft } from './ui/Icons'
import { useInfo } from '../hooks/useInfo'
import { useSectionText } from '../hooks/useSectionText'
import { useHeroImages } from '../hooks/useHeroImages'

const PILLARS = [
  { icon: BookIcon, title: 'כולל אברכים', desc: 'תלמידי חכמים העמלים בתורה' },
  { icon: StarIcon, title: 'בית כנסת קהילתי', desc: 'תפילות ושיעורים מדי יום' },
  { icon: HandsIcon, title: 'פעילות וחסד', desc: 'אירועים, נוער וחלוקת מזון' },
]

/**
 * In the cut-out the rav's left sleeve and jacket run off the photo's left
 * edge (and a caption graphic bit a notch out of the jacket there), which
 * would show as a hard vertical cut. Fade that edge — but only below the
 * raised hand: the second layer keeps the top 52% (hat and hand) fully opaque,
 * and mask layers combine as a union by default. The right side is clear of
 * the frame, so it needs nothing.
 */
const PORTRAIT_MASK =
  'linear-gradient(to right, transparent, #000 16%), linear-gradient(#000 52%, transparent 52%)'

/** How long each background photo holds before the next fades in. */
const SLIDE_MS = 7000

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Follows the visitor's OS "reduce motion" setting, live. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches)
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Backdrop — the hero's photos, cross-fading under a dark overlay.
 *
 * Only two photos are ever mounted: the one on screen and the one it replaced.
 * The newcomer fades in on top, and it is preloaded before the switch, so a
 * fade never reveals a half-decoded image. With "reduce motion" on, the first
 * photo simply stays put.
 */
function Backdrop({ images }: { images: string[] }) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const count = images.length
  // The list can shrink under us (an admin edit), so clamp rather than trust.
  const current = count ? index % count : 0

  useEffect(() => {
    if (count < 2 || reduced) return
    let cancelled = false
    const timer = setTimeout(() => {
      const next = (current + 1) % count
      const advance = () => {
        if (cancelled) return
        setPrev(current)
        setIndex(next)
      }
      const img = new Image()
      img.onload = advance
      img.onerror = advance // a broken photo shows the overlay — never stall the loop
      img.src = images[next]
    }, SLIDE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [current, count, reduced, images])

  const layers = [prev, current].filter(
    (i, layer): i is number => i !== null && i < count && (layer === 1 || i !== current),
  )

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {layers.map((i, layer) => (
        // Keyed by photo: the outgoing one keeps its element (and its motion)
        // while the incoming one mounts fresh on top and fades in.
        <div
          key={`${i}:${images[i]}`}
          className={`absolute inset-0 overflow-hidden ${layer === layers.length - 1 ? 'animate-fade-in-slow' : ''}`}
        >
          <img src={images[i]} alt="" className="h-full w-full object-cover motion-safe:animate-kenburns" />
        </div>
      ))}

      {/* Readability. On a phone the copy sits over the photo, so dim it evenly;
          on desktop keep it darkest behind the copy (left in RTL) and let the
          photo breathe behind the portrait. */}
      <div className="absolute inset-0 bg-ink/80 lg:bg-ink/50" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/75 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
    </div>
  )
}

interface HeroProps {
  onDonate: () => void
}

/**
 * Hero — the site's entrance: photos of the community behind a dark overlay,
 * the rav's portrait standing on the section's bottom edge, and the headline
 * with the two primary CTAs. Headline copy is editable in /admin/sections
 * ("ראש העמוד"); photos come from useHeroImages. Below it, the mission line
 * and the three institutional pillars.
 */
export default function Hero({ onDonate }: HeroProps) {
  const info = useInfo()
  const text = useSectionText('hero')
  const images = useHeroImages()

  return (
    <>
      <section id="hero" className="relative isolate overflow-hidden bg-ink text-white">
        <Backdrop images={images} />

        <div className="section grid items-end lg:min-h-[36rem] lg:grid-cols-2 lg:gap-10">
          {/* Copy */}
          <div className="pt-14 pb-8 text-center sm:pt-20 lg:self-center lg:py-24 lg:text-start">
            {text.eyebrow && (
              <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-gold-light/35 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold-light backdrop-blur">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-gold-light text-gold-light" />
                {text.eyebrow}
              </span>
            )}

            {text.title ? (
              <h1 className="animate-fade-up mt-5 text-balance font-heading text-4xl font-black leading-[1.15] drop-shadow-lg sm:text-6xl">
                {text.title}
              </h1>
            ) : (
              <h1 className="sr-only">מוסדות {info.nameHe}</h1>
            )}

            <div
              className="animate-fade-up mx-auto mt-6 h-0.5 w-48 bg-gradient-to-l from-transparent via-gold-light to-transparent lg:mx-0 lg:w-full lg:max-w-md lg:from-gold-light lg:via-gold/70"
              style={{ animationDelay: '0.08s' }}
            />

            {text.subtitle && (
              <p
                className="animate-fade-up mt-5 text-balance text-lg leading-relaxed text-white/85 sm:text-xl"
                style={{ animationDelay: '0.14s' }}
              >
                {text.subtitle}
              </p>
            )}

            <div
              className="animate-fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: '0.22s' }}
            >
              <button onClick={onDonate} className="btn-primary w-full sm:w-auto">
                <HeartIcon className="h-5 w-5" />
                תרומות ושותפות
              </button>
              <a
                href="#schedule"
                className="btn w-full border-2 border-white/30 text-white hover:border-gold-light hover:bg-white/10 sm:w-auto"
              >
                שיעורים ותפילות
                <ChevronLeft className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Portrait — first in the grid on desktop, i.e. the right side in RTL.
              Its cut-off torso sits flush on the section's bottom edge. */}
          <div className="relative flex justify-center lg:order-first">
            <div className="pointer-events-none absolute inset-x-8 bottom-0 top-1/4 rounded-full bg-gold/25 blur-3xl" />
            <img
              src="/rabbi-eitan.png"
              alt={info.ravName || 'ראש המוסדות'}
              width={533}
              height={546}
              // Nearly square, so cap the width too: at full height it would be wider than its column.
              className="animate-fade-in relative h-[19rem] w-auto max-w-full object-contain object-bottom drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] sm:h-[24rem] lg:h-[31rem]"
              style={{ maskImage: PORTRAIT_MASK, WebkitMaskImage: PORTRAIT_MASK }}
            />
          </div>
        </div>

        {/* Gold base rule */}
        <div className="h-1 bg-gradient-to-l from-gold via-gold-light to-gold" />
      </section>

      {/* Mission + pillars */}
      <div className="section pt-12 sm:pt-16">
        {info.mission && (
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-ink-muted sm:text-lg">
            {info.mission}
          </p>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card group flex items-center gap-4 p-5 hover:-translate-y-1 hover:shadow-card-hover">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <p className="text-sm text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
