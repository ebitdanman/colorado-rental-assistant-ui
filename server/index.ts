console.error('==== SERVER STARTUP ====');
console.error('Current working directory:', process.cwd());
console.error('Data directory path:', path.join(process.cwd(), 'data'));
console.error('Alternative data path:', path.join(process.cwd(), '..', 'data'));

import express from 'express';
import cors from 'cors';
import type { Request, Response, RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import { DocumentProcessor } from './src/utils/documentProcessor';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.error('Incoming request:');
  console.error(`  Path: ${req.path}`);
  console.error(`  Method: ${req.method}`);
  console.error(`  Origin: ${req.headers.origin}`);
  console.error(`  Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Use the cors package with specific configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow any origin that includes "colorado-rental-assistant-ui" 
    if (!origin || origin.includes("colorado-rental-assistant-ui")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true
}));

// Explicitly handle OPTIONS requests
app.options('*', cors());

// Body parser middleware
app.use(express.json());

const documentProcessor = new DocumentProcessor();

// Add error logging middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.error('Test endpoint called');
  res.json({ message: 'CORS test successful' });
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

// Define search endpoint
app.post('/api/search', searchHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.error(`Server running on port ${PORT}`);
  console.error(`Environment: ${process.env.NODE_ENV}`);
});