import { Link } from 'react-router-dom'
import { COLLECTIONS, COLLECTION_KEYS } from '../config/collections'
import { provider } from '../services/dataProvider'

/**
 * Dashboard — overview cards with item counts + quick links.
 */
export default function Dashboard() {
  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-bold">שלום וברכה 👋</h1>
      <p className="mb-6 text-ink-muted">בחרו קטגוריה לעריכה. השינויים נשמרים אוטומטית.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTION_KEYS.map((key) => {
          const count = provider.getAllSync?.(key)?.length ?? 0
          return (
            <Link
              key={key}
              to={`/admin/${key}`}
              className="card p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-heading text-lg font-bold">{COLLECTIONS[key].label}</h2>
                <span className="font-heading text-2xl font-black text-gold">{count}</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">פריטים · לחצו לעריכה</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-ink-muted">
        <strong className="text-ink">מצב הדגמה (Local):</strong> השינויים נשמרים בדפדפן זה בלבד.
        לאחר חיבור Firebase, העריכות יתעדכנו באתר החי לכל המבקרים.
      </div>
    </div>
  )
}
