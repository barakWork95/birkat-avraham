import { useEvents } from '../hooks/useEvents'
import SectionTitle from './ui/SectionTitle'
import { CalendarIcon } from './ui/Icons'

/**
 * Events — upcoming community events. Reads from the data provider
 * (useEvents), so the gabbaim can add/edit events from the admin panel and
 * they appear here automatically, with past events dropping off by date.
 */
function formatGregorian(date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  try {
    return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  } catch {
    return null
  }
}

export default function Events() {
  const { events } = useEvents()

  return (
    <section id="events" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow="לוח אירועים"
          title="אירועים קרובים"
          subtitle="הילולות, מעמדי סיום, שיעורים מיוחדים ופעילות חסד — הצטרפו אלינו."
        />

        {events.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gold/30 bg-white/50 px-6 py-12 text-center">
            <CalendarIcon className="mx-auto mb-3 h-8 w-8 text-gold" />
            <p className="font-semibold text-ink">אין אירועים קרובים כרגע</p>
            <p className="mt-1 text-sm text-ink-muted">עקבו אחרינו — אירועים חדשים יתפרסמו כאן בקרוב.</p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  )
}
