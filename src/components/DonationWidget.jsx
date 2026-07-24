import { useDonation } from '../hooks/useDonation'
import { HeartIcon } from './ui/Icons'

/**
 * DonationWidget — preset tiers, custom amount, one-time/recurring toggle,
 * donor fields with client-side validation, loading state, and a mocked
 * successful transaction that surfaces the thank-you state.
 *
 * All state/validation lives in useDonation(); on submit it builds a
 * Nedarim Plus payload (Mosad 7004283) and calls the donation callback.
 *
 * @param {{ onDonate?: (payload:object) => Promise<{success:boolean}> }} props
 *   Optional Nedarim Plus handler override (Phase 2). Defaults to the service.
 */
export default function DonationWidget({ onDonate } = {}) {
  const d = useDonation(onDonate ? { onDonate } : undefined)

  if (d.status === 'success') {
    return (
      <div className="card animate-scale-in flex flex-col items-center p-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold">
          <HeartIcon className="h-8 w-8" filled />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-bold text-ink">תודה רבה!</h3>
        <p className="mt-2 text-ink-muted">
          תרומתכם על סך <span className="font-bold text-gold-hover">₪{d.summary.amount}</span>{' '}
          {d.summary.donationType === 'recurring' ? 'לחודש ' : ''}
          נקלטה בהצלחה (הדגמה).
        </p>
        <p className="mt-1 text-sm text-ink-muted">יהי רצון שתזכו לכל הברכות.</p>
        <button onClick={d.reset} className="btn-outline mt-6">
          לתרומה נוספת
        </button>
      </div>
    )
  }

  const field =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

  return (
    <div className="card p-6 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold">
          <HeartIcon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-heading text-xl font-bold text-ink">תרומה למוסדות</h3>
          <p className="text-sm text-ink-muted">בזכות התורה והחסד</p>
        </div>
      </div>

      {/* Donation type toggle */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-cream p-1">
        {[
          { key: 'one-time', label: 'חד-פעמי' },
          { key: 'recurring', label: 'הוראת קבע' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => d.setDonationType(t.key)}
            className={`rounded-lg py-2 text-sm font-semibold transition-all ${
              d.donationType === t.key
                ? 'bg-white text-gold-hover shadow-card'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {d.tiers.map((t) => {
          const active = !d.custom && d.amount === t.amount
          return (
            <button
              key={t.id}
              onClick={() => d.selectTier(t.amount)}
              className={`relative flex flex-col items-center rounded-xl border-2 px-2 py-3 transition-all ${
                active ? 'border-gold bg-gold/5 shadow-gold' : 'border-ink/10 hover:border-gold/40'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-white">
                  מומלץ
                </span>
              )}
              <span className="font-heading text-lg font-bold text-ink">₪{t.amount}</span>
              <span className="text-[11px] text-ink-muted">{t.note}</span>
            </button>
          )
        })}
      </div>

      {/* Custom amount */}
      <div className="mt-3">
        <div className="relative">
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">₪</span>
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={d.custom}
            onChange={(e) => d.setCustom(e.target.value)}
            placeholder="סכום אחר"
            className={`${field} pr-9`}
          />
        </div>
        {d.errors.amount && <p className="mt-1 text-sm text-red-600">{d.errors.amount}</p>}
      </div>

      {/* Donor fields */}
      <div className="mt-4 space-y-3">
        <div>
          <input
            type="text"
            value={d.fullName}
            onChange={(e) => d.setFullName(e.target.value)}
            placeholder="שם מלא *"
            className={field}
          />
          {d.errors.fullName && <p className="mt-1 text-sm text-red-600">{d.errors.fullName}</p>}
        </div>
        <div>
          <input
            type="email"
            value={d.email}
            onChange={(e) => d.setEmail(e.target.value)}
            placeholder="אימייל (לקבלה)"
            className={field}
          />
          {d.errors.email && <p className="mt-1 text-sm text-red-600">{d.errors.email}</p>}
        </div>
        <input
          type="text"
          value={d.dedicationNote}
          onChange={(e) => d.setDedicationNote(e.target.value)}
          placeholder="לעילוי נשמת / להצלחת (רשות)"
          className={field}
        />
      </div>

      {d.status === 'error' && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          אירעה תקלה בעיבוד התרומה. נא לנסות שוב.
        </p>
      )}

      <button
        onClick={d.submit}
        disabled={d.status === 'submitting'}
        className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
      >
        {d.status === 'submitting' ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            מעבד תרומה…
          </>
        ) : (
          <>
            <HeartIcon className="h-5 w-5" />
            לתרומה ₪{d.effectiveAmount || 0}
            {d.donationType === 'recurring' ? ' לחודש' : ''}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-ink-muted">
        תרומה מאובטחת דרך <span className="font-semibold">נדרים פלוס</span> · סליקה מוצפנת
      </p>
    </div>
  )
}
