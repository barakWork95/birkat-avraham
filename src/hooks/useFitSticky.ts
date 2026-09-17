import { useEffect, useRef, useState } from 'react'

/**
 * useFitSticky — a `top` offset for a sticky column that keeps ALL of it
 * reachable. A sticky element taller than the viewport, pinned by its top,
 * hides its bottom until its container scrolls away. So when the element fits
 * it pins at `preferred`; when it doesn't, the offset goes negative and the
 * element pins by its bottom edge, `margin` above the viewport's.
 *
 * Re-measures on resize of the element or the window. Harmless where the
 * element isn't actually sticky (`top` does nothing on static positioning).
 */
export function useFitSticky<T extends HTMLElement>(preferred: number, margin = 24) {
  const ref = useRef<T>(null)
  const [top, setTop] = useState(preferred)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () =>
      setTop(Math.min(preferred, window.innerHeight - el.getBoundingClientRect().height - margin))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [preferred, margin])

  return { ref, top }
}
