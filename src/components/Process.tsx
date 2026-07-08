import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Corners } from './icons'
import type { Lang } from '../copy'
import { copy } from '../copy'

gsap.registerPlugin(ScrollTrigger)

interface ProcessProps {
  lang: Lang
  reducedMotion: boolean
}

const CLIPS = ['/media/clip-1.mp4', '/media/clip-2.mp4', '/media/clip-3.mp4']

/**
 * Prosessi (koyu): 4 vaihetta, joita yhdistävä toolpath-viiva piirtyy
 * scroll-scrubilla; alla verstasvideot HUD-kehyksissä.
 */
export default function Process({ lang, reducedMotion }: ProcessProps) {
  const c = copy[lang].process
  const section = useRef<HTMLElement>(null)
  const path = useRef<SVGPolylineElement>(null)

  // Toolpath piirtyy scrollin mukana (stroke-dashoffset 1 -> 0)
  useEffect(() => {
    if (reducedMotion || !section.current || !path.current) return
    const tween = gsap.fromTo(
      path.current,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reducedMotion])

  return (
    <section id="prosessi" ref={section} className="section-dark process dotgrid">
      <Corners />
      <div className="divider divider--dark" data-fade="up">
        <h2 className="divider__title">{c.heading}</h2>
        <span className="divider__rule" aria-hidden="true" />
        <span className="divider__count">{c.count}</span>
      </div>

      {/* Vaiheita yhdistävä työstörata (brändimotifi) */}
      <svg
        className="process__path"
        viewBox="0 0 1000 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points="10,80 10,25 260,25 260,65 510,65 510,25 760,25 760,65 990,65"
          fill="none"
          stroke="#565049"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          ref={path}
          points="10,80 10,25 260,25 260,65 510,65 510,25 760,25 760,65 990,65"
          fill="none"
          stroke="#D6A94A"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reducedMotion ? 0 : 1}
        />
        {[10, 260, 510, 760].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={i % 2 === 0 ? (i === 0 ? 80 : 65) : 25}
            r="4"
            fill="#1A1815"
            stroke="#D6A94A"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <ol className="process__steps">
        {c.steps.map((step) => (
          <li key={step.num} className="step" data-fade="up">
            <span className="step__num">{step.num}</span>
            <h3 className="step__title">{step.title}</h3>
            <p className="step__desc">{step.desc}</p>
          </li>
        ))}
      </ol>

      <div className="process__clips">
        {CLIPS.map((src, i) => (
          <figure key={src} className="hud-frame" data-fade="up">
            <Corners />
            <video
              className="hud-frame__media"
              src={src}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
            <figcaption className="hud-frame__caption">
              <span>
                <span className="hud-frame__rec" aria-hidden="true" />
                {c.clipCaptions[i]}
              </span>
              <span>F1200 · S18000</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
