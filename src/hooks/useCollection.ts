import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import type { Item } from '../types/models'

/**
 * useCollection — read a content collection reactively.
 *
 * Initializes synchronously (no loading flash) and re-renders whenever the
 * collection changes (admin edits, other tabs, or Firestore onSnapshot). Same
 * hook powers the public site AND the admin list screens, so admin edits reflect
 * on the site immediately. Pass a type param for typed items, e.g.
 * `useCollection<GalleryItem>('gallery')`.
 */
export function useCollection<T = Item>(name: string): T[] {
  const [items, setItems] = useState<T[]>(() => provider.getAllSync(name) as T[])

  useEffect(() => {
    let alive = true
    // pull latest (async providers resolve here; local resolves instantly)
    provider.getAll(name).then((d) => {
      if (alive) setItems(d as T[])
    })
    const unsub = provider.subscribe(name, (d) => {
      if (alive) setItems(d as T[])
    })
    return () => {
      alive = false
      unsub()
    }
  }, [name])

  return items
}
