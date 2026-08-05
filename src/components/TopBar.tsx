import { useZmanim } from '../hooks/useZmanim'

/**
 * TopBar — slim ribbon above the header showing the live Hebrew date,
 * weekly parasha and Shabbat entry/exit times.
 */
export default function TopBar() {
  const { zmanim } = useZmanim()

  const Item = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-gold-soft/70">{label}</span>
      <span className={accent ? 'font-semibold text-gold-light' : 'font-medium text-white'}>
        {value}
      </span>
    </div>
  )

  return (
    <div className="bg-ink text-[13px] text-white/90">
      <div className="section flex items-center justify-between gap-4 py-2">
        {/* Right cluster: date + parasha */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold-light text-gold-light" />
            <span className="font-semibold text-gold-light">{zmanim.hebrewDate}</span>
          </div>
          <span className="hidden text-white/20 sm:inline">|</span>
          <Item label="" value={zmanim.parasha} accent />
        </div>

        {/* Left cluster: shabbat times */}
        <div className="hidden items-center gap-4 md:flex">
          <Item label="הדלקת נרות" value={zmanim.candleLighting} />
          <span className="text-white/20">|</span>
          <Item label="צאת שבת" value={zmanim.havdalah} />
          <span className="text-white/20">|</span>
          <Item label="דף היומי" value={zmanim.dafYomi} />
        </div>
      </div>
    </div>
  )
}
