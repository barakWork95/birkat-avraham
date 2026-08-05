import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import type { Item } from '../types/models'

export interface CollectionState<T> {
  items: T[]
  /**
   * True while the first async read is in flight with nothing to show yet.
   * Local mode seeds synchronously, so this starts false there; Firestore's
   * in-memory sync cache is empty on a cold load, so it starts true until the
   * first `getAll`/snapshot resolves. Lets sections show a skeleton instead of
   * flashing an empty state, while a genuinely empty collection ends up
   * `{ items: [], loading: false }`.
   */
  loading: boolean
}

/**
 * useCollection — read a content collection reactively.
 *
 * Initializes synchronously from the provider's sync cache and re-renders
 * whenever the collection changes (admin edits, other tabs, or Firestore
 * onSnapshot). Same hook powers the public site AND the admin list screens, so
 * admin edits reflect on the site immediately. Pass a type param for typed
 * items, e.g. `useCollection<GalleryItem>('gallery')`.
 */
export function useCollection<T = Item>(name: string): CollectionState<T> {
  const [items, setItems] = useState<T[]>(() => provider.getAllSync(name) as T[])
  const [loading, setLoading] = useState<boolean>(() => provider.getAllSync(name).length === 0)

  useEffect(() => {
    let alive = true
    // Reset for the new name: loading only if we have nothing cached to show.
    const cached = provider.getAllSync(name) as T[]
    setItems(cached)
    setLoading(cached.length === 0)
    // pull latest (async providers resolve here; local resolves instantly)
    provider.getAll(name).then((d) => {
      if (alive) {
        setItems(d as T[])
        setLoading(false)
      }
    })
    const unsub = provider.subscribe(name, (d) => {
      if (alive) {
        setItems(d as T[])
        setLoading(false)
      }
    })
    return () => {
      alive = false
      unsub()
    }
  }, [name])

  return { items, loading }
}
