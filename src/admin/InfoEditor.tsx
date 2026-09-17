import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import { INFO_DEFAULTS } from '../config/infoDefaults'
import { bankLabel, branchLabel, withSplitBankFields } from '../lib/bankDetails'

type InfoForm = Record<string, any>

/**
 * InfoEditor — dedicated editor for the institution-info singleton
 * (scalars + a contacts repeater + bank-transfer fields).
 */
const fieldCls =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

/** Legal details shown under the donation form's heading. Empty = line hidden. */
const AMUTA_FIELDS = [
  { key: 'taxNotice', label: 'אישור סעיף 46', hint: 'יש לרוקן את השדה אם תוקף האישור פג' },
  { key: 'amutaNumber', label: 'מספר עמותה רשומה' },
  { key: 'amutaName', label: 'שם העמותה' },
]

/** The PushCoins card in the donation section. Empty title + text = no card. */
const PUSHCOINS_FIELDS = [
  { key: 'pushcoinsTitle', label: 'כותרת' },
  { key: 'pushcoinsText', label: 'תיאור', rows: 3 },
  { key: 'pushcoinsButton', label: 'טקסט הכפתור' },
  { key: 'pushcoinsUrl', label: 'קישור הכפתור', hint: 'כתובת מלאה (https://…). שדה ריק — אין כפתור', ltr: true },
]

/**
 * Bank details, with bank and branch split into name + number so nobody types
 * parentheses — the site formats them ("מרכנתיל (מס׳ 17)", "740 (אשדוד)").
 */
const BANK_FIELDS: { key: string; label: string; numeric?: boolean; half?: boolean }[] = [
  { key: 'accountName', label: 'שם החשבון' },
  { key: 'bankName', label: 'שם הבנק', half: true },
  { key: 'bankCode', label: 'מספר בנק', numeric: true, half: true },
  { key: 'branchName', label: 'שם הסניף', half: true },
  { key: 'branchNumber', label: 'מספר סניף', numeric: true, half: true },
  { key: 'account', label: 'מספר חשבון', numeric: true },
  { key: 'iban', label: 'IBAN להעברה מחו"ל (רשות — להעתיק בדיוק כפי שהבנק מסר)' },
]

/**
 * The form's starting state: defaults under the stored info, and the bank
 * details split — details saved before the split arrive as free text, which is
 * parsed into the new fields here, so saving once migrates them.
 */
const toForm = (d: Record<string, unknown>): InfoForm => {
  const merged: InfoForm = { contacts: [], bankTransfer: {}, ...INFO_DEFAULTS, ...d }
  return { ...merged, bankTransfer: withSplitBankFields(merged.bankTransfer) }
}

const SCALARS = [
  { key: 'nameHe', label: 'שם המוסד' },
  { key: 'tagline', label: 'סלוגן' },
  { key: 'ravName', label: 'שם הרב' },
  { key: 'address', label: 'כתובת' },
  { key: 'mapQuery', label: 'כתובת לחיפוש במפה' },
  { key: 'phone', label: 'טלפון ראשי' },
  { key: 'secondaryPhone', label: 'טלפון נוסף (בתחתית האתר בלבד)' },
  { key: 'kollelEmail', label: 'אימייל הכולל' },
  { key: 'whatsappGroup', label: 'קישור קבוצת וואטסאפ' },
  { key: 'nedarimMosadId', label: 'מזהה מוסד נדרים פלוס' },
]

