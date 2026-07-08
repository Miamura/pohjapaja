interface MarqueeProps {
  items: string[]
  reducedMotion: boolean
}

/**
 * Loputon mono-tekstinauha osioiden välissä. Sama rivi kahdesti
 * peräkkäin, CSS-animaatio siirtää raidetta -50 % -> saumaton silmukka.
 */
export default function Marquee({ items, reducedMotion }: MarqueeProps) {
  const row = items.map((item) => `${item} · `).join('')

  return (
    <div className="marquee" aria-hidden="true">
      <div className={`marquee__track${reducedMotion ? ' is-static' : ''}`}>
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  )
}
