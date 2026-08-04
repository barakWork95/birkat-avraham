import { useEffect, useState } from 'react'
import { auth } from '../services/auth'
import type { AuthUser } from '../services/auth/types'

/**
 * useAuth — current admin user + sign in/out, backed by the auth provider
 * (local passcode or Firebase Auth depending on VITE_DATA_PROVIDER).
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => auth.getUser())

  useEffect(() => auth.onChange(setUser), [])

  return {
    user,
    signIn: (usernameOrEmail: string, password?: string) => auth.signIn(usernameOrEmail, password),
    signOut: () => auth.signOut(),
    mode: auth.mode,
  }
}
