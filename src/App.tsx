import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Flex,
  Link,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import ArticlesSection from "./components/ArticlesSection";
import ArticleView from "./components/ArticleView";
import { getArticles } from "./utils/articleLoader";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const toast = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        credentials: "include", // Add this for cookies/auth if needed
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setResult(data.answer);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleClick = (slug: string) => {
    setSelectedArticle(slug);
    // When viewing an article, clear any search results
    setResult("");
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      {/* Header */}
      <Flex 
        as="header" 
        bg="blue.700" 
        color="white" 
        p={4} 
        alignItems="center" 
        boxShadow="sm"
      >
        <Container maxW="container.xl" display="flex" alignItems="center">
          <Link href="/" _hover={{ textDecoration: 'none' }}>
            <Heading size="md" cursor="pointer">Colorado Rental Assistant</Heading>
          </Link>
          <Spacer />
        </Container>
      </Flex>

      {/* Hero section with search - only show on homepage */}
      {!selectedArticle && (
        <Box bg="blue.600" py={12}>
          <Container maxW="container.xl">
            <VStack spacing={8} align="stretch">
              <Heading textAlign="center" color="white" size="2xl">
                Colorado Rental Assistant
              </Heading>
              <Text textAlign="center" color="white" fontSize="xl">
                Ask questions about Colorado rental regulations and get accurate answers from Colorado state law.
              </Text>
              <Box 
                as="form" 
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.querySelector("input") as HTMLInputElement;
                  if (input.value.trim()) {
                    handleSearch(input.value);
                  }
                }}
                width="100%"
                maxW="800px"
                mx="auto"
              >
                <VStack spacing={4}>
                  <FormControl>
                    <Input
                      placeholder="Ask a question about Colorado rental regulations..."
                      size="lg"
                      bg="white"
                      _hover={{ bg: "white" }}
                      _focus={{ bg: "white", borderColor: "blue.300" }}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Searching..."
                    size="lg"
                    width="200px"
                    bg="blue.500"
                    _hover={{ bg: "blue.600" }}
                  >
                    Search
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>
      )}

      {/* Main Content */}
      <Box flex="1">
        {/* Search Results */}
        {result && (
          <Container maxW="container.xl" mt={8}>
            <Box 
              p={6} 
              borderWidth={1} 
              borderRadius="lg" 
              bg="white" 
              boxShadow="sm" 
              mb={8}
            >
              <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.700">Answer:</Text>
              <Text whiteSpace="pre-wrap">{result}</Text>
            </Box>
          </Container>
        )}

        {/* Article Content or Articles List */}
        {selectedArticle ? (
          <ArticleView 
            slug={selectedArticle} 
            onBack={handleBackToArticles} 
          />
        ) : (
          <Container maxW="container.xl" py={10}>
            <ArticlesSection 
              articles={getArticles()} 
              onArticleClick={handleArticleClick} 
            />
          </Container>
        )}
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.100" py={8} mt="auto">
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
            <Box mb={{ base: 4, md: 0 }}>
              <Text fontSize="sm" color="gray.500">
                © 2024 Colorado Rental Assistant. All rights reserved.
              </Text>
            </Box>
            <HStack spacing={4}>
              <Link fontSize="sm" color="gray.500" href="#">Privacy Policy</Link>
              <Link fontSize="sm" color="gray.500" href="#">Terms of Service</Link>
              <Link fontSize="sm" color="gray.500" href="#">Contact Us</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default App;