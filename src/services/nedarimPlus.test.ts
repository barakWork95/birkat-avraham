import { describe, it, expect } from 'vitest'
import {
  buildNedarimPayload,
  NEDARIM_MOSAD_ID,
  type DonationForm,
} from './nedarimPlus'

/** A valid one-time donation form with sensible defaults; override per test. */
const form = (over: Partial<DonationForm> = {}): DonationForm => ({
  amount: 180,
  donationType: 'one-time',
  fullName: 'ישראל ישראלי',
  ...over,
})

describe('buildNedarimPayload', () => {
  it('maps a one-time donation to Ragil / single payment', () => {
    const p = buildNedarimPayload(form())
    expect(p.Mosad).toBe(NEDARIM_MOSAD_ID)
    expect(p.PaymentType).toBe('Ragil')
    expect(p.Tashlumim).toBe('1')
    expect(p.Currency).toBe('1') // ₪
    expect(p.Amount).toBe('180')
    expect(p.Groupe).toBe('אתר')
  })

  it('maps a recurring donation to HK / 12 monthly payments', () => {
    const p = buildNedarimPayload(form({ donationType: 'recurring' }))
    expect(p.PaymentType).toBe('HK')
    expect(p.Tashlumim).toBe('12')
  })

  it('splits the full name into first + last', () => {
    const p = buildNedarimPayload(form({ fullName: 'ישראל ישראלי' }))
    expect(p.FirstName).toBe('ישראל')
    expect(p.LastName).toBe('ישראלי')
  })

  it('keeps multi-word surnames in LastName', () => {
    const p = buildNedarimPayload(form({ fullName: 'דוד בן גוריון' }))
    expect(p.FirstName).toBe('דוד')
    expect(p.LastName).toBe('בן גוריון')
  })

  it('handles a single-word name (empty LastName)', () => {
    const p = buildNedarimPayload(form({ fullName: 'משה' }))
    expect(p.FirstName).toBe('משה')
    expect(p.LastName).toBe('')
  })

  it('trims and collapses extra whitespace in the name', () => {
    const p = buildNedarimPayload(form({ fullName: '  ישראל   ישראלי  ' }))
    expect(p.FirstName).toBe('ישראל')
    expect(p.LastName).toBe('ישראלי')
  })

  it('passes optional email / phone / dedication through', () => {
    const p = buildNedarimPayload(
      form({ email: 'a@b.com', phone: '050-1234567', dedicationNote: 'לעילוי נשמת' }),
    )
    expect(p.Mail).toBe('a@b.com')
    expect(p.Phone).toBe('050-1234567')
    expect(p.Comment).toBe('לעילוי נשמת')
  })

  it('defaults missing optional fields to empty strings (never "undefined")', () => {
    const p = buildNedarimPayload(form())
    expect(p.Mail).toBe('')
    expect(p.Phone).toBe('')
    expect(p.Comment).toBe('')
    // No value should ever serialize the literal string "undefined".
    expect(Object.values(p)).not.toContain('undefined')
  })

  it('coerces a falsy amount to "0"', () => {
    const p = buildNedarimPayload(form({ amount: 0 }))
    expect(p.Amount).toBe('0')
  })

  it('stringifies a numeric amount', () => {
    const p = buildNedarimPayload(form({ amount: 1000 }))
    expect(p.Amount).toBe('1000')
    expect(typeof p.Amount).toBe('string')
  })

  it('emits only string values (the iframe reads strings)', () => {
    const p = buildNedarimPayload(form({ amount: 360, donationType: 'recurring' }))
    for (const v of Object.values(p)) {
      expect(typeof v).toBe('string')
    }
  })
})
