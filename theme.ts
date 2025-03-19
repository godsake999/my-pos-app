import { extendTheme } from '@chakra-ui/react';

const lightTheme = {
  colors: {
    primaryBackground: '#f9f9f9', // Light gray background
    secondaryBackground: '#ffffff', // White secondary background
    tertiaryBackground: '#f0f0f0', // Slightly darker gray for tertiary elements
    primaryText: '#333333', // Dark gray primary text
    secondaryText: '#666666', // Medium gray secondary text
    accentText: '#007bff', // Blue accent color, more modern
    primaryButtonBackground: '#007bff', // Blue primary button
    primaryButtonText: '#ffffff', // White button text
    secondaryButtonBackground: '#ffc107', // Yellow-amber for secondary button
    secondaryButtonText: '#333333', // Dark text for secondary button
    tableHeaderBackground: '#e9ecef', // Light gray for table header
    tableHeaderText: '#333333', // Dark text for table header
    tableRowEvenBackground: '#ffffff', // White for even rows
    tableRowOddBackground: '#f9f9f9', // Light gray for odd rows
    tableRowText: '#333333', // Dark text for table rows
    inputBackground: '#ffffff', // White input background
    inputBorder: '#ced4da', // Light gray input border
    inputText: '#495057', // Darker gray input text
    cardBackground: '#ffffff', // White card background
    cardBorder: '#dee2e6', // Light gray card border
    cardText: '#333333', // Dark card text
    errorBackground: '#dc3545', // Bootstrap danger red
    errorText: '#ffffff', // White error text
  },
};

const darkTheme = {
  colors: {
    primaryBackground: '#1a202c', // Dark background from Chakra UI dark mode
    secondaryBackground: '#2d3748', // Slightly lighter dark background
    tertiaryBackground: '#4a5568', // Medium dark gray for tertiary elements
    primaryText: '#ffffff', // White primary text
    secondaryText: '#d2d2d2', // Light gray secondary text
    accentText: '#90cdf4', // Light blue accent, more modern
    primaryButtonBackground: '#90cdf4', // Light blue primary button
    primaryButtonText: '#2d3748', // Dark text for primary button
    secondaryButtonBackground: '#ffc107', // Yellow-amber for secondary button (consistent with light theme)
    secondaryButtonText: '#2d3748', // Dark text for secondary button
    tableHeaderBackground: '#4a5568', // Dark gray for table header
    tableHeaderText: '#ffffff', // White text for table header
    tableRowEvenBackground: '#2d3748', // Darker background for even rows
    tableRowOddBackground: '#374151', // Slightly lighter dark background for odd rows
    tableRowText: '#ffffff', // White text for table rows
    inputBackground: '#2d3748', // Dark input background
    inputBorder: '#718096', // Medium gray input border
    inputText: '#ffffff', // White input text
    cardBackground: '#374151', // Slightly lighter dark card background
    cardBorder: '#4a5568', // Medium dark gray card border
    cardText: '#ffffff', // White card text
    errorBackground: '#dc3545', // Bootstrap danger red (consistent with light theme)
    errorText: '#ffffff', // White error text
  },
};

const theme = extendTheme({
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === 'light' ? lightTheme.colors.primaryBackground : darkTheme.colors.primaryBackground,
        color: props.colorMode === 'light' ? lightTheme.colors.primaryText : darkTheme.colors.primaryText,
      },
    }),
  },
  colors: {
    light: lightTheme.colors,
    dark: darkTheme.colors,
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
      },
      variants: {
        solid: (props: { colorMode: 'light' | 'dark' }) => ({
          bg: props.colorMode === 'light' ? lightTheme.colors.primaryButtonBackground : darkTheme.colors.primaryButtonBackground,
          color: props.colorMode === 'light' ? lightTheme.colors.primaryButtonText : darkTheme.colors.primaryButtonText,
          _hover: {
            bg: props.colorMode === 'light' ? lightTheme.colors.secondaryButtonBackground : darkTheme.colors.secondaryButtonBackground,
          },
        }),
      },
    },
    Heading: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        color: props.colorMode === 'light' ? lightTheme.colors.primaryText : darkTheme.colors.primaryText,
      }),
    },
    Table: {
      variants: {
        striped: (props: { colorMode: 'light' | 'dark' }) => ({
          th: {
            bg: props.colorMode === 'light' ? lightTheme.colors.tableHeaderBackground : darkTheme.colors.tableHeaderBackground,
            color: props.colorMode === 'light' ? lightTheme.colors.tableHeaderText : darkTheme.colors.tableHeaderText,
          },
          tr: {
            _even: {
              bg: props.colorMode === 'light' ? lightTheme.colors.tableRowEvenBackground : darkTheme.colors.tableRowEvenBackground,
            },
            _odd: {
              bg: props.colorMode === 'light' ? lightTheme.colors.tableRowOddBackground : darkTheme.colors.tableRowOddBackground,
            },
            color: props.colorMode === 'light' ? lightTheme.colors.tableRowText : darkTheme.colors.tableRowText,
          },
        }),
      },
    },
    Input: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        field: {
          bg: props.colorMode === 'light' ? lightTheme.colors.inputBackground : darkTheme.colors.inputBackground,
          borderColor: props.colorMode === 'light' ? lightTheme.colors.inputBorder : darkTheme.colors.inputBorder,
          color: props.colorMode === 'light' ? lightTheme.colors.inputText : darkTheme.colors.inputText,
        },
      }),
    },
    Card: {
      baseStyle: (props: { colorMode: 'light' | 'dark' }) => ({
        bg: props.colorMode === 'light' ? lightTheme.colors.cardBackground : darkTheme.colors.cardBackground,
        borderColor: props.colorMode === 'light' ? lightTheme.colors.cardBorder : darkTheme.colors.cardBorder,
        color: props.colorMode === 'light' ? lightTheme.colors.cardText : darkTheme.colors.cardText,
      }),
    },
  },
});

export default theme;
