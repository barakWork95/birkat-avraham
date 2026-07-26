import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'

/**
 * useInfo — the institution-info singleton (name, address, contacts, WhatsApp,
 * bank details, mission…). Reads from the provider so admin edits reflect live.
 * Initializes synchronously so consumers never need a loading state.
 */
export function useInfo() {
  const [info, setInfo] = useState(() => provider.getSingletonSync?.('info') ?? {})

  useEffect(() => {
    let alive = true
    provider.getSingleton('info').then((d) => alive && setInfo(d))
    const unsub = provider.subscribeSingleton?.('info', (d) => alive && setInfo(d))
    return () => {
      alive = false
      unsub?.()
    }
  }, [])

  return info
}
