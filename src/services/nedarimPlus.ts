/**
 * ------------------------------------------------------------------
 *  Nedarim Plus (נדרים פלוס) — donation integration service
 * ------------------------------------------------------------------
 *  Mosad (institution) ID: 7004283
 *
 *  Nedarim Plus works through an embedded iframe + window.postMessage. The
 *  donor's CARD DETAILS are entered inside the matara.pro iframe (PCI-safe —
 *  they never touch our page). Our page contributes amount / name / etc. and
 *  triggers the charge:
 *    1. Load the iframe:  NEDARIM_IFRAME_URL  (renders the card fields)
 *    2. To charge, post:  { Name: 'FinishTransaction2', Value: <payload> }
 *    3. Listen for:       { Name: 'TransactionResponse', Value: { Status, ... } }
 *                         { Name: 'Height',            Value: <px> }  (auto-resize)
 *
 *  LIVE vs DEMO is decided by whether the ApiValid token is configured
 *  (VITE_NEDARIM_API_VALID). With a token → real charge through the iframe.
 *  Without one → a mocked success so the thank-you UI still demonstrates and
 *  no real charge is attempted.
 * ------------------------------------------------------------------
 */

export type DonationType = 'one-time' | 'recurring'

export interface DonationForm {
  amount: number
  donationType: DonationType
  fullName: string
  email?: string
  phone?: string
  dedicationNote?: string
}

export type NedarimPayload = Record<string, string>

export interface DonationResult {
  success: boolean
  transactionId?: string
  payload: NedarimPayload
  raw: Record<string, unknown>
}

export const NEDARIM_MOSAD_ID = '7004283'
export const NEDARIM_ORIGIN = 'https://www.matara.pro'
// The live embeddable payment iframe (renders the card fields; no X-Frame-Options).
// Note: /nedarim/iframe is a stale 404 — the current path is /NedarimPlus/iframe/.
export const NEDARIM_IFRAME_URL = `${NEDARIM_ORIGIN}/NedarimPlus/iframe/`

// ApiValid comes from the environment so the token stays out of committed source.
export const NEDARIM_API_VALID = import.meta.env.VITE_NEDARIM_API_VALID || ''

/** True when a live ApiValid token is present, so real charges are enabled. */
export const isNedarimConfigured = (): boolean => NEDARIM_API_VALID.trim().length > 0

/** Shape the form values into the payload Nedarim Plus expects. */
export function buildNedarimPayload(form: DonationForm): NedarimPayload {
  const { amount, donationType, fullName, email, phone, dedicationNote } = form
  const parts = (fullName || '').trim().split(/\s+/)
  const firstName = parts.shift() || ''
  const lastName = parts.join(' ')
  const recurring = donationType === 'recurring'

  // Every field the iframe reads from event.data.Value on FinishTransaction2.
  // Unused ones are sent as '' so the iframe never posts the string "undefined".
  return {
    Mosad: NEDARIM_MOSAD_ID,
    ApiValid: NEDARIM_API_VALID,
    PaymentType: recurring ? 'HK' : 'Ragil', // HK = הוראת קבע · Ragil = one-time
    Currency: '1', // 1 = ₪ (ILS)
    Zeout: '', // donor ID number (not collected)
    Amount: String(amount || 0),
    Tashlumim: recurring ? '12' : '1', // recurring → number of monthly charges
    FirstName: firstName,
    LastName: lastName,
    Street: '',
    City: '',
    Phone: phone || '',
    Mail: email || '',
    Comment: dedicationNote || '',
    Groupe: 'אתר', // source/campaign tag so site donations are identifiable
    CallBack: '',
    CallBackMailError: '',
    Param1: '',
    Param2: '',
    Day: '', // recurring charge day of month (blank = default)
    ThirdPartyReceipt: '',
    ForceUpdateMatching: '',
  }
}

