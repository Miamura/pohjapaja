# Pohjapaja

CNC-verstas Helsinki — marka kılavuzuna göre inşa edilmiş "CNC-tech" tek sayfalık site.
**Pohjatyöstä viimeistelyyn.**

Marka referansları: `public/media/Pohjapaja Brand Foundations.dc.html` (Vaihe 01) ve
`public/media/Pohjapaja Web & Social.dc.html` (Vaihe 02 — web mockup).

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [Lenis](https://lenis.darkroom.engineering) (smooth scroll) + [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) (reveal, scrub, sayaçlar)
- [three](https://threejs.org) + @react-three/fiber + drei — hero'da CAM tarzı **3D toolpath simülasyonu** (yalnız çizgi/nokta, ışık ve dış asset yok)
- Fontlar: IBM Plex Sans Condensed (display) · IBM Plex Sans (gövde) · IBM Plex Mono (teknik)
- Deploy: Cloudflare Pages (single build, static)

## Mimari

Tüm state (`lang`, `reducedMotion`, `scrolled`) `src/App.tsx`'te; geri kalanı props alan subcomponent'ler. Lenis, `[data-fade]` reveal efekti ve anchor navigasyon da App seviyesinde.

```
src/App.tsx                    -> state root + Lenis + GSAP + anchor scroll + FI/EN
src/copy.ts                    -> tüm metinler iki dilli obje (FI brand book'tan)
src/components/icons.tsx       -> 6 kategori ikonu + PP monogram + Corners (köşe braketi)
src/components/Nav.tsx         -> wordmark + ankraj linkleri + FI/EN + tarjous-CTA
src/components/Hero.tsx        -> koyu HUD hero: koordinat ticker + satır reveal
src/components/ToolpathScene.tsx -> 3D cep spirali toolpath (kendini çizer)
src/components/Marquee.tsx     -> mono kategori şeridi
src/components/Products.tsx    -> "Mitä koneistamme" 6 kart (id: tuotteet)
src/components/Process.tsx     -> 4 vaihe + scrub toolpath SVG + video HUD (id: prosessi)
src/components/Materials.tsx   -> malzeme çipleri + sayaçlı spec'ler (id: materiaalit)
src/components/Gallery.tsx     -> "Työn jälki" foto braket çerçeveleri
src/components/CtaSection.tsx  -> form (yalnız UI, backend yok) + footer (id: yhteys)
src/components/Cursor.tsx      -> crosshair trailing reticle
public/media/                  -> fotoğraflar, videolar, marka dokümanları
design/                        -> ikon konsept dosyaları (build'e girmez)
```

Bölüm akışı: **Hero (koyu HUD + 3D toolpath)** → marquee → **Tuotteet** (açık, 6 kart) → **Prosessi** (koyu, 4 adım + videolar) → **Materiaalit** (sayaçlar: 0,02 mm · 200×200×100 mm · 18000 rpm) → **Työn jälki** (fotoğraflar) → **Yhteys** (form + footer).

Notlar:

- 3D sahne unlit çizgilerden ibaret: HDR/Environment yok, dış CDN isteği yok.
- `prefers-reduced-motion` açıkken: Lenis, GSAP reveal/scrub, sayaçlar, marquee, cursor, video autoplay ve toolpath animasyonu kapalı — yol tam çizili, içerik statik ve tamamen görünür.
- Messinki tek vurgu; koyu zeminlerde açık ton `#D6A94A` kullanılır (brand book kuralı).

## Komutlar

```sh
npm install      # bağımlılıklar
npm run dev      # geliştirme sunucusu (http://localhost:5173)
npm run build    # tsc + vite build -> dist/
npm run preview  # dist/'i lokalde önizle
```

## Deploy (Cloudflare Pages)

| Ayar             | Değer           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Ya da CLI ile:

```sh
npm run build
npx wrangler pages deploy dist --project-name=pohjapaja
```
