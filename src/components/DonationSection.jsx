import { forwardRef } from 'react'
import SectionTitle from './ui/SectionTitle'
import ImpactCarousel from './ImpactCarousel'
import DonationWidget from './DonationWidget'
import { useInfo } from '../hooks/useInfo'

/**
 * DonationSection — pairs the impact carousel ("see where funds go")
 * with the donation widget, plus bank-transfer details for those who prefer it.
 * `ref` lets CTAs elsewhere scroll here.
 */
const DonationSection = forwardRef(function DonationSection(_props, ref) {
  const bank = useInfo().bankTransfer || {}

  return (
    <section id="donate" ref={ref} className="scroll-mt-28 bg-white/60 py-16 sm:py-24">
      <div className="section">
        <SectionTitle
          eyebrow="שותפות במפעל"
          title="התרומה שלכם — במעשה"
          subtitle="כל תרומה מיתרגמת ישירות לתורה, לתפילה ולחסד. הביטו היכן הכספים פועלים, ובחרו כיצד להשתתף."
        />

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <ImpactCarousel />
          <DonationWidget />
        </div>

        {/* Bank transfer alternative */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/25 bg-cream px-6 py-5">
          <div className="flex flex-col items-center gap-x-8 gap-y-2 text-center sm:flex-row sm:justify-between sm:text-right">
            <div>
              <h3 className="font-heading text-lg font-bold text-ink">להעברה בנקאית</h3>
              <p className="text-sm text-ink-muted">ע"ש {bank.accountName}</p>
            </div>
            <dl className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
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
      </div>
    </section>
  )
})

export default DonationSection
