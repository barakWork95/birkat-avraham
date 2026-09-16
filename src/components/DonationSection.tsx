import { forwardRef } from 'react'
import SectionTitle from './ui/SectionTitle'
import ImpactCarousel from './ImpactCarousel'
import DonationWidget from './DonationWidget'
import { useInfo } from '../hooks/useInfo'
import type { BankTransfer } from '../types/models'
import { useSectionText } from '../hooks/useSectionText'

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
  const bank: BankTransfer = useInfo().bankTransfer || {}

  return (
    <section id="donate" ref={ref} className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* Side column — sticky on desktop, dissolved into the grid on mobile. */}
          <div className="contents lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-6 lg:self-start">
            <div className="order-1">
              <ImpactCarousel />
            </div>

            {/* Off-widget ways to give: bank transfer, and the QR to the site. */}
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

              {/* The code carries the site to a phone — for donating from the
                  mobile, or for handing the site to someone standing next to you.
                  SVG so it stays crisp at any size (and when printed); the PNG is
                  the fallback. */}
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-gold/25 bg-cream px-6 py-5 text-center">
                <picture>
                  <source srcSet="/qr-code.svg" type="image/svg+xml" />
                  <img
                    src="/qr-code.png"
                    alt="קוד QR לפתיחת אתר מוסדות ברכת אברהם"
                    width={128}
                    height={128}
                    loading="lazy"
                    className="h-28 w-28 rounded-lg bg-white p-1.5 ring-1 ring-ink/10 sm:h-32 sm:w-32"
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
