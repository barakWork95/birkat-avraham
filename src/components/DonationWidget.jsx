import { useDonation } from '../hooks/useDonation'
import { HeartIcon } from './ui/Icons'

/**
 * DonationWidget — preset tiers, custom amount, once/monthly toggle,
 * donor fields with client-side validation, and a mock async submit.
 * All state/validation lives in useDonation() so Phase 2 only rewires submit().
 */
export default function DonationWidget() {
  const d = useDonation()

  if (d.status === 'success') {
    return (
      <div className="card animate-scale-in flex flex-col items-center p-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold">
          <HeartIcon className="h-8 w-8" filled />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-bold text-ink">תודה רבה!</h3>
        <p className="mt-2 text-ink-muted">
          תרומתכם על סך <span className="font-bold text-gold-hover">₪{d.summary.amount}</span>{' '}
          {d.summary.frequency === 'monthly' ? 'לחודש ' : ''}
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

      {/* Frequency toggle */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-cream p-1">
        {[
          { key: 'once', label: 'חד-פעמי' },
          { key: 'monthly', label: 'הוראת קבע' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => d.setFrequency(f.key)}
            className={`rounded-lg py-2 text-sm font-semibold transition-all ${
              d.frequency === f.key ? 'bg-white text-gold-hover shadow-card' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {f.label}
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
                active
                  ? 'border-gold bg-gold/5 shadow-gold'
                  : 'border-ink/10 hover:border-gold/40'
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
            value={d.donor.name}
            onChange={(e) => d.setDonor({ ...d.donor, name: e.target.value })}
            placeholder="שם מלא *"
            className={field}
          />
          {d.errors.name && <p className="mt-1 text-sm text-red-600">{d.errors.name}</p>}
        </div>
        <div>
          <input
            type="email"
            value={d.donor.email}
            onChange={(e) => d.setDonor({ ...d.donor, email: e.target.value })}
            placeholder="אימייל (לקבלה)"
            className={field}
          />
          {d.errors.email && <p className="mt-1 text-sm text-red-600">{d.errors.email}</p>}
        </div>
        <input
          type="text"
          value={d.donor.dedication}
          onChange={(e) => d.setDonor({ ...d.donor, dedication: e.target.value })}
          placeholder="לעילוי נשמת / להצלחת (רשות)"
          className={field}
        />
      </div>

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
            {d.frequency === 'monthly' ? ' לחודש' : ''}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-ink-muted">
        תרומה מאובטחת · הדגמה בלבד — בשלב הבא יחובר סליקה (נדרים פלוס / משולם / טרנזילה)
      </p>
    </div>
  )
}
