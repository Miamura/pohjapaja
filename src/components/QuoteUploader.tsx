import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from 'react'
import { CONTACT_EMAIL, copy, type Lang } from '../copy'
import type { ModelData } from '../lib/loadModel'

// three/r3f pysyy poissa SSR:stä: viewer lazyna, loader dynaamisena importtina.
const ModelViewer = lazy(() => import('./ModelViewer'))

const MAX_MB = 60
// Tuotannossa aseta VITE_QUOTE_ENDPOINT (Cloudflare Workerin URL).
// Oletus /api/quote toimii jos Worker reititetään samaan originiin.
const ENDPOINT = import.meta.env.VITE_QUOTE_ENDPOINT || '/api/quote'

type Parse = 'idle' | 'loading' | 'ready' | 'error'
type Send = 'idle' | 'sending' | 'sent' | 'error'

const mm = (v: number) => v.toFixed(1)

export default function QuoteUploader({ lang }: { lang: Lang }) {
  const c = copy[lang].makera
  const [file, setFile] = useState<File | null>(null)
  const [parse, setParse] = useState<Parse>('idle')
  const [data, setData] = useState<ModelData | null>(null)
  const [send, setSend] = useState<Send>('idle')
  const [dragOver, setDragOver] = useState(false)
  const dataRef = useRef<ModelData | null>(null)

  // Jäsennä malli (dynaaminen import -> three vasta tässä)
  useEffect(() => {
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) {
      setParse('error')
      return
    }
    let cancelled = false
    setParse('loading')
    setData(null)
    ;(async () => {
      try {
        const mod = await import('../lib/loadModel')
        const fmt = mod.detectFormat(file.name)
        if (!fmt) throw new Error('unsupported')
        const buf = await file.arrayBuffer()
        const result = fmt === 'stl' ? await mod.loadStl(buf) : await mod.loadStep(buf)
        if (cancelled) {
          result.geometry.dispose()
          return
        }
        dataRef.current?.geometry.dispose()
        dataRef.current = result
        setData(result)
        setParse('ready')
      } catch {
        if (!cancelled) setParse('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [file])

  // Vapauta GPU-muisti kun komponentti poistuu
  useEffect(() => () => dataRef.current?.geometry.dispose(), [])

  const pick = (f: File | null) => {
    if (!f) return
    setSend('idle')
    setFile(f)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    pick(e.dataTransfer.files?.[0] ?? null)
  }

  const reset = () => {
    dataRef.current?.geometry.dispose()
    dataRef.current = null
    setFile(null)
    setData(null)
    setParse('idle')
    setSend('idle')
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return
    const form = new FormData(e.currentTarget)
    form.append('file', file, file.name)
    form.append('lang', lang)
    if (data) {
      form.append(
        'dimensions',
        `${mm(data.size.x)} × ${mm(data.size.y)} × ${mm(data.size.z)} mm`,
      )
      form.append('triangles', String(data.triangles))
      if (data.volumeMm3) form.append('volume_cm3', (data.volumeMm3 / 1000).toFixed(1))
    }
    setSend('sending')
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: form })
      if (!res.ok) throw new Error(String(res.status))
      setSend('sent')
    } catch {
      setSend('error')
    }
  }

  // ---- Onnistunut lähetys ----
  if (send === 'sent') {
    return (
      <div className="mk-card mk-card--done" role="status">
        <div className="mk-card__check" aria-hidden="true">✓</div>
        <h3 className="mk-card__title">{c.sentTitle}</h3>
        <p className="mk-card__body">{c.sentBody}</p>
        <button className="btn btn--outline-light" type="button" onClick={reset}>
          {c.reset}
        </button>
      </div>
    )
  }

  // ---- Ei tiedostoa: pudotusalue ----
  if (!file) {
    return (
      <div
        className={`mk-drop${dragOver ? ' is-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <svg className="mk-drop__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M24 32V12m0 0l-7 7m7-7l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 30v4a4 4 0 004 4h20a4 4 0 004-4v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="mk-drop__title">{c.drop}</p>
        <label className="btn btn--brass mk-drop__btn">
          {c.dropBtn}
          <input
            type="file"
            accept=".stl,.step,.stp,model/stl,application/step"
            hidden
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
        </label>
        <p className="mk-drop__hint">{c.dropHint}</p>
        <p className="mk-drop__privacy">{c.privacy}</p>
      </div>
    )
  }

  // ---- Tiedosto valittu: esikatselu + lomake ----
  return (
    <div className="mk-tool">
      <div className="mk-viewer">
        <div className="mk-viewer__stage">
          {parse === 'ready' && data ? (
            <Suspense fallback={<div className="mk-viewer__msg">{c.loading}</div>}>
              <ModelViewer geometry={data.geometry} />
            </Suspense>
          ) : parse === 'error' ? (
            <div className="mk-viewer__msg mk-viewer__msg--error">{c.parseError}</div>
          ) : (
            <div className="mk-viewer__msg">
              <span className="mk-spinner" aria-hidden="true" />
              {c.loading}
            </div>
          )}
        </div>

        <div className="mk-viewer__bar">
          <span className="mk-viewer__file" title={file.name}>{file.name}</span>
          <button className="mk-viewer__reset" type="button" onClick={reset}>
            {c.reset}
          </button>
        </div>

        {parse === 'ready' && data && (
          <dl className="mk-dims">
            <div>
              <dt>{c.dimsSize}</dt>
              <dd>{mm(data.size.x)} × {mm(data.size.y)} × {mm(data.size.z)} mm</dd>
            </div>
            {data.volumeMm3 ? (
              <div>
                <dt>{c.dimsVolume}</dt>
                <dd>{(data.volumeMm3 / 1000).toFixed(1)} cm³</dd>
              </div>
            ) : null}
            <div>
              <dt>{c.dimsTris}</dt>
              <dd>{data.triangles.toLocaleString('fi-FI')}</dd>
            </div>
            <p className="mk-dims__note">{c.dimsUnitNote}</p>
          </dl>
        )}
      </div>

      <form className="mk-form" onSubmit={onSubmit}>
        <h3 className="mk-form__title">{c.formTitle}</h3>
        <label className="field">
          <span className="field__label">{c.nameLabel}</span>
          <input className="field__input" type="text" name="name" required />
        </label>
        <label className="field">
          <span className="field__label">{c.emailLabel}</span>
          <input className="field__input" type="email" name="email" required />
        </label>
        <label className="field">
          <span className="field__label">{c.materialLabel}</span>
          <select className="field__input" name="material" defaultValue={c.materials[0]}>
            {c.materials.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">{c.noteLabel}</span>
          <textarea
            className="field__input field__input--area"
            name="note"
            rows={3}
            placeholder={c.notePlaceholder}
          />
        </label>

        {send === 'error' && (
          <p className="mk-form__error">
            {c.errorBody}{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}

        <button
          className="btn btn--brass mk-form__submit"
          type="submit"
          disabled={send === 'sending' || parse === 'loading'}
        >
          {send === 'sending' ? c.sending : c.submit}
        </button>
      </form>
    </div>
  )
}
