import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { COLLECTIONS } from '../config/collections'
import { provider } from '../services/dataProvider'

type FormState = Record<string, any>

/**
 * CollectionEditor — generic add/edit form, rendered from the collection schema.
 */
export default function CollectionEditor() {
  const { name, id } = useParams()
  const navigate = useNavigate()
  const schema = name ? COLLECTIONS[name] : undefined
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState | null>(null)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null) // key currently uploading

  useEffect(() => {
    if (!schema || !name) return
    if (isNew) {
      setForm({ ...schema.defaults })
    } else {
      provider.getAll(name).then((items) => {
        const found = items.find((i) => i.id === id)
        setForm(found ? { ...schema.defaults, ...found } : { ...schema.defaults })
      })
    }
  }, [name, id, isNew, schema])

  const fieldCls =
    'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

  if (!schema || !name) return <p className="text-ink-muted">קטגוריה לא נמצאה.</p>
  if (!form) return <p className="text-ink-muted">טוען…</p>

  const backTo = `/admin/${name}`

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  const onPickImage = async (key: string, file?: File) => {
    if (!file) return
    setErrors((e) => ({ ...e, [key]: undefined }))
    setUploading(key)
    const previous = form[key]
    try {
      const url = await provider.uploadImage(file, name)
      set(key, url)
      // Clean up the replaced image (best-effort; no-op in local mode).
      if (previous) provider.deleteImage?.(previous)
    } catch (err) {
      setErrors((e) => ({ ...e, [key]: (err as Error).message || 'העלאת התמונה נכשלה' }))
    } finally {
      setUploading(null)
    }
  }

  const onRemoveImage = (key: string) => {
    const previous = form[key]
    set(key, '')
    if (previous) provider.deleteImage?.(previous)
  }

  const validate = () => {
    const e: Record<string, string | undefined> = {}
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
    const payload: FormState = { ...form }
    schema.fields.forEach((f) => {
      if (f.type === 'number') payload[f.key] = Number(payload[f.key]) || 0
    })
    if (isNew) await provider.create(name, payload)
    else if (id) await provider.update(name, id, payload)
    navigate(backTo)
  }

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
                  {(f.options ?? []).map((o) => (
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
                  {uploading === f.key ? (
                    <div className="grid h-20 w-20 place-items-center rounded-xl bg-cream ring-1 ring-ink/10">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/40 border-t-gold" />
                    </div>
                  ) : form[f.key] ? (
                    <img src={form[f.key]} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink/10" />
                  ) : (
                    <div className="grid h-20 w-20 place-items-center rounded-xl bg-cream text-xs text-ink-muted ring-1 ring-ink/10">
                      אין תמונה
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className={`btn-outline cursor-pointer text-sm ${uploading === f.key ? 'pointer-events-none opacity-60' : ''}`}>
                      {uploading === f.key ? 'מעלה…' : form[f.key] ? 'החלפת תמונה' : 'העלאת תמונה'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading === f.key}
                        onChange={(e) => onPickImage(f.key, e.target.files?.[0])}
                      />
                    </label>
                    {form[f.key] && uploading !== f.key && (
                      <button type="button" onClick={() => onRemoveImage(f.key)} className="text-sm text-red-600 hover:underline">
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
          <button onClick={save} disabled={busy || uploading !== null} className="btn-primary disabled:opacity-70">
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
