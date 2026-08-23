import { PhoneIcon, WhatsAppIcon, PinIcon, HeartIcon, MailIcon } from './ui/Icons'
import { useInfo } from '../hooks/useInfo'
import { useOptionalSections } from '../hooks/useOptionalSections'
import { useSectionText } from '../hooks/useSectionText'

interface FooterProps {
  onDonate: () => void
}

/**
 * Footer — brand summary, quick links, contact, and legal line.
 */
export default function Footer({ onDonate }: FooterProps) {
  const info = useInfo()
  const year = new Date().getFullYear()
  // Same rule as the navbar: link a section only while it is on the page.
  const visible = useOptionalSections()
  const noticeboard = useSectionText('noticeboard')

  const links = [
    { href: '#schedule', label: 'לוח זמנים' },
    ...(visible.noticeboard
      ? [{ href: '#noticeboard', label: noticeboard.title || 'לוח מודעות' }]
      : []),
    { href: '#bulletin', label: 'העלון השבועי' },
    ...(visible.shiurim ? [{ href: '#shiurim', label: 'שיעורי הרב' }] : []),
    { href: '#leadership', label: 'אנשי קשר' },
    { href: '#gallery', label: 'גלריה' },
    { href: '#donate', label: 'תרומה' },
    { href: '#location', label: 'צור קשר' },
  ]

  return (
    <footer className="bg-ink text-white/80">
      <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 place-items-center rounded-xl font-heading text-2xl text-gold-light"
              style={{ background: 'radial-gradient(circle at 30% 25%, #3a241a, #1A1110)' }}
            >
              ב
            </span>
            <div>
              <p className="font-heading text-xl font-bold text-white">מוסדות {info.nameHe}</p>
              <p className="text-sm text-white/60">{info.tagline}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            בית לתורה, לתפילה ולחסד בראשות {info.ravName}. אנו מזמינים אתכם להיות שותפים במפעל של קדושה.
          </p>
          <button onClick={onDonate} className="btn-primary mt-5 !py-2.5">
            <HeartIcon className="h-4 w-4" />
            לתרומה למוסדות
          </button>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 font-heading text-lg font-bold text-gold-light">ניווט מהיר</h4>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/70 transition-colors hover:text-gold-light">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-heading text-lg font-bold text-gold-light">יצירת קשר</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <PinIcon className="h-4 w-4 text-gold-light" />
              <span className="text-white/70">{info.address}</span>
            </li>
            {info.phone && (
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gold-light" />
                <a href={`tel:${info.phone.replace(/\D/g, '')}`} dir="ltr" className="text-white/70 hover:text-gold-light">{info.phone}</a>
              </li>
            )}
            {info.kollelEmail && (
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-gold-light" />
                <a href={`mailto:${info.kollelEmail}`} dir="ltr" className="text-white/70 hover:text-gold-light">{info.kollelEmail}</a>
              </li>
            )}
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 text-gold-light" />
              <a href={info.whatsappGroup} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-gold-light">קבוצת השיעורים בוואטסאפ</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-white/50 sm:flex-row sm:text-right">
          <p>© {year} מוסדות {info.nameHe}. כל הזכויות שמורות.</p>
          <p>מבנה כובשי החרמון 10, רחובות</p>
        </div>
      </div>
    </footer>
  )
}
