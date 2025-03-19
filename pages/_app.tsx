import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import type { AppProps } from 'next/app';
import theme from '../theme'; // Import the custom theme

import '../styles/globals.css'; // Import global styles

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;