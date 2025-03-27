import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

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
                Last updated: March 27, 2025
              </Text>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  1. ACCEPTANCE OF TERMS
                </Heading>
                <Text color={textColor}>
                  By accessing or using the Colorado Rental Assistant website, application, or services (collectively, the "Service"), you agree to be bound by these Terms. If you disagree with any part of the Terms, you do not have permission to access the Service.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  2. DESCRIPTION OF SERVICE
                </Heading>
                <Text color={textColor}>
                  Colorado Rental Assistant provides information about Colorado rental laws, including Colorado state statutes, knowledge base articles, and a search feature. The Service is intended solely for informational purposes.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  3. NOT LEGAL ADVICE
                </Heading>
                <Text color={textColor} fontWeight="bold" mb={4}>
                  IMPORTANT DISCLAIMER: THE SERVICE DOES NOT PROVIDE LEGAL ADVICE.
                </Text>
                <Text color={textColor} mb={4}>
                  The information contained in or provided through the Service is intended for general informational purposes only and is not intended to be a substitute for professional legal advice, diagnosis, or treatment. The Service provides general information about Colorado rental laws, but this information:
                </Text>
                <Text color={textColor} ml={5} mb={2}>• Is not guaranteed to be accurate, complete, or up-to-date</Text>
                <Text color={textColor} ml={5} mb={2}>• Does not constitute legal advice</Text>
                <Text color={textColor} ml={5} mb={2}>• Does not create an attorney-client relationship</Text>
                <Text color={textColor} ml={5} mb={4}>• Should not be relied upon as a substitute for consulting with a qualified attorney</Text>
                <Text color={textColor}>
                  Users should always seek the advice of a qualified attorney with any questions they may have regarding their specific legal situation. Never disregard professional legal advice or delay in seeking it because of something you have read on this Service.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  4. LIMITATIONS OF LIABILITY
                </Heading>
                <Text color={textColor} mb={4}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, COLORADO RENTAL ASSISTANT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, AND ASSIGNS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </Text>
                <Text color={textColor} mb={2}>
                  a) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;
                </Text>
                <Text color={textColor} mb={2}>
                  b) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;
                </Text>
                <Text color={textColor} mb={2}>
                  c) ANY CONTENT OBTAINED FROM THE SERVICE; AND
                </Text>
                <Text color={textColor} mb={4}>
                  d) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </Text>
                <Text color={textColor} mb={4}>
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION EXCEED ONE HUNDRED DOLLARS ($100.00).
                </Text>
                <Text color={textColor}>
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  5. DISCLAIMER OF WARRANTIES
                </Heading>
                <Text color={textColor} mb={4}>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </Text>
                <Text color={textColor} mb={4}>
                  COLORADO RENTAL ASSISTANT DOES NOT WARRANT THAT:
                </Text>
                <Text color={textColor} mb={2}>
                  a) THE SERVICE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION;
                </Text>
                <Text color={textColor} mb={2}>
                  b) ANY ERRORS OR DEFECTS WILL BE CORRECTED;
                </Text>
                <Text color={textColor} mb={2}>
                  c) THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR
                </Text>
                <Text color={textColor}>
                  d) THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS OR BE ACCURATE, RELIABLE, COMPLETE, OR CURRENT.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  6. USER RESPONSIBILITIES
                </Heading>
                <Text color={textColor} mb={4}>
                  Users of the Service agree to:
                </Text>
                <Text color={textColor} mb={2}>
                  a) Use the Service only for lawful purposes and in accordance with these Terms.
                </Text>
                <Text color={textColor} mb={2}>
                  b) Independently verify any information obtained through the Service before relying on it for any decision-making purposes.
                </Text>
                <Text color={textColor} mb={2}>
                  c) Seek professional legal advice for specific legal questions or situations.
                </Text>
                <Text color={textColor} mb={2}>
                  d) Not use the Service to engage in any activity that may cause harm to others or damage to the Service.
                </Text>
                <Text color={textColor}>
                  e) Not attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  7. INTELLECTUAL PROPERTY
                </Heading>
                <Text color={textColor} mb={4}>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Colorado Rental Assistant and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                </Text>
                <Text color={textColor}>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without prior written consent.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  8. THIRD-PARTY LINKS
                </Heading>
                <Text color={textColor}>
                  The Service may contain links to third-party websites or services that are not owned or controlled by Colorado Rental Assistant. Colorado Rental Assistant has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Colorado Rental Assistant shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  9. TERMINATION
                </Heading>
                <Text color={textColor}>
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  10. GOVERNING LAW
                </Heading>
                <Text color={textColor}>
                  These Terms shall be governed and construed in accordance with the laws of the State of Colorado, without regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these Terms or your use of the Service shall be brought exclusively in the state or federal courts located in Colorado, and you consent to the personal jurisdiction of such courts.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  11. CHANGES TO TERMS
                </Heading>
                <Text color={textColor}>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  12. ENTIRE AGREEMENT
                </Heading>
                <Text color={textColor}>
                  These Terms constitute the entire agreement between you and Colorado Rental Assistant regarding the Service and supersede all prior and contemporaneous written or oral agreements between you and Colorado Rental Assistant.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" color="blue.700" mb={4}>
                  13. CONTACT US
                </Heading>
                <Text color={textColor} mb={4}>
                  If you have any questions about these Terms, please contact us at:
                </Text>
                <Text color={textColor} mb={2}>Colorado Rental Assistant</Text>
                <Text color={textColor}>contact@proplaws.com</Text>
              </Box>

              <Text color={textColor} fontStyle="italic" mt={4}>
                By using the Colorado Rental Assistant Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TermsOfService;