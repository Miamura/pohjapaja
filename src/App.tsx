import { useEffect, useRef, useState } from 'react'
import { Head } from 'vite-react-ssg'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Products from './components/Products'
import Process from './components/Process'
import Materials from './components/Materials'
import Gallery from './components/Gallery'
import CtaSection from './components/CtaSection'
import Cursor from './components/Cursor'
import { copy, type Lang } from './copy'

gsap.registerPlugin(ScrollTrigger)

/**
 * Kaikki tila asuu täällä (arkkitehtuuri: state root'ta):
 *  - lang: FI/EN-kielivalinta
 *  - reducedMotion: prefers-reduced-motion -media query
 *  - scrolled: nav saa taustan kun sivua on vieritetty
 * Täällä myös sivun laajuiset efektit: Lenis (smooth scroll ikkunassa)
 * ja GSAP ScrollTrigger -paljastukset [data-fade]-elementeille.
 */
export default function App() {
  const [lang, setLang] = useState<Lang>('fi')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // <html lang="..."> pysyy synkassa ruudunlukijoita varten
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Nav-tausta + lukupalkki scrollatessa (Lenis animoi natiivia scrollia,
  // joten tavallinen scroll-kuuntelija toimii). Palkki päivitetään suoraan
  // DOM:iin, ettei joka scroll-frame aiheuta re-renderiä.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        progressRef.current.style.transform = `scaleX(${p})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lenis smooth scroll + ScrollTrigger-synkka.
  // prefers-reduced-motion -tilassa jätetään natiivi scroll rauhaan.
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.1 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reducedMotion])

  // Tekstien fade-in scrollatessa. Kielivaihto ajaa efektin uudelleen,
  // jolloin näkyvän osion tekstit animoituvat heti takaisin.
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
        const dir = el.dataset.fade // 'up' | 'right'
        gsap.fromTo(
          el,
          { opacity: 0, x: dir === 'right' ? 56 : 0, y: dir === 'up' ? 28 : 0 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          },
        )
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [lang, reducedMotion])

  // Ankkurinavigaatio Lenisin kautta (nav on fixed -> offset)
  const scrollTo = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -64 })
    else target.scrollIntoView()
  }

  const c = copy[lang]

  return (
    <>
      <Head>
        <title>Pohjapaja — CNC-verstas · Helsinki</title>
        <meta
          name="description"
          content="Pohjapaja — CNC-verstas Helsingissä. Mittatilaustyönä koneistetut pienesineet: sormukset, kyltit, lasinaluset, avaimenperät ja prototyypit. Pohjatyöstä viimeistelyyn."
        />
        <link rel="canonical" href="https://pohjapaja.fi/" />
        <meta property="og:url" content="https://pohjapaja.fi/" />
        <meta property="og:title" content="Pohjapaja — CNC-verstas · Helsinki" />
        <meta
          property="og:description"
          content="Mittatilaustyönä koneistetut pienesineet: sormukset, kyltit, lasinaluset, avaimenperät ja prototyypit. Pohjatyöstä viimeistelyyn."
        />
      </Head>
      <Cursor reducedMotion={reducedMotion} />
      <div className="progress" aria-hidden="true">
        <div ref={progressRef} className="progress__bar" />
      </div>
      <Nav lang={lang} onLangChange={setLang} scrolled={scrolled} onNavigate={scrollTo} />
      <main>
        <Hero
          lang={lang}
          reducedMotion={reducedMotion}
          onPrimary={() => scrollTo('yhteys')}
          onSecondary={() => scrollTo('tuotteet')}
        />
        <Marquee items={c.marquee} reducedMotion={reducedMotion} />
        <Products lang={lang} onCta={() => scrollTo('yhteys')} />
        <Process lang={lang} reducedMotion={reducedMotion} />
        <Materials lang={lang} reducedMotion={reducedMotion} />
        <Gallery lang={lang} />
        <CtaSection lang={lang} />
      </main>
    </>
  )
}
