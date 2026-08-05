import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { COLLECTIONS } from '../config/collections'
import { provider } from '../services/dataProvider'
import type { MediaEntry } from '../types/models'

type FormState = Record<string, any>

const genMediaId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

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
  const [uploading, setUploading] = useState<string | null>(null) // image-field key currently uploading
  const [mediaUploading, setMediaUploading] = useState<string | null>(null) // media-field key uploading

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

  // ── Media repeater (album `media[]`) — functional updates avoid stale closures.
  const getMedia = (key: string): MediaEntry[] => (Array.isArray(form[key]) ? form[key] : [])
  const mutateMedia = (key: string, fn: (arr: MediaEntry[]) => MediaEntry[]) =>
    setForm((f) => ({ ...f, [key]: fn(Array.isArray(f?.[key]) ? f![key] : []) }))

  const addMediaEntry = (key: string, entry: Partial<MediaEntry> = {}) =>
    mutateMedia(key, (arr) => [
      ...arr,
      { id: genMediaId(), type: 'photo', image: '', videoUrl: '', caption: '', ...entry },
    ])

  const updateMediaEntry = (key: string, i: number, patch: Partial<MediaEntry>) =>
    mutateMedia(key, (arr) => arr.map((m, idx) => (idx === i ? { ...m, ...patch } : m)))

  const removeMediaEntry = (key: string, i: number) => {
    const previous = getMedia(key)[i]?.image
    mutateMedia(key, (arr) => arr.filter((_, idx) => idx !== i))
    if (previous) provider.deleteImage?.(previous)
  }

  const moveMediaEntry = (key: string, i: number, dir: -1 | 1) =>
    mutateMedia(key, (arr) => {
      const j = i + dir
      if (j < 0 || j >= arr.length) return arr
      const next = arr.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const uploadMediaFiles = async (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return
    setErrors((e) => ({ ...e, [key]: undefined }))
    setMediaUploading(key)
    try {
      const urls = await Promise.all(Array.from(files).map((file) => provider.uploadImage(file, name)))
      mutateMedia(key, (arr) => [
        ...arr,
        ...urls.map((url) => ({ id: genMediaId(), type: 'photo' as const, image: url, caption: '' })),
      ])
    } catch (err) {
      setErrors((e) => ({ ...e, [key]: (err as Error).message || 'העלאת המדיה נכשלה' }))
    } finally {
      setMediaUploading(null)
    }
  }

  const replaceMediaImage = async (key: string, i: number, file?: File) => {
    if (!file) return
    setErrors((e) => ({ ...e, [key]: undefined }))
    setMediaUploading(key)
    const previous = getMedia(key)[i]?.image
    try {
      const url = await provider.uploadImage(file, name)
      updateMediaEntry(key, i, { image: url })
      if (previous) provider.deleteImage?.(previous)
    } catch (err) {
      setErrors((e) => ({ ...e, [key]: (err as Error).message || 'העלאת התמונה נכשלה' }))
    } finally {
      setMediaUploading(null)
    }
  }

  /** Fields that are actually shown (and therefore validated) for the current form. */
  const visibleFields = schema.fields.filter((f) => !f.showIf || f.showIf(form))

  const validate = () => {
    const e: Record<string, string | undefined> = {}
    visibleFields.forEach((f) => {
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
          {visibleFields.map((f) => (
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
              {f.type === 'media' && (
                <div className="space-y-3">
                  {getMedia(f.key).length === 0 && (
                    <p className="rounded-xl border border-dashed border-ink/15 bg-cream px-4 py-6 text-center text-sm text-ink-muted">
                      אין עדיין מדיה באלבום. הוסיפו תמונות או וידאו.
                    </p>
                  )}

                  {getMedia(f.key).map((m, i) => (
                    <div key={m.id || i} className="rounded-xl border border-ink/10 bg-white p-3">
                      <div className="flex items-start gap-3">
                        {/* reorder */}
                        <div className="flex flex-col pt-1">
                          <button
                            type="button"
                            onClick={() => moveMediaEntry(f.key, i, -1)}
                            disabled={i === 0}
                            className="px-1 text-ink-muted hover:text-gold disabled:opacity-30"
                            aria-label="הזז מעלה"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMediaEntry(f.key, i, 1)}
                            disabled={i === getMedia(f.key).length - 1}
                            className="px-1 text-ink-muted hover:text-gold disabled:opacity-30"
                            aria-label="הזז מטה"
                          >
                            ▼
                          </button>
                        </div>

                        {/* thumbnail */}
                        {m.type === 'photo' && m.image ? (
                          <img src={m.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-ink/10" />
                        ) : (
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-cream text-[10px] text-ink-muted ring-1 ring-ink/10">
                            {m.type === 'video' ? 'וידאו' : 'אין תמונה'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-2">
                          {/* type toggle */}
                          <div className="inline-flex rounded-lg bg-cream p-0.5 text-xs font-semibold">
                            {(['photo', 'video'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => updateMediaEntry(f.key, i, { type: t })}
                                className={`rounded-md px-3 py-1 ${
                                  m.type === t ? 'bg-white text-gold-hover shadow-card' : 'text-ink-muted'
                                }`}
                              >
                                {t === 'photo' ? 'תמונה' : 'וידאו'}
                              </button>
                            ))}
                          </div>

                          {m.type === 'video' ? (
                            <input
                              type="text"
                              dir="ltr"
                              value={m.videoUrl ?? ''}
                              onChange={(e) => updateMediaEntry(f.key, i, { videoUrl: e.target.value })}
                              placeholder="https://www.youtube.com/embed/…"
                              className={`${fieldCls} !py-2 text-sm`}
                            />
                          ) : (
                            <label className={`btn-outline inline-flex cursor-pointer !py-1.5 text-xs ${mediaUploading === f.key ? 'pointer-events-none opacity-60' : ''}`}>
                              {mediaUploading === f.key ? 'מעלה…' : m.image ? 'החלפת תמונה' : 'העלאת תמונה'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={mediaUploading === f.key}
                                onChange={(e) => replaceMediaImage(f.key, i, e.target.files?.[0])}
                              />
                            </label>
                          )}

                          <input
                            type="text"
                            value={m.caption ?? ''}
                            onChange={(e) => updateMediaEntry(f.key, i, { caption: e.target.value })}
                            placeholder="כיתוב (רשות)"
                            className={`${fieldCls} !py-2 text-sm`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeMediaEntry(f.key, i)}
                          className="shrink-0 rounded-lg bg-red-50 px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          מחיקה
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* add controls */}
                  <div className="flex flex-wrap gap-2">
                    <label className={`btn-primary cursor-pointer !py-2 !px-4 text-sm ${mediaUploading === f.key ? 'pointer-events-none opacity-60' : ''}`}>
                      {mediaUploading === f.key ? 'מעלה…' : 'העלאת תמונות'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={mediaUploading === f.key}
                        onChange={(e) => uploadMediaFiles(f.key, e.target.files)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => addMediaEntry(f.key, { type: 'video' })}
                      className="rounded-xl bg-ink/5 px-4 py-2 text-sm font-medium hover:bg-ink/10"
                    >
                      + הוספת וידאו
                    </button>
                  </div>
                </div>
              )}

              {errors[f.key] && <p className="mt-1 text-sm text-red-600">{errors[f.key]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={save} disabled={busy || uploading !== null || mediaUploading !== null} className="btn-primary disabled:opacity-70">
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
