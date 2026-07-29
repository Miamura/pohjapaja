# /makera — 3D-mallin lataus, esikatselu ja tarjouspyyntö

Sivu `/makera`: asiakas vetää Fusion 360:sta (tai muusta CAD:sta) viedyn
**STL- tai STEP-tiedoston** selaimeen, näkee sen heti 3D:nä ja lähettää
**alkuperäisen tiedoston** tarjousta varten. Tiedostoa ei muuteta matkalla —
verstas saa täsmälleen asiakkaan tiedoston (ei virhemarginaalia).

## Osat

| Osa | Missä | Tarvitseeko setuppia |
|-----|-------|----------------------|
| Esikatselu (STL/STEP → 3D selaimessa) | `src/components/QuoteUploader.tsx`, `ModelViewer.tsx`, `src/lib/loadModel.ts` | Ei — toimii heti, kokonaan selaimessa |
| Lomake + lähetys | `QuoteUploader.tsx` → `POST /api/quote` | — |
| Backend: tallennus + ilmoitus | `functions/api/quote.ts`, `functions/api/file/[[path]].ts` | **Kyllä** (R2 + Resend, alla) |

Esikatselu tapahtuu **kokonaan asiakkaan selaimessa** — tiedosto ei lähde
mihinkään ennen kuin asiakas painaa “Lähetä tarjouspyyntö”. STEP-esikatselu
lataa `occt-import-js`-WASMin (~7,6 MB) vasta kun STEP-tiedosto tuodaan; STL
ei maksa siitä mitään.

## Backendin käyttöönotto (jotta tiedosto oikeasti saapuu)

Ilman tätä esikatselu toimii, mutta “Lähetä” näyttää virheen +
sähköposti-fallbackin. Vaiheet (kertaluontoinen):

1. **R2-ämpäri** (tiedoston tallennus):
   ```
   npx wrangler r2 bucket create pohjapaja-quotes
   ```
   Sidonta `QUOTE_BUCKET` on jo `wrangler.toml`:ssa.

2. **Resend** (sähposti-ilmoitus):
   - Luo tili osoitteessa resend.com ja **vahvista domain `pohjapaja.fi`**
     (DNS-tietueet Resendin ohjeen mukaan).
   - Luo API-avain ja aseta se salaisuudeksi (ei koodiin):
     ```
     npx wrangler pages secret put RESEND_API_KEY
     ```
   - Tarkista `wrangler.toml`:n `[vars]`: `QUOTE_TO` (mihin ilmoitus tulee) ja
     `QUOTE_FROM` (vahvistetusta domainista, esim. `no-reply@pohjapaja.fi`).

3. **Julkaisu Cloudflare Pagesiin** (functions/ lähtee automaattisesti mukaan):
   ```
   npm run build
   npx wrangler pages deploy dist
   ```
   Tai Git-integraatiolla: build-komento `npm run build`, output `dist`.
   Aseta R2-sidonta ja `RESEND_API_KEY` myös dashboardista, jos käytät
   Git-integraatiota (Pages > projekti > Settings).

## Paikallinen testaus

- **Pelkkä frontend** (esikatselu, ei lähetystä):
  ```
  npm run dev
  ```
  `/makera` toimii, mutta `/api/quote` ei ole käytössä → “Lähetä” näyttää
  virheen. Esikatselun testaamiseen tämä riittää.

- **Backend mukana** (koko ketju paikallisesti):
  ```
  npm run build
  npx wrangler pages dev dist
  ```
  Tarvitsee paikallisen `RESEND_API_KEY`:n (esim. `.dev.vars`-tiedostoon
  `RESEND_API_KEY=...`). R2 emuloidaan paikallisesti.

## Säädöt

- **Sallitut muodot / kokoraja:** `src/components/QuoteUploader.tsx`
  (`MAX_MB`) ja `functions/api/quote.ts` (`MAX_BYTES`, `ALLOWED_EXT`). Pidä
  nämä synkassa.
- **Endpoint:** oletus `/api/quote` (sama origin). Jos backend on eri
  originissa, aseta `VITE_QUOTE_ENDPOINT` build-aikana ja lisää CORS Functioniin.
- **Faz 2 -ideat:** DXF/SVG-esikatselu (2D-kaiverrus), latauksen edistymispalkki
  isoille tiedostoille, virustarkistus.
