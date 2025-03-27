// Import statements must come first
import express from 'express';
import cors from 'cors';
import type { Request, Response, RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import { DocumentProcessor } from './src/utils/documentProcessor';
import path from 'path';
import fs from 'fs';

// Initialize environment variables
dotenv.config();

// Initialize path variables
const dataPath = path.join(process.cwd(), 'data');

// Log startup information
console.log("=================================================================");
console.log("SERVER STARTING - THIS SHOULD APPEAR IN RAILWAY LOGS");
console.log("=================================================================");

console.error('==== SERVER STARTUP ====');
console.error('Current working directory:', process.cwd());
console.error('Data directory path:', dataPath);

const app = express();

// Simple test endpoint - placed at the very top
app.get('/api-test-xyz', (req, res) => {
  res.send('API TEST WORKING');
});

// Request logger middleware - add this BEFORE other middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

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

// Simple GET test endpoint
app.get('/api/test', (req, res) => {
  console.log('GET /api/test received');
  res.json({ 
    message: 'GET test endpoint working', 
    method: 'GET',
    headers: req.headers
  });
});

// Simple POST test endpoint
app.post('/api/test', (req, res) => {
  console.log('POST /api/test received');
  console.log('Request body:', req.body);
  res.json({ 
    message: 'POST test endpoint working', 
    method: 'POST',
    body: req.body,
    headers: req.headers
  });
});

// Echo endpoint that returns info about the request
app.all('/api/echo', (req, res) => {
  console.log(`${req.method} /api/echo received`);
  res.json({
    message: 'Echo endpoint',
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: req.headers
  });
});

// Add diagnostic test endpoint
app.get('/api/diagnostic-test', (req, res) => {
  console.log('GET /api/diagnostic-test received');
  res.json({ 
    message: 'Diagnostic test endpoint working', 
    method: 'GET',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Define interface for article metadata
interface ArticleMetadata {
  title: string;
  description?: string;
  category?: string;
}

// UPDATED: Serve all articles as a list
app.get('/api/articles', (req, res) => {
  try {
    const articlesDir = path.join(process.cwd(), 'data', 'articles');
    
    // Verify directory exists
    if (!fs.existsSync(articlesDir)) {
      console.error(`Articles directory not found: ${articlesDir}`);
      res.status(404).json({ error: 'Articles directory not found' });
      return;
    }
    
    const files = fs.readdirSync(articlesDir);
    const articles = [];
    
    // Get MD files only (not metadata files)
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    for (const file of mdFiles) {
      const slug = file.replace('.md', '');
      const filePath = path.join(articlesDir, file);
      const metadataPath = path.join(articlesDir, `${slug}.metadata.json`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      
      let metadata: ArticleMetadata = { title: slug };
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent) as ArticleMetadata;
        } catch (err) {
          console.error(`Error parsing metadata for ${slug}:`, err);
        }
      }
      
      articles.push({
        id: slug,
        content,
        ...metadata
      });
    }
    
    console.log(`Sending ${articles.length} articles`);
    res.json(articles);
  } catch (error: unknown) {
    console.error('Error serving articles:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATED: Serve a specific article by ID
app.get('/api/articles/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching article with ID: ${id}`);
    
    const articlesDir = path.join(process.cwd(), 'data', 'articles');
    
    // Handle special case where the frontend sends id with ":1" suffix
    const slug = id.includes(':') ? id.split(':')[0] : id;
    
    const filePath = path.join(articlesDir, `${slug}.md`);
    const metadataPath = path.join(articlesDir, `${slug}.metadata.json`);
    
    console.log(`Looking for file at: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Article not found: ${filePath}`);
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    
    let metadata: ArticleMetadata = { title: slug };
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent) as ArticleMetadata;
      } catch (err) {
        console.error(`Error parsing metadata for ${slug}:`, err);
      }
    }
    
    res.json({
      id: slug,
      content,
      ...metadata
    });
  } catch (error: unknown) {
    console.error('Error serving article:', error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve article files
app.get('/articles/:slug.md', (req, res) => {
  try {
    const { slug } = req.params;
    const articlePath = path.join(process.cwd(), '..', 'data', 'articles', `${slug}.md`);
    const metadataPath = path.join(process.cwd(), '..', 'data', 'articles', `${slug}.metadata.json`);
    
    if (!fs.existsSync(articlePath)) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const content = fs.readFileSync(articlePath, 'utf-8');
    let metadata: ArticleMetadata = { title: slug };
    
    if (fs.existsSync(metadataPath)) {
      const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
      const parsedMetadata = JSON.parse(metadataContent) as ArticleMetadata;
      metadata = parsedMetadata;
    }

    res.type('text/markdown').send(content);
  } catch (error: unknown) {
    console.error('Error serving article:', error instanceof Error ? error.message : String(error));
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
    const metadata = JSON.parse(content) as ArticleMetadata;
    res.type('application/json').send(content);
  } catch (error: unknown) {
    console.error('Error serving article metadata:', error instanceof Error ? error.message : String(error));
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