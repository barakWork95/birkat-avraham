import { useState, type FormEvent } from 'react'
import type { AuthUser } from '../services/auth/types'

interface LoginProps {
  onSignIn: (usernameOrEmail: string, password?: string) => Promise<AuthUser | null>
  mode: 'local' | 'firebase'
}

/**
 * Login — passcode gate for the demo admin (local mode).
 * In Firebase mode this becomes email + password.
 */
export default function Login({ onSignIn, mode }: LoginProps) {
  const [value, setValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'firebase') await onSignIn(value, password)
      else await onSignIn(value)
    } catch (err) {
      setError((err as Error).message || 'התחברות נכשלה')
    } finally {
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <form onSubmit={submit} className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="ברכת אברהם"
            className="mx-auto h-14 w-auto"
          />
          <h1 className="mt-4 font-heading text-2xl font-bold text-ink">ניהול תוכן</h1>
          <p className="mt-1 text-sm text-ink-muted">מערכת ניהול מוסדות ברכת אברהם</p>
        </div>

        {mode === 'firebase' && (
          <input
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="אימייל"
            className={`${field} mb-3`}
            autoComplete="username"
          />
        )}
        <input
          type="password"
          value={mode === 'firebase' ? password : value}
          onChange={(e) => (mode === 'firebase' ? setPassword(e.target.value) : setValue(e.target.value))}
          placeholder={mode === 'firebase' ? 'סיסמה' : 'קוד גישה'}
          className={field}
          autoComplete="current-password"
          autoFocus
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full disabled:opacity-70">
          {busy ? 'מתחבר…' : 'כניסה'}
        </button>

        <a href={import.meta.env.BASE_URL} className="mt-4 block text-center text-sm text-ink-muted hover:text-gold">
          חזרה לאתר →
        </a>
      </form>
    </div>
  )
}
