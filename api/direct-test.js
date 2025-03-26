export default async function handler(req, res) {
  try {
    // Show what we're receiving
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Body:', req.body);

    // Make a direct fetch to Railway with detailed logging
    console.log('Starting direct test to Railway');
    
    const response = await fetch('https://colorado-rental-assistant-ui-production.up.railway.app/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://colorado-rental-assistant-ui.vercel.app',
        'Referer': 'https://colorado-rental-assistant-ui.vercel.app/'
      },
      body: JSON.stringify({ query: "This is a test query" })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()]));
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error response body:', text);
      return res.status(200).json({ 
        success: false, 
        railwayStatus: response.status,
        railwayResponse: text
      });
    }
    
    const data = await response.json();
    return res.status(200).json({ 
      success: true, 
      railwayStatus: response.status,
      railwayResponse: data
    });
  } catch (error) {
    console.error('Error in direct-test:', error);
    return res.status(200).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
} 