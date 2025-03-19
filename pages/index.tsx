import { Box, Heading, Input, Button, VStack, useColorModeValue, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const secondaryText = useColorModeValue("light.secondaryText", "dark.secondaryText");
  const inputBackground = useColorModeValue("light.inputBackground", "dark.inputBackground");
  const inputBorder = useColorModeValue("light.inputBorder", "dark.inputBorder");
  const inputText = useColorModeValue("light.inputText", "dark.inputText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={primaryBackground} p={4}>
      <Box
        bg={secondaryBackground}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w={{ base: 'full', sm: 'md' }}
        textAlign="center"
      >
        <Heading size="xl" color={primaryText} mb={6}>
          Welcome to Modern POS
        </Heading>
        <Text fontSize="md" color={secondaryText} mb={8}>
          Log in to continue to your dashboard.
        </Text>
        <form onSubmit={handleLogin}>
          <VStack spacing={6}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
              _focus={{ borderColor: useColorModeValue("light.accentText", "dark.accentText"), boxShadow: `0 0 0 1px ${useColorModeValue("light.accentText", "dark.accentText")}` }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              bg={inputBackground}
              borderColor={inputBorder}
              color={inputText}
              _focus={{ borderColor: useColorModeValue("light.accentText", "dark.accentText"), boxShadow: `0 0 0 1px ${useColorModeValue("light.accentText", "dark.accentText")}` }}
            />
            <Button type="submit" bg={buttonBackground} color={buttonText} w="full" _hover={{ bg: useColorModeValue("light.secondaryButtonBackground", "dark.secondaryButtonBackground"), color: useColorModeValue("dark.primaryText", "light.primaryText") }}>
              Login
            </Button>
          </VStack>
        </form>
        <Box mt={6} fontSize="sm" color={secondaryText}>
          New to POS System? <Button variant="link" colorScheme="accent" color={useColorModeValue("light.accentText", "dark.accentText")}>Sign up</Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginPage;
