import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" color="blue.700" textAlign="center">
            Terms of Service
          </Heading>
          
          <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="sm">
            <VStack spacing={6} align="stretch">
              <Text color={textColor}>
                Last updated: {new Date().toLocaleDateString()}
              </Text>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  1. Acceptance of Terms
                </Heading>
                <Text color={textColor}>
                  By accessing and using the Colorado Rental Assistant, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  2. Use of Service
                </Heading>
                <Text color={textColor}>
                  The Colorado Rental Assistant provides information about Colorado rental laws and regulations. While we strive to maintain accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of any information provided.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  3. Legal Disclaimer
                </Heading>
                <Text color={textColor}>
                  The information provided through this service is for general informational purposes only and should not be considered legal advice. We recommend consulting with a qualified attorney for specific legal advice regarding your situation.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  4. Intellectual Property
                </Heading>
                <Text color={textColor}>
                  All content, including but not limited to text, graphics, logos, and software, is the property of Colorado Rental Assistant and is protected by intellectual property laws.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  5. Limitation of Liability
                </Heading>
                <Text color={textColor}>
                  Colorado Rental Assistant shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  6. Changes to Terms
                </Heading>
                <Text color={textColor}>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  7. Contact Information
                </Heading>
                <Text color={textColor}>
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <Link as={RouterLink} to="/contact" color="blue.500">
                    Contact Us
                  </Link>
                  .
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsOfService; 