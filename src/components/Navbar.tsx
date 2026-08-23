import { useEffect, useState } from 'react'
import { MenuIcon, CloseIcon, HeartIcon } from './ui/Icons'
import { useInfo } from '../hooks/useInfo'
import { useOptionalSections, type OptionalSection } from '../hooks/useOptionalSections'
import { useSectionText } from '../hooks/useSectionText'

/**
 * Site nav, in page order. Entries carrying `optional` belong to sections that
 * hide themselves when their collection is empty — those links appear only
 * while their section is actually on the page.
 */
const NAV_LINKS: { href: string; label: string; optional?: OptionalSection }[] = [
  { href: '#hero', label: 'בית' },
  { href: '#schedule', label: 'לוח זמנים' },
  { href: '#noticeboard', label: 'לוח מודעות', optional: 'noticeboard' },
  { href: '#bulletin', label: 'העלון' },
  { href: '#shiurim', label: 'שיעורים', optional: 'shiurim' },
  { href: '#leadership', label: 'אנשי קשר' },
  { href: '#gallery', label: 'גלריה' },
  { href: '#events', label: 'אירועים', optional: 'events' },
  { href: '#location', label: 'צור קשר' },
]

interface NavbarProps {
  onDonate: () => void
}

/**
 * Navbar — sticky header with brand mark, desktop nav, donation CTA,
 * and a full-screen mobile drawer.
 */
export default function Navbar({ onDonate }: NavbarProps) {
  const institutionInfo = useInfo()
  const visible = useOptionalSections()
  const noticeboard = useSectionText('noticeboard')
  const navLinks = NAV_LINKS.filter((l) => !l.optional || visible[l.optional]).map((l) =>
    // The board's link follows whatever the gabbai titled the section.
    l.optional === 'noticeboard' ? { ...l, label: noticeboard.title || l.label } : l,
  )
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const Brand = () => (
    <a
      href="#hero"
      className="flex items-center"
      onClick={() => setOpen(false)}
      aria-label={`מוסדות ${institutionInfo.nameHe}`}
    >
      {/* Real logo — file lives at public/logo.png (BASE_URL keeps it correct under the GH Pages sub-path) */}
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt={`מוסדות ${institutionInfo.nameHe}`}
        className="h-12 w-auto sm:h-14"
      />
    </a>
  )

  return (
    <>
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-cream/90 shadow-card backdrop-blur-md' : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <nav className="section flex items-center justify-between py-3">
        <Brand />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-[15px] font-medium text-ink/80 transition-colors hover:bg-gold/5 hover:text-gold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={onDonate} className="btn-primary hidden !py-2.5 sm:inline-flex">
            <HeartIcon className="h-4 w-4" />
            תרומה
          </button>

          {/* Mobile toggle */}
          <button
            className="grid h-11 w-11 place-items-center rounded-xl text-ink hover:bg-gold/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile drawer — rendered OUTSIDE <header> on purpose.
          The header uses backdrop-blur, and backdrop-filter establishes a
          containing block for position:fixed descendants, which would otherwise
          trap this overlay inside the header's box (clipping it to ~header height). */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        {/* panel */}
        <div
          className={`absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <Brand />
            <button
              className="grid h-10 w-10 place-items-center rounded-xl text-ink hover:bg-gold/5"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="flex flex-col gap-1 p-5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-lg font-medium text-ink hover:bg-gold/5 hover:text-gold"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto p-5">
            <button
              onClick={() => { setOpen(false); onDonate?.() }}
              className="btn-primary w-full"
            >
              <HeartIcon className="h-5 w-5" />
              לתרומה למוסדות
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
