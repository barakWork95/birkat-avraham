/**
 * Video helpers — a video field may hold either an external link (YouTube,
 * Vimeo…) or a file uploaded to Storage. Nothing stores *which*: the URL itself
 * is the discriminator, so legacy items keep working and a direct .mp4 link
 * pasted as an "external" URL still plays in the native player, which is what
 * the visitor wants anyway.
 */

/** Extensions we hand to <video> rather than an <iframe>. */
const FILE_VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i

/**
 * True when the URL points at a video *file* (an upload) rather than an
 * embeddable page. Covers Storage download URLs (`…%2F123-ab.mp4?alt=media`)
 * and the data: URLs local mode inlines.
 */
export function isFileVideo(url?: string): boolean {
  if (!url) return false
  if (url.startsWith('data:video/')) return true
  return FILE_VIDEO_EXT.test(url)
}

/** Accepted upload types for the admin's video picker. */
export const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime'

/** Upload ceiling for a single video, in megabytes. */
export const VIDEO_MAX_MB = 200
