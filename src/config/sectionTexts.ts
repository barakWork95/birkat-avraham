/**
 * ------------------------------------------------------------------
 *  SECTION TEXTS — every section heading on the public site, editable.
 * ------------------------------------------------------------------
 *  Each public section renders its eyebrow/title/subtitle through
 *  `useSectionText(key)`, which layers the `sections` singleton (edited in
 *  /admin/sections) over the defaults below. Add an entry here → it shows up
 *  in the admin editor automatically, and the section falls back to the
 *  default text until a gabbai overrides it.
 *
 *  Clearing a field in the admin stores an empty string on purpose — that
 *  HIDES the line (e.g. a section with no subtitle). "שחזור" restores the
 *  default text below.
 * ------------------------------------------------------------------
 */

export interface SectionText {
  eyebrow?: string
  title?: string
  subtitle?: string
}

export interface SectionTextConfig {
  key: string
  /** Name of the section as it appears in the admin. */
  label: string
  defaults: SectionText
}

export const SECTION_TEXTS: SectionTextConfig[] = [
  {
    key: 'donation',
    label: 'תרומות',
    defaults: {
      eyebrow: 'שותפות במפעל',
      title: 'התרומה שלכם — במעשה',
      subtitle:
        'כל תרומה מיתרגמת ישירות לתורה, לתפילה ולחסד. הביטו היכן הכספים פועלים, ובחרו כיצד להשתתף.',
    },
  },
  {
    key: 'schedule',
    label: 'לוח זמנים',
    defaults: {
      eyebrow: 'לו"ז שבועי',
      title: 'תפילות, שיעורים וכולל ערב',
      subtitle: 'זמני התפילות, שיעורי הרב איתן אברהם שליט״א וסדרי הכולל בבית המדרש.',
    },
  },
  {
    key: 'noticeboard',
    label: 'לוח מודעות',
    defaults: {
      eyebrow: 'עדכונים',
      title: 'לוח מודעות',
      subtitle: 'מודעות, הודעות ועדכונים שוטפים מבית המדרש.',
    },
  },
  {
    key: 'bulletin',
    label: 'העלון השבועי',
    defaults: {
      eyebrow: 'פרסום שבועי',
      title: 'העלון השבועי',
      subtitle: 'דבר תורה, הלכה וחדשות הקהילה — מדי שבוע מבית מוסדות ״ברכת אברהם״.',
    },
  },
  {
    key: 'leadership',
    label: 'אנשי קשר',
    defaults: {
      eyebrow: 'הנהלה וצוות',
      title: 'אנשי קשר ובעלי תפקידים',
      subtitle: 'העומדים בראש המוסדות ומובילים את פעילות התורה, התפילה והחסד.',
    },
  },
  {
    key: 'gallery',
    label: 'גלריה',
    defaults: {
      eyebrow: 'גלריה',
      title: 'תמונות וסרטונים',
      subtitle: 'רגעים מבית המדרש, מהאירועים ומפעילות החסד.',
    },
  },
  {
    key: 'events',
    label: 'אירועים',
    defaults: {
      eyebrow: 'לוח אירועים',
      title: 'אירועים קרובים',
      subtitle: 'הילולות, מעמדי סיום, שיעורים מיוחדים ופעילות חסד — הצטרפו אלינו.',
    },
  },
  {
    key: 'location',
    label: 'מיקום ויצירת קשר',
    defaults: {
      eyebrow: 'מיקום ופרטים',
      title: 'בואו לבקר',
      subtitle: 'דלתות בית המדרש פתוחות. נשמח לראותכם.',
    },
  },
]

/** Default text per section key — the fallback when nothing is stored. */
export const SECTION_TEXT_DEFAULTS: Record<string, SectionText> = Object.fromEntries(
  SECTION_TEXTS.map((s) => [s.key, s.defaults]),
)
