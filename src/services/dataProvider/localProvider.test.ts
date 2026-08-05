import { describe, it, expect, beforeEach, vi } from 'vitest'
import { localProvider } from './localProvider'
import { eventsData, institutionInfo } from '../../data/mockData'

// An arbitrary collection name so CRUD tests don't depend on seeded content.
const COL = 'testcol'

beforeEach(() => {
  localStorage.clear()
})

describe('localProvider — collections CRUD', () => {
  it('create assigns an id and getAll returns the item', async () => {
    const created = await localProvider.create(COL, { title: 'שלום' })
    expect(created.id).toBeTruthy()
    const all = await localProvider.getAll(COL)
    expect(all).toHaveLength(1)
    expect(all[0]).toMatchObject({ id: created.id, title: 'שלום' })
  })

  it('preserves insertion order', async () => {
    await localProvider.create(COL, { title: 'a' })
    await localProvider.create(COL, { title: 'b' })
    await localProvider.create(COL, { title: 'c' })
    const all = await localProvider.getAll(COL)
    expect(all.map((i) => i.title)).toEqual(['a', 'b', 'c'])
  })

  it('getAllSync mirrors getAll', async () => {
    const c = await localProvider.create(COL, { title: 'x' })
    expect(localProvider.getAllSync(COL).map((i) => i.id)).toEqual([c.id])
  })

  it('update merges the patch and leaves siblings untouched', async () => {
    const a = await localProvider.create(COL, { title: 'a', n: 1 })
    const b = await localProvider.create(COL, { title: 'b', n: 2 })
    const updated = await localProvider.update(COL, a.id, { title: 'a2' })
    expect(updated).toMatchObject({ id: a.id, title: 'a2', n: 1 })
    const all = await localProvider.getAll(COL)
    expect(all.find((i) => i.id === b.id)).toMatchObject({ title: 'b', n: 2 })
  })

  it('remove deletes only the target', async () => {
    const a = await localProvider.create(COL, { title: 'a' })
    const b = await localProvider.create(COL, { title: 'b' })
    await localProvider.remove(COL, a.id)
    const all = await localProvider.getAll(COL)
    expect(all.map((i) => i.id)).toEqual([b.id])
  })

  it('getAll on an unknown collection returns []', async () => {
    expect(await localProvider.getAll('does-not-exist')).toEqual([])
  })
})

describe('localProvider — reorder (move)', () => {
  const seed3 = async () => {
    const a = await localProvider.create(COL, { title: 'a' })
    const b = await localProvider.create(COL, { title: 'b' })
    const c = await localProvider.create(COL, { title: 'c' })
    return { a, b, c }
  }
  const titles = async () => (await localProvider.getAll(COL)).map((i) => i.title)

  it('moves an item down (dir=1)', async () => {
    const { a } = await seed3()
    await localProvider.move(COL, a.id, 1)
    expect(await titles()).toEqual(['b', 'a', 'c'])
  })

  it('moves an item up (dir=-1)', async () => {
    const { c } = await seed3()
    await localProvider.move(COL, c.id, -1)
    expect(await titles()).toEqual(['a', 'c', 'b'])
  })

  it('is a no-op past the boundaries', async () => {
    const { a, c } = await seed3()
    await localProvider.move(COL, a.id, -1) // already first
    await localProvider.move(COL, c.id, 1) // already last
    expect(await titles()).toEqual(['a', 'b', 'c'])
  })

  it('is a no-op for an unknown id', async () => {
    await seed3()
    await localProvider.move(COL, 'missing', 1)
    expect(await titles()).toEqual(['a', 'b', 'c'])
  })
})

describe('localProvider — reset', () => {
  it('restores a collection to its mockData seed', async () => {
    await localProvider.create('events', { title: 'temp' })
    await localProvider.reset('events')
    const all = await localProvider.getAll('events')
    expect(all).toHaveLength(eventsData.length)
    expect(all.map((i) => i.id)).toEqual(eventsData.map((e) => e.id))
  })
})

describe('localProvider — subscriptions', () => {
  it('notifies subscribers of the same collection on write', async () => {
    const cb = vi.fn()
    const unsub = localProvider.subscribe(COL, cb)
    await localProvider.create(COL, { title: 'a' })
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb.mock.calls[0][0]).toHaveLength(1)
    unsub()
  })

  it('does not notify subscribers of a different collection', async () => {
    const cb = vi.fn()
    const unsub = localProvider.subscribe('other', cb)
    await localProvider.create(COL, { title: 'a' })
    expect(cb).not.toHaveBeenCalled()
    unsub()
  })

  it('stops notifying after unsubscribe', async () => {
    const cb = vi.fn()
    const unsub = localProvider.subscribe(COL, cb)
    unsub()
    await localProvider.create(COL, { title: 'a' })
    expect(cb).not.toHaveBeenCalled()
  })
})

describe('localProvider — singletons', () => {
  it('getSingletonSync defaults to {} when unset', () => {
    expect(localProvider.getSingletonSync('info')).toEqual({})
  })

  it('setSingleton then getSingleton round-trips', async () => {
    await localProvider.setSingleton('info', { nameHe: 'בדיקה' })
    expect(await localProvider.getSingleton('info')).toEqual({ nameHe: 'בדיקה' })
  })

  it('resetSingleton restores the mockData info seed', async () => {
    await localProvider.setSingleton('info', { nameHe: 'זמני' })
    const seed = await localProvider.resetSingleton('info')
    expect(seed).toMatchObject({ nameHe: institutionInfo.nameHe })
    expect(await localProvider.getSingleton('info')).toMatchObject({
      nameHe: institutionInfo.nameHe,
    })
  })

  it('notifies singleton subscribers on set', async () => {
    const cb = vi.fn()
    const unsub = localProvider.subscribeSingleton('info', cb)
    await localProvider.setSingleton('info', { nameHe: 'x' })
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb.mock.calls[0][0]).toMatchObject({ nameHe: 'x' })
    unsub()
  })
})
