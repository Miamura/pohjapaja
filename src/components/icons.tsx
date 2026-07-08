import type { IconName } from '../copy'

/**
 * Kategoriaikonit suoraan brändikirjasta (06 · Kategoriaikonit):
 * 1,5 px stroke, 48 px viewBox, väri periytyy currentColorista.
 */
export function CategoryIcon({ name, size = 46 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'ring':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" />
          <circle cx="24" cy="24" r="9.5" />
        </svg>
      )
    case 'sign':
      return (
        <svg {...common} strokeLinecap="round">
          <rect x="8" y="14" width="32" height="22" rx="2" />
          <circle cx="14.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="33.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <line x1="14" y1="29" x2="34" y2="29" />
        </svg>
      )
    case 'coaster':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="5" />
          <circle cx="24" cy="24" r="11" />
          <circle cx="24" cy="24" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'keychain':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="7" />
          <rect x="22" y="23" width="17" height="17" rx="3.5" />
          <line x1="20.8" y1="20.8" x2="24.5" y2="24.5" />
          <circle cx="30.5" cy="31.5" r="1.6" />
        </svg>
      )
    case 'leather':
      return (
        <svg {...common}>
          <rect x="10" y="11" width="28" height="27" rx="4" strokeDasharray="3 2.6" />
          <circle cx="24" cy="18" r="2.4" />
        </svg>
      )
    case 'pcb':
      return (
        <svg {...common} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="12" width="30" height="24" rx="2" />
          <rect x="20" y="21" width="8" height="6" rx="1" />
          <path d="M16 18v3M16 21h-2.5M32 30v-3M32 27h2.5" />
          <circle cx="16" cy="18" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="32" cy="30" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )
  }
}

/** PP-monogrammi: neliökehys + messinkiset kulmamerkit (brändikirja 01 · Tunnus). */
export function PPMark({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  const frame = dark ? '#B5821F' : '#1A1815'
  const tick = dark ? '#D6A94A' : '#B5821F'
  const text = dark ? '#F4F1EA' : '#1A1815'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" stroke={frame} strokeWidth="1.5" />
      <path d="M6 10 V6 H10" stroke={tick} strokeWidth="1.5" />
      <path d="M38 42 H42 V38" stroke={tick} strokeWidth="1.5" />
      <text
        x="24"
        y="32.5"
        textAnchor="middle"
        fontFamily="'IBM Plex Sans Condensed', sans-serif"
        fontWeight="700"
        fontSize="23"
        letterSpacing="-1.4"
        fill={text}
      >
        PP
      </text>
    </svg>
  )
}

/**
 * Neljä kulmamerkkiä (kulmabracketit) — vanhempi tarvitsee position: relative.
 * Väri periytyy CSS-muuttujasta --corner-color.
 */
export function Corners() {
  return (
    <span className="corners" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}
