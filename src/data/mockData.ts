/**
 * ------------------------------------------------------------------
 *  MOCK DATA — local/demo seed
 * ------------------------------------------------------------------
 *  This is the seed content for local mode (localStorage provider) and the
 *  one-time Firestore seed. Each export maps to a collection (or the info
 *  singleton) via its `seedKey` in src/config/collections.ts. The live site
 *  reads from the data provider, not from here directly.
 *
 *  Typed with `satisfies` so the literals keep their exact shapes while being
 *  checked against the domain models in src/types/models.ts.
 * ------------------------------------------------------------------
 */
import { SECTION_TEXT_DEFAULTS } from '../config/sectionTexts'
import type {
  Bulletin,
  Contact,
  DonationTier,
  EventItem,
  GalleryItem,
  ImpactSlide,
  InstitutionInfo,
  Notice,
  ScheduleItem,
  Zmanim,
} from '../types/models'

export const institutionInfo = {
  nameHe: 'ברכת אברהם',
  tagline: 'מקום של תורה, תפילה וחסד',
  ravName: 'הרב איתן אברהם שליט"א',
  ravTitle: 'ראש המוסדות',
  mission:
    'מוסדות "ברכת אברהם" הם בית לתורה, לתפילה ולחסד — כולל אברכים העמלים בתורה יומם ולילה, בית כנסת קהילתי חם, ומערך פעילות ענף המחזק את הקהילה כולה. אנו מזמינים אתכם להיות שותפים במפעל של קדושה.',
  address: 'רח\' כובשי החרמון 10 (מעל הבר-כל), רחובות',
  city: 'רחובות',
  mapQuery: 'כובשי החרמון 10, רחובות',
  // Primary contact + all published numbers (from the institution flyer)
  phone: '050-444-1821',
  contacts: [
    { id: 'c1', label: 'בירורים כלליים וזמני תפילות', phone: '050-444-1821' },
    { id: 'c2', label: 'בירורים כלליים', phone: '052-777-3551' },
    { id: 'c3', label: 'בית ההוראה', phone: '08-638-4377' },
    { id: 'c4', label: 'שיעורים והזמנת מו"ר — ר\' אלעד מדמון', phone: '050-444-1821' },
  ],
  // WhatsApp group for the Rav's shiurim
  whatsappGroup: 'https://chat.whatsapp.com/CBqj8VBPuVkJHMaECAubXo',
  // Kollel contact email
  kollelEmail: 'kolelbirkatavraham@gmail.com',
  // Bank-transfer details for donations
  bankTransfer: {
    accountName: 'חנוך לנער עפ"י דרכו',
    bank: 'בנק מרכנתיל',
    branch: '740',
    account: '86098235',
  },
  // Nedarim Plus mosad id (used by the donation form / service)
  nedarimMosadId: '7004283',
} satisfies InstitutionInfo

/**
 * Top bar — Zmanim & Hebrew date.
 * Static fallback; the live source is a Hebcal API call (see useZmanim.ts).
 */
export const zmanimData = {
  hebrewDate: 'כ״ז בתמוז תשפ״ה',
  gregorianDate: '22 ביולי 2025',
  parasha: 'פרשת מטות-מסעי',
  city: 'רחובות',
  candleLighting: '19:12',
  havdalah: '20:23',
  dafYomi: 'עבודה זרה ל״ד',
} satisfies Zmanim

/**
 * Daily schedule — grouped by category for the tabbed view.
 */
