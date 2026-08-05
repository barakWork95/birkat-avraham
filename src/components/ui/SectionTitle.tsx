/**
 * SectionTitle — consistent centered section heading with an eyebrow
 * label and the decorative gold rule.
 */
interface SectionTitleProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  align?: 'center' | 'right'
}

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }: SectionTitleProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-right items-start'
  return (
    <div className={`mb-12 flex flex-col ${alignment}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      <div className={`gold-rule ${align === 'center' ? '' : 'mr-0 ml-auto'}`} />
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
