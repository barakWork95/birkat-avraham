import { useEffect, useState } from 'react'
import { zmanimData } from '../data/mockData'

/**
 * useZmanim — Hebrew date, weekly parasha, Shabbat times & daf yomi.
 *
 * Live source: Hebcal (free, no API key). We fetch three things and map them
 * into the SAME shape the mock used, so no UI component changes:
 *   - Shabbat times + parasha  → /shabbat   (geonameid = Rehovot)
 *   - Today's Hebrew date      → /converter (Gregorian → Hebrew)
 *   - Daf yomi                 → /hebcal    (daily learning feed)
 *
 * Resilience: results are cached in localStorage for the day, and any network
 * failure falls back to the static `zmanimData` so the ribbon never breaks.
 */

// GeoNames id for Rehovot, Israel (the institution's city). Petah Tikva = 293918.
const REHOVOT_GEONAMEID = 293703
const CACHE_KEY = 'ba:zmanim'

const pad = (n) => String(n).padStart(2, '0')
const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
// Extract "HH:MM" from a Hebcal ISO datetime like "2025-07-25T19:12:00+03:00".
const timeFromISO = (iso) => (iso && iso.includes('T') ? iso.slice(11, 16) : '')
// Hebcal Hebrew strings arrive with nikud; strip it to match the site's style.
const stripNikud = (s) => (s || '').replace(/[֑-ׇ]/g, '').trim()

async function fetchZmanim() {
  const [shabbat, converter, learning] = await Promise.all([
    fetch(
      `https://www.hebcal.com/shabbat?cfg=json&geonameid=${REHOVOT_GEONAMEID}&lg=he&b=18&M=on`,
    ).then((r) => r.json()),
    fetch(
      `https://www.hebcal.com/converter?cfg=json&date=${todayISO()}&g2h=1&strict=1`,
    ).then((r) => r.json()),
    fetch(
      `https://www.hebcal.com/hebcal?cfg=json&v=1&maj=off&min=off&mod=off&nx=off&ss=off&mf=off&c=off&F=on&lg=he&start=${todayISO()}&end=${todayISO()}`,
    )
      .then((r) => r.json())
      .catch(() => null),
  ])

  const items = shabbat?.items || []
  const candles = items.find((i) => i.category === 'candles')
  const havdalah = items.find((i) => i.category === 'havdalah')
  const parasha = items.find((i) => i.category === 'parashat')
  const daf = learning?.items?.find((i) => i.category === 'dafyomi')

  return {
    hebrewDate: stripNikud(converter?.hebrew) || zmanimData.hebrewDate,
    gregorianDate: new Date().toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    parasha: stripNikud(parasha?.hebrew) || zmanimData.parasha,
    city: 'רחובות',
    candleLighting: timeFromISO(candles?.date) || zmanimData.candleLighting,
    havdalah: timeFromISO(havdalah?.date) || zmanimData.havdalah,
    dafYomi: stripNikud(daf?.hebrew) || zmanimData.dafYomi,
  }
}

export function useZmanim() {
  const [zmanim, setZmanim] = useState(zmanimData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    // Serve today's cached result instantly if we already fetched it today.
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached?.date === todayISO() && cached.data) {
        setZmanim(cached.data)
        setLoading(false)
        return
      }
    } catch {
      /* ignore cache read errors */
    }

    fetchZmanim()
      .then((data) => {
        if (!alive) return
        setZmanim(data)
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayISO(), data }))
        } catch {
          /* ignore quota errors */
        }
      })
      .catch(() => {
        /* keep the static fallback already in state */
      })
      .finally(() => alive && setLoading(false))

    return () => {
      alive = false
    }
  }, [])

  return { zmanim, loading }
}
