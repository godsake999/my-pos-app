import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

type Sale = {
  id: number;
  createdAt: string;
  total: number;
  items: string;
};

const SalesHistoryPage = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const tableHeaderBackground = useColorModeValue("light.tableHeaderBackground", "dark.tableHeaderBackground");
  const tableHeaderText = useColorModeValue("light.tableHeaderText", "dark.tableHeaderText");
  const tableRowEvenBackground = useColorModeValue("light.tableRowEvenBackground", "dark.tableRowEvenBackground");
  const tableRowOddBackground = useColorModeValue("light.tableRowOddBackground", "dark.tableRowOddBackground");
  const tableRowText = useColorModeValue("light.tableRowText", "dark.tableRowText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");

  const [sales, setSales] = useState<Sale[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data);
    };

    fetchSales();
  }, []);

  const viewSaleDetails = (sale: Sale) => {
    router.push({
      pathname: '/receipt',
      query: { cart: sale.items, total: sale.total },
    });
  };

  return (
    <Box minH="100vh" bg={primaryBackground} p={8}>
      <Heading size="lg" textAlign="center" mb={8} color={primaryText}>
        Sales History
      </Heading>

      <VStack spacing={4} align="center">
        <Box overflowX="auto" borderRadius="lg" boxShadow="md" bg={secondaryBackground} p={4} w="80%">
          <Table variant="simple" size="md">
            <Thead bg={tableHeaderBackground}>
              <Tr>
                <Th color={tableHeaderText}>ID</Th>
                <Th color={tableHeaderText}>Date</Th>
                <Th color={tableHeaderText}>Total</Th>
                <Th color={tableHeaderText}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sales.map((sale) => (
                <Tr key={sale.id} bg={sale.id % 2 === 0 ? tableRowEvenBackground : tableRowOddBackground}>
                  <Td color={tableRowText}>{sale.id}</Td>
                  <Td color={tableRowText}>{new Date(sale.createdAt).toLocaleString()}</Td>
                  <Td color={tableRowText}>${sale.total.toFixed(2)}</Td>
                  <Td>
                    <Button bg={buttonBackground} color={buttonText} size="sm" onClick={() => viewSaleDetails(sale)}>
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};

export default SalesHistoryPage;
