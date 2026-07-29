import { ViteReactSSG } from 'vite-react-ssg'
import type { RouteRecord } from 'vite-react-ssg'
import './index.css'
import App from './App'
import MakeraPage from './pages/MakeraPage'

// vite-react-ssg router-tila: jokainen route prerenderoidaan omaksi
// static HTML:kseen (dist/index.html, dist/makera/index.html), joten
// jokaisella sivulla on oma sisältö + <Head>-meta hakuroboteille.
// Client hydratoi päälle. Selain-API:t (three.js, FileReader) elävät
// efekteissä / <ClientOnly>-kääreessä, joten ne eivät aja prerenderissä.
export const routes: RouteRecord[] = [
  { path: '/', element: <App /> },
  { path: '/makera', element: <MakeraPage /> },
]

export const createRoot = ViteReactSSG({ routes })
