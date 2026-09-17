import { describe, it, expect } from 'vitest'
import { telHref } from './phone'

describe('telHref', () => {
  it('strips the dashes and spaces a number is displayed with', () => {
    expect(telHref('052-782-6600')).toBe('tel:0527826600')
    expect(telHref(' 08 638 4377 ')).toBe('tel:086384377')
  })

  it('keeps a leading + for international numbers', () => {
    expect(telHref('+972-52-782-6600')).toBe('tel:+972527826600')
  })
})
