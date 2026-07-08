/**
 * Kaikki UI-tekstit kaksikielisenä (FI/EN).
 * FI-tekstit tulevat suoraan brändikirjasta (Brand Foundations / Web & Social).
 * Kieli valitaan App.tsx:n tilasta ja välitetään propseina alaspäin.
 */

export type Lang = 'fi' | 'en'

/** Myynnin yhteysosoite — tarjouspyynnöt ohjataan tänne. */
export const CONTACT_EMAIL = 'myynti@pohjapaja.fi'

export type IconName = 'ring' | 'sign' | 'coaster' | 'keychain' | 'leather' | 'pcb'

export interface ProductCopy {
  icon: IconName
  num: string
  title: string
  desc: string
  price: string
  dark?: boolean
}

export interface StepCopy {
  num: string
  title: string
  desc: string
}

export interface SpecCopy {
  target: number
  decimals: number
  suffix: string
  label: string
}

interface Copy {
  nav: {
    links: { id: string; label: string }[]
    cta: string
  }
  hero: {
    kicker: string
    titleLines: [string, string]
    tagline: string
    ctaPrimary: string
    ctaSecondary: string
    note: string
    status: string
  }
  marquee: string[]
  products: {
    heading: string
    count: string
    items: ProductCopy[]
    cardCta: string
  }
  process: {
    heading: string
    count: string
    steps: StepCopy[]
    clipCaptions: [string, string, string]
  }
  materials: {
    heading: string
    count: string
    chips: string[]
    specs: SpecCopy[]
    machine: string
  }
  gallery: {
    heading: string
    count: string
    captions: [string, string, string]
    alts: [string, string, string]
  }
  cta: {
    tag: string
    title: string
    body: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    subject: string
    sentTitle: string
    sentBody: string
    orWrite: string
    note: string
  }
  footer: {
    lockup: string
    company: string
  }
}

