import { forwardRef, useEffect } from 'react'
import { NEDARIM_IFRAME_URL, NEDARIM_ORIGIN } from '../services/nedarimPlus'

/**
 * NedarimIframe — the matara.pro iframe that renders the donor's credit-card
 * fields (card number / expiry / CVV) inside Nedarim's PCI-compliant frame.
 * The parent triggers the actual charge via postMessage (see nedarimPlus.js).
 *
 * Auto-resizes to the height Nedarim reports so the card fields are never
 * clipped. Rendered only when a live ApiValid token is configured.
 */
const NedarimIframe = forwardRef(function NedarimIframe(_props, ref) {
  const elOf = () => (typeof ref === 'function' ? null : ref?.current)

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== NEDARIM_ORIGIN) return
      const el = elOf()
      if (el && e.data?.Name === 'Height' && e.data.Value) {
        el.style.height = `${e.data.Value}px`
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [ref])

  // The iframe reports its height only when asked — request it once it loads
  // (and again shortly after, since the card fields render asynchronously).
  const requestHeight = () => {
    const win = elOf()?.contentWindow
    if (!win) return
    const ask = () => win.postMessage({ Name: 'GetHeight' }, NEDARIM_ORIGIN)
    ask()
    setTimeout(ask, 600)
  }

  return (
    <div className="mt-4 rounded-xl border border-ink/15 bg-white p-2">
      <p className="mb-2 px-1 text-sm font-semibold text-ink">פרטי כרטיס אשראי</p>
      <iframe
        ref={ref}
        id="nedarim-iframe"
        title="סליקת נדרים פלוס"
        src={NEDARIM_IFRAME_URL}
        onLoad={requestHeight}
        className="w-full"
        style={{ height: 320, border: 0 }}
      />
    </div>
  )
})

export default NedarimIframe
