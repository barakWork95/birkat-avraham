import { afterEach, describe, it, expect, vi } from 'vitest'
import { copyText } from './clipboard'

const setClipboard = (value: unknown) =>
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true })

describe('copyText', () => {
  afterEach(() => {
    setClipboard(undefined)
    vi.restoreAllMocks()
  })

  it('uses the Clipboard API when it is there', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard({ writeText })
    await expect(copyText('86098235')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('86098235')
  })

  it('falls back to execCommand when the API rejects, and cleans up after itself', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) })
    const exec = vi.fn().mockReturnValue(true)
    document.execCommand = exec
    await expect(copyText('פרטים')).resolves.toBe(true)
    expect(exec).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('falls back when there is no Clipboard API, and reports failure', async () => {
    setClipboard(undefined)
    document.execCommand = vi.fn().mockReturnValue(false)
    await expect(copyText('x')).resolves.toBe(false)
  })
})
