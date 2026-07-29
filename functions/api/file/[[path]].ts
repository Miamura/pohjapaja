/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function: GET /api/file/<pvm>/<uuid>/<nimi>
// Palvelee R2:een tallennetun alkuperäisen tiedoston sähköpostin
// latauslinkkiä varten. Avain on arvaamaton (uuid), joten linkki toimii
// verstaalle mutta ei ole listattavissa/arvattavissa.

interface Env {
  QUOTE_BUCKET: R2Bucket
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const parts = ctx.params.path // catch-all: string[]
  const key = Array.isArray(parts) ? parts.join('/') : String(parts ?? '')
  if (!key) return new Response('Not found', { status: 404 })

  const obj = await ctx.env.QUOTE_BUCKET.get(key)
  if (!obj) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  const filename = key.split('/').pop() || 'model'
  headers.set('content-disposition', `attachment; filename="${filename}"`)
  headers.set('cache-control', 'private, no-store')
  return new Response(obj.body, { headers })
}
