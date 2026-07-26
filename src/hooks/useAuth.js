import { useEffect, useState } from 'react'
import { auth } from '../services/auth'

/**
 * useAuth — current admin user + sign in/out. Backed by the auth provider
 * (local passcode today, Firebase Auth later).
 */
export function useAuth() {
  const [user, setUser] = useState(() => auth.getUser())

  useEffect(() => auth.onChange(setUser), [])

  return {
    user,
    signIn: (...args) => auth.signIn(...args),
    signOut: () => auth.signOut(),
    mode: auth.mode,
  }
}
