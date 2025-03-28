import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0f4fa",
      100: "#d9e2f3",
      200: "#b6cbea",
      300: "#8eaad9",
      400: "#6e8cc7",
      500: "#4a6eb0",
      600: "#3a558d",
      700: "#2a3d69",
      800: "#1a365d", // primary navy blue
      900: "#0c1a2d",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569", // secondary slate gray
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    accent: {
        50: "#faf5eb",
        100: "#f5e9d3",
        200: "#e9d4ae",
        300: "#d9bc85",
        400: "#c9a55e",
        500: "#b08d44", // soft, warm gold - more professional and subtle
        600: "#96773a",
        700: "#7d622f",
        800: "#644e26",
        900: "#4d3b1d",
      },
  },
  fonts: {
    heading: `'Georgia', serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: "brand.800",
          color: "white",
          _hover: { bg: "brand.700" },
        },
        secondary: {
          bg: "slate.600",
          color: "white",
          _hover: { bg: "slate.500" },
        },
        accent: {
          bg: "accent.500",
          color: "white",
          _hover: { bg: "accent.400" },
        },
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.600',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.700',
          },
        }),
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
        lineHeight: 'shorter',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "slate.300",
            _hover: {
              borderColor: "brand.300",
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          borderRadius: "md",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme;