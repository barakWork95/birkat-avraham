/**
 * Image compression helpers. A single canvas-based core downscales an image to
 * fit within `maxDim`; callers pick the output they need:
 *   - compressImage()      → JPEG data URL (local mode; stored inline)
 *   - compressImageToBlob() → JPEG Blob    (firebase mode; uploaded to Storage)
 */

const DEFAULTS = { maxDim: 1200, quality: 0.82 }

/** Load a File into a downscaled <canvas>. */
function toCanvas(file, maxDim) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error('הקובץ אינו תמונה'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('קריאת הקובץ נכשלה'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('טעינת התמונה נכשלה'))
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Compress a File to a JPEG data URL (kept small enough to live inline in
 * localStorage / a Firestore document).
 * @returns {Promise<string>} data URL (image/jpeg)
 */
export async function compressImage(file, opts = {}) {
  const { maxDim, quality } = { ...DEFAULTS, ...opts }
  const canvas = await toCanvas(file, maxDim)
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * Compress a File to a JPEG Blob (for uploading to Firebase Storage).
 * @returns {Promise<Blob>}
 */
export async function compressImageToBlob(file, opts = {}) {
  const { maxDim, quality } = { ...DEFAULTS, ...opts }
  const canvas = await toCanvas(file, maxDim)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('דחיסת התמונה נכשלה'))),
      'image/jpeg',
      quality,
    )
  })
}
