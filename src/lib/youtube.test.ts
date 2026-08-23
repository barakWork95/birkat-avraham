import { describe, expect, it } from 'vitest'
import { youTubeEmbedUrl, youTubeId, youTubeThumbnail } from './youtube'

describe('youTubeId', () => {
  it('reads every common link form', () => {
    const id = 'NyKXkK7R0Zs'
    expect(youTubeId(`https://www.youtube.com/embed/${id}`)).toBe(id)
    expect(youTubeId(`https://www.youtube.com/watch?v=${id}`)).toBe(id)
    expect(youTubeId(`https://www.youtube.com/watch?app=desktop&v=${id}`)).toBe(id)
    expect(youTubeId(`https://youtu.be/${id}`)).toBe(id)
    expect(youTubeId(`https://www.youtube.com/live/${id}`)).toBe(id)
    expect(youTubeId(`https://www.youtube.com/shorts/${id}`)).toBe(id)
  })

  it('keeps working when the link carries tracking params', () => {
    expect(youTubeId('https://www.youtube.com/embed/kzzvbQMM7UM?si=VTQtNBT0yusKvZns')).toBe(
      'kzzvbQMM7UM',
    )
  })

  it('returns null for anything that is not a YouTube video', () => {
    expect(youTubeId('')).toBeNull()
    expect(youTubeId(undefined)).toBeNull()
    expect(youTubeId('https://vimeo.com/123456')).toBeNull()
  })
})

describe('youTubeEmbedUrl', () => {
  it('normalises a watch link into an embed link', () => {
    expect(youTubeEmbedUrl('https://www.youtube.com/watch?v=NyKXkK7R0Zs')).toBe(
      'https://www.youtube.com/embed/NyKXkK7R0Zs',
    )
  })

  it('passes through a non-YouTube url untouched', () => {
    expect(youTubeEmbedUrl('https://example.org/video.mp4')).toBe('https://example.org/video.mp4')
  })
})

describe('youTubeThumbnail', () => {
  it('prefers the sharp maxres frame', () => {
    expect(youTubeThumbnail('https://youtu.be/NyKXkK7R0Zs')).toBe(
      'https://img.youtube.com/vi/NyKXkK7R0Zs/maxresdefault.jpg',
    )
  })

  it('offers the always-present hqdefault frame as the fallback', () => {
    expect(youTubeThumbnail('https://youtu.be/NyKXkK7R0Zs', 'hq')).toBe(
      'https://img.youtube.com/vi/NyKXkK7R0Zs/hqdefault.jpg',
    )
  })

  it('has no thumbnail for a non-YouTube url', () => {
    expect(youTubeThumbnail('https://example.org/video.mp4')).toBeNull()
  })
})
