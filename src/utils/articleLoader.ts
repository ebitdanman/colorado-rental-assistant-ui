import { Article, ArticleMetadata } from '../types/article';

// Remove API_URL constant since we're using relative paths
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// In a real application, this would be dynamic using something like Vite's import.meta.glob
const articles: ArticleMetadata[] = [
  {
    id: "security-deposits",
    slug: "security-deposits",
    title: "Security Deposits in Colorado",
    description: "Understanding Colorado's laws regarding security deposits, including limits, handling, and return requirements.",
    category: "Money Matters",
    lastUpdated: "2024-03-25"
  },
  {
    id: "applicants-and-screening",
    slug: "applicants-and-screening",
    title: "Applications & Screening: What You Can and Can't Ask",
    description: "Learn about legal requirements for rental applications, screening criteria, and application fees in Colorado.",
    category: "Getting a Tenant",
    lastUpdated: "2024-03-25"
  },
  {
    id: "background-checks",
    slug: "background-checks",
    title: "Background Checks",
    description: "Guidelines for conducting legal and thorough tenant background checks in Colorado.",
    category: "Getting a Tenant",
    lastUpdated: "2024-03-25"
  },
  {
    id: "rental-agreements",
    slug: "rental-agreements",
    title: "Rental Agreements",
    description: "Information about Colorado rental agreements, required clauses, and best practices for landlords.",
    category: "Getting a Tenant",
    lastUpdated: "2024-03-25"
  }
];

export async function getArticles() {
  try {
    const response = await fetch(`/api/articles`);
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticle(slug: string) {
  try {
    const response = await fetch(`/api/articles/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
} 