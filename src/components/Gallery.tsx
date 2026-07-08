import { Corners } from './icons'
import type { Lang } from '../copy'
import { copy } from '../copy'

interface GalleryProps {
  lang: Lang
}

const PHOTOS = [
  '/media/ring-lifestyle.png',
  '/media/ring-studio.png',
  '/media/ring-linen.png',
]

/** Työn jälki: valmiit tilaustyöt braket-kehyksissä mono-otsikoin. */
export default function Gallery({ lang }: GalleryProps) {
  const c = copy[lang].gallery

  return (
    <section className="section-light gallery">
      <div className="divider" data-fade="up">
        <h2 className="divider__title">{c.heading}</h2>
        <span className="divider__rule" aria-hidden="true" />
        <span className="divider__count">{c.count}</span>
      </div>

      <div className="gallery__grid">
        {PHOTOS.map((src, i) => (
          <figure key={src} className="hud-frame hud-frame--light" data-fade="up">
            <Corners />
            <img className="hud-frame__media" src={src} alt={c.alts[i]} loading="lazy" />
            <figcaption className="hud-frame__caption">
              <span>{c.captions[i]}</span>
              <span>{String(i + 1).padStart(2, '0')} / 03</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
