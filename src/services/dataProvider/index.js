/**
 * Data provider selector.
 *
 * Today: local (localStorage) — the whole app runs with no backend.
 * Firebase sprint: `npm i firebase`, fill .env, then swap the export below:
 *
 *   import { firebaseProvider } from './firebaseProvider'
 *   export const provider =
 *     import.meta.env.VITE_DATA_PROVIDER === 'firebase' ? firebaseProvider : localProvider
 *
 * Every component talks to `provider` through this module + the useCollection
 * hook, so the switch requires no UI changes.
 */
import { localProvider } from './localProvider'

export const provider = localProvider
