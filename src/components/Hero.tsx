import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ToolpathScene from './ToolpathScene'
import { Corners } from './icons'
import type { Lang } from '../copy'
import { copy } from '../copy'

interface HeroProps {
  lang: Lang
  reducedMotion: boolean
  onPrimary: () => void
  onSecondary: () => void
}

/**
 * Koyu "makine ekranı" hero: nokta ızgara + köşe braketleri + scroll'la
 * akan X/Y/Z koordinat okuması + satır-maskeli başlık + 3D toolpath.
 */
export default function Hero({ lang, reducedMotion, onPrimary, onSecondary }: HeroProps) {
  const c = copy[lang].hero
  const section = useRef<HTMLElement>(null)
  const coordX = useRef<HTMLSpanElement>(null)
  const coordY = useRef<HTMLSpanElement>(null)

  // Koordinaatit "liikkuvat" scrollin mukana — kirjoitetaan suoraan DOM:iin
  useEffect(() => {
    const fmt = (v: number) => v.toFixed(1).padStart(6, '0')
    const onScroll = () => {
      const s = window.scrollY
      if (coordX.current) coordX.current.textContent = `X+${fmt((s * 0.37) % 200)}`
      if (coordY.current) coordY.current.textContent = `Y+${fmt((s * 0.21) % 200)}`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Otsikkorivien paljastus (ajetaan uudelleen kielivaihdossa)
  useEffect(() => {
    if (reducedMotion || !section.current) return
    const lines = section.current.querySelectorAll('[data-line]')
    const tween = gsap.fromTo(
      lines,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12, delay: 0.1 },
    )
    return () => {
      tween.kill()
    }
  }, [lang, reducedMotion])

  return (
    <section ref={section} className="hero dotgrid">
      <Corners />
      <ToolpathScene reducedMotion={reducedMotion} />

      <div className="hero__coords" aria-hidden="true">
        <span>
          <span ref={coordX}>X+000.0</span> <span ref={coordY}>Y+000.0</span>{' '}
          <span>Z−02.0</span>
        </span>
        <span>{c.kicker}</span>
      </div>

      <div className="hero__content">
        <p className="tag tag--dark" data-fade="up">{c.kicker}</p>
        <h1 className="hero__title" aria-label={c.titleLines.join(' ')}>
          {c.titleLines.map((line) => (
            <span className="hero__line-wrap" key={line} aria-hidden="true">
              <span className="hero__line" data-line>{line}</span>
            </span>
          ))}
        </h1>
        <div className="hero__tagline" data-fade="up">
          <span className="hero__rule" aria-hidden="true" />
          <span>{c.tagline}</span>
        </div>
        <div className="hero__actions" data-fade="up">
          <button className="btn btn--brass" type="button" onClick={onPrimary}>
            {c.ctaPrimary}
          </button>
          <button className="btn btn--outline-light" type="button" onClick={onSecondary}>
            {c.ctaSecondary}
          </button>
        </div>
        <p className="hero__note" data-fade="up">{c.note}</p>
      </div>

      <div className="hero__status" aria-hidden="true">
        <span className="hero__status-dot" />
        <span>{c.status}</span>
      </div>
    </section>
  )
}
