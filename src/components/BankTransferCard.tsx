import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BankIcon, CheckIcon, CopyIcon } from './ui/Icons'
import { accountDigits, bankDetailsText, compactIban, groupIban } from '../lib/bankDetails'
import { copyText } from '../lib/clipboard'
import type { BankTransfer } from '../types/models'

type CopyTarget = 'all' | 'account' | 'iban'

/** How long "הועתק" shows before the button goes back to normal. */
const FEEDBACK_MS = 2000

/**
 * BankTransferCard — the donation section's bank details, built to be acted on:
 * gold-framed so it reads as a primary way to give, values large and bold for
 * scanning, and two copy actions. "העתק פרטים" copies the whole block (account
 * name included — bank apps ask for it); tapping the account number (or IBAN)
 * copies just that, in the form a banking app's field accepts.
 */
export default function BankTransferCard({ bank }: { bank: BankTransfer }) {
  const [copied, setCopied] = useState<{ target: CopyTarget; ok: boolean } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (target: CopyTarget, text: string) => {
    const ok = await copyText(text)
    setCopied({ target, ok })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), FEEDBACK_MS)
  }
  const isCopied = (target: CopyTarget) => copied?.target === target && copied.ok

  const details = bankDetailsText(bank)
  const account = accountDigits(bank.account)
  const iban = compactIban(bank.iban)

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border-2 border-gold/60 bg-gradient-to-bl from-gold/15 via-white to-white px-4 py-4 shadow-card sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2.5">
          {/* Dropped between lg and xl only: there the card is ~275px wide, and the
              icon would push "העתק פרטים" onto a second line — making the card, and
              the sticky column it sits in, taller than a laptop screen allows. The
              gold frame still marks the card out. */}
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-l from-gold to-gold-light text-white shadow-gold lg:max-xl:hidden">
            <BankIcon className="h-5 w-5" />
          </span>
          <h3 className="font-heading text-lg font-bold text-ink">להעברה בנקאית</h3>
        </div>
        {details && (
          <button
            type="button"
            onClick={() => copy('all', details)}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-gold-light transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            {isCopied('all') ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
            {isCopied('all') ? 'הועתק' : 'העתק פרטים'}
          </button>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5">
        {bank.bank?.trim() && (
          <>
            <dt className="text-sm text-ink-muted">בנק</dt>
            <dd className="font-heading text-base font-bold text-ink">{bank.bank.trim()}</dd>
          </>
        )}
        {bank.branch?.trim() && (
          <>
            <dt className="text-sm text-ink-muted">סניף</dt>
            {/* LTR as before, right-aligned to sit beside its label. */}
            <dd dir="ltr" className="text-right font-heading text-base font-bold text-ink">
              {bank.branch.trim()}
            </dd>
          </>
        )}
        {account && (
          <>
            <dt className="text-sm text-ink-muted">חשבון</dt>
            <dd>
              <CopyValue
                label={`העתקת מספר החשבון ${account}`}
                copied={isCopied('account')}
                onCopy={() => copy('account', account)}
              >
                <span dir="ltr" className="font-heading text-xl font-black tracking-wider tabular-nums">
                  {bank.account?.trim()}
                </span>
              </CopyValue>
            </dd>
          </>
        )}
        {iban && (
          <>
            <dt className="text-sm text-ink-muted">IBAN</dt>
            <dd>
              <CopyValue label={`העתקת ה-IBAN ${iban}`} copied={isCopied('iban')} onCopy={() => copy('iban', iban)}>
                <span dir="ltr" className="font-heading text-sm font-bold tracking-wide tabular-nums">
                  {groupIban(iban)}
                </span>
              </CopyValue>
            </dd>
          </>
        )}
      </dl>

      {copied && !copied.ok && (
        <p className="mt-2 text-xs text-red-700">לא ניתן להעתיק אוטומטית — סמנו את הפרטים והעתיקו ידנית.</p>
      )}
      <p className="sr-only" aria-live="polite">
        {copied ? (copied.ok ? 'הועתק ללוח' : 'ההעתקה נכשלה') : ''}
      </p>
    </div>
  )
}

/** A value that copies itself when tapped, with a copy/tick icon beside it. */
function CopyValue({
  label,
  copied,
  onCopy,
  children,
}: {
  label: string
  copied: boolean
  onCopy: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      title="לחצו להעתקה"
      className="group -mx-1.5 -my-1 inline-flex max-w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-ink transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {children}
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-700" />
      ) : (
        <CopyIcon className="h-4 w-4 text-gold-hover opacity-70 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}
