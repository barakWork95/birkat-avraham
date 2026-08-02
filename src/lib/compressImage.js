/**
 * compressImage — read a File, downscale it to fit within `maxDim`, and return
 * a JPEG data URL. Keeps uploaded images small enough to live comfortably in
 * localStorage (demo) or a Firestore document (< ~900KB) until Firebase Storage
 * is wired, at which point this same data URL can be uploaded and swapped for a
 * download URL with no change to the editor UI.
 *
 * @param {File} file
 * @param {{ maxDim?: number, quality?: number }} [opts]
 * @returns {Promise<string>} data URL (image/jpeg)
 */
export function compressImage(file, { maxDim = 1200, quality = 0.82 } = {}) {
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
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