export const scheduleData = {
  tabs: [
    { key: 'tefilot', label: 'תפילות' },
    { key: 'shiurim', label: 'שיעורים' },
    { key: 'kollel', label: 'כולל ערב' },
  ],
  tefilot: [
    { id: 'p1', name: 'שחרית', time: '06:00 · 08:00', location: 'בית המדרש' },
    { id: 'p2', name: 'מנחה', time: '13:30 · 18:45', location: 'בית המדרש' },
    { id: 'p3', name: 'ערבית', time: '19:00', location: 'בית המדרש' },
  ] satisfies ScheduleItem[],
  shiurim: [
    {
      id: 's1',
      name: 'השיעור המרכזי — הלכה',
      time: '20:15',
      sub: 'ימי רביעי · הרב איתן אברהם שליט"א',
      location: 'בית המדרש',
    },
    {
      id: 's2',
      name: 'שיעור מוסר',
      time: '21:15',
      sub: 'ימי רביעי · הרב איתן אברהם שליט"א',
      location: 'בית המדרש',
    },
    {
      id: 's3',
      name: 'שיעור בזוגיות וחינוך ילדים',
      time: '21:00',
      sub: 'ימי ראשון',
      location: 'בית המדרש',
    },
  ] satisfies ScheduleItem[],
  kollel: [
    { id: 'k1', name: 'כולל ערב', time: '20:15 – 22:00', sub: 'ימים א׳–ד׳', location: 'בית המדרש' },
    { id: 'k2', name: 'חברותות', time: '20:15', sub: 'ימים א׳, ב׳, ג׳', location: 'בית המדרש' },
  ] satisfies ScheduleItem[],
}

// Flat exports so the admin can manage each schedule tab as its own collection.
export const scheduleTefilot = scheduleData.tefilot
export const scheduleShiurim = scheduleData.shiurim
export const scheduleKollel = scheduleData.kollel

/**
 * Leadership & staff grid.
 * `img: null` → the UI renders an elegant monogram avatar (no external assets needed).
 */
export const leadershipData = [
  {
    id: 'l1',
    name: 'הרב איתן אברהם שליט"א',
    title: 'ראש מוסדות "ברכת אברהם"',
    desc: 'מוביל את המוסדות ומעביר את השיעור המרכזי.',
    img: null,
    featured: true,
  },
  {
    id: 'l2',
    name: 'הרב דוד דהרי שליט"א',
    title: 'סגן הרב ומשגיח הכולל',
    desc: 'אחראי על סדרי הכולל.',
    img: null,
  },
  {
    id: 'l3',
    name: 'הרב אלעד מדמון',
    title: 'גבאי',
    desc: 'איש קשר לשיעורים ולהזמנת מו"ר.',
    img: null,
  },
  {
    id: 'l4',
    name: 'מארי כפיר אריה',
    title: 'גבאי',
    desc: 'גבאי בית הכנסת והמוסדות.',
    img: null,
  },
] satisfies Contact[]

/**
 * Donation impact carousel — "see where your funds go".
 * `gradient` is a CSS placeholder; real photography can be uploaded via admin.
 */
export const impactSlides = [
  {
    id: 'i1',
    title: 'אברכי הכולל',
    caption: 'תמיכה חודשית ל־42 אברכים העמלים בתורה',
    stat: '42',
    statLabel: 'אברכים',
    gradient: 'linear-gradient(135deg, #1A1110 0%, #4a2f1e 55%, #B8860B 100%)',
  },
  {
    id: 'i2',
    title: 'חלוקת מזון לחג',
    caption: 'סלי מזון ל־180 משפחות לקראת החגים',
    stat: '180',
    statLabel: 'משפחות',
    gradient: 'linear-gradient(135deg, #2B1B17 0%, #7a5a1e 60%, #D4AF37 100%)',
  },
  {
    id: 'i3',
    title: 'שיעורי תורה לקהילה',
    caption: 'למעלה מ־30 שיעורים שבועיים, פתוחים לכולם',
    stat: '30+',
    statLabel: 'שיעורים שבועיים',
    gradient: 'linear-gradient(135deg, #1A1110 0%, #5c3a1e 50%, #966d07 100%)',
  },
  {
    id: 'i4',
    title: 'פעילות נוער',
    caption: 'מסגרת ערכית לבני הקהילה בשבתות ובחגים',
    stat: '120',
    statLabel: 'בני נוער',
    gradient: 'linear-gradient(135deg, #2B1B17 0%, #6b4a1e 55%, #B8860B 100%)',
  },
] satisfies ImpactSlide[]

/**
 * Donation preset tiers for the widget.
 */
export const donationTiers = [
  { id: 't1', amount: 52, label: 'ברכה', note: 'שיעור אחד לקהילה' },
  { id: 't2', amount: 180, label: 'חי פעמים', note: 'סל מזון למשפחה', popular: true },
  { id: 't3', amount: 360, label: 'שותפות', note: 'יום לימוד לאברך' },
  { id: 't4', amount: 1000, label: 'נדיב', note: 'תמיכה חודשית' },
] satisfies DonationTier[]

