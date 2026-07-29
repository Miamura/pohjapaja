/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function: POST /api/quote
// Vastaanottaa /makera-sivun tarjouspyynnön (alkuperäinen 3D-tiedosto +
// yhteystiedot), tallentaa tiedoston R2:een muuttamattomana ja lähettää
// verstaalle sähköposti-ilmoituksen (Resend) latauslinkillä + mitoilla.
//
// Sama origin kuin sivusto -> ei CORS-kikkoja, frontendin oletus /api/quote.
// Tiedostoa EI muuteta matkalla: verstas saa tismalleen asiakkaan tiedoston.

interface Env {
  QUOTE_BUCKET: R2Bucket
  RESEND_API_KEY: string
  QUOTE_TO: string // esim. myynti@pohjapaja.fi
  QUOTE_FROM: string // vahvistetusta domainista, esim. "Pohjapaja <no-reply@pohjapaja.fi>"
}

const MAX_BYTES = 60 * 1024 * 1024
const ALLOWED_EXT = ['.stl', '.step', '.stp']

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

/** Tiedostonimi URL- ja R2-turvalliseksi (latauslinkki toimii ilman enkoodausta). */
function safeName(name: string): string {
  const cleaned = name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')
  return cleaned.slice(-80) || 'model'
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) =>
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : '&quot;',
  )
}

async function sendEmail(
  env: Env,
  d: {
    name: string
    email: string
    material: string
    note: string
    dimensions: string
    volume: string
    triangles: string
    fileName: string
    sizeMb: string
    downloadUrl: string
  },
): Promise<void> {
  const rows: [string, string][] = [
    ['Nimi', d.name],
    ['Sähköposti', d.email],
    ['Materiaali', d.material || '—'],
    ['Mitat', d.dimensions || '—'],
    ['Tilavuus', d.volume ? `${d.volume} cm³` : '—'],
    ['Kolmiot', d.triangles || '—'],
    ['Tiedosto', `${d.fileName} (${d.sizeMb} MB)`],
  ]
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#565049">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:system-ui,sans-serif;color:#1a1815;max-width:560px">
      <h2 style="margin:0 0 12px">Uusi tarjouspyyntö (3D-malli)</h2>
      <table style="border-collapse:collapse;font-size:14px">${table}</table>
      ${d.note ? `<p style="margin:14px 0 4px;color:#565049">Lisätiedot:</p><p style="margin:0;white-space:pre-wrap">${esc(d.note)}</p>` : ''}
      <p style="margin:20px 0">
        <a href="${esc(d.downloadUrl)}" style="background:#b5821f;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Lataa alkuperäinen tiedosto</a>
      </p>
      <p style="font-size:12px;color:#8c9196">Tiedosto on tallennettu muuttamattomana. Linkki on henkilökohtainen — älä jaa eteenpäin.</p>
    </div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.QUOTE_FROM,
      to: [env.QUOTE_TO],
      reply_to: d.email,
      subject: `Tarjouspyyntö (3D) — ${d.name}`,
      html,
    }),
  })
  if (!res.ok) {
    throw new Error(`resend ${res.status} ${await res.text()}`)
  }
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx
  try {
    const form = await request.formData()
    const file = form.get('file')
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()

    if (!(file instanceof File)) return json({ error: 'no-file' }, 400)
    if (!name || !email) return json({ error: 'missing-fields' }, 400)
    if (file.size > MAX_BYTES) return json({ error: 'too-large' }, 413)
    const lower = file.name.toLowerCase()
    if (!ALLOWED_EXT.some((e) => lower.endsWith(e))) return json({ error: 'bad-type' }, 415)

    // Arvaamaton avain: pvm / uuid / turvallinen nimi
    const day = new Date().toISOString().slice(0, 10)
    const key = `${day}/${crypto.randomUUID()}/${safeName(file.name)}`

    await env.QUOTE_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    })

    const origin = new URL(request.url).origin
    const downloadUrl = `${origin}/api/file/${key}`

    await sendEmail(env, {
      name,
      email,
      material: String(form.get('material') ?? ''),
      note: String(form.get('note') ?? ''),
      dimensions: String(form.get('dimensions') ?? ''),
      volume: String(form.get('volume_cm3') ?? ''),
      triangles: String(form.get('triangles') ?? ''),
      fileName: file.name,
      sizeMb: (file.size / 1048576).toFixed(1),
      downloadUrl,
    })

    return json({ ok: true })
  } catch {
    return json({ error: 'server' }, 500)
  }
}
