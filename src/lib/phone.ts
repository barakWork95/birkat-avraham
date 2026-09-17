/** A `tel:` link for a displayed number: formatting stripped, a leading + kept. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
