import { institutionInfo } from '../data/mockData'
import SectionTitle from './ui/SectionTitle'
import { PinIcon, PhoneIcon, WhatsAppIcon } from './ui/Icons'

/**
 * Location — address, published contact numbers, WhatsApp shiurim group,
 * and an embedded map with a Waze shortcut. Map/Waze URLs are derived from
 * `mapQuery` so there's a single source of truth for the address.
 */
export default function Location() {
  const info = institutionInfo
  const q = encodeURIComponent(info.mapQuery)
  const wazeUrl = `https://waze.com/ul?q=${q}`
  const mapEmbed = `https://www.google.com/maps?q=${q}&output=embed`

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
        <SectionTitle
          eyebrow="מיקום ופרטים"
          title="בואו לבקר"
          subtitle="דלתות בית המדרש פתוחות. נשמח לראותכם."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Details */}
          <div className="card flex flex-col gap-5 p-7">
            <Row icon={PinIcon}>
              <p className="font-semibold">כתובת</p>
              <p className="text-ink-muted">{info.address}</p>
            </Row>

            <Row icon={PhoneIcon}>
              <p className="font-semibold">טלפונים</p>
              <ul className="mt-1 space-y-2 text-sm">
                {info.contacts.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-ink-muted">{c.label}</span>
                    <a
                      href={`tel:${c.phone.replace(/\D/g, '')}`}
                      dir="ltr"
                      className="font-medium text-ink hover:text-gold"
                    >
                      {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </Row>

            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                <PinIcon className="h-5 w-5" />
                ניווט ב-Waze
              </a>
              <a
                href={info.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1"
              >
                <WhatsAppIcon className="h-5 w-5" />
                קבוצת השיעורים
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden p-0">
            <iframe
              title="מפת המוסדות"
              src={mapEmbed}
              className="h-full min-h-[340px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
