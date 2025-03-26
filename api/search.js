export default async function handler(req, res) {
  // Log the request method
  console.log('Request method:', req.method);
  
  // Handle OPTIONS requests directly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // For actual requests, proxy to Railway
  if (req.method === 'POST') {
    // Parse the request body if it's a string
    let requestBody;
    try {
      requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return res.status(400).json({ error: 'Invalid request body' });
    }
    
    // Forward the request to your Railway backend
    try {
      const response = await fetch('https://colorado-rental-assistant-ui-production.up.railway.app/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`Railway API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error proxying to Railway:', error);
      return res.status(500).json({ error: 'Failed to proxy request: ' + error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 