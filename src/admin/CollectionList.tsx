import { Link, useParams } from 'react-router-dom'
import { COLLECTIONS } from '../config/collections'
import { useCollection } from '../hooks/useCollection'
import { provider } from '../services/dataProvider'

/**
 * CollectionList — generic list screen for any collection (schema-driven).
 * Add / edit / delete / reorder.
 */
export default function CollectionList() {
  const { name } = useParams()
  const schema = name ? COLLECTIONS[name] : undefined
  const { items, loading } = useCollection(name ?? '')

  if (!name || !schema) return <p className="text-ink-muted">קטגוריה לא נמצאה.</p>

  const onDelete = async (id: string, title: string) => {
    if (window.confirm(`למחוק את "${title}"?`)) await provider.remove(name, id)
  }
  const onReset = async () => {
    if (window.confirm('לשחזר את הקטגוריה לברירת המחדל? כל השינויים יימחקו.')) await provider.reset(name)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">{schema.label}</h1>
          <p className="text-sm text-ink-muted">{items.length} פריטים</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} className="rounded-lg bg-ink/5 px-3 py-2 text-sm font-medium hover:bg-ink/10">
            שחזור ברירת מחדל
          </button>
          <Link to={`/admin/${name}/new`} className="btn-primary !py-2 !px-4">
            + הוספה
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {loading && items.length === 0 && (
          <div className="card p-8 text-center text-ink-muted">טוען…</div>
        )}
        {!loading && items.length === 0 && (
          <div className="card p-8 text-center text-ink-muted">אין עדיין פריטים. לחצו על "הוספה".</div>
        )}
        {items.map((item, idx) => (
          <div key={item.id} className="card flex items-center gap-3 p-3">
            {/* reorder */}
            <div className="flex flex-col">
              <button
                onClick={() => provider.move(name, item.id, -1)}
                disabled={idx === 0}
                className="px-1 text-ink-muted hover:text-gold disabled:opacity-30"
                aria-label="הזז מעלה"
              >
                ▲
              </button>
              <button
                onClick={() => provider.move(name, item.id, 1)}
                disabled={idx === items.length - 1}
                className="px-1 text-ink-muted hover:text-gold disabled:opacity-30"
                aria-label="הזז מטה"
              >
                ▼
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{schema.itemTitle(item)}</p>
              {schema.itemSubtitle && (
                <p className="truncate text-sm text-ink-muted">{schema.itemSubtitle(item)}</p>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                to={`/admin/${name}/${item.id}`}
                className="rounded-lg bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold-hover hover:bg-gold/20"
              >
                עריכה
              </Link>
              <button
                onClick={() => onDelete(item.id, schema.itemTitle(item))}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                מחיקה
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
