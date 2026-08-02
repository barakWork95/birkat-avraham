/**
 * Auth selector.
 *
 *   VITE_DATA_PROVIDER=firebase → Firebase Authentication (firebaseAuth)
 *   otherwise                   → local passcode gate (localAuth)
 */
import { localAuth } from './localAuth'
import { firebaseAuth } from './firebaseAuth'

export const auth =
  import.meta.env.VITE_DATA_PROVIDER === 'firebase' ? firebaseAuth : localAuth
