/**
 * firebaseAuth — live Firebase Authentication (Email/Password).
 *
 * Satisfies the AuthProvider contract so AdminApp/useAuth don't change. Write
 * access is enforced server-side by Firestore/Storage rules (an editor email
 * allowlist), not by this client gate. The Login screen shows email + password
 * when auth.mode === 'firebase'.
 */
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth as fbAuth } from '../firebase'
import type { AuthProvider, AuthUser } from './types'

// Normalize a Firebase user into the shape the admin UI expects.
const toUser = (u: User | null): AuthUser | null =>
  u ? { name: u.displayName || u.email || 'מנהל', email: u.email, uid: u.uid, role: 'admin' } : null

export const firebaseAuth = {
  mode: 'firebase',

  getUser() {
    return toUser(fbAuth.currentUser)
  },

  async signIn(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(fbAuth, (email || '').trim(), password ?? '')
      return toUser(cred.user)
    } catch (err) {
      // Surface a friendly Hebrew message for the common failures.
      const code = (err as { code?: string })?.code || ''
      if (
        code.includes('invalid-credential') ||
        code.includes('wrong-password') ||
        code.includes('user-not-found')
      ) {
        throw new Error('אימייל או סיסמה שגויים')
      }
      if (code.includes('too-many-requests')) {
        throw new Error('יותר מדי נסיונות. נסו שוב מאוחר יותר.')
      }
      throw new Error('ההתחברות נכשלה. נסו שוב.')
    }
  },

  async signOut() {
    await fbSignOut(fbAuth)
  },

  onChange(cb) {
    return onAuthStateChanged(fbAuth, (u) => cb(toUser(u)))
  },
} satisfies AuthProvider
