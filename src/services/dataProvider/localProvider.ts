/**
 * localProvider — a fully working data layer backed by localStorage.
 *
 * It lets the ENTIRE admin panel + public site run with no backend: collections
 * are seeded once from src/data/mockData, then all CRUD writes persist to
 * localStorage and notify subscribers (edits reflect live in the same tab, and
 * across tabs via the 'storage' event). Mirrors firebaseProvider via the shared
 * DataProvider contract, so switching is a one-line change in ./index.ts.
 */
import * as mock from '../../data/mockData'
import { COLLECTIONS, COLLECTION_KEYS, SINGLETONS, SINGLETON_KEYS } from '../../config/collections'
import { compressImage } from '../../lib/compressImage'
import type { Item, Singleton } from '../../types/models'
import type { DataProvider } from './types'

// mockData exports are looked up by dynamic seedKey, so treat it as a record.
const mockRecord = mock as Record<string, any>

const PREFIX = 'ba:'
const EVENT = 'ba:data-change'
// Bump this whenever the mockData seed changes so returning visitors get fresh
// content after a deploy (re-seeds from mockData; discards local demo edits).
const SEED_VERSION = '2026-08-23a'

const keyFor = (name: string) => `${PREFIX}${name}`
const singleKey = (name: string) => `${PREFIX}single:${name}`

function read(name: string): Item[] {
  try {
    const raw = localStorage.getItem(keyFor(name))
    return raw ? (JSON.parse(raw) as Item[]) : []
  } catch {
    return []
  }
}

function write(name: string, items: Item[]): void {
  localStorage.setItem(keyFor(name), JSON.stringify(items))
  // notify same-tab subscribers (the 'storage' event only fires in OTHER tabs)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { name } }))
}

function genId(name: string): string {
  return `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Seed collections from mockData. Runs once per browser, and again whenever
 * SEED_VERSION changes (i.e. a deploy shipped new content) so the public site
 * never gets stuck on stale seed data.
 */
function ensureSeeded(): void {
  const fresh = localStorage.getItem(`${PREFIX}seedVersion`) !== SEED_VERSION
  COLLECTION_KEYS.forEach((name) => {
    if (fresh || localStorage.getItem(keyFor(name)) == null) {
      const seed = mockRecord[COLLECTIONS[name].seedKey] || []
      localStorage.setItem(keyFor(name), JSON.stringify(seed))
    }
  })
  SINGLETON_KEYS.forEach((name) => {
    if (fresh || localStorage.getItem(singleKey(name)) == null) {
      const seed = mockRecord[SINGLETONS[name].seedKey] || {}
      localStorage.setItem(singleKey(name), JSON.stringify(seed))
    }
  })
  if (fresh) localStorage.setItem(`${PREFIX}seedVersion`, SEED_VERSION)
}
ensureSeeded()

export const localProvider = {
  mode: 'local',

  /** Synchronous read — lets the public site render instantly with no loading flash. */
  getAllSync(name) {
    return read(name)
  },

  async getAll(name) {
    return read(name)
  },

  /** Local mode has no object store — inline the compressed image as a data URL. */
  async uploadImage(file) {
    return compressImage(file)
  },

  /** Local mode: inline the file as a data URL (demo only — large files bloat localStorage). */
  async uploadFile(file) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('קריאת הקובץ נכשלה'))
      reader.onload = () => resolve(String(reader.result))
      reader.readAsDataURL(file)
    })
  },

  /** No-op: local data-URL images have nothing external to delete. */
  async deleteImage() {},

  async create(name, data) {
    const items = read(name)
    const item: Item = { ...data, id: genId(name) }
    items.push(item)
    write(name, items)
    return item
  },

  async update(name, id, patch) {
    const items = read(name).map((i) => (i.id === id ? { ...i, ...patch } : i))
    write(name, items)
    return items.find((i) => i.id === id)
  },

  async remove(name, id) {
    write(
      name,
      read(name).filter((i) => i.id !== id),
    )
  },

  /** Move an item up/down by one position (dir = -1 | 1). */
  async move(name, id, dir) {
    const items = read(name)
    const idx = items.findIndex((i) => i.id === id)
    const next = idx + dir
    if (idx < 0 || next < 0 || next >= items.length) return
    ;[items[idx], items[next]] = [items[next], items[idx]]
    write(name, items)
  },

  /** Restore a collection (or all) to the original mockData defaults. */
  async reset(name) {
    const names = name ? [name] : COLLECTION_KEYS
    names.forEach((n) => write(n, mockRecord[COLLECTIONS[n].seedKey] || []))
  },

  /** Subscribe to changes for a collection. Returns an unsubscribe fn. */
  subscribe(name, cb) {
    const onLocal = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail || detail.name === name) cb(read(name))
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === keyFor(name)) cb(read(name))
    }
    window.addEventListener(EVENT, onLocal)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, onLocal)
      window.removeEventListener('storage', onStorage)
    }
  },

  // ── Singletons (one-off documents, e.g. institution info) ──────────
  getSingletonSync(name) {
    try {
      const raw = localStorage.getItem(singleKey(name))
      return raw ? (JSON.parse(raw) as Singleton) : {}
    } catch {
      return {}
    }
  },

  async getSingleton(name) {
    return this.getSingletonSync(name)
  },

  async setSingleton(name, data) {
    localStorage.setItem(singleKey(name), JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { name: `single:${name}` } }))
    return data
  },

  async resetSingleton(name) {
    const seed = (mockRecord[SINGLETONS[name].seedKey] || {}) as Singleton
    await this.setSingleton(name, seed)
    return seed
  },

  subscribeSingleton(name, cb) {
    const onLocal = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail || detail.name === `single:${name}`) cb(this.getSingletonSync(name))
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === singleKey(name)) cb(this.getSingletonSync(name))
    }
    window.addEventListener(EVENT, onLocal)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, onLocal)
      window.removeEventListener('storage', onStorage)
    }
  },
} satisfies DataProvider
