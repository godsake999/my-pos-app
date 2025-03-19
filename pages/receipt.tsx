import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const ReceiptPage = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const tableHeaderBackground = useColorModeValue("light.tableHeaderBackground", "dark.tableHeaderBackground");
  const tableHeaderText = useColorModeValue("light.tableHeaderText", "dark.tableHeaderText");
  const tableRowText = useColorModeValue("light.tableRowText", "dark.tableRowText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");

  const router = useRouter();
  const { cart, total } = router.query;

  const parsedCart = cart ? JSON.parse(cart as string) : [];

  return (
    <Box minH="100vh" bg={primaryBackground} display="flex" alignItems="center" justifyContent="center">
      <VStack bg={secondaryBackground} p={8} borderRadius="lg" boxShadow="lg" spacing={6} w="sm">
        <Heading size="lg" color={primaryText}>
          Receipt
        </Heading>

        <Table variant="simple" size="sm">
          <Thead bg={tableHeaderBackground}>
            <Tr>
              <Th color={tableHeaderText}>Item</Th>
              <Th color={tableHeaderText}>Qty</Th>
              <Th color={tableHeaderText}>Price</Th>
              <Th color={tableHeaderText}>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {parsedCart.map((item: { id: number; name: string; quantityInCart: number; price: number }) => (
              <Tr key={item.id}>
                <Td color={tableRowText}>{item.name}</Td>
                <Td color={tableRowText}>{item.quantityInCart}</Td>
                <Td color={tableRowText}>${item.price.toFixed(2)}</Td>
                <Td color={tableRowText}>${(item.quantityInCart * item.price).toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Text fontSize="lg" fontWeight="bold" color={primaryText}>
          Total: ${Number(total).toFixed(2)}
        </Text>

        <Button bg={buttonBackground} color={buttonText} w="full" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </VStack>
    </Box>
  );
};

export default ReceiptPage;