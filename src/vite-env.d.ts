/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Workerin URL tarjouspyyntöjen vastaanottoon (POST). */
  readonly VITE_QUOTE_ENDPOINT?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
