/**
 * ------------------------------------------------------------------
 *  COLLECTIONS — the single schema that drives the whole admin panel.
 * ------------------------------------------------------------------
 *  Add a field here → it appears in the admin editor automatically.
 *  Add a collection here → it appears in the admin sidebar automatically.
 *
 *  `seedKey` maps each collection to its export in src/data/mockData.js
 *  (used to seed local mode, and the one-time Firestore seed script).
 * ------------------------------------------------------------------
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'media'
  | 'file'

export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[]
  /** Optional: only render (and validate) this field when the predicate passes. */
  showIf?: (item: any) => boolean
}

export interface CollectionConfig {
  label: string
  seedKey: string
  itemTitle: (item: any) => string
  itemSubtitle?: (item: any) => string
  fields: FieldSchema[]
  defaults: Record<string, unknown>
}

export interface SingletonConfig {
  label: string
  seedKey: string
}

export const COLLECTIONS: Record<string, CollectionConfig> = {
  leadership: {
    label: 'אנשי קשר',
    seedKey: 'leadershipData',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => i.title,
    fields: [
      { key: 'name', label: 'שם', type: 'text', required: true },
      { key: 'title', label: 'תפקיד', type: 'text', required: true },
      { key: 'desc', label: 'תיאור קצר', type: 'textarea' },
      { key: 'img', label: 'תמונה', type: 'image' },
      { key: 'featured', label: 'הדגשה (ראש המוסדות)', type: 'boolean' },
    ],
    defaults: { name: '', title: '', desc: '', featured: false, img: null },
  },

  events: {
    label: 'אירועים',
    seedKey: 'eventsData',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => i.hebrewDate,
    fields: [
      { key: 'title', label: 'כותרת', type: 'text', required: true },
      { key: 'date', label: 'תאריך (YYYY-MM-DD)', type: 'text' },
      { key: 'hebrewDate', label: 'תאריך עברי', type: 'text' },
      { key: 'desc', label: 'תיאור', type: 'textarea' },
    ],
    defaults: { title: '', date: '', hebrewDate: '', desc: '' },
  },

  gallery: {
    label: 'גלריה',
    seedKey: 'galleryData',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => i.category,
    fields: [
      { key: 'title', label: 'כותרת', type: 'text', required: true },
      {
        key: 'category',
        label: 'קטגוריה',
        type: 'select',
        options: ['שיעורים', 'כולל', 'חסד', 'אירועים', 'נוער'],
      },
      { key: 'type', label: 'סוג', type: 'select', options: ['photo', 'video', 'album'] },
      {
        key: 'image',
        label: 'תמונה (או תמונת שער לאלבום)',
        type: 'image',
        showIf: (i) => i.type !== 'video',
      },
      {
        key: 'videoUrl',
        label: 'קישור וידאו',
        type: 'text',
        showIf: (i) => i.type === 'video',
      },
      {
        key: 'media',
        label: 'מדיה באלבום',
        type: 'media',
        showIf: (i) => i.type === 'album',
      },
    ],
    // Photos are uploaded to Storage (or inlined as data URLs in local mode).
    // Items with no image fall back to the gradient placeholder. Albums carry a
    // `media` array (photos uploaded to Storage + videos by URL).
    defaults: {
      title: '',
      category: 'שיעורים',
      type: 'photo',
      image: '',
      videoUrl: '',
      media: [],
      gradient: 'linear-gradient(135deg,#1A1110,#B8860B)',
    },
  },

  donationTiers: {
    label: 'סכומי תרומה',
    seedKey: 'donationTiers',
    itemTitle: (i) => `₪${i.amount}`,
    itemSubtitle: (i) => i.note,
    fields: [
      { key: 'amount', label: 'סכום (₪)', type: 'number', required: true },
      { key: 'label', label: 'כותרת', type: 'text' },
      { key: 'note', label: 'הערה', type: 'text' },
      { key: 'popular', label: 'מומלץ', type: 'boolean' },
    ],
    defaults: { amount: 0, label: '', note: '', popular: false },
  },

  impact: {
    label: 'שקופיות תרומה',
    seedKey: 'impactSlides',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => i.caption,
    fields: [
      { key: 'title', label: 'כותרת', type: 'text', required: true },
      { key: 'caption', label: 'תיאור', type: 'textarea' },
      { key: 'stat', label: 'מספר בולט', type: 'text' },
      { key: 'statLabel', label: 'תווית המספר', type: 'text' },
      { key: 'image', label: 'תמונה', type: 'image' },
    ],
    defaults: {
      title: '',
      caption: '',
      stat: '',
      statLabel: '',
      image: '',
      gradient: 'linear-gradient(135deg, #1A1110 0%, #4a2f1e 55%, #B8860B 100%)',
    },
  },

  scheduleTefilot: {
    label: 'תפילות (לו"ז)',
    seedKey: 'scheduleTefilot',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => [i.time, i.sub].filter(Boolean).join(' · '),
    fields: [
      { key: 'name', label: 'שם התפילה', type: 'text', required: true },
      { key: 'time', label: 'שעה', type: 'text' },
      { key: 'sub', label: 'הערה (ימים / מניין)', type: 'text' },
      { key: 'location', label: 'מיקום', type: 'text' },
    ],
    defaults: { name: '', time: '', sub: '', location: 'בית המדרש' },
  },

  scheduleShiurim: {
    label: 'שיעורים (לו"ז)',
    seedKey: 'scheduleShiurim',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => [i.time, i.sub].filter(Boolean).join(' · '),
    fields: [
      { key: 'name', label: 'שם השיעור', type: 'text', required: true },
      { key: 'time', label: 'שעה', type: 'text' },
      { key: 'sub', label: 'יום / מגיד שיעור', type: 'text' },
      { key: 'location', label: 'מיקום', type: 'text' },
    ],
    defaults: { name: '', time: '', sub: '', location: 'בית המדרש' },
  },

  scheduleKollel: {
    label: 'כולל ערב (לו"ז)',
    seedKey: 'scheduleKollel',
    itemTitle: (i) => i.name,
    itemSubtitle: (i) => [i.time, i.sub].filter(Boolean).join(' · '),
    fields: [
      { key: 'name', label: 'שם הסדר', type: 'text', required: true },
      { key: 'time', label: 'שעה', type: 'text' },
      { key: 'sub', label: 'ימים', type: 'text' },
      { key: 'location', label: 'מיקום', type: 'text' },
    ],
    defaults: { name: '', time: '', sub: '', location: 'בית המדרש' },
  },

  noticeboard: {
    label: 'לוח מודעות',
    seedKey: 'noticeboardData',
    itemTitle: (i) => i.title || 'מודעה',
    itemSubtitle: (i) => i.caption,
    fields: [
      { key: 'title', label: 'כותרת המודעה', type: 'text', required: true },
      { key: 'image', label: 'תמונת המודעה', type: 'image', required: true },
      { key: 'caption', label: 'כיתוב מתחת לתמונה (רשות)', type: 'text' },
      { key: 'link', label: 'קישור בלחיצה (רשות)', type: 'text' },
    ],
    // The section hides itself on the site while this collection is empty, so
    // gabbaim can clear the board simply by deleting all the notices.
    defaults: { title: '', image: '', caption: '', link: '' },
  },

  bulletins: {
    label: 'העלון השבועי',
    seedKey: 'bulletinsData',
    itemTitle: (i) => i.title,
    itemSubtitle: (i) => i.date,
    fields: [
      { key: 'title', label: 'כותרת / פרשה', type: 'text', required: true },
      { key: 'date', label: 'תאריך פרסום (YYYY-MM-DD)', type: 'text' },
      { key: 'pdf', label: 'קובץ PDF', type: 'file' },
      { key: 'cover', label: 'תמונת שער (רשות)', type: 'image' },
    ],
    defaults: { title: '', date: '', pdf: '', cover: '' },
  },
}

export const COLLECTION_KEYS = Object.keys(COLLECTIONS)

/** SINGLETONS — one-off documents (not lists). Edited via a dedicated screen. */
export const SINGLETONS: Record<string, SingletonConfig> = {
  info: {
    label: 'פרטי מוסד',
    seedKey: 'institutionInfo',
  },
  sections: {
    label: 'כותרות באתר',
    seedKey: 'sectionTexts',
  },
}

export const SINGLETON_KEYS = Object.keys(SINGLETONS)
