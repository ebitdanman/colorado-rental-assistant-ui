import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

export class DocumentProcessor {
  private documents: { name: string; content: string }[] = [];
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    
    this.openai = new OpenAI({
      apiKey,
      baseURL: 'https://api.openai.com/v1'  // Using standard API endpoint for all keys
    });
    
    console.log('Using API endpoint:', this.openai.baseURL);
    this.loadDocuments();
  }

  private loadDocuments() {
    try {
      // Load .txt files from data directory
      const dataDir = path.join(process.cwd(), 'data');
      const files = fs.readdirSync(dataDir);
      
      for (const file of files) {
        if (file.endsWith('.txt')) {
          const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
          this.documents.push({ name: file, content });
          console.log(`Loaded document: ${file}`);
        }
      }

      // Load .md files from data/articles directory
      const articlesDir = path.join(dataDir, 'articles');
      if (fs.existsSync(articlesDir)) {
        const articleFiles = fs.readdirSync(articlesDir);
        for (const file of articleFiles) {
          if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
            this.documents.push({ name: file, content });
            console.log(`Loaded article: ${file}`);
          }
        }
      }
      
      console.log(`Loaded ${this.documents.length} documents`);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  private extractKeyTerms(query: string): string[] {
    // Simple key term extraction - split by spaces and remove common words
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
  }

  private searchDocuments(query: string): { content: string; relevance: number }[] {
    const keyTerms = this.extractKeyTerms(query);
    const relevantDocs: { content: string; relevance: number }[] = [];

    for (const doc of this.documents) {
      const content = doc.content.toLowerCase();
      const matches = keyTerms.filter(term => content.includes(term));
      
      if (matches.length > 0) {
        // Calculate relevance score based on number of matches and document length
        const relevance = matches.length / Math.log(content.length);
        relevantDocs.push({ content: doc.content, relevance });
      }
    }

    // Sort by relevance and take top 5 most relevant documents
    return relevantDocs
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }

  private truncateContent(content: string, query: string, maxLength: number = 2000): string {
    // If content is shorter than maxLength, return as is
    if (content.length <= maxLength) return content;
    
    // Extract key terms from query
    const keyTerms = this.extractKeyTerms(query);
    
    // Find the position of the first occurrence of any key term
    let firstMatchPos = -1;
    for (const term of keyTerms) {
      const pos = content.toLowerCase().indexOf(term.toLowerCase());
      if (pos !== -1 && (firstMatchPos === -1 || pos < firstMatchPos)) {
        firstMatchPos = pos;
      }
    }
    
    // If no matches found, return the start of the document
    if (firstMatchPos === -1) {
      return content.substring(0, maxLength);
    }
    
    // Calculate the window around the match
    const windowSize = maxLength;
    const startPos = Math.max(0, firstMatchPos - windowSize / 2);
    const endPos = Math.min(content.length, startPos + windowSize);
    
    // Find the last complete sentence in the window
    let truncated = content.substring(startPos, endPos);
    const lastPeriod = truncated.lastIndexOf('.');
    
    if (lastPeriod > 0) {
      truncated = truncated.substring(0, lastPeriod + 1);
    }
    
    // If we're not at the start of the document, add ellipsis
    if (startPos > 0) {
      truncated = '...' + truncated;
    }
    
    // If we're not at the end of the document, add ellipsis
    if (endPos < content.length) {
      truncated = truncated + '...';
    }
    
    return truncated;
  }

  async searchAndGenerateAnswer(query: string): Promise<string> {
    const relevantDocs = this.searchDocuments(query);
    
    if (relevantDocs.length === 0) {
      return "I couldn't find any relevant information in the documents.";
    }

    // Truncate each document's content to stay within token limits
    const truncatedDocs = relevantDocs.map(doc => ({
      ...doc,
      content: this.truncateContent(doc.content, query)
    }));

    const context = truncatedDocs.map(doc => doc.content).join('\n\n');
    
    try {
      console.log('Making API request to:', this.openai.baseURL);
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions about Colorado rental regulations based on the provided documents. Always cite the specific statute or document you're referencing."
          },
          {
            role: "user",
            content: `Based on the following documents, please answer this question: ${query}\n\nRelevant documents:\n${context}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "I couldn't generate an answer.";
    } catch (error) {
      console.error('Error generating answer:', error);
      if (error instanceof Error) {
        return `I encountered an error while generating the answer: ${error.message}`;
      }
      return "I encountered an error while generating the answer.";
    }
  }
}
