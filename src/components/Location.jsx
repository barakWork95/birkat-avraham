import { institutionInfo } from '../data/mockData'
import SectionTitle from './ui/SectionTitle'
import { PinIcon, PhoneIcon, MailIcon, WhatsAppIcon, ClockIcon } from './ui/Icons'

/**
 * Location — address, hours, contact actions and an embedded map with a
 * Waze shortcut.
 */
export default function Location() {
  const info = institutionInfo

  const Row = ({ icon: Icon, children }) => (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div className="text-ink">{children}</div>
    </div>
  )

  return (
    <section id="location" className="scroll-mt-28 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow="מיקום ופרטים" title="בואו לבקר" subtitle="דלתות בית המדרש פתוחות. נשמח לראותכם." />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Details */}
          <div className="card flex flex-col gap-5 p-7">
            <Row icon={PinIcon}>
              <p className="font-semibold">כתובת</p>
              <p className="text-ink-muted">{info.address}</p>
            </Row>
            <Row icon={ClockIcon}>
              <p className="font-semibold">שעות פעילות</p>
              <ul className="mt-1 space-y-1 text-sm text-ink-muted">
                {info.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-6">
                    <span>{h.label}</span>
                    <span className="font-medium text-ink">{h.value}</span>
                  </li>
                ))}
              </ul>
            </Row>
            <Row icon={PhoneIcon}>
              <p className="font-semibold">טלפון</p>
              <a href={`tel:${info.phone}`} className="text-ink-muted hover:text-gold">{info.phone}</a>
            </Row>
            <Row icon={MailIcon}>
              <p className="font-semibold">אימייל</p>
              <a href={`mailto:${info.email}`} className="text-ink-muted hover:text-gold">{info.email}</a>
            </Row>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <a
                href={info.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                <PinIcon className="h-5 w-5" />
                ניווט ב-Waze
              </a>
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1"
              >
                <WhatsAppIcon className="h-5 w-5" />
                וואטסאפ
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden p-0">
            <iframe
              title="מפת המוסדות"
              src={info.mapEmbed}
              className="h-full min-h-[340px] w-full grayscale-[0.15]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