export const copy: Record<Lang, Copy> = {
  fi: {
    nav: {
      links: [
        { id: 'tuotteet', label: 'Tuotteet' },
        { id: 'prosessi', label: 'Prosessi' },
        { id: 'materiaalit', label: 'Materiaalit' },
        { id: 'yhteys', label: 'Yhteys' },
      ],
      cta: 'Pyydä tarjous',
    },
    hero: {
      kicker: 'CNC-verstas · Helsinki',
      titleLines: ['Digitaalisesta ideasta', 'tarkaksi esineeksi.'],
      tagline: 'Pohjatyöstä viimeistelyyn.',
      ctaPrimary: 'Pyydä tarjous',
      ctaSecondary: 'Katso tuotteet',
      note: 'Tilauksesta valmistettu · Toimitusaika ilmoitetaan tarjouksessa.',
      status: 'F1200 · S18000 · Z−2,0 mm',
    },
    marquee: [
      'Sormukset',
      'Kyltit',
      'Lasinaluset',
      'Avaimenperät',
      'Nahka & akryyli',
      'Piirilevyt',
      '0,02 mm tarkkuus',
      'Helsinki',
    ],
    products: {
      heading: 'Mitä koneistamme',
      count: '06 kategoriaa',
      items: [
        {
          icon: 'ring',
          num: '01',
          title: 'Sormukset',
          desc: 'Puu & metalli, mittasi mukaan.',
          price: 'materiaalin & koon mukaan',
        },
        {
          icon: 'sign',
          num: '02',
          title: 'Kyltit',
          desc: 'Nimi- ja logokyltit kaiverrettuna.',
          price: '+1 € / merkki',
        },
        {
          icon: 'coaster',
          num: '03',
          title: 'Lasinaluset',
          desc: 'Koneistettua kovapuuta.',
          price: 'sarjana tai yksittäin',
        },
        {
          icon: 'keychain',
          num: '04',
          title: 'Avaimenperät',
          desc: 'Henkilökohtainen kaiverrus.',
          price: '+1 € / merkki',
        },
        {
          icon: 'leather',
          num: '05',
          title: 'Nahka & akryyli',
          desc: 'Kaiverretut lahjat ja yksilöinnit.',
          price: '+1 € / merkki',
        },
        {
          icon: 'pcb',
          num: '06',
          title: 'Piirilevyt & prototyypit',
          desc: 'Makereille ja yrityksille.',
          price: 'tarjouksen mukaan',
          dark: true,
        },
      ],
      cardCta: 'Pyydä tarjous →',
    },
    process: {
      heading: 'Prosessi',
      count: '04 vaihetta',
      steps: [
        {
          num: '01',
          title: 'Suunnittelu',
          desc: 'Idea mallinnetaan ja työstöradat lasketaan CAM-ohjelmassa.',
        },
        {
          num: '02',
          title: 'Kiinnitys',
          desc: 'Aihio mitataan ja kiinnitetään pöytään — nollapiste 0,02 mm tarkkuudella.',
        },
        {
          num: '03',
          title: 'Jyrsintä',
          desc: 'Makera Z1 Pro ajaa radat: F1200 · S18000 · Z−2,0 mm.',
        },
        {
          num: '04',
          title: 'Viimeistely',
          desc: 'Hionta, öljyäminen ja tarkastus käsin. Vasta sitten se lähtee.',
        },
      ],
      clipCaptions: ['Ajo 01 — jyrsintä', 'Ajo 02 — kaiverrus', 'Ajo 03 — viimeistely'],
    },
    materials: {
      heading: 'Materiaalit',
      count: '07 materiaalia',
      chips: ['Messinki', 'Alumiini', 'Kupari', 'Tammi', 'Akryyli', 'Nahka', 'PCB'],
      specs: [
        { target: 0.02, decimals: 2, suffix: ' mm', label: 'Toistotarkkuus' },
        { target: 200, decimals: 0, suffix: ' × 200 × 100 mm', label: 'Työstöalue' },
        { target: 18000, decimals: 0, suffix: ' rpm', label: 'Karan nopeus' },
      ],
      machine: 'Makera Z1 Pro',
    },
    gallery: {
      heading: 'Työn jälki',
      count: '03 tilaustyötä',
      captions: [
        'Tilaustyö 01 — sormus',
        'Tilaustyö 02 — sormus',
        'Tilaustyö 03 — sormus',
      ],
      alts: [
        'Puusormus keraamisella lautasella auringonvalossa',
        'Valmis puusormus vaalealla taustalla',
        'Käsin viimeistelty puusormus pellavakankaalla',
      ],
    },
    cta: {
      tag: 'Yhteys',
      title: 'Pyydä tarjous',
      body: 'Kerro mitä tarvitset — palaamme yleensä vuorokauden sisällä.',
      nameLabel: 'Nimi',
      emailLabel: 'Sähköposti',
      messageLabel: 'Viesti',
      messagePlaceholder: 'Millaista esinettä ajattelit? Materiaali, koko, määrä…',
      submit: 'Lähetä',
      subject: 'Tarjouspyyntö',
      sentTitle: 'Melkein valmis!',
      sentBody:
        'Avasimme viestin sähköpostiohjelmaasi — lähetä se sieltä, niin se tulee perille. Jos ohjelma ei auennut, kirjoita suoraan osoitteeseen',
      orWrite: 'Tai kirjoita suoraan',
      note: 'Tilauksesta valmistettu · Toimitusaika ilmoitetaan tarjouksessa.',
    },
    footer: {
      lockup: 'CNC-verstas · Helsinki',
      company: 'Pohjakoodi (tmi) · © 2026 Pohjapaja',
    },
  },
  en: {
    nav: {
      links: [
        { id: 'tuotteet', label: 'Products' },
        { id: 'prosessi', label: 'Process' },
        { id: 'materiaalit', label: 'Materials' },
        { id: 'yhteys', label: 'Contact' },
      ],
      cta: 'Request a quote',
    },
    hero: {
      kicker: 'CNC workshop · Helsinki',
      titleLines: ['From a digital idea', 'to a precise object.'],
      tagline: 'From groundwork to finish.',
      ctaPrimary: 'Request a quote',
      ctaSecondary: 'See products',
      note: 'Made to order · Lead time quoted per project.',
      status: 'F1200 · S18000 · Z−2.0 mm',
    },
    marquee: [
      'Rings',
      'Signs',
      'Coasters',
      'Keychains',
      'Leather & acrylic',
      'PCBs',
      '0.02 mm precision',
      'Helsinki',
    ],
    products: {
      heading: 'What we machine',
      count: '06 categories',
      items: [
        {
          icon: 'ring',
          num: '01',
          title: 'Rings',
          desc: 'Wood & metal, made to your size.',
          price: 'by material & size',
        },
        {
          icon: 'sign',
          num: '02',
          title: 'Signs',
          desc: 'Name and logo signs, engraved.',
          price: '+1 € / character',
        },
        {
          icon: 'coaster',
          num: '03',
          title: 'Coasters',
          desc: 'Machined hardwood.',
          price: 'as a set or single',
        },
        {
          icon: 'keychain',
          num: '04',
          title: 'Keychains',
          desc: 'Personal engraving.',
          price: '+1 € / character',
        },
        {
          icon: 'leather',
          num: '05',
          title: 'Leather & acrylic',
          desc: 'Engraved gifts and personalisation.',
          price: '+1 € / character',
        },
        {
          icon: 'pcb',
          num: '06',
          title: 'PCBs & prototypes',
          desc: 'For makers and companies.',
          price: 'by quote',
          dark: true,
        },
      ],
      cardCta: 'Request a quote →',
    },
    process: {
      heading: 'Process',
      count: '04 steps',
      steps: [
        {
          num: '01',
          title: 'Design',
          desc: 'The idea is modelled and toolpaths are computed in CAM.',
        },
        {
          num: '02',
          title: 'Fixturing',
          desc: 'The blank is measured and clamped — zero point set to 0.02 mm.',
        },
        {
          num: '03',
          title: 'Milling',
          desc: 'The Makera Z1 Pro runs the paths: F1200 · S18000 · Z−2.0 mm.',
        },
        {
          num: '04',
          title: 'Finishing',
          desc: 'Sanding, oiling and inspection by hand. Only then it ships.',
        },
      ],
      clipCaptions: ['Run 01 — milling', 'Run 02 — engraving', 'Run 03 — finishing'],
    },
    materials: {
      heading: 'Materials',
      count: '07 materials',
      chips: ['Brass', 'Aluminium', 'Copper', 'Oak', 'Acrylic', 'Leather', 'PCB'],
      specs: [
        { target: 0.02, decimals: 2, suffix: ' mm', label: 'Repeatability' },
        { target: 200, decimals: 0, suffix: ' × 200 × 100 mm', label: 'Work area' },
        { target: 18000, decimals: 0, suffix: ' rpm', label: 'Spindle speed' },
      ],
      machine: 'Makera Z1 Pro',
    },
    gallery: {
      heading: 'The finish',
      count: '03 commissions',
      captions: [
        'Commission 01 — ring',
        'Commission 02 — ring',
        'Commission 03 — ring',
      ],
      alts: [
        'Wooden ring on a ceramic dish in sunlight',
        'Finished wooden ring on a light background',
        'Hand-finished wooden ring on linen fabric',
      ],
    },
    cta: {
      tag: 'Contact',
      title: 'Request a quote',
      body: 'Tell us what you need — we usually reply within a day.',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      messagePlaceholder: 'What kind of object do you have in mind? Material, size, quantity…',
      submit: 'Send',
      subject: 'Quote request',
      sentTitle: 'Almost there!',
      sentBody:
        'We opened the message in your email client — send it from there and it will reach us. If nothing opened, write to us directly at',
      orWrite: 'Or write directly to',
      note: 'Made to order · Lead time quoted per project.',
    },
    footer: {
      lockup: 'CNC workshop · Helsinki',
      company: 'Pohjakoodi (tmi) · © 2026 Pohjapaja',
    },
  },
}
