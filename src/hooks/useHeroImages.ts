import { useMemo } from 'react'
import { useCollection } from './useCollection'
import type { GalleryItem, HeroImage } from '../types/models'

/**
 * useHeroImages — the photos behind the homepage hero, in order.
 *
 * The admin's "תמונות רקע" list wins. Until it has anything, the hero borrows
 * the gallery's single photos, so the top of the site shows real photography
 * from day one instead of a bare backdrop. Empty only when both are.
 */
export function useHeroImages(): string[] {
  const { items: hero } = useCollection<HeroImage>('heroImages')
  const { items: gallery } = useCollection<GalleryItem>('gallery')

  return useMemo(() => {
    const own = hero.map((h) => h.image).filter(Boolean)
    if (own.length > 0) return own
    return gallery
      .filter((g) => g.type === 'photo' && g.image)
      .map((g) => g.image as string)
  }, [hero, gallery])
}
