import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import { INFO_DEFAULTS } from '../config/infoDefaults'
import type { InstitutionInfo, Singleton } from '../types/models'

/** Stored info over the built-in defaults — a field that was never saved falls back. */
const withDefaults = (d: Singleton): InstitutionInfo => ({ ...INFO_DEFAULTS, ...(d as InstitutionInfo) })

/**
 * useInfo — the institution-info singleton (name, address, contacts, WhatsApp,
 * bank details, mission…). Reads from the provider so admin edits reflect live.
 * Initializes synchronously so consumers never need a loading state.
 */
export function useInfo(): InstitutionInfo {
  const [info, setInfo] = useState<InstitutionInfo>(() =>
    withDefaults(provider.getSingletonSync('info')),
  )

  useEffect(() => {
    let alive = true
    provider.getSingleton('info').then((d) => {
      if (alive) setInfo(withDefaults(d))
    })
    const unsub = provider.subscribeSingleton('info', (d) => {
      if (alive) setInfo(withDefaults(d))
    })
    return () => {
      alive = false
      unsub()
    }
  }, [])

  return info
}
