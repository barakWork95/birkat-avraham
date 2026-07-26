/**
 * localAuth — a lightweight passcode gate for the DEMO admin.
 *
 * ⚠️ This is NOT real security — the passcode lives client-side. It only keeps
 * the admin UI out of casual view while we're in local mode. Real auth arrives
 * with Firebase Authentication (see firebaseAuth.js) + Firestore security rules,
 * where write access is enforced on the server.
 *
 * Passcode: VITE_ADMIN_PASSCODE (defaults to "brachot" for the demo).
 */
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'brachot'
const SESSION_KEY = 'ba:admin-session'

const listeners = new Set()
const notify = (user) => listeners.forEach((cb) => cb(user))

export const localAuth = {
  mode: 'local',

  getUser() {
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
}
