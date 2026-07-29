import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClientOnly, Head } from 'vite-react-ssg'
import { copy, type Lang } from '../copy'
import { PPMark } from '../components/icons'
import QuoteUploader from '../components/QuoteUploader'

const LANGS: Lang[] = ['fi', 'en']

/**
 * /makera — lataa 3D-malli, esikatsele selaimessa ja pyydä tarjous.
 * Staattinen runko (otsikko, ohje, tuetut muodot) prerenderoituu SEO:ta
 * varten; itse työkalu (QuoteUploader) on <ClientOnly>, joten three.js /
 * FileReader eivät aja prerenderissä.
 */
export default function MakeraPage() {
  const [lang, setLang] = useState<Lang>('fi')
  const c = copy[lang]
  const m = c.makera

  // Kielivalinta jaetaan etusivun kanssa localStoragen kautta (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('pp-lang')
    if (saved === 'fi' || saved === 'en') setLang(saved)
  }, [])
  useEffect(() => {
    localStorage.setItem('pp-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <>
      <Head>
        <html lang={lang} />
        <title>{m.metaTitle}</title>
        <meta name="description" content={m.metaDescription} />
        <link rel="canonical" href="https://pohjapaja.fi/makera" />
        <meta property="og:title" content={m.metaTitle} />
        <meta property="og:description" content={m.metaDescription} />
        <meta property="og:url" content="https://pohjapaja.fi/makera" />
      </Head>

      <header className="mk-nav">
        <Link className="mk-nav__logo" to="/">Pohjapaja</Link>
        <div className="mk-nav__right">
          <div className="nav__lang" role="group" aria-label={lang === 'fi' ? 'Kieli' : 'Language'}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={`nav__lang-btn${lang === l ? ' is-active' : ''}`}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link className="mk-nav__back" to="/">← {m.back}</Link>
        </div>
      </header>

      <main className="mk-page">
        <section className="mk-hero">
          <p className="tag tag--dark">{m.kicker}</p>
          <h1 className="mk-hero__title">{m.title}</h1>
          <p className="mk-hero__intro">{m.intro}</p>
          <p className="mk-hero__formats">{m.unsupported}</p>
        </section>

        <section className="mk-tool-wrap" aria-label={m.formTitle}>
          <ClientOnly fallback={<div className="mk-drop mk-drop--static">{m.drop}</div>}>
            {() => <QuoteUploader lang={lang} />}
          </ClientOnly>
        </section>
      </main>

      <footer className="mk-footer">
        <div className="footer__lockup">
          <PPMark size={40} />
          <div>
            <div className="footer__name">Pohjapaja</div>
            <div className="footer__sub">{c.footer.lockup}</div>
          </div>
        </div>
        <div className="footer__company">{c.footer.company}</div>
      </footer>
    </>
  )
}
