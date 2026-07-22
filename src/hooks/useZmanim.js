import { useEffect, useState } from 'react'
import { zmanimData } from '../data/mockData'

/**
 * useZmanim — Hebrew date, weekly parasha & Shabbat times.
 *
 * PHASE 2: replace the mock with a live Hebcal request, e.g.
 *   fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=293918`)  // Petah Tikva
 *   fetch(`https://www.hebcal.com/converter?cfg=json&date=${today}&g2h=1`)
 * Map the response into the same { hebrewDate, parasha, candleLighting, havdalah, ... } shape.
 */
export function useZmanim() {
  const [zmanim, setZmanim] = useState(zmanimData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Phase 1: static mock. Phase 2: fetch + setZmanim(mapped).
    setLoading(false)
    setZmanim(zmanimData)
  }, [])

  return { zmanim, loading }
}
