import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Lang, SpecCopy } from '../copy'
import { copy } from '../copy'

gsap.registerPlugin(ScrollTrigger)

interface MaterialsProps {
  lang: Lang
  reducedMotion: boolean
}

/** Yksi spec-luku, joka laskee nollasta kohteeseen näkyviin tullessaan. */
function Counter({ spec, lang, reducedMotion }: { spec: SpecCopy; lang: Lang; reducedMotion: boolean }) {
  const value = useRef<HTMLSpanElement>(null)

  // FI käyttää desimaalipilkkua
  const format = (v: number) => {
    const s = v.toFixed(spec.decimals)
    return lang === 'fi' ? s.replace('.', ',') : s
  }

  useEffect(() => {
    if (!value.current) return
    if (reducedMotion) {
      value.current.textContent = format(spec.target)
      return
    }
    value.current.textContent = format(0)
    const state = { v: 0 }
    const tween = gsap.to(state, {
      v: spec.target,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (value.current) value.current.textContent = format(state.v)
      },
      scrollTrigger: { trigger: value.current, start: 'top 85%', once: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, reducedMotion, spec])

  return (
    <div className="spec">
      <div className="spec__value">
        <span ref={value}>{format(spec.target)}</span>
        <span className="spec__suffix">{spec.suffix}</span>
      </div>
      <div className="spec__label">{spec.label}</div>
    </div>
  )
}

/** Materiaalit: sirut + Makera Z1 Pron avainluvut laskureina. */
export default function Materials({ lang, reducedMotion }: MaterialsProps) {
  const c = copy[lang].materials

  return (
    <section id="materiaalit" className="section-light materials">
      <div className="divider" data-fade="up">
        <h2 className="divider__title">{c.heading}</h2>
        <span className="divider__rule" aria-hidden="true" />
        <span className="divider__count">{c.count}</span>
      </div>

      <div className="materials__chips" data-fade="up">
        {c.chips.map((chip) => (
          <span key={chip} className="chip">
            {chip}
          </span>
        ))}
      </div>

      <div className="materials__specs">
        {c.specs.map((spec) => (
          <div key={spec.label} data-fade="up">
            <Counter spec={spec} lang={lang} reducedMotion={reducedMotion} />
          </div>
        ))}
      </div>

      <p className="materials__machine" data-fade="up">
        {c.machine}
      </p>
    </section>
  )
}
