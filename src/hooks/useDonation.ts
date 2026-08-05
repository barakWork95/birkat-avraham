import { useEffect, useMemo, useState, type RefObject } from 'react'
import {
  buildNedarimPayload,
  handleNedarimDonation,
  type DonationResult,
  type DonationType,
  type NedarimPayload,
} from '../services/nedarimPlus'
import { useCollection } from './useCollection'
import type { DonationTier } from '../types/models'

type DonateFn = (
  payload: NedarimPayload,
  ctx: { iframe?: HTMLIFrameElement | null },
) => Promise<DonationResult>

interface UseDonationOpts {
  onDonate?: DonateFn
  iframeRef?: RefObject<HTMLIFrameElement | null>
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormErrors {
  amount?: string
  fullName?: string
  email?: string
}

/**
 * useDonation — donation form state, validation & submission.
 *
 * On submit it builds a Nedarim Plus payload and hands it to `onDonate`
 * (defaults to the Nedarim Plus service), passing the live iframe element so the
 * service can charge through it. Swap the callback for tests/alternate gateways.
 */
export function useDonation({ onDonate = handleNedarimDonation, iframeRef }: UseDonationOpts = {}) {
  const { items: tiers } = useCollection<DonationTier>('donationTiers')
  const [amount, setAmount] = useState(180)
  const [custom, setCustom] = useState('')
  // Whether the donor has picked a tier/custom amount themselves. Until then the
  // selection follows the recommended (מומלץ) tier from admin.
  const [touched, setTouched] = useState(false)
  const [donationType, setDonationType] = useState<DonationType>('one-time')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [dedicationNote, setDedicationNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [lastResult, setLastResult] = useState<DonationResult | null>(null)

  // Default the highlighted amount to the recommended (מומלץ) tier once tiers
  // load — falling back to the first tier — so the highlight and the "מומלץ"
  // badge track the same admin checkbox. The donor's own pick takes over.
  useEffect(() => {
    if (touched || custom || tiers.length === 0) return
    const preferred = tiers.find((t) => t.popular) ?? tiers[0]
    if (preferred) setAmount(preferred.amount)
  }, [tiers, touched, custom])

  const effectiveAmount = custom ? Number(custom) : amount

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!effectiveAmount || effectiveAmount < 1) e.amount = 'נא לבחור סכום תרומה'
    if (!fullName.trim()) e.fullName = 'נא להזין שם'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'כתובת אימייל אינה תקינה'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const selectTier = (value: number) => {
    setTouched(true)
    setCustom('')
    setAmount(value)
  }

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
    tiers,
    amount,
    custom,
    setCustom,
    effectiveAmount,
    selectTier,
    donationType,
    setDonationType,
    fullName,
    setFullName,
    email,
    setEmail,
    dedicationNote,
    setDedicationNote,
    status,
    errors,
    lastResult,
    summary,
    submit,
    reset,
  }
}
