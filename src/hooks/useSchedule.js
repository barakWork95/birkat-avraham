import { useState } from 'react'
import { useCollection } from './useCollection'

/**
 * useSchedule — daily schedule + active-tab state. Each tab is backed by its
 * own provider collection, so admin edits reflect on the site immediately.
 */
const TABS = [
  { key: 'shiurim', label: 'שיעורים' },
  { key: 'kollel', label: 'כולל ערב' },
]

export function useSchedule() {
  const [activeTab, setActiveTab] = useState('shiurim')
  const shiurim = useCollection('scheduleShiurim')
  const kollel = useCollection('scheduleKollel')

  const items = activeTab === 'shiurim' ? shiurim : kollel

  return { tabs: TABS, activeTab, setActiveTab, items }
}
