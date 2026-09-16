import { describe, it, expect } from 'vitest'
import { groupTefilot, normalizeTefila } from './tefilot'
import type { ScheduleItem } from '../types/models'

const item = (patch: Partial<ScheduleItem> & { name: string }): ScheduleItem => ({ id: patch.name, ...patch })

describe('normalizeTefila', () => {
  it('reads the day out of a legacy name and strips it', () => {
    expect(normalizeTefila(item({ name: 'שחרית (שבת)' }))).toMatchObject({ name: 'שחרית', day: 'שבת' })
    expect(normalizeTefila(item({ name: 'מנחה  ( חול ) ' }))).toMatchObject({ name: 'מנחה', day: 'חול' })
  })

  it('prefers an explicit day over the name', () => {
    expect(normalizeTefila(item({ name: 'ערבית (שבת)', day: 'חול' }))).toMatchObject({
      name: 'ערבית',
      day: 'חול',
    })
  })

  it('defaults to weekday and leaves a clean name alone', () => {
    expect(normalizeTefila(item({ name: 'ערבית' }))).toMatchObject({ name: 'ערבית', day: 'חול' })
  })

  it('ignores a garbage day value', () => {
    expect(normalizeTefila({ ...item({ name: 'שחרית (שבת)' }), day: 'x' as never }).day).toBe('שבת')
  })

  it('only strips a suffix, not the words inside a name', () => {
    expect(normalizeTefila(item({ name: 'קבלת שבת' })).name).toBe('קבלת שבת')
  })
})

describe('groupTefilot', () => {
  it('groups weekday first, keeps stored order, and drops empty groups', () => {
    const groups = groupTefilot([
      item({ name: 'שחרית (שבת)' }),
      item({ name: 'שחרית (חול)' }),
      item({ name: 'מנחה', day: 'שבת' }),
      item({ name: 'ערבית' }),
    ])
    expect(groups.map((g) => [g.label, g.items.map((i) => i.name)])).toEqual([
      ['ימי חול', ['שחרית', 'ערבית']],
      ['שבת קודש', ['שחרית', 'מנחה']],
    ])
    expect(groupTefilot([item({ name: 'שחרית', day: 'שבת' })]).map((g) => g.day)).toEqual(['שבת'])
  })
})
