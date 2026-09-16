/**
 * Prayer-schedule helpers. The תפילות tab groups prayers into weekday and
 * Shabbat. Items saved before the `day` field existed spelled it out in the
 * name instead — "שחרית (שבת)" — so normalise both shapes here, once, and the
 * site groups them correctly without anyone re-entering data.
 */
import type { ScheduleItem, TefilaDay } from '../types/models'

/** Display order of the groups. */
export const TEFILA_DAYS: readonly TefilaDay[] = ['חול', 'שבת']

/** Group heading shown on the site. */
export const TEFILA_DAY_LABELS: Record<TefilaDay, string> = {
  חול: 'ימי חול',
  שבת: 'שבת קודש',
}

/** A trailing "(חול)" / "(שבת)" on a legacy name. */
const DAY_SUFFIX = /\s*\(\s*(חול|שבת)\s*\)\s*$/

const isTefilaDay = (v: unknown): v is TefilaDay => TEFILA_DAYS.includes(v as TefilaDay)

/**
 * The item with its day resolved and the name cleaned: an explicit `day` wins,
 * then a suffix in the name, then weekday (the common case). A day suffix is
 * always stripped from the name — it is what the group heading now says.
 */
export function normalizeTefila<T extends ScheduleItem>(item: T): T & { day: TefilaDay } {
  const match = (item.name ?? '').match(DAY_SUFFIX)
  const fromName = match?.[1] as TefilaDay | undefined
  return {
    ...item,
    name: match ? item.name.replace(DAY_SUFFIX, '') : item.name,
    day: isTefilaDay(item.day) ? item.day : (fromName ?? 'חול'),
  }
}

export interface TefilaGroup<T extends ScheduleItem> {
  day: TefilaDay
  label: string
  items: (T & { day: TefilaDay })[]
}

/** Prayers split by day, in display order, keeping each group's stored order. Empty groups are dropped. */
export function groupTefilot<T extends ScheduleItem>(items: T[]): TefilaGroup<T>[] {
  const normalized = items.map(normalizeTefila)
  return TEFILA_DAYS.map((day) => ({
    day,
    label: TEFILA_DAY_LABELS[day],
    items: normalized.filter((i) => i.day === day),
  })).filter((g) => g.items.length > 0)
}
