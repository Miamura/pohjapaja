import { useEffect, useRef } from 'react'

/**
 * Kohdistusmerkki (crosshair), joka seuraa hiirtä pienellä viiveellä.
 * Vain osoitinlaitteille; prefers-reduced-motion poistaa kokonaan.
 * Natiivi kursori jää näkyviin — tämä on trailing-retikkeli, ei korvike.
 */
export default function Cursor({ reducedMotion }: { reducedMotion: boolean }) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const node = el.current
    if (!node) return

    let targetX = -100
    let targetY = -100
    let x = targetX
    let y = targetY
    let raf = 0

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      node.style.opacity = '1'
    }

    const tick = () => {
      x += (targetX - x) * 0.14
      y += (targetY - y) * 0.14
      node.style.transform = `translate(${x}px, ${y}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div ref={el} className="cursor" aria-hidden="true">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <line x1="17" y1="0" x2="17" y2="10" stroke="#B5821F" strokeWidth="1.5" />
        <line x1="17" y1="24" x2="17" y2="34" stroke="#B5821F" strokeWidth="1.5" />
        <line x1="0" y1="17" x2="10" y2="17" stroke="#B5821F" strokeWidth="1.5" />
        <line x1="24" y1="17" x2="34" y2="17" stroke="#B5821F" strokeWidth="1.5" />
        <circle cx="17" cy="17" r="5" stroke="#B5821F" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
