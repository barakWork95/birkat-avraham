import { HeartIcon, BookIcon, StarIcon, HandsIcon, ChevronLeft } from './ui/Icons'
import { useInfo } from '../hooks/useInfo'

const PILLARS = [
  { icon: BookIcon, title: 'כולל אברכים', desc: 'תלמידי חכמים העמלים בתורה' },
  { icon: StarIcon, title: 'בית כנסת קהילתי', desc: 'תפילות ושיעורים מדי יום' },
  { icon: HandsIcon, title: 'פעילות וחסד', desc: 'אירועים, נוער וחלוקת מזון' },
]

interface HeroProps {
  onDonate: () => void
}

/**
 * Hero — dignified header with mission statement and primary CTAs,
 * followed by the three institutional pillars.
 */
export default function Hero({ onDonate }: HeroProps) {
  const institutionInfo = useInfo()
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Decorative royal backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1100px 520px at 80% -10%, rgba(212,175,55,0.16), transparent 60%),' +
            'radial-gradient(900px 500px at 0% 0%, rgba(184,134,11,0.10), transparent 55%)',
        }}
      />
      {/* subtle top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />

      <div className="section pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-in mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-4 py-1.5 text-sm font-medium text-gold-hover backdrop-blur">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-gold text-gold" />
            תורה · תפילה · חסד
          </span>

          <h1 className="animate-fade-up font-heading text-5xl font-black leading-[1.1] text-ink sm:text-7xl">
            <span className="block">מוסדות</span>
            <span className="block whitespace-nowrap text-gold">״{institutionInfo.nameHe}״</span>
          </h1>

          <p className="animate-fade-up mt-4 text-lg font-medium text-ink-soft sm:text-xl" style={{ animationDelay: '0.08s' }}>
            בראשות {institutionInfo.ravName}
          </p>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg" style={{ animationDelay: '0.16s' }}>
            {institutionInfo.mission}
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.24s' }}>
            <button onClick={onDonate} className="btn-primary w-full sm:w-auto">
              <HeartIcon className="h-5 w-5" />
              היו שותפים במפעל
            </button>
            <a href="#schedule" className="btn-outline w-full sm:w-auto">
              לוח שיעורים ותפילות
              <ChevronLeft className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Pillars */}
        <div className="animate-fade-up mt-16 grid gap-4 sm:grid-cols-3" style={{ animationDelay: '0.32s' }}>
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
    </section>
  )
}
