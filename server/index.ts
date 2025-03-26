console.log('Current working directory:', process.cwd());
console.log('Data directory path:', path.join(process.cwd(), 'data'));
console.log('Alternative data path:', path.join(process.cwd(), '..', 'data'));

import express from 'express';
import type { Request, Response, RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import { DocumentProcessor } from './src/utils/documentProcessor';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

dotenv.config();

const app = express();

// Define allowed origins with more comprehensive list
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);
    
    // List of allowed origins - include your Vercel frontend
    const allowedOrigins = [
      'https://colorado-rental-assistant-ui.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // When using credentials, we need to specify the exact origin (not '*')
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin rejected by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Add this debugging middleware before your other middleware
app.use((req, res, next) => {
  console.log('Incoming request:');
  console.log(`  Path: ${req.path}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  Origin: ${req.headers.origin}`);
  console.log(`  Headers: ${JSON.stringify(req.headers)}`);
  next();
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Preflight request handler
app.options('*', cors(corsOptions));

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
