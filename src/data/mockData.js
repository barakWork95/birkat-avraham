/**
 * ------------------------------------------------------------------
 *  MOCK DATA — Phase 1 (Demo)
 * ------------------------------------------------------------------
 *  This is the single source of truth for all demo content.
 *  In Phase 2, each export below maps 1:1 to a backend endpoint,
 *  so the hooks in /src/hooks can swap `import { ... } from '../data/mockData'`
 *  for a `fetch()` / GraphQL call WITHOUT touching any UI component.
 *
 *  Suggested Phase 2 mapping:
 *    scheduleData   -> GET /api/schedule
 *    leadershipData -> GET /api/staff
 *    galleryData    -> GET /api/media
 *    eventsData     -> GET /api/events
 *    donationTiers  -> GET /api/donation/tiers
 *    impactSlides   -> GET /api/donation/impact
 *    institutionInfo-> GET /api/info
 * ------------------------------------------------------------------
 */

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
  // Bank-transfer details for donations
  bankTransfer: {
    accountName: 'חנוך לנער עפ"י דרכו',
    bank: 'בנק מרכנתיל',
    branch: '740',
    account: '86098235',
  },
  // Nedarim Plus mosad id (used by the donation form / service)
  nedarimMosadId: '7004283',
}

/**
 * Top bar — Zmanim & Hebrew date.
 * Phase 2: replace with a live Hebcal API call (see useZmanim.js).
 */
export const zmanimData = {
  hebrewDate: 'כ״ז בתמוז תשפ״ה',
  gregorianDate: '22 ביולי 2025',
  parasha: 'פרשת מטות-מסעי',
  city: 'רחובות',
  candleLighting: '19:12',
  havdalah: '20:23',
  dafYomi: 'עבודה זרה ל״ד',
}

/**
 * Daily schedule — grouped by category for the tabbed view.
 * Each item: { id, name, time, sub?, location? }
 */
export const scheduleData = {
  tabs: [
    { key: 'shiurim', label: 'שיעורים' },
    { key: 'kollel', label: 'כולל ערב' },
  ],
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
  ],
  kollel: [
    { id: 'k1', name: 'כולל ערב', time: '20:15 – 22:00', sub: 'ימים א׳–ד׳', location: 'בית המדרש' },
    { id: 'k2', name: 'חברותות', time: '20:15', sub: 'ימים א׳, ב׳, ג׳', location: 'בית המדרש' },
  ],
}

// Flat exports so the admin can manage each schedule tab as its own collection.
export const scheduleShiurim = scheduleData.shiurim
export const scheduleKollel = scheduleData.kollel

/**
 * Leadership & staff grid.
 * `img: null` → the UI renders an elegant monogram avatar (no external assets needed for the demo).
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
]

/**
 * Donation impact carousel — “see where your funds go”.
 * `image` is a CSS gradient placeholder for the demo; Phase 2 swaps in real photography.
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
]

/**
 * Donation preset tiers for the widget.
 */
export const donationTiers = [
  { id: 't1', amount: 52, label: 'ברכה', note: 'שיעור אחד לקהילה' },
  { id: 't2', amount: 180, label: 'חי פעמים', note: 'סל מזון למשפחה', popular: true },
  { id: 't3', amount: 360, label: 'שותפות', note: 'יום לימוד לאברך' },
  { id: 't4', amount: 1000, label: 'נדיב', note: 'תמיכה חודשית' },
]

/**
 * Media gallery items.
 * type: 'photo' | 'video'  — video items show a play badge and open an embedded frame in the lightbox.
 * `gradient` stands in for a thumbnail image in the demo.
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
]

/**
 * Upcoming events (used by useEvents / future events section & CTAs).
 */
export const eventsData = [
  { id: 'e1', title: 'הילולת הצדיק', date: '2025-08-10', hebrewDate: 'ט״ז באב', desc: 'ערב לימוד ותפילה לזכר הצדיק, בהשתתפות הרב.' },
  { id: 'e2', title: 'סיום מסכת', date: '2025-08-24', hebrewDate: 'ר״ח אלול', desc: 'מעמד סיום חגיגי לאברכי הכולל.' },
  { id: 'e3', title: 'חלוקת סלי מזון', date: '2025-09-15', hebrewDate: 'כ״ב אלול', desc: 'חלוקת סלי מזון למשפחות לקראת החגים.' },
]
