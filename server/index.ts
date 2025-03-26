console.error('==== SERVER STARTUP ====');
console.error('Current working directory:', process.cwd());
console.error('Data directory path:', path.join(process.cwd(), 'data'));
console.error('Alternative data path:', path.join(process.cwd(), '..', 'data'));

import express from 'express';
import type { Request, Response, RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import { DocumentProcessor } from './src/utils/documentProcessor';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();


// Add this debugging middleware before your other middleware
app.use((req, res, next) => {
  console.log('Incoming request:');
  console.log(`  Path: ${req.path}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  Origin: ${req.headers.origin}`);
  console.log(`  Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Simple, direct CORS middleware at the top of your middleware chain
app.use((req, res, next) => {
  // Log request details
  console.log('Processing request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin
  });

  // Set CORS headers directly
  const allowedOrigin = 'https://colorado-rental-assistant-ui.vercel.app';
  
  // Set the origin
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  
  // Set other CORS headers
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return res.status(204).end();
  }
  
  next();
});
// Body parser middleware
app.use(express.json());

const documentProcessor = new DocumentProcessor();

// Add error logging middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Serve article files
app.get('/articles/:slug.md', (req, res) => {
  try {
    const { slug } = req.params;
    const articlePath = path.join(process.cwd(), '..', 'data', 'articles', `${slug}.md`);
    
    if (!fs.existsSync(articlePath)) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const content = fs.readFileSync(articlePath, 'utf-8');
    res.type('text/markdown').send(content);
  } catch (error) {
    console.error('Error serving article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve article metadata
app.get('/articles/:slug.metadata.json', (req, res) => {
  try {
    const { slug } = req.params;
    const metadataPath = path.join(process.cwd(), '..', 'data', 'articles', `${slug}.metadata.json`);
    
    if (!fs.existsSync(metadataPath)) {
      res.status(404).json({ error: 'Article metadata not found' });
      return;
    }

    const content = fs.readFileSync(metadataPath, 'utf-8');
    res.type('application/json').send(content);
  } catch (error) {
    console.error('Error serving article metadata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const searchHandler: RequestHandler = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const answer = await documentProcessor.searchAndGenerateAnswer(query);
    res.json({ answer });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

app.post('/api/search', searchHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
