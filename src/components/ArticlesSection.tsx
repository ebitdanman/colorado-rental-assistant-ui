import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Center,
  Icon,
} from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";
import { ArticleMetadata } from '../types/article';

interface ArticlesSectionProps {
  articles: ArticleMetadata[];
  onArticleClick: (slug: string) => void;
  isLoading?: boolean;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles, onArticleClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // Group articles by category
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, ArticleMetadata[]>);

  return (
    <Box maxW="container.lg" mx="auto" mt={4}>
      <Heading as="h2" size="xl" mb={6}>
        Knowledge Base
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
          <Card key={category} variant="outline" borderRadius="lg" boxShadow="sm">
            <CardHeader pb={2}>
              <Heading size="md" mb={0} color="gray.700">
                {category}
              </Heading>
            </CardHeader>
            <CardBody pt={2}>
              <VStack spacing={5} align="stretch">
                {categoryArticles.map((article) => (
                  <Box
                    key={article.id}
                    id={article.slug}
                    onClick={() => onArticleClick(article.slug)}
                    _hover={{
                      cursor: 'pointer',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s',
                      bg: 'gray.50',
                      borderRadius: 'md',
                      px: 2,
                      py: 1
                    }}
                  >
                    <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={1} display="flex" alignItems="center">
                      <Icon as={FiFileText} boxSize={4} mr={2} /> {article.title}
                    </Text>
                    <Text color="gray.600" fontSize="sm">
                      {article.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ArticlesSection;
