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
  address: 'רחוב הרב קוק 24, פתח תקווה',
  phone: '03-9000000',
  whatsapp: '972500000000',
  email: 'office@birkat-avraham.org.il',
  wazeUrl: 'https://waze.com/ul?q=הרב%20קוק%2024%20פתח%20תקווה',
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=34.87%2C32.08%2C34.90%2C32.10&layer=mapnik&marker=32.09%2C34.885',
  hours: [
    { label: 'ימים א׳–ה׳', value: '05:30 – 23:00' },
    { label: 'יום שישי', value: '05:30 – כניסת שבת' },
    { label: 'מוצאי שבת', value: 'צאת שבת – 23:30' },
  ],
}

/**
 * Top bar — Zmanim & Hebrew date.
 * Phase 2: replace with a live Hebcal API call (see useZmanim.js).
 */
export const zmanimData = {
  hebrewDate: 'כ״ז בתמוז תשפ״ה',
  gregorianDate: '22 ביולי 2025',
  parasha: 'פרשת מטות-מסעי',
  city: 'פתח תקווה',
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
    { key: 'shacharit', label: 'תפילות' },
    { key: 'shiurim', label: 'שיעורים' },
    { key: 'kollel', label: 'סדרי כולל' },
  ],
  shacharit: [
    { id: 'p1', name: 'שחרית — מניין ראשון', time: '06:00', sub: 'ותיקין', location: 'בית המדרש הגדול' },
    { id: 'p2', name: 'שחרית — מניין שני', time: '07:15', location: 'בית המדרש הגדול' },
    { id: 'p3', name: 'שחרית — מניין שלישי', time: '08:30', location: 'אולם התפילה' },
    { id: 'p4', name: 'מנחה', time: '13:30', sub: 'רצופה לאורך היום', location: 'בית המדרש' },
    { id: 'p5', name: 'מנחה גדולה', time: '18:45', location: 'בית המדרש הגדול' },
    { id: 'p6', name: 'ערבית', time: '20:00', sub: 'מניינים רצופים עד 23:00', location: 'בית המדרש' },
  ],
  shiurim: [
    { id: 's1', name: 'דף היומי', time: '05:15', sub: 'הרב דוד דהרי שליט"א', location: 'בית המדרש' },
    { id: 's2', name: 'הלכה יומית', time: '07:00', sub: 'בין שחרית למניין', location: 'אולם התפילה' },
    { id: 's3', name: 'שיעור בפרשת השבוע', time: '13:00', sub: 'הרב איתן אברהם שליט"א', location: 'בית המדרש הגדול' },
    { id: 's4', name: 'שיעור אמונה ומחשבה', time: '19:15', sub: 'לרחבי הקהילה', location: 'אולם האירועים' },
    { id: 's5', name: 'עין יעקב', time: '21:00', sub: 'אגדות חז"ל', location: 'בית המדרש' },
  ],
  kollel: [
    { id: 'k1', name: 'סדר בוקר', time: '09:00 – 13:00', sub: 'עיון בסוגיות הש"ס', location: 'כולל אברכים' },
    { id: 'k2', name: 'סדר צהריים', time: '15:30 – 18:30', sub: 'בקיאות והלכה', location: 'כולל אברכים' },
    { id: 'k3', name: 'סדר ערב', time: '20:30 – 22:30', sub: 'חברותות', location: 'בית המדרש' },
    { id: 'k4', name: 'מבחן חודשי', time: 'ראש חודש', sub: 'סיכום מסכת', location: 'כולל אברכים' },
  ],
}

/**
 * Leadership & staff grid.
 * `img: null` → the UI renders an elegant monogram avatar (no external assets needed for the demo).
 */
export const leadershipData = [
  {
    id: 'l1',
    name: 'הרב איתן אברהם שליט"א',
    title: 'ראש מוסדות "ברכת אברהם"',
    desc: 'מוביל את המוסדות ומעביר את השיעור המרכזי בפרשת השבוע.',
    img: null,
    featured: true,
  },
  {
    id: 'l2',
    name: 'הרב דוד דהרי שליט"א',
    title: 'סגן הרב ומשגיח הכולל',
    desc: 'אחראי על סדרי הכולל ומגיד שיעור הדף היומי.',
    img: null,
  },
  {
    id: 'l3',
    name: 'הרב יוסף כהן שליט"א',
    title: 'רב בית הכנסת',
    desc: 'מענה הלכתי לקהילה ומעביר שיעורי הלכה יומיים.',
    img: null,
  },
  {
    id: 'l4',
    name: 'ר׳ משה לוי הי"ו',
    title: 'מנהל אדמיניסטרטיבי',
    desc: 'ניהול שוטף, אירועים וקשרי קהילה.',
    img: null,
  },
  {
    id: 'l5',
    name: 'ר׳ אליהו נחום הי"ו',
    title: 'גבאי בית הכנסת',
    desc: 'ארגון המניינים, לוח הזמנים והתפילות.',
    img: null,
  },
  {
    id: 'l6',
    name: 'הרב שמעון פרץ שליט"א',
    title: 'ראש מדור החסד',
    desc: 'רכז חלוקת מזון וסיוע למשפחות הקהילה.',
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
