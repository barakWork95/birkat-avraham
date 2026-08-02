import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { COLLECTIONS } from '../config/collections'
import { provider } from '../services/dataProvider'
import { compressImage } from '../lib/compressImage'

/**
 * CollectionEditor — generic add/edit form, rendered from the collection schema.
 */
export default function CollectionEditor() {
  const { name, id } = useParams()
  const navigate = useNavigate()
  const schema = COLLECTIONS[name]
  const isNew = id === 'new'

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isNew) {
      setForm({ ...schema.defaults })
    } else {
      provider.getAll(name).then((items) => {
        const found = items.find((i) => i.id === id)
        setForm(found ? { ...schema.defaults, ...found } : { ...schema.defaults })
      })
    }
  }, [name, id, isNew, schema])

  const backTo = `/admin/${name}`

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const onPickImage = async (key, file) => {
    if (!file) return
    try {
      set(key, await compressImage(file))
    } catch (err) {
      setErrors((e) => ({ ...e, [key]: err.message || 'העלאת התמונה נכשלה' }))
    }
  }

  const validate = () => {
    const e = {}
    schema.fields.forEach((f) => {
      if (f.required && !String(form[f.key] ?? '').trim()) e[f.key] = 'שדה חובה'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    setBusy(true)
    // coerce number fields
    const payload = { ...form }
    schema.fields.forEach((f) => {
      if (f.type === 'number') payload[f.key] = Number(payload[f.key]) || 0
    })
    if (isNew) await provider.create(name, payload)
    else await provider.update(name, id, payload)
    navigate(backTo)
  }

  const fieldCls =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

  if (!schema) return <p className="text-ink-muted">קטגוריה לא נמצאה.</p>
  if (!form) return <p className="text-ink-muted">טוען…</p>

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate(backTo)} className="mb-4 text-sm text-ink-muted hover:text-gold">
        → חזרה ל{schema.label}
      </button>

      <div className="card p-6 sm:p-7">
        <h1 className="mb-5 font-heading text-2xl font-bold">
          {isNew ? `הוספת פריט ל${schema.label}` : 'עריכת פריט'}
        </h1>

        <div className="space-y-4">
          {schema.fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-semibold text-ink">
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
              </label>

              {f.type === 'textarea' && (
                <textarea rows={3} value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
              )}
              {f.type === 'text' && (
                <input type="text" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
              )}
              {f.type === 'number' && (
                <input type="number" value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls} />
              )}
              {f.type === 'select' && (
                <select value={form[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} className={fieldCls}>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              )}
              {f.type === 'boolean' && (
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} className="h-5 w-5 accent-gold" />
                  <span className="text-sm text-ink-muted">כן</span>
                </label>
              )}
              {f.type === 'image' && (
                <div className="flex items-center gap-4">
                  {form[f.key] ? (
                    <img src={form[f.key]} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink/10" />
                  ) : (
                    <div className="grid h-20 w-20 place-items-center rounded-xl bg-cream text-xs text-ink-muted ring-1 ring-ink/10">
                      אין תמונה
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="btn-outline cursor-pointer text-sm">
                      {form[f.key] ? 'החלפת תמונה' : 'העלאת תמונה'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onPickImage(f.key, e.target.files?.[0])}
                      />
                    </label>
                    {form[f.key] && (
                      <button type="button" onClick={() => set(f.key, '')} className="text-sm text-red-600 hover:underline">
                        הסרה
                      </button>
                    )}
                  </div>
                </div>
              )}

              {errors[f.key] && <p className="mt-1 text-sm text-red-600">{errors[f.key]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-70">
            {busy ? 'שומר…' : 'שמירה'}
          </button>
          <button onClick={() => navigate(backTo)} className="btn-outline">
            ביטול
          </button>
        </div>
      </div>
    </div>
  )
}
