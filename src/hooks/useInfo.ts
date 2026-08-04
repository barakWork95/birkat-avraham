import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import type { InstitutionInfo } from '../types/models'

/**
 * useInfo — the institution-info singleton (name, address, contacts, WhatsApp,
 * bank details, mission…). Reads from the provider so admin edits reflect live.
 * Initializes synchronously so consumers never need a loading state.
 */
export function useInfo(): InstitutionInfo {
  const [info, setInfo] = useState<InstitutionInfo>(
    () => provider.getSingletonSync('info') as InstitutionInfo,
  )

  useEffect(() => {
    let alive = true
    provider.getSingleton('info').then((d) => {
      if (alive) setInfo(d as InstitutionInfo)
    })
    const unsub = provider.subscribeSingleton('info', (d) => {
      if (alive) setInfo(d as InstitutionInfo)
    })
    return () => {
      alive = false
      unsub()
    }
  }, [])

  return info
}
