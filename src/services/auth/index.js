/**
 * Auth selector. Local passcode today; Firebase Auth in the Firebase sprint:
 *
 *   import { firebaseAuth } from './firebaseAuth'
 *   export const auth =
 *     import.meta.env.VITE_DATA_PROVIDER === 'firebase' ? firebaseAuth : localAuth
 */
import { localAuth } from './localAuth'

export const auth = localAuth
