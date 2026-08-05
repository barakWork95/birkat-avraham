# מוסדות "ברכת אברהם"

אתר תדמית ותרומות למוסדות **"ברכת אברהם"** (רחובות), בראשות **הרב איתן אברהם שליט"א** —
כולל אברכים, בית כנסת קהילתי ופעילות חסד. עברית מלאה, RTL.

**חי בפרודקשן:** [birkat-avraham.com](https://birkat-avraham.com) (Firebase Hosting, SSL).
תרומות אמיתיות זורמות דרך **נדרים פלוס**. ניהול תוכן חי דרך `/admin`.

> זה כבר לא "דמו Phase 1" — האתר באוויר עם Firebase, סליקה חיה, והעלאת תמונות ל-Storage.

---

## הרצה מהירה

```bash
npm install
npm run dev        # http://localhost:5173
```

בלי `.env` האתר רץ במצב **הדגמה מקומי** (נתונים ב-localStorage). לחיבור Firebase/סליקה
חיה צריך קובץ `.env` (ראו [משתני סביבה](#משתני-סביבה)). **דרישות:** Node 18+ (נבדק על Node 22).

```bash
npm run build      # פלט ל-dist/
npm run preview    # תצוגה מקומית של הבנייה
npm run typecheck  # tsc --noEmit
npm test           # Vitest — בדיקות מסלולים קריטיים
```

---

## מחסנית טכנולוגית

| רכיב | טכנולוגיה |
|------|-----------|
| Framework | React 18 + Vite 6 |
| שפה | **TypeScript** (strict) — כל `src/` הוא `.ts/.tsx` |
| עיצוב | Tailwind CSS 3 · RTL מלא · גופנים `Heebo`/`Assistant` |
| Backend | **Firebase** — Firestore (תוכן), Auth (ניהול), Storage (תמונות) |
| סליקה | **נדרים פלוס** (Nedarim Plus) דרך iframe מאובטח (מוסד `7004283`) |
| זמנים | **Hebcal** (תאריך עברי, פרשה, זמני שבת) — ללא מפתח API |
| בדיקות | Vitest (jsdom) |
| תלויות UI חיצוניות | **אין** — קרוסלה, טאבים, לייטבוקס, אלבומים ומגירה מומשו מאפס |

---

## ארכיטקטורה

הלב הוא **הפשטת ספק נתונים (data provider)**: כל גישה לנתונים עוברת דרך חוזה `DataProvider`
אחיד, כך שהחלפת ה-Backend היא שינוי של שורה אחת ואף רכיב UI לא משתנה.

- **`src/services/dataProvider/`** — שני מימושים לאותו חוזה מטופס (`satisfies DataProvider`):
  - `localProvider` — מצב הדגמה, מגובה `localStorage` (נזרע פעם אחת מ-`data/mockData.ts`).
  - `firebaseProvider` — פרודקשן, מגובה Firestore (+ Storage לתמונות).
  - הבחירה לפי `VITE_DATA_PROVIDER` ב-`index.ts`.
- **`src/services/auth/`** — אותו דפוס: `localAuth` (קוד גישה) מול `firebaseAuth` (אימייל+סיסמה).
- **`src/config/collections.ts`** — **סכימה אחת שמניעה את כל פאנל הניהול**. הוספת שדה כאן →
  מופיע אוטומטית בעורך; הוספת אוסף → מופיע אוטומטית בסיידבר. שדות תומכים ב-`showIf`
  (הצגה מותנית) ובטיפוס `media` (ריפיטר אלבומים).
- **`src/hooks/`** — הרכיבים נוגעים בנתונים רק דרך hooks (`useCollection<T>` גנרי,
  `useInfo`, `useDonation`, `useSchedule`, `useEvents`, `useZmanim`). `useCollection`
  מחזיר `{ items, loading }` כדי להציג שלד טעינה בקריאת Firestore קרה במקום להבהב ריק.

**מודל הנתונים ב-Firestore:** כל אוסף תוכן = אוסף Firestore באותו שם (מסמכים נושאים שדה
`order` לסידור מהניהול); סינגלטונים תחת `singletons/{name}` (כרגע רק `info`).

---

## מבנה הפרויקט

```
src/
├── main.tsx                   # נקודת כניסה; עוטף ב-ErrorBoundary
├── App.tsx                    # הרכבת המקטעים + splash עד טעינת פרטי המוסד
├── types/models.ts            # מודלי הדומיין (Contact, GalleryItem, MediaEntry, …)
├── config/collections.ts      # ✦ הסכימה שמניעה את פאנל הניהול
├── data/mockData.ts           # זרע מצב ההדגמה (מטופס ב-satisfies מול המודלים)
├── services/
│   ├── dataProvider/          # localProvider · firebaseProvider · חוזה DataProvider
│   ├── auth/                  # localAuth · firebaseAuth · חוזה AuthProvider
│   ├── firebase.ts            # אתחול Firebase משותף
│   └── nedarimPlus.ts         # בניית payload + סליקה חיה דרך ה-iframe
├── hooks/                     # שכבת הגישה לנתונים (useCollection<T> ועוד)
├── components/                # אתר הציבור (Hero, Schedule, Gallery, Donation…)
│   └── ui/                    # פרימיטיבים (Icons, Avatar, SectionTitle, Skeleton)
└── admin/                     # פאנל הניהול (schema-driven) תחת /admin
```

---

## פיצ'רים עיקריים

- **תרומות חיות** — סכומים מוגדרים, סכום חופשי, חד-פעמי/הוראת קבע, ולידציה, ומסך תודה.
  הסליקה עצמה ב-iframe של נדרים פלוס (פרטי הכרטיס לעולם לא נוגעים בדף). ללא טוקן → מצב הדגמה.
- **לו"ז בטאבים** — **תפילות** (ברירת מחדל) · שיעורים · כולל ערב. כל טאב = אוסף נפרד, נערך בניהול.
- **גלריה + אלבומים** — סינון לפי קטגוריה, לייטבוקס עם ניווט מקלדת. פריט יכול להיות תמונה/וידאו
  בודדים או **אלבום** (`media[]`) עם דפדוף פנימי; ניהול האלבום דרך ריפיטר מדיה עם העלאה מרובה.
- **זמנים חיים** — תאריך עברי, פרשה וזמני שבת מ-Hebcal (מטמון יומי, נפילה לנתוני גיבוי).
- **פאנל ניהול** — כניסה ב-`/admin`, עריכת כל האוספים + פרטי המוסד, העלאת תמונות ל-Storage,
  סידור מחדש, שחזור לברירת מחדל. שינויים משתקפים באתר החי מיידית.
- **UX** — רספונסיבי mobile-first, מגירת ניווט, כפתור תרומה צף, שלדי טעינה, `ErrorBoundary`, נגישות.

---

## משתני סביבה

הקובץ `.env` **מוחרג מגיט** ומחזיק את הקונפיג של Firebase + טוקן נדרים. בלי `.env` האתר רץ
במצב הדגמה מקומי. המפתחות:

| משתנה | תיאור |
|-------|-------|
| `VITE_DATA_PROVIDER` | `local` (הדגמה) או `firebase` (חי) |
| `VITE_FB_*` | קונפיג פרויקט Firebase — `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `SENDER_ID`, `APP_ID`, `MEASUREMENT_ID` |
| `VITE_NEDARIM_API_VALID` | טוקן ApiValid של נדרים פלוס. קיים → סליקה אמיתית; חסר → הדגמה |
| `VITE_ADMIN_PASSCODE` | קוד הגישה לניהול במצב הדגמה מקומי (במצב Firebase — אימייל+סיסמה) |

**שתי סביבות:** `.env` = פרודקשן, `.env.staging` = staging. פרטים ב-[`ENVIRONMENTS.md`](ENVIRONMENTS.md).

> ⚠️ אף פעם לא לקמט סודות. `.env`/`.env.staging` מוחרגים; לפני commit ודאו שהטוקנים לא בדיף.

---

## בדיקות

```bash
npm test           # ריצה חד-פעמית
npm run test:watch # מצב watch
```

Vitest (סביבת jsdom) מכסה את המסלולים הקריטיים:
- **`nedarimPlus`** — בניית ה-payload (חד-פעמי מול הוראת קבע, פיצול שם, ברירות מחדל, טיפוסים).
- **`localProvider`** — CRUD, סידור מחדש, שחזור לזרע, מנויים (subscribe), וסינגלטונים.

---

## פריסה (Deploy)

Firebase Hosting, בזרימת **preview → promote**. הפריסה דורשת את חשבון ה-Google של המשתמש
(ה-login של Firebase CLI אינטראקטיבי):

```bash
npm run deploy:preview   # ערוץ זמני לבדיקה
npm run deploy           # קידום לפרודקשן
npm run deploy:staging   # לפרויקט ה-staging
```

runbook מלא ב-[`DEPLOY.md`](DEPLOY.md); זרימת הסביבות ב-[`ENVIRONMENTS.md`](ENVIRONMENTS.md).
זריעת Firestore מ-`mockData`: `scripts/seedFirestore.mjs` (מקבל `ENV_FILE` לכל סביבה).
