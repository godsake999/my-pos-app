import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Input,
  Select,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useRouter } from 'next/router';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantityInCart: number;
};

const SalesPage = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const tableHeaderBackground = useColorModeValue("light.tableHeaderBackground", "dark.tableHeaderBackground");
  const tableHeaderText = useColorModeValue("light.tableHeaderText", "dark.tableHeaderText");
  const tableRowEvenBackground = useColorModeValue("light.tableRowEvenBackground", "dark.tableRowEvenBackground");
  const tableRowOddBackground = useColorModeValue("light.tableRowOddBackground", "dark.tableRowOddBackground");
  const tableRowText = useColorModeValue("light.tableRowText", "dark.tableRowText");
  const inputBackground = useColorModeValue("light.inputBackground", "dark.inputBackground");
  const inputBorder = useColorModeValue("light.inputBorder", "dark.inputBorder");
  const inputText = useColorModeValue("light.inputText", "dark.inputText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");
  const cardBackground = useColorModeValue("light.cardBackground", "dark.cardBackground");
  const cardText = useColorModeValue("light.cardText", "dark.cardText");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data); // Start with all products
    };

    fetchProducts();
  }, []);

  // Search and filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter === 'low-stock') {
      filtered = filtered.filter((product) => product.quantity < 10);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter((product) => product.quantity === 0);
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, stockFilter, categoryFilter, products]);

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantityInCart: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Adjust quantity in cart
  const adjustQuantity = (id: number, amount: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantityInCart: Math.max(item.quantityInCart + amount, 1) }
        : item
    );
    setCart(updatedCart);
  };

  // Complete sale
  const completeSale = async () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, total }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push({
        pathname: '/receipt',
        query: { cart: JSON.stringify(cart), total: data.total },
      });
      setCart([]); // Clear cart after sale
    } else {
      alert(data.message || 'Sale failed');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantityInCart, 0);

  return (
    <Box display="flex" gap={8} p={8} minH="100vh" bg={primaryBackground}>
      {/* Left side: Product list */}
      <Box flex="2" bg={secondaryBackground} p={4} borderRadius="lg" boxShadow="md">
  <Heading size="md" mb={4} color={primaryText}>
    Products
  </Heading>

  {/* Category Buttons */}
  <HStack spacing={4} mb={4}>
    <Button
      size="sm"
      bg={buttonBackground}
      color={buttonText}
      onClick={() => setCategoryFilter('')}
    >
      All
    </Button>
    {[...new Set(products.map((product) => product.category))].map((category) => (
      <Button
        key={category}
        size="sm"
        bg={buttonBackground}
        color={buttonText}
        onClick={() => setCategoryFilter(category)}
      >
        {category}
      </Button>
    ))}
  </HStack>

  {/* Search and Filter Controls */}
  <HStack spacing={4} mb={4}>
    <Input
      placeholder="Search by product name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      bg={inputBackground}
      borderColor={inputBorder}
      color={inputText}
    />
    <Select
      placeholder="Filter by stock"
      value={stockFilter}
      onChange={(e) => setStockFilter(e.target.value)}
      bg={inputBackground}
      borderColor={inputBorder}
      color={inputText}
    >
      <option value="">All Stock</option>
      <option value="low-stock">Low Stock (&lt; 10)</option>
      <option value="out-of-stock">Out of Stock</option>
    </Select>
  </HStack>

  <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
    {filteredProducts.map((product) => (
      <Card key={product.id} bg={cardBackground} p={4} borderRadius="lg" boxShadow="md">
        <CardBody>
          <VStack spacing={2} color={cardText}>
            <Text fontWeight="bold">{product.name}</Text>
            <Text>${product.price.toFixed(2)}</Text>
            <Text>Stock: {product.quantity}</Text>
            <Button
              bg={buttonBackground}
              color={buttonText}
              size="sm"
              isDisabled={product.quantity === 0}
              onClick={() => addToCart(product)}
            >
              {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </VStack>
        </CardBody>
      </Card>
    ))}
  </Grid>
</Box>

      {/* Right side: Cart */}
      <Box flex="1" bg={secondaryBackground} p={4} borderRadius="lg" boxShadow="md">
  <Heading size="md" mb={4} color={primaryText}>
    Cart
  </Heading>
  <Box overflowX="auto" borderRadius="lg" boxShadow="md" bg={secondaryBackground} p={4}>
    <Table>
      <Thead>
        <Tr>
          <Th color={tableHeaderText}>Product</Th>
          <Th color={tableHeaderText}>Quantity</Th>
          <Th color={tableHeaderText} isNumeric>Price</Th>
          <Th color={tableHeaderText} isNumeric>Subtotal</Th>
          <Th color={tableHeaderText}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {cart.map((item) => (
          <Tr key={item.id}>
            <Td>{item.name}</Td>
            <Td>
              <HStack>
                <IconButton
                  aria-label="Decrease quantity"
                  icon={<FaMinus />}
                  size="xs"
                  onClick={() => adjustQuantity(item.id, -1)}
                />
                <Text>{item.quantityInCart}</Text>
                <IconButton
                  aria-label="Increase quantity"
                  icon={<FaPlus />}
                  size="xs"
                  onClick={() => adjustQuantity(item.id, 1)}
                />
              </HStack>
            </Td>
            <Td isNumeric>${item.price.toFixed(2)}</Td>
            <Td isNumeric>${(item.price * item.quantityInCart).toFixed(2)}</Td>
            <Td>
              <Button
                colorScheme="red"
                size="xs"
                onClick={() => removeFromCart(item.id)} // Corrected the onClick handler
              >
                Remove
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
  {cart.length > 0 && (
    <VStack mt={4} spacing={4}>
      <Text fontSize="lg" fontWeight="bold" color={primaryText}>
        Total: ${total.toFixed(2)}
      </Text>
      <Button bg={buttonBackground} color={buttonText} w="full" onClick={completeSale}>
        Complete Sale
      </Button>
    </VStack>
  )}
</Box>
    </Box>
  );
};

export default SalesPage;
