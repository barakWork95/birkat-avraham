/**
 * seedFirestore — import mockData content into Firestore.
 *
 * Signs in as an editor (so the writes satisfy firestore.rules), then writes
 * the selected content collections (with an `order` field) and, if selected,
 * the info singleton — using each item's existing id as the doc id, so
 * re-running overwrites rather than duplicates.
 *
 * Run with tsx (the seed reads the .ts data/config directly):
 *   npm run seed        # = tsx scripts/seedFirestore.mjs
 *
 * Credentials + target come from env (never committed):
 *   SEED_EMAIL="kolelbirkatavraham@gmail.com" SEED_PASSWORD="•••" npm run seed
 *   ENV_FILE=.env.staging SEED_EMAIL="…" SEED_PASSWORD="…" npm run seed   # staging
 *
 * ── SAFETY (production already has real, admin-edited content) ─────────────
 * By default this OVERWRITES every collection + the info singleton from
 * mockData — fine for INITIAL seeding of an EMPTY project (e.g. staging), but
 * it would clobber real content on production. Two guards make it safe:
 *   SEED_ONLY=scheduleTefilot        # only these collections (comma-separated;
 *                                    # include 'info' to also write the singleton)
 *   SEED_SKIP_EXISTING=1             # skip any collection that already has docs
 *
 * Safe "add the new prayers to production" command:
 *   SEED_ONLY=scheduleTefilot SEED_SKIP_EXISTING=1 \
 *     SEED_EMAIL="…" SEED_PASSWORD="…" npm run seed
 *
 * Prerequisite: publish that project's firestore.rules first (writes denied otherwise).
 */
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeFirestore, doc, setDoc, getDocs, collection as fsCollection } from 'firebase/firestore'
import * as mock from '../src/data/mockData.ts'
import { COLLECTIONS, SINGLETONS } from '../src/config/collections.ts'

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

// Guards
const only = (process.env.SEED_ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const wanted = (name) => only.length === 0 || only.includes(name)
const skipExisting = process.env.SEED_SKIP_EXISTING === '1'

if (only.length) console.log(`SEED_ONLY: ${only.join(', ')}`)
if (skipExisting) console.log('SEED_SKIP_EXISTING: on (populated collections are skipped)')
if (!only.length && !skipExisting) {
  console.log('⚠️  Full overwrite of ALL collections + info from mockData (use SEED_ONLY / SEED_SKIP_EXISTING to scope).')
}

const app = initializeApp(firebaseConfig)
// Long-polling avoids Node/WebChannel connectivity issues.
const db = initializeFirestore(app, { experimentalForceLongPolling: true })
const auth = getAuth(app)

async function main() {
  await signInWithEmailAndPassword(auth, email, password)
  console.log(`Signed in as ${email}`)

  for (const [name, cfg] of Object.entries(COLLECTIONS)) {
    if (!wanted(name)) continue
    if (skipExisting) {
      const snap = await getDocs(fsCollection(db, name))
      if (!snap.empty) {
        console.log(`  ⊘ ${name}: already has ${snap.size} docs — skipped`)
        continue
      }
    }
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
    if (!wanted(name)) continue
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
