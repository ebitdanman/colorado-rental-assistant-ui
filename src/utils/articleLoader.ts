import { ArticleMetadata } from '../types/article';

export async function getArticles(): Promise<ArticleMetadata[]> {
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

export async function getArticleBySlug(slug: string) {
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