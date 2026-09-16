import SectionTitle from './ui/SectionTitle'
import Avatar from './ui/Avatar'
import Skeleton from './ui/Skeleton'
import { useCollection } from '../hooks/useCollection'
import type { Contact } from '../types/models'
import { useSectionText } from '../hooks/useSectionText'

/**
 * Leadership — the "אודות" section: the featured leader (ראש המוסדות) with the
 * rav's bio in a wide card, then the rest of the staff grid.
 *
 * The bio is the section's `body` text (edited with the headings in
 * /admin/sections); blank lines split it into paragraphs.
 */
export default function Leadership() {
  const text = useSectionText('leadership')
  const { items: leadershipData, loading } = useCollection<Contact>('leadership')
  const featured = leadershipData.find((p) => p.featured)
  const rest = leadershipData.filter((p) => !p.featured)
  const paragraphs = (text.body ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section id="leadership" className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        {/* Loading skeletons (cold Firestore read) */}
        {loading && leadershipData.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card flex flex-col items-center p-6">
                <Skeleton className="h-20 w-20 !rounded-full" />
                <Skeleton className="mt-4 h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-20" />
                <Skeleton className="mt-3 h-3 w-40" />
              </div>
            ))}
          </div>
        )}

        {/* Featured leader + bio */}
        {(featured || paragraphs.length > 0) && (
          <article className="card mx-auto mb-6 max-w-4xl p-7 ring-2 ring-gold/30 sm:p-9">
            {featured && (
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-right">
                <Avatar name={featured.name} src={featured.img} size="h-28 w-28" featured />
                <div>
                  <span className="eyebrow">{featured.title}</span>
                  <h3 className="font-heading text-2xl font-bold text-ink">{featured.name}</h3>
                  {featured.desc && <p className="mt-2 text-ink-muted">{featured.desc}</p>}
                </div>
              </div>
            )}
            {paragraphs.length > 0 && (
              // Justified only from sm up — on a phone's narrow column it opens rivers.
              <div
                className={`space-y-4 text-[1.05rem] leading-loose text-ink-soft sm:text-justify ${
                  featured ? 'mt-7 border-t border-gold/15 pt-7' : ''
                }`}
              >
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </article>
        )}

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <div
              key={p.id}
              className="card animate-fade-up flex flex-col items-center p-6 text-center hover:-translate-y-1 hover:shadow-card-hover"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <Avatar name={p.name} src={p.img} size="h-20 w-20" />
              <h3 className="mt-4 font-heading text-lg font-bold text-ink">{p.name}</h3>
              <p className="text-sm font-semibold text-gold-hover">{p.title}</p>
              <p className="mt-2 text-sm text-ink-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
