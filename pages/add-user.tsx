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
  VStack,
  Button,
  Input,
  useColorModeValue,
  Flex,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  IconButton
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { User } from 'types/user'; // Assuming you have a User type defined

const AddUserPage = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const inputBackground = useColorModeValue("light.inputBackground", "dark.inputBackground");
  const inputBorder = useColorModeValue("light.inputBorder", "dark.inputBorder");
  const inputText = useColorModeValue("light.inputText", "dark.inputText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");
  const tableHeaderBackground = useColorModeValue("light.tableHeaderBackground", "dark.tableHeaderBackground");
  const tableHeaderText = useColorModeValue("light.tableHeaderText", "dark.tableHeaderText");
  const tableRowEvenBackground = useColorModeValue("light.tableRowEvenBackground", "dark.tableRowEvenBackground");
  const tableRowOddBackground = useColorModeValue("light.tableRowOddBackground", "dark.tableRowOddBackground");
  const tableRowText = useColorModeValue("light.tableRowText", "dark.tableRowText");
  const cardBackground = useColorModeValue("light.cardBackground", "dark.cardBackground");
  const cardBorder = useColorModeValue("light.cardBorder", "dark.cardBorder");
  const cardText = useColorModeValue("light.cardText", "dark.cardText");

  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (error: any) {
        console.error("Could not fetch users:", error);
        setMessage({ type: 'error', text: 'Failed to load users.' });
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    setMessage({ type: null, text: '' }); // Clear previous message
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const newUser = await res.json();
      setUsers([...users, newUser]);
      setUsername('');
      setPassword('');
      setRole('');
      setMessage({ type: 'success', text: 'User added successfully!' });
    } catch (error: any) {
      console.error("Error adding user:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to add user.' });
    }
  };

  const handleDeleteUser = async (id: number) => {
    setMessage({ type: null, text: '' }); // Clear previous message
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }

        setUsers(users.filter(user => user.id !== id));
        setMessage({ type: 'success', text: 'User deleted successfully!' });
      } catch (error: any) {
        console.error("Error deleting user:", error);
        setMessage({ type: 'error', text: error.message || 'Failed to delete user.' });
      }
    }
  };


  return (
    <Flex minH="100vh" bg={primaryBackground} p={8} align="center" justify="center">
      <Card w="90%" maxW="container.lg" bg={cardBackground} boxShadow="lg" borderRadius="md" overflow="hidden">
        <CardHeader bg={secondaryBackground}>
          <Heading size="lg" textAlign="center" color={primaryText}>
            Manage Users
          </Heading>
        </CardHeader>
        <CardBody p={6}>
          {message.type && (
            <Alert status={message.type} mb={4}>
              <AlertIcon />
              {message.text}
            </Alert>
          )}
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color={primaryText}>Username</FormLabel>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg={inputBackground}
                borderColor={inputBorder}
                color={inputText}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={primaryText}>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={inputBackground}
                borderColor={inputBorder}
                color={inputText}
              />
            </FormControl>
            <FormControl>
              <FormLabel color={primaryText}>Role</FormLabel>
              <Input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                bg={inputBackground}
                borderColor={inputBorder}
                color={inputText}
              />
            </FormControl>
            <Button bg={buttonBackground} color={buttonText} onClick={handleAddUser} w="full">
              Add User
            </Button>
          </VStack>

          <Box mt={8} overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead bg={tableHeaderBackground}>
                <Tr>
                  <Th color={tableHeaderText}>ID</Th>
                  <Th color={tableHeaderText}>Username</Th>
                  <Th color={tableHeaderText}>Role</Th>
                  <Th color={tableHeaderText} textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id} bg={user.id % 2 === 0 ? tableRowEvenBackground : tableRowOddBackground}>
                    <Td color={tableRowText}>{user.id}</Td>
                    <Td color={tableRowText}>{user.username}</Td>
                    <Td color={tableRowText}>{user.role}</Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Delete user"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default AddUserPage;
