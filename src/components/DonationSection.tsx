import { forwardRef } from 'react'
import SectionTitle from './ui/SectionTitle'
import ImpactCarousel from './ImpactCarousel'
import DonationWidget from './DonationWidget'
import { useInfo } from '../hooks/useInfo'
import type { BankTransfer } from '../types/models'
import { useSectionText } from '../hooks/useSectionText'
import { CoinIcon, ExternalLinkIcon } from './ui/Icons'
import { useFitSticky } from '../hooks/useFitSticky'

/** Where the side column pins on desktop: clear of the sticky navbar (7rem). */
const STICKY_TOP_PX = 112

/** Only http(s) links become buttons — never a `javascript:` URL typed into the admin. */
const safeHref = (url?: string): string | undefined => {
  const u = url?.trim()
  return u && /^https?:\/\//i.test(u) ? u : undefined
}

/**
 * DonationSection — pairs the impact carousel ("see where funds go")
 * with the donation widget, plus the two off-widget ways to give: bank
 * transfer details, and a QR that carries the site over to a phone.
 * `ref` lets CTAs elsewhere scroll here.
 *
 * Layout: the donation form is far taller than anything beside it, so on
 * desktop the carousel and the bank/QR cards share one column that sticks
 * while the form scrolls past — the column is never empty in view. On mobile
 * that wrapper dissolves (`display: contents`) and `order` puts the form
 * between the carousel and the bank/QR cards, which is the reading order.
 */
const DonationSection = forwardRef<HTMLElement>(function DonationSection(_props, ref) {
  const text = useSectionText('donation')
  const info = useInfo()
  const bank: BankTransfer = info.bankTransfer || {}
  const pushcoins = {
    title: info.pushcoinsTitle,
    text: info.pushcoinsText,
    button: info.pushcoinsButton || 'להורדת האפליקציה',
    href: safeHref(info.pushcoinsUrl),
  }
  const showPushcoins = Boolean(pushcoins.title || pushcoins.text)
  // The column can outgrow a laptop screen; this keeps its bottom (the
  // PushCoins button) reachable while it sticks. See useFitSticky.
  const side = useFitSticky<HTMLDivElement>(STICKY_TOP_PX, 16)

  return (
    <section id="donate" ref={ref} className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* Side column — sticky on desktop, dissolved into the grid on mobile. */}
          <div
            ref={side.ref}
            style={{ top: side.top }}
            className="contents lg:sticky lg:flex lg:flex-col lg:gap-5 lg:self-start"
          >
            <div className="order-1">
              <ImpactCarousel />
            </div>

            {/* Off-widget ways to give: bank transfer, PushCoins, and the QR to the
                site. From sm up, bank and QR share a row and PushCoins spans the
                full width under them (it needs the width for its text). On a
                phone they go bank → PushCoins → QR, the QR being least useful there. */}
            <div className="order-3 mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-[1fr_auto] lg:max-w-none">
              <div className="rounded-2xl border border-gold/25 bg-cream px-6 py-5">
                {/* A row at md (full width); stacked again at lg, where it shares half the page with the QR. */}
                <div className="flex h-full flex-col items-center justify-center gap-x-8 gap-y-2 text-center md:flex-row md:justify-between md:text-right lg:flex-col lg:items-start lg:justify-center">
                  <h3 className="font-heading text-lg font-bold text-ink">להעברה בנקאית</h3>
                  <dl className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm lg:justify-start">
                    <div className="flex items-baseline gap-1.5">
                      <dt className="text-ink-muted">בנק</dt>
                      <dd className="font-semibold text-ink">{bank.bank}</dd>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <dt className="text-ink-muted">סניף</dt>
                      <dd className="font-semibold text-ink" dir="ltr">{bank.branch}</dd>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <dt className="text-ink-muted">חשבון</dt>
                      <dd className="font-semibold text-ink" dir="ltr">{bank.account}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {showPushcoins && (
                <div className="rounded-2xl border border-gold/25 bg-cream px-6 py-5 sm:col-span-2 lg:py-4">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-right">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                      <CoinIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      {pushcoins.title && (
                        <h3 className="font-heading text-lg font-bold text-ink">{pushcoins.title}</h3>
                      )}
                      {pushcoins.text && (
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{pushcoins.text}</p>
                      )}
                      {pushcoins.href && (
                        <a
                          href={pushcoins.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary mt-3 !px-5 !py-2 text-sm"
                        >
                          {pushcoins.button}
                          <ExternalLinkIcon className="h-4 w-4" />
                          <span className="sr-only">(נפתח בכרטיסייה חדשה)</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* The code carries the site to a phone — for donating from the
                  mobile, or for handing the site to someone standing next to you.
                  SVG so it stays crisp at any size (and when printed); the PNG is
                  the fallback. */}
              <div
                // Explicitly into row 1 beside the bank card: it comes after PushCoins
                // in the DOM (for the phone order), so auto-placement would push it down.
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gold/25 bg-cream px-6 py-5 text-center sm:col-start-2 sm:row-start-1"
              >
                <picture>
                  <source srcSet="/qr-code.svg" type="image/svg+xml" />
                  <img
                    src="/qr-code.png"
                    alt="קוד QR לפתיחת אתר מוסדות ברכת אברהם"
                    width={128}
                    height={128}
                    loading="lazy"
                    // Smaller on desktop, where every pixel of the sticky column counts.
                    className="h-28 w-28 rounded-lg bg-white p-1.5 ring-1 ring-ink/10 sm:h-32 sm:w-32 lg:h-24 lg:w-24"
                  />
                </picture>
                <div>
                  <h3 className="font-heading text-sm font-bold text-ink">סרקו לתרומה מהנייד</h3>
                  <p className="text-xs text-ink-muted">הקוד מוביל לאתר המוסדות</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2">
            <DonationWidget />
          </div>
        </div>
      </div>
    </section>
  )
})

export default DonationSection
