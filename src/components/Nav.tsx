import type { Lang } from '../copy'
import { copy } from '../copy'

interface NavProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
  /** true kun sivua on vieritetty: nav saa taustan luettavuuden vuoksi */
  scrolled: boolean
  onNavigate: (id: string) => void
}

const LANGS: Lang[] = ['fi', 'en']

/** Kiinteä yläpalkki: wordmark + ankkurilinkit + FI/EN + tarjous-CTA. */
export default function Nav({ lang, onLangChange, scrolled, onNavigate }: NavProps) {
  const c = copy[lang].nav

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <button className="nav__logo" type="button" onClick={() => window.scrollTo({ top: 0 })}>
        Pohjapaja
      </button>
      <nav className="nav__links" aria-label={lang === 'fi' ? 'Päävalikko' : 'Main menu'}>
        {c.links.map((link) => (
          <button
            key={link.id}
            type="button"
            className="nav__link"
            onClick={() => onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className="nav__right">
        <div
          className="nav__lang"
          role="group"
          aria-label={lang === 'fi' ? 'Kieli' : 'Language'}
        >
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`nav__lang-btn${lang === l ? ' is-active' : ''}`}
              aria-pressed={lang === l}
              onClick={() => onLangChange(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="nav__cta" type="button" onClick={() => onNavigate('yhteys')}>
          {c.cta}
        </button>
      </div>
    </header>
  )
}
