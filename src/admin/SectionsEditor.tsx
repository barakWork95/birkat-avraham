import { useEffect, useState } from 'react'
import { provider } from '../services/dataProvider'
import { SECTION_TEXTS, type SectionText } from '../config/sectionTexts'

type TextMap = Record<string, SectionText>

const fieldCls =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'

const LINES: { key: keyof SectionText; label: string; hint: string }[] = [
  { key: 'eyebrow', label: 'תווית עליונה', hint: 'הטקסט הקטן מעל הכותרת' },
  { key: 'title', label: 'כותרת', hint: 'הכותרת הראשית של הקטע' },
  { key: 'subtitle', label: 'כותרת משנה', hint: 'משפט ההסבר מתחת לכותרת' },
]

/**
 * SectionsEditor — edits the `sections` singleton: the eyebrow/title/subtitle
 * of every section on the public site.
 *
 * A field left EMPTY is saved as an empty string on purpose — that hides the
 * line on the site (e.g. a section with no subtitle). "שחזור" puts the original
 * text back. Anything never touched simply falls back to the built-in default.
 */
export default function SectionsEditor() {
  const [texts, setTexts] = useState<TextMap | null>(null)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    provider.getSingleton('sections').then((d) => setTexts((d || {}) as TextMap))
  }, [])

  if (!texts) return <p className="text-ink-muted">טוען…</p>

  /** Stored value if set, otherwise the built-in default for that line. */
  const valueOf = (key: string, line: keyof SectionText, fallback?: string) =>
    texts[key]?.[line] ?? fallback ?? ''

  const set = (key: string, line: keyof SectionText, val: string) => {
    setTexts((t) => ({ ...t, [key]: { ...t![key], [line]: val } }))
    setSaved(false)
  }

  const restore = (key: string, defaults: SectionText) => {
    setTexts((t) => ({ ...t, [key]: { ...defaults } }))
    setSaved(false)
  }

  const save = async () => {
    setBusy(true)
    try {
      // Persist every section explicitly (including the untouched ones) so the
      // saved document is a complete, self-describing snapshot.
      const payload: TextMap = Object.fromEntries(
        SECTION_TEXTS.map((s) => [
          s.key,
          {
            eyebrow: valueOf(s.key, 'eyebrow', s.defaults.eyebrow),
            title: valueOf(s.key, 'title', s.defaults.title),
            subtitle: valueOf(s.key, 'subtitle', s.defaults.subtitle),
          },
        ]),
      )
      await provider.setSingleton('sections', payload)
      setTexts(payload)
      setSaved(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-2xl font-bold">כותרות באתר</h1>
      <p className="mb-6 text-ink-muted">
        עריכת הכותרות וכותרות המשנה של הקטעים באתר. שדה שיישאר ריק — השורה לא תוצג באתר.
      </p>

      <div className="space-y-5">
        {SECTION_TEXTS.map((s) => (
          <div key={s.key} className="card space-y-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-bold">{s.label}</h2>
              <button
                onClick={() => restore(s.key, s.defaults)}
                className="rounded-lg bg-ink/5 px-3 py-1.5 text-sm font-medium hover:bg-ink/10"
              >
                שחזור ברירת מחדל
              </button>
            </div>

            {LINES.map((line) => (
              <div key={line.key}>
                <label className="mb-1 block text-sm font-semibold">
                  {line.label}
                  <span className="mr-2 font-normal text-ink-muted">· {line.hint}</span>
                </label>
                {line.key === 'subtitle' ? (
                  <textarea
                    rows={2}
                    value={valueOf(s.key, line.key, s.defaults[line.key])}
                    onChange={(e) => set(s.key, line.key, e.target.value)}
                    className={fieldCls}
                  />
                ) : (
                  <input
                    type="text"
                    value={valueOf(s.key, line.key, s.defaults[line.key])}
                    onChange={(e) => set(s.key, line.key, e.target.value)}
                    className={fieldCls}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 flex items-center gap-3 bg-cream/90 py-4 backdrop-blur">
        <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-70">
          {busy ? 'שומר…' : 'שמירה'}
        </button>
        {saved && <span className="text-sm font-medium text-green-700">✓ נשמר</span>}
      </div>
    </div>
  )
}
