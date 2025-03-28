import { useState, useEffect } from "react";
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
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";
import ArticlesSection from "./components/ArticlesSection";
import ArticleView from "./components/ArticleView";
import TermsOfService from "./pages/TermsOfService";
import { getArticles } from "./utils/articleLoader";
import { ArticleMetadata } from "./types/article";

function MainContent() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [articles, setArticles] = useState<ArticleMetadata[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
        toast({
          title: "Error",
          description: "Failed to load articles. Please refresh the page.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingArticles(false);
      }
    };

    loadArticles();
  }, [toast]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    setResult("");
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <Box bg="blue.600" py={12}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center" color="white" size="2xl">
              Colorado Rental Assistant
            </Heading>
            <Text textAlign="center" color="white" fontSize="xl">
              Ask questions about Colorado rental regulations and get accurate answers from Colorado state law.
            </Text>
            <Text textAlign="center" color="whiteAlpha.800" fontSize="sm">
              Powered by official statutes • Updated March 2025
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
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="e.g. Can I charge a non-refundable pet deposit?"
                      bg="white"
                      _hover={{ bg: "white" }}
                      _focus={{ bg: "white", borderColor: "blue.300" }}
                    />
                  </InputGroup>
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

      <Box flex="1">
        {result && (
          <Container maxW="container.xl" mt={8}>
            <Box p={6} borderWidth={1} borderRadius="lg" bg="white" boxShadow="sm" mb={8}>
              <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.700">Answer:</Text>
              <Text whiteSpace="pre-wrap">{result}</Text>
            </Box>
          </Container>
        )}

        {selectedArticle ? (
          <ArticleView slug={selectedArticle} onBack={handleBackToArticles} />
        ) : (
          <Container maxW="container.xl" py={10}>
            <ArticlesSection
              articles={articles}
              onArticleClick={handleArticleClick}
              isLoading={isLoadingArticles}
            />
          </Container>
        )}
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
        <Flex as="header" bg="blue.700" color="white" p={4} alignItems="center" boxShadow="sm">
          <Container maxW="container.xl" display="flex" alignItems="center">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Heading size="md" cursor="pointer">Colorado Rental Assistant</Heading>
            </Link>
            <Spacer />
          </Container>
        </Flex>

        <Routes>
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/" element={<MainContent />} />
        </Routes>

        <Box as="footer" bg="gray.100" py={8} mt="auto">
          <Container maxW="container.xl">
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center">
              <Box mb={{ base: 4, md: 0 }}>
                <Text fontSize="sm" color="gray.500">
                  © 2024 Colorado Rental Assistant. All rights reserved.
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: '<a href="https://www.flaticon.com/free-icons/buildings" title="buildings icons">Buildings icons created by Freepik - Flaticon</a>'
                    }}
                  />
                </Text>
              </Box>
              <HStack spacing={4}>
                <Link as={RouterLink} fontSize="sm" color="gray.500" to="/privacy">Privacy Policy</Link>
                <Link as={RouterLink} fontSize="sm" color="gray.500" to="/terms">Terms of Service</Link>
                <Link fontSize="sm" color="gray.500" href="mailto:dan@proplaws.com">Contact Us</Link>
              </HStack>
            </Flex>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
