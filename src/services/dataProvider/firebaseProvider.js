/**
 * firebaseProvider — live Firestore implementation of the data provider.
 *
 * Mirrors localProvider's interface exactly, so switching is a one-line change
 * in ./index.js and no UI component changes. Content collections are stored as
 * Firestore collections of the same name; each doc carries an `order` number so
 * the admin can reorder items. Singletons (e.g. institution info) live under the
 * `singletons` collection, one doc per name.
 *
 * A small in-memory cache backs the *Sync getters so the public site can render
 * immediately from the last snapshot (useCollection/useInfo read sync first,
 * then subscribe).
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'
import { compressImageToBlob } from '../../lib/compressImage'

const SINGLETON_COLLECTION = 'singletons'

const listCache = {} // name -> items[]
const singleCache = {} // name -> object

const sortByOrder = (items) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

export const firebaseProvider = {
  mode: 'firebase',

  // ── Collections ────────────────────────────────────────────────
  getAllSync(name) {
    return listCache[name] || []
  },

  async getAll(name) {
    const snap = await getDocs(collection(db, name))
    const items = sortByOrder(mapDocs(snap))
    listCache[name] = items
    return items
  },

  /** Compress the image and upload it to Storage; return its public download URL. */
  async uploadImage(file, pathPrefix = 'images') {
    const blob = await compressImageToBlob(file)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const objectRef = ref(storage, `${pathPrefix}/${name}`)
    await uploadBytes(objectRef, blob, { contentType: 'image/jpeg' })
    return getDownloadURL(objectRef)
  },

  /** Best-effort delete of a previously uploaded Storage image (ignores non-Storage URLs). */
  async deleteImage(url) {
    if (!url || !/firebasestorage\.googleapis\.com|\.firebasestorage\.app/.test(url)) return
    try {
      await deleteObject(ref(storage, url))
    } catch {
      /* already gone / not ours — ignore */
    }
  },

  async create(name, data) {
    // Append to the end: order = current max + 1.
    const current = listCache[name] || (await this.getAll(name))
    const maxOrder = current.reduce((m, i) => Math.max(m, i.order ?? 0), 0)
    const item = { ...data, order: maxOrder + 1 }
    const ref = await addDoc(collection(db, name), item)
    return { id: ref.id, ...item }
  },

  async update(name, id, patch) {
    await updateDoc(doc(db, name, id), patch)
    return { id, ...patch }
  },

  async remove(name, id) {
    await deleteDoc(doc(db, name, id))
  },

  /** Move an item up/down by one position (dir = -1 | 1) by swapping order values. */
  async move(name, id, dir) {
    const items = sortByOrder(listCache[name] || (await this.getAll(name)))
    const idx = items.findIndex((i) => i.id === id)
    const next = idx + dir
    if (idx < 0 || next < 0 || next >= items.length) return
    const a = items[idx]
    const b = items[next]
    const aOrder = a.order ?? idx
    const bOrder = b.order ?? next
    await Promise.all([
      updateDoc(doc(db, name, a.id), { order: bOrder }),
      updateDoc(doc(db, name, b.id), { order: aOrder }),
    ])
  },

  /** No-op for Firestore (re-seeding is a one-time server script, not a client action). */
  async reset() {
    /* intentionally not supported live — see scripts/seedFirestore.mjs */
  },

  subscribe(name, cb) {
    const q = query(collection(db, name), orderBy('order'))
    return onSnapshot(
      q,
      (snap) => {
        const items = mapDocs(snap)
        listCache[name] = items
        cb(items)
      },
      // If a doc is missing `order`, the ordered query can error — fall back to
      // an unordered listen so the site keeps working.
      () =>
        onSnapshot(collection(db, name), (snap) => {
          const items = sortByOrder(mapDocs(snap))
          listCache[name] = items
          cb(items)
        }),
    )
  },

  // ── Singletons ─────────────────────────────────────────────────
  getSingletonSync(name) {
    return singleCache[name] || {}
  },

  async getSingleton(name) {
    const snap = await getDoc(doc(db, SINGLETON_COLLECTION, name))
    const data = snap.exists() ? snap.data() : {}
    singleCache[name] = data
    return data
  },

  async setSingleton(name, data) {
    await setDoc(doc(db, SINGLETON_COLLECTION, name), data, { merge: true })
    singleCache[name] = data
    return data
  },

  async resetSingleton() {
    /* not supported live — see scripts/seedFirestore.mjs */
  },

  subscribeSingleton(name, cb) {
    return onSnapshot(doc(db, SINGLETON_COLLECTION, name), (snap) => {
      const data = snap.exists() ? snap.data() : {}
      singleCache[name] = data
      cb(data)
    })
  },
}