export default function InfoEditor() {
  const [form, setForm] = useState<InfoForm | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    provider
      .getSingleton('info')
      .then((d) => setForm(toForm(d)))
  }, [])

  if (!form) return <p className="text-ink-muted">טוען…</p>

  const set = (key: string, val: unknown) => {
    setForm((f) => ({ ...f, [key]: val }))
    setSaved(false)
  }
  const setBank = (key: string, val: unknown) => {
    setForm((f) => ({ ...f, bankTransfer: { ...f!.bankTransfer, [key]: val } }))
    setSaved(false)
  }
  const setContact = (i: number, key: string, val: unknown) => {
    setForm((f) => {
      const contacts = [...f!.contacts]
      contacts[i] = { ...contacts[i], [key]: val }
      return { ...f, contacts }
    })
    setSaved(false)
  }
  const addContact = () =>
    setForm((f) => ({ ...f, contacts: [...f!.contacts, { id: `c-${Date.now()}`, label: '', phone: '' }] }))
  const removeContact = (i: number) =>
    setForm((f) => ({ ...f, contacts: f!.contacts.filter((_: unknown, idx: number) => idx !== i) }))

  const save = async () => {
    await provider.setSingleton('info', form)
    setSaved(true)
  }
  const reset = async () => {
    if (!window.confirm('לשחזר את פרטי המוסד לברירת המחדל?')) return
    const seed = await provider.resetSingleton('info')
    setForm(toForm(seed))
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-bold">פרטי מוסד</h1>

      {/* Scalars */}
      <div className="card space-y-4 p-6">
        <h2 className="font-heading text-lg font-bold">פרטים כלליים</h2>
        {SCALARS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold">{f.label}</label>
            <input type="text" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-semibold">משפט חזון (Mission)</label>
          <textarea rows={3} value={form.mission ?? ''} onChange={(e) => set('mission', e.target.value)} className={fieldCls} />
        </div>
      </div>

      {/* Contacts repeater */}
      <div className="card mt-5 space-y-3 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">טלפונים ליצירת קשר</h2>
          <button onClick={addContact} className="rounded-lg bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold-hover hover:bg-gold/20">
            + הוספת טלפון
          </button>
        </div>
        {form.contacts.map((c: any, i: number) => (
          <div key={c.id || i} className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={c.label ?? ''}
              onChange={(e) => setContact(i, 'label', e.target.value)}
              placeholder="תיאור (למשל: בית ההוראה)"
              className={`${fieldCls} flex-1`}
            />
            <input
              type="text"
              dir="ltr"
              value={c.phone ?? ''}
              onChange={(e) => setContact(i, 'phone', e.target.value)}
              placeholder="050-000-0000"
              className={`${fieldCls} w-40`}
            />
            <button
              onClick={() => removeContact(i)}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              מחיקה
            </button>
          </div>
        ))}
      </div>

      {/* Association / tax details */}
      <div className="card mt-5 space-y-4 p-6">
        <div>
          <h2 className="font-heading text-lg font-bold">פרטי עמותה ואישור מס</h2>
          <p className="text-sm text-ink-muted">מוצגים מתחת לכותרת טופס התרומה. שדה ריק — השורה לא תוצג.</p>
        </div>
        {AMUTA_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold">
              {f.label}
              {f.hint && <span className="mr-2 font-normal text-ink-muted">· {f.hint}</span>}
            </label>
            <input type="text" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
          </div>
        ))}
      </div>

      {/* PushCoins */}
      <div className="card mt-5 space-y-4 p-6">
        <div>
          <h2 className="font-heading text-lg font-bold">קופת צדקה דיגיטלית (PushCoins)</h2>
          <p className="text-sm text-ink-muted">כרטיס בקטע התרומות, ליד פרטי ההעברה הבנקאית. כותרת ותיאור ריקים — הכרטיס לא יוצג.</p>
        </div>
        {PUSHCOINS_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold">
              {f.label}
              {f.hint && <span className="mr-2 font-normal text-ink-muted">· {f.hint}</span>}
            </label>
            {f.rows ? (
              <textarea rows={f.rows} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
            ) : (
              <input
                type="text"
                dir={f.ltr ? 'ltr' : undefined}
                value={form[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
                className={fieldCls}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bank transfer */}
      <div className="card mt-5 space-y-4 p-6">
        <div>
          <h2 className="font-heading text-lg font-bold">פרטי חשבון בנק להעברה</h2>
          <p className="text-sm text-ink-muted">אין צורך בסוגריים או במילה "מס׳" — האתר מסדר את התצוגה לבד.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {BANK_FIELDS.map((f) => (
            <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
              <label className="mb-1 block text-sm font-semibold">{f.label}</label>
              <input
                type="text"
                inputMode={f.numeric ? 'numeric' : undefined}
                dir={f.numeric || f.key === 'iban' ? 'ltr' : undefined}
                value={form.bankTransfer[f.key] ?? ''}
                onChange={(e) => setBank(f.key, e.target.value)}
                className={`${fieldCls} ${f.numeric ? 'text-right' : ''}`}
              />
            </div>
          ))}
        </div>
        {/* What the card on the site will say, as it is typed. */}
        {(bankLabel(form.bankTransfer) || branchLabel(form.bankTransfer)) && (
          <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-ink">
            <span className="font-semibold text-gold-hover">תצוגה באתר: </span>
            {bankLabel(form.bankTransfer) && <>בנק {bankLabel(form.bankTransfer)}</>}
            {bankLabel(form.bankTransfer) && branchLabel(form.bankTransfer) && ' · '}
            {branchLabel(form.bankTransfer) && <>סניף {branchLabel(form.bankTransfer)}</>}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary">שמירה</button>
        <button onClick={reset} className="btn-outline">שחזור ברירת מחדל</button>
        {saved && <span className="text-sm font-medium text-green-700">✓ נשמר</span>}
      </div>
    </div>
  )
}
