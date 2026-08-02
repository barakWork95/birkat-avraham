/**
 * ------------------------------------------------------------------
 *  COLLECTIONS — the single schema that drives the whole admin panel.
 * ------------------------------------------------------------------
 *  Add a field here → it appears in the admin editor automatically.
 *  Add a collection here → it appears in the admin sidebar automatically.
 *
 *  `seedKey` maps each collection to its export in src/data/mockData.js
 *  (used to seed local mode, and later to seed Firestore once on setup).
 *
 *  Field types: text | textarea | number | boolean | select
 * ------------------------------------------------------------------
 */

export const COLLECTIONS = {
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
      { key: 'type', label: 'סוג', type: 'select', options: ['photo', 'video'] },
      { key: 'image', label: 'תמונה', type: 'image' },
      { key: 'videoUrl', label: 'קישור וידאו (למדיה מסוג וידאו)', type: 'text' },
    ],
    // Photos uploaded here are stored as compressed data URLs (works today in
    // local mode). Items with no uploaded image fall back to the gradient
    // placeholder. Firebase Storage upgrade: upload the file, store its URL here.
    defaults: { title: '', category: 'שיעורים', type: 'photo', image: '', videoUrl: '', gradient: 'linear-gradient(135deg,#1A1110,#B8860B)' },
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
    ],
    defaults: {
      title: '', caption: '', stat: '', statLabel: '',
      gradient: 'linear-gradient(135deg, #1A1110 0%, #4a2f1e 55%, #B8860B 100%)',
    },
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
}

export const COLLECTION_KEYS = Object.keys(COLLECTIONS)

/**
 * SINGLETONS — one-off documents (not lists). Edited via a dedicated screen.
 */
export const SINGLETONS = {
  info: {
    label: 'פרטי מוסד',
    seedKey: 'institutionInfo',
  },
}

export const SINGLETON_KEYS = Object.keys(SINGLETONS)
