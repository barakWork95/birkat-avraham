import SectionTitle from './ui/SectionTitle'
import Avatar from './ui/Avatar'
import { useCollection } from '../hooks/useCollection'

/**
 * Leadership — staff grid. The featured leader (ראש המוסדות) spans a
 * wider, elevated card at the top.
 *
 * Reads from the data provider (useCollection), so edits made in the admin
 * panel reflect here immediately — the proven end-to-end slice.
 */
export default function Leadership() {
  const leadershipData = useCollection('leadership')
  const featured = leadershipData.find((p) => p.featured)
  const rest = leadershipData.filter((p) => !p.featured)

  return (
    <section id="leadership" className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow="הנהלה וצוות"
          title="אנשי קשר ובעלי תפקידים"
          subtitle="העומדים בראש המוסדות ומובילים את פעילות התורה, התפילה והחסד."
        />

        {/* Featured */}
        {featured && (
          <div className="card mx-auto mb-6 flex max-w-3xl flex-col items-center gap-6 p-7 text-center ring-2 ring-gold/30 sm:flex-row sm:text-right">
            <Avatar name={featured.name} src={featured.img} size="h-28 w-28" featured />
            <div>
              <span className="eyebrow">{featured.title}</span>
              <h3 className="font-heading text-2xl font-bold text-ink">{featured.name}</h3>
              <p className="mt-2 text-ink-muted">{featured.desc}</p>
            </div>
          </div>
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
