/**
 * Data provider selector.
 *
 *   VITE_DATA_PROVIDER=firebase → live Firestore (firebaseProvider)
 *   otherwise                   → localStorage demo (localProvider)
 *
 * Every component talks to `provider` through this module + the useCollection
 * hook, so the switch requires no UI changes.
 */
import { localProvider } from './localProvider'
import { firebaseProvider } from './firebaseProvider'
import type { DataProvider } from './types'

export const provider: DataProvider =
  import.meta.env.VITE_DATA_PROVIDER === 'firebase' ? firebaseProvider : localProvider
