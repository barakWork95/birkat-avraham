import { useEvents } from '../hooks/useEvents'
import SectionTitle from './ui/SectionTitle'
import { CalendarIcon } from './ui/Icons'
import { useSectionText } from '../hooks/useSectionText'

/**
 * Events — upcoming community events. Reads from the data provider
 * (useEvents), so the gabbaim can add/edit events from the admin panel and
 * they appear here automatically, with past events dropping off by date.
 *
 * Like the notice board, the section hides itself when there is nothing to
 * show — note that "nothing" here means no UPCOMING events, so a board of
 * events that have all passed removes the section on its own.
 */
function formatGregorian(date: string | undefined): string | null {
  const d = new Date(date ?? '')
  if (isNaN(d.getTime())) return null
  try {
    return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  } catch {
    return null
  }
}

export default function Events() {
  const text = useSectionText('events')
  const { events } = useEvents()

  // Nothing coming up → no section (also covers the cold-load window).
  if (events.length === 0) return null

  return (
    <section id="events" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev, i) => {
            const gregorian = formatGregorian(ev.date)
            return (
              <article
                key={ev.id || i}
                className="card animate-fade-up flex gap-4 p-5 hover:-translate-y-1 hover:shadow-card-hover"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Date block */}
                <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-ink px-3 py-3 text-center text-gold-light">
                  <CalendarIcon className="mb-1 h-4 w-4 opacity-70" />
                  {ev.hebrewDate && (
                    <span className="whitespace-nowrap font-heading text-sm font-bold leading-tight">
                      {ev.hebrewDate}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-lg font-bold text-ink">{ev.title}</h3>
                  {gregorian && <p className="mt-0.5 text-xs font-medium text-gold-hover">{gregorian}</p>}
                  {ev.desc && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{ev.desc}</p>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
