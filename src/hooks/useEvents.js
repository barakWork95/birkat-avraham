import { useMemo } from 'react'
import { eventsData } from '../data/mockData'

/**
 * useEvents — upcoming community events, sorted soonest-first.
 * PHASE 2: replace the constant with GET /api/events.
 */
export function useEvents() {
  const events = useMemo(
    () => [...eventsData].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [],
  )
  return { events }
}
