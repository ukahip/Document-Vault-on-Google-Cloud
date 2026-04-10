export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    gatewayUrl: process.env.GATEWAY_URL || '',
    identityApiKey: process.env.IDENTITY_API_KEY || ''
  });
}
