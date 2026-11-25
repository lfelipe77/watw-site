// Cloudflare Pages Function: POST /api/lead
// Receives the landing-page form and forwards it to a Google Apps Script web app
// (env LEAD_WEBHOOK) that emails we@weautomatetheworld.com and logs a row in a Google Sheet.
// Env vars (Cloudflare Pages > Settings > Variables and secrets): LEAD_WEBHOOK, LEAD_TOKEN.
const FIELDS = ['nome','escritorio','whatsapp','email','tipo','carteira','obs','pagina','url','ref'];
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  if (d.site) return json({ ok: true }); // honeypot: bots fill the hidden field
  const lead = {};
  for (const k of FIELDS) lead[k] = String(d[k] ?? '').slice(0, k === 'obs' ? 1500 : 300).trim();
  if (!lead.nome || !lead.escritorio || (!lead.whatsapp && !lead.email)) return json({ ok: false, error: 'missing' }, 422);
  const origin = request.headers.get('origin') || '';
  if (origin && !/weautomatetheworld\.com$|\.pages\.dev$|localhost/.test(new URL(origin).hostname)) return json({ ok: false }, 403);
  if (!env.LEAD_WEBHOOK) return json({ ok: false, error: 'not_configured' }, 503);
  lead.token = env.LEAD_TOKEN || '';
  lead.pais = request.cf?.country || '';
  lead.quando = new Date().toISOString();
  try {
    const r = await fetch(env.LEAD_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead), redirect: 'follow' });
    const t = await r.text();
    return t.includes('ok') ? json({ ok: true }) : json({ ok: false, error: 'webhook' }, 502);
  } catch {
    return json({ ok: false, error: 'webhook_down' }, 502);
  }
}
export const onRequest = () => json({ ok: false }, 405);
