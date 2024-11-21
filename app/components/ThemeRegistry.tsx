'use client'

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { ReactNode } from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/noto-sans-jp'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    grey: {
      100: '#F8F9FA',
      200: '#E9ECEF',
      300: '#DEE2E6',
    },
  },
  typography: {
    fontFamily: "'Noto Sans JP', 'Roboto', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(33, 33, 33, 0.9)',
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
