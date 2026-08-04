/**
 * localAuth — a lightweight passcode gate for the DEMO admin.
 *
 * ⚠️ NOT real security — the passcode lives client-side. It only keeps the admin
 * UI out of casual view in local mode. Real auth is firebaseAuth (Email/Password)
 * + Firestore rules, where write access is enforced on the server.
 */
import type { AuthProvider, AuthUser } from './types'

const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'brachot'
const SESSION_KEY = 'ba:admin-session'

type Listener = (user: AuthUser | null) => void
const listeners = new Set<Listener>()
const notify = (user: AuthUser | null) => listeners.forEach((cb) => cb(user))

export const localAuth = {
  mode: 'local',

  getUser(): AuthUser | null {
    return sessionStorage.getItem(SESSION_KEY) ? { name: 'מנהל', role: 'admin' } : null
  },

  async signIn(passcode) {
    if (passcode !== PASSCODE) {
      throw new Error('קוד גישה שגוי')
    }
    sessionStorage.setItem(SESSION_KEY, '1')
    const user = this.getUser()
    notify(user)
    return user
  },

  async signOut() {
    sessionStorage.removeItem(SESSION_KEY)
    notify(null)
  },

  onChange(cb) {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
} satisfies AuthProvider
