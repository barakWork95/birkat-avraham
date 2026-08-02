import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'

/**
 * InfoEditor — dedicated editor for the institution-info singleton
 * (scalars + a contacts repeater + bank-transfer fields).
 */
const fieldCls =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

const SCALARS = [
  { key: 'nameHe', label: 'שם המוסד' },
  { key: 'tagline', label: 'סלוגן' },
  { key: 'ravName', label: 'שם הרב' },
  { key: 'address', label: 'כתובת' },
  { key: 'mapQuery', label: 'כתובת לחיפוש במפה' },
  { key: 'phone', label: 'טלפון ראשי' },
  { key: 'kollelEmail', label: 'אימייל הכולל' },
  { key: 'whatsappGroup', label: 'קישור קבוצת וואטסאפ' },
  { key: 'nedarimMosadId', label: 'מזהה מוסד נדרים פלוס' },
]

export default function InfoEditor() {
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    provider.getSingleton('info').then((d) => setForm({ contacts: [], bankTransfer: {}, ...d }))
  }, [])

  if (!form) return <p className="text-ink-muted">טוען…</p>

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setSaved(false)
  }
  const setBank = (key, val) => {
    setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, [key]: val } }))
    setSaved(false)
  }
  const setContact = (i, key, val) => {
    setForm((f) => {
      const contacts = [...f.contacts]
      contacts[i] = { ...contacts[i], [key]: val }
      return { ...f, contacts }
    })
    setSaved(false)
  }
  const addContact = () =>
    setForm((f) => ({ ...f, contacts: [...f.contacts, { id: `c-${Date.now()}`, label: '', phone: '' }] }))
  const removeContact = (i) =>
    setForm((f) => ({ ...f, contacts: f.contacts.filter((_, idx) => idx !== i) }))

  const save = async () => {
    await provider.setSingleton('info', form)
    setSaved(true)
  }
  const reset = async () => {
    if (!window.confirm('לשחזר את פרטי המוסד לברירת המחדל?')) return
    const seed = await provider.resetSingleton('info')
    setForm({ contacts: [], bankTransfer: {}, ...seed })
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
        {form.contacts.map((c, i) => (
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

      {/* Bank transfer */}
      <div className="card mt-5 space-y-4 p-6">
        <h2 className="font-heading text-lg font-bold">פרטי חשבון בנק להעברה</h2>
        {[
          { key: 'accountName', label: 'שם החשבון' },
          { key: 'bank', label: 'בנק' },
          { key: 'branch', label: 'סניף' },
          { key: 'account', label: 'מספר חשבון' },
        ].map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-semibold">{f.label}</label>
            <input type="text" value={form.bankTransfer[f.key] ?? ''} onChange={(e) => setBank(f.key, e.target.value)} className={fieldCls} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary">שמירה</button>
        <button onClick={reset} className="btn-outline">שחזור ברירת מחדל</button>
        {saved && <span className="text-sm font-medium text-green-700">✓ נשמר</span>}
      </div>
    </div>
  )
}
