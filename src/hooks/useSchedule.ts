import { useState } from 'react'
import { useCollection } from './useCollection'
import type { ScheduleItem } from '../types/models'

/**
 * useSchedule — daily schedule + active-tab state. Each tab is backed by its
 * own provider collection, so admin edits reflect on the site immediately.
 */
const TABS = [
  { key: 'tefilot', label: 'תפילות' },
  { key: 'shiurim', label: 'שיעורים' },
  { key: 'kollel', label: 'כולל ערב' },
] as const

type TabKey = (typeof TABS)[number]['key']

export function useSchedule() {
  const [activeTab, setActiveTab] = useState<TabKey>('tefilot')
  const tefilot = useCollection<ScheduleItem>('scheduleTefilot')
  const shiurim = useCollection<ScheduleItem>('scheduleShiurim')
  const kollel = useCollection<ScheduleItem>('scheduleKollel')

  const byTab = { tefilot, shiurim, kollel }
  const active = byTab[activeTab]

  return { tabs: TABS, activeTab, setActiveTab, items: active.items, loading: active.loading }
}
