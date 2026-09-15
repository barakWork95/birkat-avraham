import { describe, it, expect } from 'vitest'
import { isFileVideo } from './video'

describe('isFileVideo', () => {
  it('treats an empty value as not a file', () => {
    expect(isFileVideo()).toBe(false)
    expect(isFileVideo('')).toBe(false)
  })

  it('recognises a Firebase Storage download URL by its extension', () => {
    expect(
      isFileVideo(
        'https://firebasestorage.googleapis.com/v0/b/ba.appspot.com/o/gallery%2Fvideo%2F1-ab.mp4?alt=media&token=x',
      ),
    ).toBe(true)
  })

  it('recognises plain file URLs', () => {
    expect(isFileVideo('https://example.com/clip.webm')).toBe(true)
    expect(isFileVideo('https://example.com/clip.MOV')).toBe(true)
    expect(isFileVideo('/uploads/clip.m4v#t=2')).toBe(true)
  })

  it('recognises inlined data URLs (local mode)', () => {
    expect(isFileVideo('data:video/mp4;base64,AAAA')).toBe(true)
    expect(isFileVideo('data:image/jpeg;base64,AAAA')).toBe(false)
  })

  it('leaves embeddable links to the iframe', () => {
    expect(isFileVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false)
    expect(isFileVideo('https://youtu.be/dQw4w9WgXcQ')).toBe(false)
    expect(isFileVideo('https://vimeo.com/123456')).toBe(false)
  })

  it('does not match an extension that merely appears mid-path', () => {
    expect(isFileVideo('https://example.com/mp4/watch?v=abc')).toBe(false)
  })
})
