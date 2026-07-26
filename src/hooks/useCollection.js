import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'

/**
 * useCollection — read a content collection reactively.
 *
 * Initializes synchronously (no loading flash in local mode) and re-renders
 * whenever the collection changes (admin edits, other tabs, or Firestore
 * onSnapshot once Firebase is wired). Same hook powers the public site AND the
 * admin list screens, so admin edits reflect on the site immediately.
 */
export function useCollection(name) {
  const [items, setItems] = useState(() => provider.getAllSync?.(name) ?? [])

  useEffect(() => {
    let alive = true
    // pull latest (async providers resolve here; local resolves instantly)
    provider.getAll(name).then((d) => alive && setItems(d))
    const unsub = provider.subscribe?.(name, (d) => alive && setItems(d))
    return () => {
      alive = false
      unsub?.()
    }
  }, [name])

  return items
}
