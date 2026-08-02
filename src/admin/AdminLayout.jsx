import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { COLLECTIONS, COLLECTION_KEYS } from '../config/collections'
import { MenuIcon, CloseIcon } from '../components/ui/Icons'

/**
 * AdminLayout — top bar + collections nav + content outlet.
 * The nav is a fixed sidebar on desktop and a slide-in drawer on mobile.
 */
export default function AdminLayout({ children, user, onSignOut }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname])

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Single source of truth for the admin nav (dashboard + collections + info).
  const navItems = [
    { to: '/admin', label: 'לוח בקרה', match: (p) => p === '/admin' },
    ...COLLECTION_KEYS.map((key) => ({
      to: `/admin/${key}`,
      label: COLLECTIONS[key].label,
      match: (p) => p.startsWith(`/admin/${key}`),
    })),
    { to: '/admin/info', label: 'פרטי מוסד', match: (p) => p.startsWith('/admin/info') },
  ]

  const NavList = () => (
    <nav className="flex flex-col gap-1">
      {navItems.map((item, i) => (
        <div key={item.to}>
          {/* divider before "פרטי מוסד" */}
          {i === navItems.length - 1 && <div className="my-1 border-t border-ink/10" />}
          <Link
            to={item.to}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              item.match(pathname) ? 'bg-gold/10 text-gold-hover' : 'text-ink/80 hover:bg-ink/5'
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )

  return (
    <div dir="rtl" className="min-h-screen bg-cream text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {/* Mobile menu toggle */}
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink hover:bg-ink/5 sm:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="פתיחת תפריט"
            aria-expanded={menuOpen}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Link to="/admin" className="flex min-w-0 shrink-0 items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ברכת אברהם" className="h-9 w-auto shrink-0" />
            <span className="hidden font-heading text-lg font-bold sm:inline">ניהול תוכן</span>
          </Link>
        </div>
        <div className="flex min-w-0 items-center gap-2 text-sm sm:gap-3">
          <a href={import.meta.env.BASE_URL} className="whitespace-nowrap text-ink-muted hover:text-gold">
            צפייה באתר ↗
          </a>
          <span className="hidden text-ink/20 md:inline">|</span>
          <span className="hidden max-w-[180px] truncate text-ink-muted md:inline">{user?.name}</span>
          <button onClick={onSignOut} className="shrink-0 rounded-lg bg-ink/5 px-3 py-1.5 font-medium hover:bg-ink/10">
            יציאה
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 sm:block">
          <div className="card sticky top-20 p-3">
            <NavList />
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile nav drawer */}
      <div className={`fixed inset-0 z-50 sm:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[80%] max-w-xs flex-col bg-cream shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
            <span className="font-heading text-lg font-bold">תפריט ניהול</span>
            <button
              className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-ink/5"
              onClick={() => setMenuOpen(false)}
              aria-label="סגירת תפריט"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="overflow-y-auto p-3">
            <NavList />
          </div>
        </div>
      </div>
    </div>
  )
}
