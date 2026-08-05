import type { Item, Singleton } from '../../types/models'

export type Unsubscribe = () => void

/**
 * DataProvider — the contract every backend (localStorage, Firestore) must
 * satisfy. Components only ever talk to this interface, so swapping backends is
 * a one-line change and the compiler guarantees both implementations stay in
 * sync (collections CRUD + reorder + subscriptions, singletons, image storage).
 */
export interface DataProvider {
  mode: 'local' | 'firebase'

  // Collections
  getAllSync(name: string): Item[]
  getAll(name: string): Promise<Item[]>
  create(name: string, data: Record<string, unknown>): Promise<Item>
  update(name: string, id: string, patch: Record<string, unknown>): Promise<Item | undefined>
  remove(name: string, id: string): Promise<void>
  /** Move an item up/down by one position (dir = -1 | 1). */
  move(name: string, id: string, dir: 1 | -1): Promise<void>
  /** Restore a collection (or all) to defaults. */
  reset(name?: string): Promise<void>
  subscribe(name: string, cb: (items: Item[]) => void): Unsubscribe

  // Singletons (one-off documents)
  getSingletonSync(name: string): Singleton
  getSingleton(name: string): Promise<Singleton>
  setSingleton(name: string, data: Singleton): Promise<Singleton>
  resetSingleton(name: string): Promise<Singleton>
  subscribeSingleton(name: string, cb: (data: Singleton) => void): Unsubscribe

  // Image storage
  uploadImage(file: File, pathPrefix?: string): Promise<string>
  /** Upload an arbitrary file (e.g. a PDF) as-is — no image compression. */
  uploadFile(file: File, pathPrefix?: string): Promise<string>
  deleteImage(url: string): Promise<void>
}
