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

/** Every filled-in detail, one "label: value" per line; empty ones are left out. */
export function bankDetailsText(bank: BankTransfer): string {
  const lines: [string, string][] = [
    ['שם החשבון', clean(bank.accountName)],
    ['בנק', clean(bank.bank)],
    ['סניף', clean(bank.branch)],
    ['מספר חשבון', clean(bank.account)],
    ['IBAN', compactIban(bank.iban)],
  ]
  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}
