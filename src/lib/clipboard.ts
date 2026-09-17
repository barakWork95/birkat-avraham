/**
 * copyText — put text on the clipboard, reporting whether it worked.
 *
 * The async Clipboard API is missing from some in-app browsers (a link opened
 * from WhatsApp, say) and on non-secure origins, and it can reject. Those fall
 * back to selecting a hidden textarea and `execCommand('copy')` — deprecated,
 * but still the one path those browsers support.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Denied or unavailable — try the legacy path below.
  }
  return legacyCopy(text)
}

function legacyCopy(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '') // no on-screen keyboard on mobile
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    area.remove()
  }
}
