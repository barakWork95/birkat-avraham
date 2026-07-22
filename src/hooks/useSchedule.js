import { useMemo, useState } from 'react'
import { scheduleData } from '../data/mockData'

/**
 * useSchedule — provides the daily schedule + active-tab state.
 *
 * PHASE 2: replace the `useMemo` body with a data fetch, e.g.
 *   const { data } = useQuery(['schedule'], () => fetch('/api/schedule').then(r => r.json()))
 * The returned shape { tabs, activeTab, setActiveTab, items } must stay identical
 * so no UI component needs to change.
 */
export function useSchedule() {
  const { tabs } = scheduleData
  const [activeTab, setActiveTab] = useState(tabs[0].key)

  const items = useMemo(() => scheduleData[activeTab] ?? [], [activeTab])

  return { tabs, activeTab, setActiveTab, items }
}
