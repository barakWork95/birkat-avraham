// Some jsdom builds don't expose a working localStorage. The localProvider
// only needs a minimal, synchronous key/value store — provide an in-memory one
// when the environment lacks it, so the provider tests are deterministic.
class MemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  clear() {
    this.store.clear()
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }
}

function ensureLocalStorage(target: any) {
  if (target && target.localStorage == null) {
    Object.defineProperty(target, 'localStorage', {
      value: new MemoryStorage(),
      configurable: true,
      writable: true,
    })
  }
}

ensureLocalStorage(globalThis)
if (typeof window !== 'undefined') ensureLocalStorage(window)
