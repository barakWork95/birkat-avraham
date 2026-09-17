import { describe, it, expect } from 'vitest'
import {
  accountDigits,
  bankDetailsText,
  bankLabel,
  branchLabel,
  compactIban,
  groupIban,
  withSplitBankFields,
} from './bankDetails'

describe('bank and branch labels', () => {
  it('formats the split fields', () => {
    const bank = { bankName: 'מרכנתיל', bankCode: '17', branchName: 'אשדוד', branchNumber: '740' }
    expect(bankLabel(bank)).toBe('מרכנתיל (מס׳ 17)')
    expect(branchLabel(bank)).toBe('740 (אשדוד)')
  })

  it('shows whichever half is filled in when the other is empty', () => {
    expect(bankLabel({ bankName: ' מרכנתיל ', bankCode: '' })).toBe('מרכנתיל')
    expect(bankLabel({ bankName: '', bankCode: '17' })).toBe('מס׳ 17')
    expect(branchLabel({ branchName: 'אשדוד', branchNumber: '' })).toBe('אשדוד')
    expect(branchLabel({ branchName: '', branchNumber: '740' })).toBe('740')
    expect(bankLabel({ bankName: '', bankCode: '' })).toBe('')
  })

  it('reads the free text saved before the split (the live data)', () => {
    const live = { bank: 'מרכנתיל (מס׳ 17)', branch: ' (אשדוד) 740' }
    expect(bankLabel(live)).toBe('מרכנתיל (מס׳ 17)')
    expect(branchLabel(live)).toBe('740 (אשדוד)')
    expect(withSplitBankFields(live)).toMatchObject({
      bankName: 'מרכנתיל',
      bankCode: '17',
      branchName: 'אשדוד',
      branchNumber: '740',
    })
  })

  it('parses other legacy spellings', () => {
    expect(withSplitBankFields({ bank: "בנק מרכנתיל (מס' 17)", branch: '740 (אשדוד)' })).toMatchObject({
      bankName: 'מרכנתיל',
      bankCode: '17',
      branchName: 'אשדוד',
      branchNumber: '740',
    })
    expect(withSplitBankFields({ bank: 'בנק מרכנתיל', branch: '740' })).toMatchObject({
      bankName: 'מרכנתיל',
      bankCode: '',
      branchName: '',
      branchNumber: '740',
    })
  })

  it('ignores the legacy text once a split field was saved — even when cleared', () => {
    const saved = { bank: 'מרכנתיל (מס׳ 17)', branch: '740', bankName: 'לאומי', bankCode: '10', branchName: '', branchNumber: '' }
    expect(bankLabel(saved)).toBe('לאומי (מס׳ 10)')
    expect(branchLabel(saved)).toBe('')
  })
})

describe('bankDetailsText', () => {
  it('lists every detail in order, formatted and trimmed, including the account name', () => {
    expect(
      bankDetailsText({
        accountName: 'חנוך לנער עפ"י דרכו',
        bankName: 'מרכנתיל',
        bankCode: '17',
        branchName: 'אשדוד',
        branchNumber: '740',
        account: '86098235',
      }),
    ).toBe(
      ['שם החשבון: חנוך לנער עפ"י דרכו', 'בנק: מרכנתיל (מס׳ 17)', 'סניף: 740 (אשדוד)', 'מספר חשבון: 86098235'].join(
        '\n',
      ),
    )
  })

  it('leaves out empty details and compacts the IBAN', () => {
    expect(bankDetailsText({ bankName: 'מרכנתיל', branchName: '  ', account: '123', iban: 'il62 0108 0000' })).toBe(
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
