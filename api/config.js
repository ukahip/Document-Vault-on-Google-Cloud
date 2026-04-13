// api/config.js
//
// FIX: The original CSRF check compared origin against host using .includes(),
// which fails in two common scenarios:
//
//   1. Same-origin requests from the browser often send NO Origin header at all
//      (navigations, non-CORS fetches). The original code allowed these through
//      only because `origin` was falsy — that logic was correct but fragile.
//
//   2. The real issue: `origin.includes(host)` compares something like
//      "https://document-vault-gcp.vercel.app" against "document-vault-gcp.vercel.app".
//      That works. But if Vercel's host header includes a port or a preview URL
//      (e.g. "document-vault-gcp-git-main.vercel.app"), the check breaks and
//      returns 403 — which silently breaks config loading and causes the
//      "Auth service unavailable — config not loaded" error in the frontend.
//
// The fix: allow any *.vercel.app origin (covers preview deployments) plus
// localhost for local dev. Tighten to an exact allowlist in production.

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN,                       // set in Vercel env vars: https://document-vault-gcp.vercel.app
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

export default function handler(req, res) {
  const origin = req.headers['origin'] || '';

  // Allow requests with no Origin (same-origin navigations, curl, Vercel preview)
  // Allow explicitly whitelisted origins
  const allowed =
    !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+(\.vercel\.app)$/.test(origin);   // covers all preview URLs

  if (!allowed) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Set CORS header so the browser accepts the response
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.status(200).json({
    gatewayUrl:     process.env.GATEWAY_URL      || '',
    identityApiKey: process.env.IDENTITY_API_KEY || '',
  });
}
