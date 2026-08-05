import { useSchedule } from '../hooks/useSchedule'
import SectionTitle from './ui/SectionTitle'
import Skeleton from './ui/Skeleton'
import { ClockIcon, PinIcon } from './ui/Icons'

/**
 * Schedule — tabbed daily schedule (prayers / shiurim / kollel).
 * Data + active tab come from useSchedule().
 */
export default function Schedule() {
  const { tabs, activeTab, setActiveTab, items, loading } = useSchedule()

  return (
    <section id="schedule" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow='לו"ז שבועי'
          title="תפילות, שיעורים וכולל ערב"
          subtitle="זמני התפילות, שיעורי הרב איתן אברהם שליט״א וסדרי הכולל בבית המדרש."
        />

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl bg-white p-1.5 shadow-card ring-1 ring-ink/5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all sm:text-base ${
                  activeTab === t.key
                    ? 'bg-gradient-to-l from-gold to-gold-light text-white shadow-gold'
                    : 'text-ink-muted hover:bg-gold/5 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons (cold Firestore read) */}
        {loading && items.length === 0 && (
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[76px] w-full !rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state (loaded, no items in this tab) */}
        {!loading && items.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gold/30 bg-white/50 px-6 py-10 text-center text-ink-muted">
            אין פריטים משובצים כרגע.
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
        <div key={activeTab} className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="card animate-fade-up flex items-center gap-4 p-4 hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Time chip */}
              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-ink px-3 py-2 text-center text-gold-light">
                <ClockIcon className="mb-0.5 h-4 w-4 opacity-70" />
                <span className="whitespace-nowrap font-heading text-sm font-bold leading-none">
                  {item.time}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-ink">{item.name}</h3>
                {item.sub && <p className="truncate text-sm text-gold-hover">{item.sub}</p>}
                {item.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    <PinIcon className="h-3.5 w-3.5" />
                    {item.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
