export default function handler(req, res) {
  res.status(200).json({
    gatewayUrl: process.env.GATEWAY_URL || '',
  });
}
