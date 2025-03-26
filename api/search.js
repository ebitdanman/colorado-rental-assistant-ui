export default async function handler(req, res) {
  // Handle OPTIONS requests directly
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // For actual requests, return a mock response
  if (req.method === 'POST') {
    // Parse the request body to get the query
    let requestBody;
    try {
      requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body: ' + error.message });
    }
    
    // Return a mock response
    return res.status(200).json({
      answer: `This is a mock response for the query: "${requestBody.query}". We're still working on connecting to the actual backend.`
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 