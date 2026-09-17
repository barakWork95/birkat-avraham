/**
 * Bank-transfer details as donors need them on the clipboard: the full block
 * for a message or a note, or just the digits for a banking app's account
 * field (which rejects anything else).
 */
import type { BankTransfer } from '../types/models'

const clean = (v?: string) => (v ?? '').trim()

/** An IBAN as a bank app wants it pasted: no spaces, upper case. */
export const compactIban = (iban?: string) => clean(iban).replace(/\s+/g, '').toUpperCase()

/** An IBAN as a person reads it: groups of four. */
export const groupIban = (iban?: string) => compactIban(iban).replace(/(.{4})(?=.)/g, '$1 ')

/** Just the digits of an account number. */
export const accountDigits = (account?: string) => clean(account).replace(/\D/g, '')

/** "מרכנתיל (מס׳ 17)" → name + code. Tolerates "מס'", "מספר", or no parentheses at all. */
function parseLegacyBank(text?: string): Pick<BankTransfer, 'bankName' | 'bankCode'> {
  const t = clean(text)
  const code = t.match(/\(\s*(?:מס(?:פר)?\s*['׳"״]?\.?\s*)?(\d+)\s*\)/)
  const name = (code ? t.replace(code[0], '') : t).replace(/^בנק\s+/, '').trim()
  return { bankName: name, bankCode: code?.[1] ?? '' }
}

/** " (אשדוד) 740" / "740 (אשדוד)" / "740" → number + name, in either order. */
function parseLegacyBranch(text?: string): Pick<BankTransfer, 'branchName' | 'branchNumber'> {
  const t = clean(text)
  const number = t.match(/\d+/)?.[0] ?? ''
  const inParens = t.match(/\(([^)]*)\)/)?.[1]
  const name = (inParens ?? t.replace(/\d+/g, '').replace(/^סניף\s*/, '')).trim()
  return { branchName: name, branchNumber: number }
}

/**
 * The details with the split bank/branch fields filled in. Details saved
 * before the split carry free text in `bank` / `branch`; those are parsed into
 * the split fields — but only for a pair that was never saved. Once a field
 * exists (even as '', i.e. deliberately cleared) the legacy text is ignored,
 * so clearing a field can't bring the old value back.
 */
export function withSplitBankFields(bank: BankTransfer): BankTransfer {
  const hasBank = bank.bankName !== undefined || bank.bankCode !== undefined
  const hasBranch = bank.branchName !== undefined || bank.branchNumber !== undefined
  return {
    ...bank,
    ...(hasBank ? {} : parseLegacyBank(bank.bank)),
    ...(hasBranch ? {} : parseLegacyBranch(bank.branch)),
  }
}

/** The bank line as shown and copied: "מרכנתיל (מס׳ 17)". */
export function bankLabel(bank: BankTransfer): string {
  const { bankName, bankCode } = withSplitBankFields(bank)
  const name = clean(bankName)
  const code = clean(bankCode)
  if (name && code) return `${name} (מס׳ ${code})`
  return name || (code ? `מס׳ ${code}` : '')
}

/** The branch line as shown and copied: "740 (אשדוד)" — number first, as branches are quoted. */
export function branchLabel(bank: BankTransfer): string {
  const { branchName, branchNumber } = withSplitBankFields(bank)
  const name = clean(branchName)
  const number = clean(branchNumber)
  if (name && number) return `${number} (${name})`
  return number || name
}

/** Every filled-in detail, one "label: value" per line; empty ones are left out. */
export function bankDetailsText(bank: BankTransfer): string {
  const lines: [string, string][] = [
    ['שם החשבון', clean(bank.accountName)],
    ['בנק', bankLabel(bank)],
    ['סניף', branchLabel(bank)],
    ['מספר חשבון', clean(bank.account)],
    ['IBAN', compactIban(bank.iban)],
  ]
  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}
