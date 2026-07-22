import { forwardRef } from 'react'
import SectionTitle from './ui/SectionTitle'
import ImpactCarousel from './ImpactCarousel'
import DonationWidget from './DonationWidget'

/**
 * DonationSection — pairs the impact carousel ("see where funds go")
 * with the donation widget. `ref` lets CTAs elsewhere scroll here.
 */
const DonationSection = forwardRef(function DonationSection(_props, ref) {
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
      </div>
    </section>
  )
})

export default DonationSection
