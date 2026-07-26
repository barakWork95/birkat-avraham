/**
 * localProvider — a fully working data layer backed by localStorage.
 *
 * It lets the ENTIRE admin panel + public site run today, with no backend:
 * collections are seeded once from src/data/mockData.js, then all CRUD writes
 * persist to localStorage and notify subscribers (so edits reflect live in the
 * same tab, and across tabs via the 'storage' event).
 *
 * The Firebase provider (firebaseProvider.js) implements this same interface,
 * so switching is a one-line change in ./index.js — no component changes.
 */
import * as mock from '../../data/mockData'
import { COLLECTIONS, COLLECTION_KEYS } from '../../config/collections'

const PREFIX = 'ba:'
const EVENT = 'ba:data-change'
// Bump this whenever the mockData seed changes so returning visitors get fresh
// content after a deploy (re-seeds from mockData; discards local demo edits).
const SEED_VERSION = '2026-07-26'

const keyFor = (name) => `${PREFIX}${name}`

function read(name) {
  try {
    const raw = localStorage.getItem(keyFor(name))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(name, items) {
  localStorage.setItem(keyFor(name), JSON.stringify(items))
  // notify same-tab subscribers (the 'storage' event only fires in OTHER tabs)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { name } }))
}

function genId(name) {
  return `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Seed collections from mockData. Runs once per browser, and again whenever
 * SEED_VERSION changes (i.e. a deploy shipped new content) so the public site
 * never gets stuck on stale seed data.
 */
function ensureSeeded() {
  const fresh = localStorage.getItem(`${PREFIX}seedVersion`) !== SEED_VERSION
  COLLECTION_KEYS.forEach((name) => {
    if (fresh || localStorage.getItem(keyFor(name)) == null) {
      const seed = mock[COLLECTIONS[name].seedKey] || []
      localStorage.setItem(keyFor(name), JSON.stringify(seed))
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

  async create(name, data) {
    const items = read(name)
    const item = { ...data, id: genId(name) }
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
    write(name, read(name).filter((i) => i.id !== id))
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
    names.forEach((n) => write(n, mock[COLLECTIONS[n].seedKey] || []))
  },

  /** Subscribe to changes for a collection. Returns an unsubscribe fn. */
  subscribe(name, cb) {
    const onLocal = (e) => {
      if (!e.detail || e.detail.name === name) cb(read(name))
    }
    const onStorage = (e) => {
      if (e.key === keyFor(name)) cb(read(name))
    }
    window.addEventListener(EVENT, onLocal)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, onLocal)
      window.removeEventListener('storage', onStorage)
    }
  },
}
