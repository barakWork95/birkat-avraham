import { useMemo, useState } from 'react'
import { donationTiers } from '../data/mockData'

/**
 * useDonation — client-side donation form state, validation & (mock) submission.
 *
 * PHASE 2: swap `submit()` for a real call to an Israeli processor
 * (Nedarim Plus / Meshulam / Tranzila). The component only cares about
 * { amount, setAmount, frequency, ... status, submit } — keep this contract.
 */
export function useDonation() {
  const [tiers] = useState(donationTiers)
  const [amount, setAmount] = useState(180)
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState('once') // 'once' | 'monthly'
  const [donor, setDonor] = useState({ name: '', email: '', dedication: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [errors, setErrors] = useState({})

  const effectiveAmount = custom ? Number(custom) : amount

  const validate = () => {
    const e = {}
    if (!effectiveAmount || effectiveAmount < 1) e.amount = 'נא לבחור סכום תרומה'
    if (!donor.name.trim()) e.name = 'נא להזין שם'
    if (donor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email))
      e.email = 'כתובת אימייל אינה תקינה'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const selectTier = (value) => {
    setCustom('')
    setAmount(value)
  }

  const submit = async () => {
    if (!validate()) return
    setStatus('submitting')
    // --- Phase 2 integration point ---------------------------------
    // await paymentProvider.createCharge({ amount: effectiveAmount, frequency, donor })
    await new Promise((r) => setTimeout(r, 1400)) // simulate network
    setStatus('success')
  }

  const reset = () => {
    setStatus('idle')
    setErrors({})
  }

  const summary = useMemo(
    () => ({ amount: effectiveAmount, frequency }),
    [effectiveAmount, frequency],
  )

  return {
    tiers,
    amount,
    custom,
    setCustom,
    frequency,
    setFrequency,
    donor,
    setDonor,
    status,
    errors,
    effectiveAmount,
    summary,
    selectTier,
    submit,
    reset,
  }
}
