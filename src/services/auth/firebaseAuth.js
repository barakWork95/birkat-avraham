/**
 * firebaseAuth — TEMPLATE (not yet wired). Mirrors localAuth's interface.
 *
 * TO ACTIVATE (Firebase sprint):
 *   1. Enable Email/Password in Firebase Console → Authentication
 *   2. Add the gabbaim as users (and set a custom `admin` claim, or gate by UID)
 *   3. npm i firebase, then uncomment below and switch ./index.js
 */

// import { initializeApp, getApps } from 'firebase/app'
// import {
//   getAuth, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged,
// } from 'firebase/auth'
//
// const app = getApps()[0] || initializeApp({ /* same config as firebaseProvider */ })
// const fbAuth = getAuth(app)
//
// export const firebaseAuth = {
//   mode: 'firebase',
//   getUser() { return fbAuth.currentUser },
//   async signIn(email, password) {
//     const cred = await signInWithEmailAndPassword(fbAuth, email, password)
//     return cred.user
//   },
//   async signOut() { await fbSignOut(fbAuth) },
//   onChange(cb) { return onAuthStateChanged(fbAuth, cb) },
// }

export const firebaseAuth = null
