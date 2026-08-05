import { useMemo } from 'react'
import { useCollection } from './useCollection'
import type { EventItem } from '../types/models'

/**
 * useEvents — upcoming community events, read from the data provider so admin
 * edits reflect live. Filters out events whose date has passed and sorts the
 * rest soonest-first. Events with no/invalid date are kept (shown last).
 */
export function useEvents() {
  const { items: all, loading } = useCollection<EventItem>('events')

  const events = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return [...all]
      .filter((e) => {
        const d = new Date(e.date ?? '')
        return isNaN(d.getTime()) || d >= today
      })
      .sort((a, b) => {
        const da = new Date(a.date ?? '').getTime()
        const db = new Date(b.date ?? '').getTime()
        if (isNaN(da)) return 1
        if (isNaN(db)) return -1
        return da - db
      })
  }, [all])

  return { events, loading }
}
