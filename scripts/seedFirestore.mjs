/**
 * seedFirestore — one-time import of the mockData content into Firestore.
 *
 * Signs in as an editor (so the writes satisfy firestore.rules), then writes
 * every content collection (with an `order` field) and the info singleton,
 * using each item's existing id as the Firestore doc id (so re-running is
 * idempotent — it overwrites, never duplicates).
 *
 * Run (credentials via env so they're never committed):
 *   SEED_EMAIL="kolelbirkatavraham@gmail.com" SEED_PASSWORD="•••" \
 *     node scripts/seedFirestore.mjs
 *
 * Target a different environment with ENV_FILE (defaults to .env), e.g. staging:
 *   ENV_FILE=.env.staging SEED_EMAIL="…" SEED_PASSWORD="…" \
 *     node scripts/seedFirestore.mjs
 *
 * Prerequisite: publish that project's firestore.rules first (writes denied otherwise).
 */
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeFirestore, doc, setDoc } from 'firebase/firestore'
import * as mock from '../src/data/mockData.js'
import { COLLECTIONS, SINGLETONS } from '../src/config/collections.js'

// Load VITE_FB_* values from the target env file (public identifiers).
// Staging note: .env.staging only overrides Firebase keys, so we layer it on
// top of .env to inherit any shared values.
const parseEnv = (relPath) => {
  try {
    return Object.fromEntries(
      readFileSync(new URL(`../${relPath}`, import.meta.url), 'utf8')
        .split('\n')
        .filter((l) => l && !l.trimStart().startsWith('#') && l.includes('='))
        .map((l) => {
          const i = l.indexOf('=')
          return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
        }),
    )
  } catch {
    return {}
  }
}

const envFile = process.env.ENV_FILE || '.env'
const env = { ...parseEnv('.env'), ...parseEnv(envFile) }
console.log(`Using Firebase project: ${env.VITE_FB_PROJECT_ID} (from ${envFile})`)

const firebaseConfig = {
  apiKey: env.VITE_FB_API_KEY,
  authDomain: env.VITE_FB_AUTH_DOMAIN,
  projectId: env.VITE_FB_PROJECT_ID,
  storageBucket: env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FB_SENDER_ID,
  appId: env.VITE_FB_APP_ID,
}

const email = process.env.SEED_EMAIL
const password = process.env.SEED_PASSWORD
if (!email || !password) {
  console.error('Missing SEED_EMAIL / SEED_PASSWORD env vars.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
// Long-polling avoids Node/WebChannel connectivity issues.
const db = initializeFirestore(app, { experimentalForceLongPolling: true })
const auth = getAuth(app)

async function main() {
  await signInWithEmailAndPassword(auth, email, password)
  console.log(`Signed in as ${email}`)

  for (const [name, cfg] of Object.entries(COLLECTIONS)) {
    const items = mock[cfg.seedKey] || []
    let order = 0
    for (const item of items) {
      const { id, ...rest } = item
      const docId = id || `${name}-${order}`
      await setDoc(doc(db, name, docId), { ...rest, order })
      order += 1
    }
    console.log(`  ✓ ${name}: ${items.length} docs`)
  }

  for (const [name, cfg] of Object.entries(SINGLETONS)) {
    const data = mock[cfg.seedKey] || {}
    await setDoc(doc(db, 'singletons', name), data)
    console.log(`  ✓ singleton ${name}`)
  }

  console.log('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err?.code || '', err?.message || err)
  process.exit(1)
})
