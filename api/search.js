export default async function handler(req, res) {
  // Log additional information
  console.log('Handler started');
  console.log('Request method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  
  // Handle OPTIONS requests directly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log('Responding to OPTIONS request');
    return res.status(200).end();
  }
  
  // For actual requests, proxy to Railway
  if (req.method === 'POST') {
    console.log('Processing POST request');
    
    // Log the request body
    console.log('Raw request body:', req.body);
    
    // Parse the request body if it's a string
    let requestBody;
    try {
      requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return res.status(400).json({ error: 'Invalid request body: ' + error.message });
    }
    
    // Forward the request to your Railway backend
    try {
      console.log('Fetching from Railway API');
      const response = await fetch('https://colorado-rental-assistant-ui-production.up.railway.app/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Railway API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Railway API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Railway API response data:', data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error proxying to Railway:', error);
      return res.status(500).json({ 
        error: 'Failed to proxy request: ' + error.message,
        stack: error.stack
      });
    }
  } else {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 