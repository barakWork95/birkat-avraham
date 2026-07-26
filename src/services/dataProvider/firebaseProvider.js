/**
 * firebaseProvider — TEMPLATE (not yet wired).
 *
 * This mirrors localProvider's interface exactly, so switching to Firebase is a
 * one-line change in ./index.js once the project exists. It is intentionally
 * NOT imported anywhere yet, so the app builds without the firebase SDK.
 *
 * TO ACTIVATE (Firebase sprint):
 *   1. npm i firebase
 *   2. fill .env (see .env.example) with your Firebase web config
 *   3. uncomment the imports + body below
 *   4. in ./index.js, export firebaseProvider when VITE_DATA_PROVIDER === 'firebase'
 */

// import { initializeApp } from 'firebase/app'
// import {
//   getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc, onSnapshot,
// } from 'firebase/firestore'
//
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FB_API_KEY,
//   authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FB_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
//   appId: import.meta.env.VITE_FB_APP_ID,
// }
// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)
//
// export const firebaseProvider = {
//   mode: 'firebase',
//   _cache: {},
//   getAllSync(name) { return this._cache[name] || [] },
//   async getAll(name) {
//     const snap = await getDocs(collection(db, name))
//     const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
//     this._cache[name] = items
//     return items
//   },
//   async create(name, data) { const ref = await addDoc(collection(db, name), data); return { id: ref.id, ...data } },
//   async update(name, id, patch) { await updateDoc(doc(db, name, id), patch) },
//   async remove(name, id) { await deleteDoc(doc(db, name, id)) },
//   async move() { /* implement via an `order` field + updateDoc */ },
//   async reset() { /* optional: re-seed from mockData */ },
//   subscribe(name, cb) {
//     return onSnapshot(collection(db, name), (snap) => {
//       const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
//       this._cache[name] = items
//       cb(items)
//     })
//   },
// }

export const firebaseProvider = null
