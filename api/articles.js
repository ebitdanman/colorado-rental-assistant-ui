export default async function handler(req, res) {
  // Handle OPTIONS requests directly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // For GET requests, proxy to our Railway backend
  if (req.method === 'GET') {
    // Forward the request to your Railway backend
    try {
      const response = await fetch('https://lavish-caring-production.up.railway.app/api/articles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Railway API responded with status ${response.status}`);
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch articles: ' + error.message
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 