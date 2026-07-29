import { ViteReactSSG } from 'vite-react-ssg/single-page'
import './index.css'
import App from './App'

// vite-react-ssg: build-time prerender.
//  - dev'issa (vite) toimii kuten ennenkin: client-render.
//  - build'issa (vite-react-ssg build) koko DOM maalataan valmiiksi HTML:ksi
//    dist/index.html:ään -> Products/Process/Materials/Gallery/CTA näkyvät
//    hakuroboteille ja LLM-crawlereille ilman JS:ää. Client hydratoi päälle.
// Selain-API:t (window/document/three.js) elävät efekteissä, joten ne eivät
// aja prerenderissä. Uuden sivun (esim. Makera) lisääntyessä siirrytään
// router-tilaan: ViteReactSSG({ routes }) ja yksi route-objekti lisää.
export const createRoot = ViteReactSSG(<App />)
