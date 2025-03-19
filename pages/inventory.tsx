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
  Input,
  VStack,
  HStack,
  Select,
  useDisclosure,
  useColorModeValue,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

const InventoryPage = () => {
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

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    };

    fetchProducts();
  }, []);

  // Search and filter in real-time
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (quantityFilter === 'low-stock') {
      filtered = filtered.filter((product) => product.quantity < 10); // Example threshold
    } else if (quantityFilter === 'out-of-stock') {
      filtered = filtered.filter((product) => product.quantity === 0);
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, quantityFilter, categoryFilter, products]);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    onOpen();
  };

  const openNewProductModal = () => {
    setEditingProduct({ name: '', price: 0, quantity: 0, category: '' });
  };

  const saveProduct = async () => {
    const method = editingProduct?.id ? 'PUT' : 'POST';

    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct),
    });

    const savedProduct = await res.json();

    if (method === 'POST') {
      setProducts([...products, savedProduct]);
    } else {
      setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
    }

    setEditingProduct(null);
    onClose();
  };

  const deleteProduct = async (id: number) => {
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <Box minH="100vh" bg={primaryBackground} p={8}>
      <Heading size="lg" textAlign="center" mb={8} color={primaryText}>
        Inventory Management
      </Heading>

      <Flex>
        {/* Left side: Product Table */}
        <Box flex="2" overflowX="auto" borderRadius="lg" boxShadow="md" bg={secondaryBackground} p={4} mr={4}>
          <HStack spacing={4} mb={4}>
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
              width="300px"
            />
            <Select
              placeholder="Filter by quantity"
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
              width="200px"
            >
              <option value="low-stock">Low Stock (&lt; 10)</option>
              <option value="out-of-stock">Out of Stock</option>
            </Select>
            <Select
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
              width="200px"
            >
              {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </HStack>

          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>ID</Th>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>Name</Th>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>Price</Th>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>Quantity</Th>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>Category</Th>
                <Th bg={tableHeaderBackground} color={tableHeaderText}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product, index) => (
                <Tr key={product.id} bg={index % 2 === 0 ? tableRowEvenBackground : tableRowOddBackground}>
                  <Td color={tableRowText}>{product.id}</Td>
                  <Td color={tableRowText}>{product.name}</Td>
                  <Td color={tableRowText}>${product.price.toFixed(2)}</Td>
                  <Td color={tableRowText}>{product.quantity}</Td>
                  <Td color={tableRowText}>{product.category}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(product)}>
                        Edit
                      </Button>
                      <Button colorScheme="red" size="sm" onClick={() => deleteProduct(product.id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Right side: Add New Product */}
        <Box flex="1" bg={secondaryBackground} p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4} color={primaryText}>
            Add New Product
          </Heading>
          <VStack spacing={4}>
            <Select
              placeholder="Category"
              value={editingProduct?.category || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
            >
              {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Product Name"
              value={editingProduct?.name || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
            />
            <Input
              type="number"
              placeholder="Price"
              value={editingProduct?.price?.toString() || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={editingProduct?.quantity?.toString() || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
            />
            <Button bg={buttonBackground} color={buttonText} onClick={saveProduct}>
              Add to Inventory
            </Button>
          </VStack>
        </Box>
      </Flex>

      {/* Edit Product Modal */}
      {editingProduct && editingProduct.id && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Select
                  placeholder="Category"
                  value={editingProduct.category || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  bg={inputBackground}
                  borderColor={inputBorder}
                  color={inputText}
                >
                  {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
                <Input
                  placeholder="Product Name"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  bg={inputBackground}
                  borderColor={inputBorder}
                  color={inputText}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={editingProduct.price?.toString() || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  bg={inputBackground}
                  borderColor={inputBorder}
                  color={inputText}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={editingProduct.quantity?.toString() || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                  bg={inputBackground}
                  borderColor={inputBorder}
                  color={inputText}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button bg={buttonBackground} color={buttonText} mr={3} onClick={saveProduct}>
                Save Changes
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default InventoryPage;