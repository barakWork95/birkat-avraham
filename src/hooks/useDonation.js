import { useMemo, useState } from 'react'
import { buildNedarimPayload, handleNedarimDonation } from '../services/nedarimPlus'
import { useCollection } from './useCollection'

/**
 * useDonation — donation form state, validation & submission.
 *
 * Captured state: amount, donationType ('one-time' | 'recurring'),
 * fullName, email, dedicationNote.
 *
 * On submit it builds a Nedarim Plus payload and hands it to the
 * `onDonate` callback (defaults to the Nedarim Plus service), passing the live
 * iframe element (from `iframeRef`) so the service can charge through it.
 *
 * @param {{ onDonate?: (payload:object, ctx:{iframe?:HTMLIFrameElement}) => Promise<{success:boolean}>, iframeRef?: {current: HTMLIFrameElement|null} }} [opts]
 */
export function useDonation({ onDonate = handleNedarimDonation, iframeRef } = {}) {
  const tiers = useCollection('donationTiers')
  const [amount, setAmount] = useState(180)
  const [custom, setCustom] = useState('')
  const [donationType, setDonationType] = useState('one-time') // 'one-time' | 'recurring'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dedicationNote, setDedicationNote] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [errors, setErrors] = useState({})
  const [lastResult, setLastResult] = useState(null)

  const effectiveAmount = custom ? Number(custom) : amount

  const validate = () => {
    const e = {}
    if (!effectiveAmount || effectiveAmount < 1) e.amount = 'נא לבחור סכום תרומה'
    if (!fullName.trim()) e.fullName = 'נא להזין שם'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'כתובת אימייל אינה תקינה'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const selectTier = (value) => {
    setCustom('')
    setAmount(value)
  }

  /**
   * handleNedarimDonation — builds the payload from current form state and
   * triggers the donation callback (Nedarim Plus postMessage in production).
   */
  const submit = async () => {
    if (!validate()) return
    setStatus('submitting')

    const payload = buildNedarimPayload({
      amount: effectiveAmount,
      donationType,
      fullName,
      email,
      dedicationNote,
    })

    try {
      // ← Nedarim Plus integration point (live iframe passed through)
      const result = await onDonate(payload, { iframe: iframeRef?.current })
      setLastResult(result)
      setStatus(result?.success ? 'success' : 'error')
    } catch (err) {
      console.error('[useDonation] donation failed', err)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setErrors({})
    setLastResult(null)
  }

  const summary = useMemo(
    () => ({ amount: effectiveAmount, donationType }),
    [effectiveAmount, donationType],
  )

  return {
    // options
    tiers,
    // amount
    amount,
    custom,
    setCustom,
    effectiveAmount,
    selectTier,
    // type
    donationType,
    setDonationType,
    // donor fields
    fullName,
    setFullName,
    email,
    setEmail,
    dedicationNote,
    setDedicationNote,
    // status
    status,
    errors,
    lastResult,
    summary,
    submit,
    reset,
  }
}
