export type Unsubscribe = () => void

/** The signed-in admin, normalized across local and Firebase auth. */
export interface AuthUser {
  name: string
  email?: string | null
  uid?: string
  role: string
}

/**
 * AuthProvider — the auth contract (local passcode gate vs Firebase Auth).
 * `signIn` takes a passcode in local mode, or email + password in Firebase mode.
 */
export interface AuthProvider {
  mode: 'local' | 'firebase'
  getUser(): AuthUser | null
  signIn(usernameOrEmail: string, password?: string): Promise<AuthUser | null>
  signOut(): Promise<void>
  onChange(cb: (user: AuthUser | null) => void): Unsubscribe
}
