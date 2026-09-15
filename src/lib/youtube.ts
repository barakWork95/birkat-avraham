/**
 * YouTube helpers — the admin may paste any YouTube link (watch, share, embed),
 * so normalise it once here instead of demanding a specific format from gabbaim.
 */
import type { SyntheticEvent } from 'react'

/** Extract the 11-character video id from any common YouTube URL form. */
export function youTubeId(url?: string): string | null {
  if (!url) return null
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

/** An embeddable URL for the player (falls back to the given url if unrecognised). */
export function youTubeEmbedUrl(url?: string): string {
  const id = youTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : (url ?? '')
}

/**
 * Poster frame for a video.
 *
 * `maxresdefault` (1280×720) is the sharp one but 404s on older uploads, while
 * `hqdefault` exists for every video — so callers render the former and swap to
 * the latter on error. Past live streams legitimately have only the channel
 * avatar on grey; that IS their thumbnail, and a custom cover can be uploaded
 * in the admin to replace it.
 */
export function youTubeThumbnail(url?: string, quality: 'max' | 'hq' = 'max'): string | null {
  const id = youTubeId(url)
  if (!id) return null
  const file = quality === 'max' ? 'maxresdefault' : 'hqdefault'
  return `https://img.youtube.com/vi/${id}/${file}.jpg`
}

/**
 * `onLoad`/`onError` handlers for a tile rendering `youTubeThumbnail(url)`.
 *
 * Older uploads have no maxres frame. YouTube answers those with a 120×90 grey
 * placeholder — and Chrome *renders* it (firing `load`, not `error`, despite
 * the 404), so the giveaway is the decoded width, not a failed request. Either
 * signal swaps the tile to hqdefault, which exists for every video.
 *
 * `hasCustomCover` short-circuits the swap: an uploaded cover is never replaced.
 */
export function youTubePosterHandlers(videoUrl: string | undefined, hasCustomCover: boolean) {
  const swap = (img: HTMLImageElement) => {
    if (hasCustomCover || img.dataset.fallback) return
    const hq = youTubeThumbnail(videoUrl, 'hq')
    if (!hq) return
    img.dataset.fallback = '1'
    img.src = hq
  }
  return {
    onLoad: (e: SyntheticEvent<HTMLImageElement>) => {
      if (e.currentTarget.naturalWidth <= 120) swap(e.currentTarget)
    },
    onError: (e: SyntheticEvent<HTMLImageElement>) => swap(e.currentTarget),
  }
}
