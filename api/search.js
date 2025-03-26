export default function handler(req, res) {
  // Log the request method and headers
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  
  // Handle OPTIONS requests directly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // For actual requests, proxy to Railway
  if (req.method === 'POST') {
    // Forward the request to your Railway backend
    fetch('https://colorado-rental-assistant-ui-production.up.railway.app/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })
    .then(response => response.json())
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error proxying to Railway:', error);
      res.status(500).json({ error: 'Failed to proxy request' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 