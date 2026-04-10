export default function handler(req, res) {
  // CSRF: only serve config to same-origin requests
  const origin = req.headers['origin'] || '';
  const host   = req.headers['host']   || '';
  if (origin && !origin.includes(host)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.status(200).json({
    gatewayUrl:     process.env.GATEWAY_URL       || '',
    identityApiKey: process.env.IDENTITY_API_KEY  || '',
  });
}