// Friendly Hebrew messages for the iframe's card-field validation errors.
const FIELD_ERRORS: Record<string, Record<string, string>> = {
  Card: { Empty: 'נא להזין מספר כרטיס אשראי', Wrong: 'מספר כרטיס האשראי אינו תקין' },
  Expiration: { Empty: 'נא להזין תוקף', Wrong: 'תוקף הכרטיס אינו תקין' },
  CVV: { Empty: 'נא להזין CVV', Wrong: 'ה-CVV אינו תקין' },
}

/**
 * Charge through the live Nedarim Plus iframe.
 *
 * The card fields live inside `iframeEl` (the donor fills them there, PCI-safe).
 * Flow, matching the iframe's postMessage API:
 *   1. post { Name:'ValidateFields' }        → iframe checks its card inputs
 *      · { Name:'ValidateFields', Value:'OK' }              → proceed
 *      · { Name:'ValidateFields', Field, ErrorType }        → reject (bad field)
 *   2. post { Name:'FinishTransaction2', Value: payload }   → charge
 *      · { Name:'TransactionResponse', Value: <result> }    → resolve
 *
 * Only messages from the Nedarim origin are trusted.
 */
export function chargeViaNedarim(
  iframeEl: HTMLIFrameElement | null | undefined,
  payload: NedarimPayload,
  { timeoutMs = 90000 }: { timeoutMs?: number } = {},
): Promise<DonationResult> {
  return new Promise((resolve, reject) => {
    const frame = iframeEl?.contentWindow
    if (!frame) {
      reject(new Error('טופס הסליקה עדיין נטען, נסו שוב בעוד רגע'))
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timer)
    }

    const onMessage = (e: MessageEvent) => {
      // Trust only messages from the Nedarim Plus origin.
      if (e.origin !== NEDARIM_ORIGIN) return
      const { Name, Value, Field, ErrorType } = e.data || {}

      if (Name === 'ValidateFields') {
        if (Value === 'OK') {
          // Card fields look valid → run the actual charge.
          frame.postMessage({ Name: 'FinishTransaction2', Value: payload }, NEDARIM_ORIGIN)
        } else {
          cleanup()
          reject(new Error(FIELD_ERRORS[Field]?.[ErrorType] || 'נא לבדוק את פרטי כרטיס האשראי'))
        }
        return
      }

      if (Name === 'TransactionResponse') {
        cleanup()
        const raw = (Value || {}) as Record<string, unknown>
        const status = String(raw.Status ?? '').toLowerCase()
        const success = status === 'success' || status === 'ok' || raw.Status === true
        resolve({
          success,
          transactionId: (raw.TransactionId || raw.Id) as string | undefined,
          raw,
          payload,
        })
      }
    }

    window.addEventListener('message', onMessage)
    // Kick off with client-side field validation; charge happens on the OK reply.
    frame.postMessage({ Name: 'ValidateFields' }, NEDARIM_ORIGIN)

    timer = setTimeout(() => {
      cleanup()
      reject(new Error('לא התקבלה תשובה מנדרים פלוס. נסו שוב.'))
    }, timeoutMs)
  })
}

/**
 * Main entry used by the donation hook. Routes to the live charge when an
 * iframe + ApiValid are available, otherwise returns a mocked success (demo).
 */
export async function handleNedarimDonation(
  payload: NedarimPayload,
  { iframe }: { iframe?: HTMLIFrameElement | null } = {},
): Promise<DonationResult> {
  if (isNedarimConfigured() && iframe) {
    console.info('[Nedarim Plus] LIVE charge → posting to iframe', { ...payload, ApiValid: '***' })
    return chargeViaNedarim(iframe, payload)
  }

  // DEMO: no token (or no iframe) — simulate network + a successful charge.
  console.info('[Nedarim Plus] DEMO mode (no ApiValid) — mocking success', {
    ...payload,
    ApiValid: payload.ApiValid ? '***' : '',
  })
  await new Promise((r) => setTimeout(r, 1400))
  return { success: true, transactionId: 'DEMO-' + Date.now(), payload, raw: {} }
}
