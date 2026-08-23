import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import { SECTION_TEXT_DEFAULTS, type SectionText } from '../config/sectionTexts'
import type { Singleton } from '../types/models'

type SectionTextMap = Record<string, SectionText>

/**
 * useSectionTexts — the `sections` singleton (all section headings), read
 * reactively so admin edits reflect on the site immediately. Initializes
 * synchronously so headings never flash.
 */
export function useSectionTexts(): SectionTextMap {
  const [texts, setTexts] = useState<SectionTextMap>(
    () => provider.getSingletonSync('sections') as SectionTextMap,
  )

  useEffect(() => {
    let alive = true
    const apply = (d: Singleton) => alive && setTexts(d as SectionTextMap)
    provider.getSingleton('sections').then(apply)
    const unsub = provider.subscribeSingleton('sections', apply)
    return () => {
      alive = false
      unsub()
    }
  }, [])

  return texts
}

/**
 * useSectionText — the heading for one section, with the stored text layered
 * over the built-in default. A field the gabbai cleared stays cleared (empty
 * string hides that line); only fields that were never set fall back.
 */
export function useSectionText(key: string): SectionText {
  const texts = useSectionTexts()
  return { ...SECTION_TEXT_DEFAULTS[key], ...(texts?.[key] ?? {}) }
}
