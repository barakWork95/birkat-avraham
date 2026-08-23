import { useCallback, useEffect, useRef, useState } from 'react'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DonationSection from './components/DonationSection'
import Schedule from './components/Schedule'
import Noticeboard from './components/Noticeboard'
import WeeklyBulletin from './components/WeeklyBulletin'
import Shiurim from './components/Shiurim'
import Leadership from './components/Leadership'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Location from './components/Location'
import Footer from './components/Footer'
import { HeartIcon } from './components/ui/Icons'
import { provider } from './services/dataProvider'

/** A branded splash shown until the above-the-fold institution info is loaded. */
function BootSplash() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="ברכת אברהם"
        className="h-16 w-auto animate-pulse"
      />
    </div>
  )
}

/**
 * App — top-level composition. A single `scrollToDonate` handler is passed
 * to every CTA so all "תרומה" buttons converge on the donation section.
 *
 * We gate the first paint on the institution-info singleton so the hero never
 * flashes with empty name/rav fields while Firestore loads. This waits on ONE
 * small doc (not all content), and falls back to rendering after a short
 * timeout so a slow/failed read can never leave the splash stuck.
 */
export default function App() {
  const donateRef = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(
    () => Object.keys(provider.getSingletonSync?.('info') || {}).length > 0,
  )

  useEffect(() => {
    if (ready) return
    let alive = true
    const done = () => alive && setReady(true)
    provider.getSingleton('info').then(done).catch(done)
    const timer = setTimeout(done, 3000) // safety net
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [ready])

  const scrollToDonate = useCallback(() => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  if (!ready) return <BootSplash />

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar onDonate={scrollToDonate} />

      <main>
        <Hero onDonate={scrollToDonate} />
        <DonationSection ref={donateRef} />
        <Schedule />
        <Noticeboard />
        <WeeklyBulletin />
        <Shiurim />
        <Leadership />
        <Gallery />
        <Events />
        <Location />
      </main>

      <Footer onDonate={scrollToDonate} />

      {/* Floating donate button (mobile-friendly) */}
      <button
        onClick={scrollToDonate}
        className="btn-primary fixed bottom-5 left-5 z-30 !px-5 shadow-card-hover sm:hidden"
        aria-label="לתרומה"
      >
        <HeartIcon className="h-5 w-5" />
        תרומה
      </button>
    </div>
  )
}
