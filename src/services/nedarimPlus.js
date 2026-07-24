/**
 * ------------------------------------------------------------------
 *  Nedarim Plus (נדרים פלוס) — donation integration service
 * ------------------------------------------------------------------
 *  Mosad (institution) ID: 7004283
 *
 *  Nedarim Plus works through an embedded iframe + window.postMessage:
 *    1. Load the iframe:  NEDARIM_IFRAME_URL
 *    2. To charge, post:  { Name: 'FinishTransaction2', Value: <payload> }
 *    3. Listen for:       { Name: 'TransactionResponse', Value: { Status, Message, ... } }
 *
 *  In PHASE 1 (this demo) we DON'T hit the real gateway — `handleNedarimDonation`
 *  builds the exact payload, logs it, and resolves a mocked success so the
 *  thank-you UI can be demonstrated. Flipping to production means uncommenting
 *  the postMessage block below; no UI component needs to change.
 * ------------------------------------------------------------------
 */

export const NEDARIM_MOSAD_ID = '7004283'
export const NEDARIM_IFRAME_URL = `https://www.matara.pro/nedarim/iframe?mosad=${NEDARIM_MOSAD_ID}`

/**
 * Shape the form values into the payload Nedarim Plus expects.
 * @param {{ amount:number, donationType:'one-time'|'recurring', fullName:string, email:string, dedicationNote:string }} form
 */
export function buildNedarimPayload(form) {
  const { amount, donationType, fullName, email, dedicationNote } = form
  const parts = (fullName || '').trim().split(/\s+/)
  const firstName = parts.shift() || ''
  const lastName = parts.join(' ')
  const recurring = donationType === 'recurring'

  return {
    Mosad: NEDARIM_MOSAD_ID,
    ApiValid: '', // TODO(prod): set the ApiValid token from the Nedarim mosad config
    PaymentType: recurring ? 'HK' : 'Ragil', // HK = הוראת קבע (standing order) · Ragil = one-time
    Currency: '1', // 1 = ₪ (ILS)
    Amount: String(amount || 0),
    Tashlumim: recurring ? '12' : '1', // recurring → number of monthly charges
    FirstName: firstName,
    LastName: lastName,
    Mail: email || '',
    Phone: '', // TODO(prod): add a phone field to the form and map it here
    Comment: dedicationNote || '',
    Groupe: 'אתר', // source/campaign tag so donations from the site are identifiable
  }
}

/**
 * Trigger a donation. PHASE 1 returns a mocked successful transaction.
 * @returns {Promise<{ success:boolean, transactionId?:string, payload:object, raw?:object }>}
 */
export async function handleNedarimDonation(payload) {
  // The exact object that will be posted to the Nedarim Plus iframe:
  console.info('[Nedarim Plus] payload ready for postMessage →', payload)

  // ─── PHASE 2: real integration ───────────────────────────────────────
  // const frame = document.getElementById('nedarim-iframe')?.contentWindow
  // frame?.postMessage({ Name: 'FinishTransaction2', Value: payload }, '*')
  // return new Promise((resolve) => {
  //   const onMessage = (e) => {
  //     if (e?.data?.Name === 'TransactionResponse') {
  //       window.removeEventListener('message', onMessage)
  //       const raw = e.data.Value || {}
  //       resolve({ success: raw.Status === 'Success', raw, payload })
  //     }
  //   }
  //   window.addEventListener('message', onMessage)
  // })
  // ─────────────────────────────────────────────────────────────────────

  // DEMO: simulate network + a successful charge.
  await new Promise((r) => setTimeout(r, 1400))
  return { success: true, transactionId: 'DEMO-' + Date.now(), payload }
}
