import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  VStack,
  Link,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getArticleBySlug, getArticles } from "../utils/articleLoader";
import { Article, ArticleMetadata } from "../types/article";

// You'll need to install a markdown parser like react-markdown
// npm install react-markdown

// Function to extract headings from markdown content
const extractHeadings = (content: string): {id: string, text: string}[] => {
  const headings: {id: string, text: string}[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^## (.*)$/);
    if (match) {
      const text = match[1];
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      headings.push({ id, text });
    }
  }
  
  return headings;
};

interface ArticleViewProps {
  slug: string;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ slug, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{id: string, text: string}[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<ArticleMetadata[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleData = await getArticleBySlug(slug);
        if (articleData) {
          setArticle(articleData);
          setHeadings(extractHeadings(articleData.content));
          
          // Get related articles from the same category
          const allArticles = getArticles();
          const categoryArticles = allArticles.filter(
            a => a.category === articleData.category
          );
          setRelatedArticles(categoryArticles);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Failed to load article");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Enhanced markdown rendering function
  const renderMarkdown = (content: string) => {
    // Replace headers with anchored headers
    let html = content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, (_: string, p1: string) => {
        const id = p1.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        return `<h2 id="${id}">${p1}</h2>`;
      })
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Replace lists
      .replace(/^\s*\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\s*\• (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<\/li>\n/g, '</li></ul>\n')
      .replace(/\n<li>/g, '\n<ul><li>')
      // Replace paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Basic link support
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
      
    // Wrap in a paragraph if needed
    if (!html.startsWith('<')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('>')) {
      html += '</p>';
    }

    return html;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading article...</Text>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={4}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        separator={<ChevronRightIcon color="gray.500" />} 
        mb={4} 
        fontSize="sm" 
        color="gray.500"
      >
        <BreadcrumbItem>
          <BreadcrumbLink onClick={onBack}>Knowledge Base</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{article.category}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{article.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Grid 
        templateColumns={{ base: "1fr", md: "250px 1fr 250px" }}
        gap={8}
      >
        {/* Left Sidebar - Articles in this section */}
        <GridItem display={{ base: "none", md: "block" }}>
          <Box position="sticky" top="4">
            <Heading as="h3" size="md" mb={4}>
              Articles in this section
            </Heading>
            <VStack spacing={2} align="start">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  color={relatedArticle.slug === slug ? "blue.600" : "gray.700"}
                  fontWeight={relatedArticle.slug === slug ? "bold" : "normal"}
                  onClick={() => {
                    if (relatedArticle.slug !== slug) {
                      // Handle navigation to another article
                      onBack(); // First go back to list
                      // Small timeout to ensure state updates before going to new article
                      setTimeout(() => {
                        document.getElementById(relatedArticle.slug)?.click();
                      }, 0);
                    }
                  }}
                  _hover={{ color: "blue.600" }}
                >
                  {relatedArticle.title}
                </Link>
              ))}
            </VStack>
          </Box>
        </GridItem>

        {/* Main Content */}
        <GridItem>
          <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="md">
            <Button 
              leftIcon={<ChevronLeftIcon />} 
              variant="ghost" 
              mb={6} 
              onClick={onBack}
              display={{ base: "block", md: "none" }}
            >
              Back to Knowledge Base
            </Button>

            <Heading as="h1" size="xl" mb={2}>
              {article.title}
            </Heading>
            
            <Flex mb={8} flexWrap="wrap" fontSize="sm" color="gray.500">
              <Text mr={4}>Last updated: {article.lastUpdated}</Text>
            </Flex>

            <Box
              className="article-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
              sx={{
                'h1': { fontSize: '2xl', fontWeight: 'bold', mt: 6, mb: 4 },
                'h2': { fontSize: 'xl', fontWeight: 'bold', mt: 8, mb: 4, pt: 4, borderTop: '1px', borderTopColor: 'gray.200' },
                'h3': { fontSize: 'lg', fontWeight: 'bold', mt: 4, mb: 2 },
                'p': { mb: 4, lineHeight: 1.7 },
                'ul': { mb: 6, ml: 6 },
                'li': { mb: 2, lineHeight: 1.7 },
                'a': { color: 'blue.500', textDecoration: 'underline' }
              }}
            />
          </Box>
        </GridItem>

        {/* Right Sidebar - In this article */}
        <GridItem display={{ base: "none", md: "block" }}>
          {headings.length > 0 && (
            <Box position="sticky" top="4">
              <Card variant="outline">
                <CardBody>
                  <Heading as="h3" size="md" mb={4}>
                    In this article
                  </Heading>
                  <VStack spacing={2} align="start">
                    {headings.map((heading) => (
                      <Link
                        key={heading.id}
                        href={`#${heading.id}`}
                        color="gray.700"
                        _hover={{ color: "blue.600" }}
                        fontSize="sm"
                      >
                        {heading.text}
                      </Link>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ArticleView; 