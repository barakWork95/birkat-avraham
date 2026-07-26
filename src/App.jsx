import { useCallback, useRef } from 'react'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DonationSection from './components/DonationSection'
import Schedule from './components/Schedule'
import Leadership from './components/Leadership'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Location from './components/Location'
import Footer from './components/Footer'
import { HeartIcon } from './components/ui/Icons'

/**
 * App — top-level composition. A single `scrollToDonate` handler is passed
 * to every CTA so all "תרומה" buttons converge on the donation section.
 */
export default function App() {
  const donateRef = useRef(null)

  const scrollToDonate = useCallback(() => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar onDonate={scrollToDonate} />

      <main>
        <Hero onDonate={scrollToDonate} />
        <DonationSection ref={donateRef} />
        <Schedule />
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
