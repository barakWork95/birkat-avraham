import { useState } from 'react'
import { useCollection } from './useCollection'
import type { ScheduleItem } from '../types/models'

/**
 * useSchedule — daily schedule + active-tab state. Each tab is backed by its
 * own provider collection, so admin edits reflect on the site immediately.
 */
const TABS = [
  { key: 'shiurim', label: 'שיעורים' },
  { key: 'kollel', label: 'כולל ערב' },
] as const

export function useSchedule() {
  const [activeTab, setActiveTab] = useState<'shiurim' | 'kollel'>('shiurim')
  const shiurim = useCollection<ScheduleItem>('scheduleShiurim')
  const kollel = useCollection<ScheduleItem>('scheduleKollel')

  const items = activeTab === 'shiurim' ? shiurim : kollel

  return { tabs: TABS, activeTab, setActiveTab, items }
}
