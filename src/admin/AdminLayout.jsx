import { Link, useLocation } from 'react-router-dom'
import { COLLECTIONS, COLLECTION_KEYS } from '../config/collections'

/**
 * AdminLayout — sidebar (collections) + top bar + content outlet.
 */
export default function AdminLayout({ children, user, onSignOut }) {
  const { pathname } = useLocation()

  return (
    <div dir="rtl" className="min-h-screen bg-cream text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-5">
        <Link to="/admin" className="flex min-w-0 shrink-0 items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="ברכת אברהם" className="h-9 w-auto shrink-0" />
          <span className="hidden font-heading text-lg font-bold sm:inline">ניהול תוכן</span>
        </Link>
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
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 sm:block">
          <nav className="card sticky top-20 flex flex-col gap-1 p-3">
            {COLLECTION_KEYS.map((key) => {
              const active = pathname.includes(`/admin/${key}`)
              return (
                <Link
                  key={key}
                  to={`/admin/${key}`}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-gold/10 text-gold-hover' : 'text-ink/80 hover:bg-ink/5'
                  }`}
                >
                  {COLLECTIONS[key].label}
                </Link>
              )
            })}
            <div className="my-1 border-t border-ink/10" />
            <Link
              to="/admin/info"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname.includes('/admin/info') ? 'bg-gold/10 text-gold-hover' : 'text-ink/80 hover:bg-ink/5'
              }`}
            >
              פרטי מוסד
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
