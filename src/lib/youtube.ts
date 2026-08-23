/**
 * YouTube helpers — the admin may paste any YouTube link (watch, share, embed),
 * so normalise it once here instead of demanding a specific format from gabbaim.
 */

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
