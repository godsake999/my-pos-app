import { useEffect, useState } from 'react';
import { Box, VStack, Button, Heading, Icon, Text, Avatar, Spacer, useColorMode, IconButton, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaBoxes, FaShoppingCart, FaHistory, FaSignOutAlt, FaUserPlus, FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import InventoryPage from './inventory';
import SalesPage from './sales';
import SalesHistoryPage from './sales-history';
import AddUserPage from './add-user';

const MotionBox = motion(Box);

const Dashboard = () => {
  const primaryBackground = useColorModeValue("light.primaryBackground", "dark.primaryBackground");
  const secondaryBackground = useColorModeValue("light.secondaryBackground", "dark.secondaryBackground");
  const primaryText = useColorModeValue("light.primaryText", "dark.primaryText");
  const buttonBackground = useColorModeValue("light.primaryButtonBackground", "dark.primaryButtonBackground");
  const buttonHoverBackground = useColorModeValue("light.secondaryButtonBackground", "dark.secondaryButtonBackground");
  const buttonText = useColorModeValue("light.primaryButtonText", "dark.primaryButtonText");

  const [activeTab, setActiveTab] = useState('sales'); // Default to sales for cashiers
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inventory':
        return user?.role === 'admin' ? <InventoryPage /> : <Text>Access Denied</Text>;
      case 'sales':
        return <SalesPage />;
      case 'sales-history':
        return <SalesHistoryPage />;
      case 'add-user':
        return user?.role === 'admin' ? <AddUserPage /> : <Text>Access Denied</Text>;
      default:
        return <SalesPage />;
    }
  };

  return (
    <Box display="flex" minH="100vh" bg={primaryBackground}>
      {/* Sidebar */}
      <MotionBox
        w="250px"
        bg={secondaryBackground}
        color={primaryText}
        p={6}
        display="flex"
        flexDirection="column"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        boxShadow="lg"
      >
        {/* User Profile */}
        {user && (
          <VStack spacing={3} align="center" mb={8}>
            <Avatar name={user.username} bg="accentText" color={buttonText} size="lg" />
            <Heading as="h4" size="md">{user.username}</Heading>
            <Text fontSize="sm" color="secondaryText">{user.role.toUpperCase()}</Text>
          </VStack>
        )}

        {/* Navigation */}
        <VStack spacing={4} align="stretch">
          {user?.role === 'admin' && (
            <Button
              leftIcon={<Icon as={FaBoxes} />}
              variant={activeTab === 'inventory' ? 'solid' : 'ghost'}
              onClick={() => handleTabChange('inventory')}
              w="full"
              fontSize="md"
              justifyContent="flex-start"
            >
              Inventory
            </Button>
          )}
          <Button
            leftIcon={<Icon as={FaShoppingCart} />}
            variant={activeTab === 'sales' ? 'solid' : 'ghost'}
            onClick={() => handleTabChange('sales')}
            w="full"
            fontSize="md"
            justifyContent="flex-start"
          >
            Sales
          </Button>
          <Button
            leftIcon={<Icon as={FaHistory} />}
            variant={activeTab === 'sales-history' ? 'solid' : 'ghost'}
            onClick={() => handleTabChange('sales-history')}
            w="full"
            fontSize="md"
            justifyContent="flex-start"
          >
            Sales History
          </Button>
          {user?.role === 'admin' && (
            <Button
              leftIcon={<Icon as={FaUserPlus} />}
              variant={activeTab === 'add-user' ? 'solid' : 'ghost'}
              onClick={() => handleTabChange('add-user')}
              w="full"
              fontSize="md"
              justifyContent="flex-start"
            >
              Users
            </Button>
          )}
        </VStack>

        <Spacer />
        
        {/* Dark Mode Toggle Button */}
        <Flex justify="center" align="center" mt={6}>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            size="lg"
            colorScheme="yellow"
          />
        </Flex>
        {/* Logout Button */}
        <Button 
          leftIcon={<Icon as={FaSignOutAlt} />} 
          colorScheme="red" 
          onClick={handleLogout} 
          w="full"
          mt={8}
        >
          Logout
        </Button>
      </MotionBox>

      {/* Content Area */}
      <MotionBox
        flex="1"
        p={8}
        key={activeTab}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderActiveTab()}
      </MotionBox>
    </Box>
  );
};

export default Dashboard;
