import { useMemo } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import SectionTitle from './ui/SectionTitle'
import Skeleton from './ui/Skeleton'
import { ClockIcon, PinIcon } from './ui/Icons'
import { useSectionText } from '../hooks/useSectionText'
import { groupTefilot } from '../lib/tefilot'
import type { ScheduleItem } from '../types/models'

/** One schedule card: time chip + name, note and location. */
function ScheduleCard({ item, index }: { item: ScheduleItem; index: number }) {
  return (
    <div
      className="card animate-fade-up flex items-center gap-4 p-4 hover:-translate-y-0.5 hover:shadow-card-hover"
      style={{ animationDelay: `${index * 0.05}s` }}
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
  )
}

/**
 * Schedule — tabbed daily schedule (prayers / shiurim / kollel).
 * Data + active tab come from useSchedule(). The prayers tab is further
 * grouped under "ימי חול" and "שבת קודש" headings (see lib/tefilot.ts).
 */
export default function Schedule() {
  const text = useSectionText('schedule')
  const { tabs, activeTab, setActiveTab, items, loading } = useSchedule()
  // Other tabs render as a single ungrouped list.
  const groups = useMemo(
    () =>
      activeTab === 'tefilot'
        ? groupTefilot(items)
        : [{ day: null, label: null, items }],
    [activeTab, items],
  )

  return (
    <section id="schedule" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

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

        {/* Items. On the prayers tab the day groups sit side by side on desktop —
            RTL puts the first group (ימי חול) in the right-hand column and
            שבת קודש on the left — and stack weekday-first on mobile. */}
        {items.length > 0 && (
          <div
            key={activeTab}
            className={`mx-auto grid max-w-4xl items-start gap-8 ${
              groups.length > 1 ? 'lg:grid-cols-2 lg:gap-6' : ''
            }`}
          >
            {groups.map((group) => (
              <div key={group.day ?? 'all'}>
                {group.label && (
                  <div className="mb-4 flex items-center gap-4">
                    {/* RTL: the first rule sits on the right — each fades away from the heading. */}
                    <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
                    <h3 className="font-heading text-lg font-bold text-gold-hover">{group.label}</h3>
                    <span className="h-px flex-1 bg-gradient-to-l from-gold/40 to-transparent" />
                  </div>
                )}
                {/* A day column is half the width on desktop, so its cards go single-file there. */}
                <div className={`grid gap-3 sm:grid-cols-2 ${groups.length > 1 ? 'lg:grid-cols-1' : ''}`}>
                  {group.items.map((item, i) => (
                    <ScheduleCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
