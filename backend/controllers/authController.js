const path = require('path');
const fs = require('fs');

const DEMO_TOKEN = 'demo-1234';

const validateToken = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  // Built-in portfolio demo mode (works without clients.json or Google Drive credentials)
  if (token.trim().toLowerCase() === DEMO_TOKEN) {
    return res.status(200).json({ clientName: 'Portfolio Demo Studio', isDemo: true });
  }

  const clientsPath = path.join(__dirname, '../clients.json');
  if (!fs.existsSync(clientsPath)) {
    console.error('Missing backend/clients.json. Copy clients.example.json to clients.json to configure client tokens.');
    return res.status(500).json({ error: 'Server configuration missing (clients.json). Use access code DEMO-1234 for demo mode.' });
  }
  const clients = JSON.parse(fs.readFileSync(clientsPath, 'utf-8'));

  const client = clients[token];
  if (!client) {
    return res.status(401).json({ error: 'Invalid access code.' });
  }

  return res.status(200).json({ clientName: client.name });
};

module.exports = { validateToken };
