import { describe, it, expect } from 'vitest'
import { accountDigits, bankDetailsText, compactIban, groupIban } from './bankDetails'

describe('bankDetailsText', () => {
  it('lists every detail in order, trimmed, including the account name', () => {
    expect(
      bankDetailsText({
        accountName: 'חנוך לנער עפ"י דרכו',
        bank: 'מרכנתיל (מס׳ 17)',
        branch: ' (אשדוד) 740',
        account: '86098235',
      }),
    ).toBe(
      ['שם החשבון: חנוך לנער עפ"י דרכו', 'בנק: מרכנתיל (מס׳ 17)', 'סניף: (אשדוד) 740', 'מספר חשבון: 86098235'].join(
        '\n',
      ),
    )
  })

  it('leaves out empty details and compacts the IBAN', () => {
    expect(bankDetailsText({ bank: 'מרכנתיל', branch: '  ', account: '123', iban: 'il62 0108 0000' })).toBe(
      'בנק: מרכנתיל\nמספר חשבון: 123\nIBAN: IL6201080000',
    )
  })

  it('is empty when nothing is filled in', () => {
    expect(bankDetailsText({})).toBe('')
  })
})

describe('account and IBAN formatting', () => {
  it('keeps only the digits of an account number', () => {
    expect(accountDigits(' 86-098235 ')).toBe('86098235')
    expect(accountDigits(undefined)).toBe('')
  })

  it('compacts and groups an IBAN', () => {
    expect(compactIban(' il62 0108 0000 0009 9999 999 ')).toBe('IL620108000000099999999')
    expect(groupIban('IL620108000000099999999')).toBe('IL62 0108 0000 0009 9999 999')
    expect(groupIban('')).toBe('')
  })
})
