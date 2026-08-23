import { useCollection } from './useCollection'
import { useEvents } from './useEvents'

/** Sections that only exist on the page when they have content. */
export type OptionalSection = 'noticeboard' | 'shiurim' | 'events'

/**
 * useOptionalSections — which of the content-dependent sections are currently
 * rendered. Each of those sections returns null when empty, so the navbar and
 * footer ask here instead of guessing, and never link to a missing anchor.
 *
 * Events go through useEvents on purpose: the section only shows UPCOMING
 * events, so a list of events that have all passed counts as empty here too.
 */
export function useOptionalSections(): Record<OptionalSection, boolean> {
  const { items: notices } = useCollection('noticeboard')
  const { items: shiurim } = useCollection('shiurim')
  const { events } = useEvents()

  return {
    noticeboard: notices.length > 0,
    shiurim: shiurim.length > 0,
    events: events.length > 0,
  }
}