/**
 * Media gallery items.
 * type: 'photo' | 'video' — video items show a play badge and open an embedded frame in the lightbox.
 * `gradient` stands in for a thumbnail image until a photo is uploaded.
 */
export const galleryData = [
  { id: 'g1', type: 'photo', title: 'שיעורו של ראש המוסדות', category: 'שיעורים', gradient: 'linear-gradient(135deg,#1A1110,#B8860B)' },
  { id: 'g2', type: 'video', title: 'סרטון הכולל', category: 'כולל', gradient: 'linear-gradient(135deg,#2B1B17,#D4AF37)', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 'g3', type: 'photo', title: 'חלוקת מזון לחג', category: 'חסד', gradient: 'linear-gradient(135deg,#3a241a,#966d07)' },
  { id: 'g4', type: 'photo', title: 'הילולת הצדיק', category: 'אירועים', gradient: 'linear-gradient(135deg,#1A1110,#D4AF37)' },
  { id: 'g5', type: 'photo', title: 'בית המדרש בעת הסדר', category: 'כולל', gradient: 'linear-gradient(135deg,#2B1B17,#B8860B)' },
  { id: 'g6', type: 'video', title: 'ברכת ראש המוסדות', category: 'שיעורים', gradient: 'linear-gradient(135deg,#4a2f1e,#D4AF37)', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 'g7', type: 'photo', title: 'סעודת מצווה קהילתית', category: 'אירועים', gradient: 'linear-gradient(135deg,#1A1110,#966d07)' },
  { id: 'g8', type: 'photo', title: 'פעילות הנוער', category: 'נוער', gradient: 'linear-gradient(135deg,#2B1B17,#D4AF37)' },
  {
    id: 'g9',
    type: 'album',
    title: 'אלבום הכנסת ספר תורה',
    category: 'אירועים',
    gradient: 'linear-gradient(135deg,#1A1110,#D4AF37)',
    media: [
      { id: 'g9m1', type: 'photo', caption: 'ריקודים לכבוד התורה' },
      { id: 'g9m2', type: 'photo', caption: 'כתיבת האותיות האחרונות' },
      { id: 'g9m3', type: 'video', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'סרטון המעמד' },
      { id: 'g9m4', type: 'photo', caption: 'הכנסת הספר לארון הקודש' },
    ],
  },
] satisfies GalleryItem[]

/**
 * Upcoming events (used by useEvents / events section & CTAs).
 */
export const eventsData = [
  { id: 'e1', title: 'הילולת הצדיק', date: '2026-07-31', hebrewDate: 'ט״ז באב', desc: 'ערב לימוד ותפילה לזכר הצדיק, בהשתתפות הרב.' },
  { id: 'e2', title: 'סיום מסכת', date: '2026-08-14', hebrewDate: 'ר״ח אלול', desc: 'מעמד סיום חגיגי לאברכי הכולל.' },
  { id: 'e3', title: 'חלוקת סלי מזון', date: '2026-09-04', hebrewDate: 'כ״ב אלול', desc: 'חלוקת סלי מזון למשפחות לקראת החגים.' },
] satisfies EventItem[]

/**
 * Weekly bulletin (העלון השבועי). The current issue is the newest by date; the
 * PDF is uploaded via admin. Left empty in the demo seed until a real file is added.
 */
export const bulletinsData = [
  { id: 'b1', title: 'פרשת ראה', date: '2026-08-14', pdf: '', cover: '' },
] satisfies Bulletin[]

/**
 * Notice board (לוח מודעות) — poster images the gabbaim upload each week.
 * Seeded EMPTY on purpose: the section only appears on the site once there is
 * at least one notice, so a fresh install shows no empty board.
 */
export const noticeboardData = [] satisfies Notice[]

/**
 * Section headings (eyebrow / title / subtitle) of the public sections.
 * Seeded from the defaults in src/config/sectionTexts.ts and editable at
 * /admin/sections; the site falls back to those defaults for anything unset.
 */
export const sectionTexts = SECTION_TEXT_DEFAULTS
