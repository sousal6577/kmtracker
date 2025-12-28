// src/styles/theme.js - Tema MUI Moderno Dark
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#020617',
      paper: 'rgba(15, 23, 42, 0.8)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      disabled: '#64748b',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.3)',
    '0 2px 4px rgba(0, 0, 0, 0.3)',
    '0 4px 8px rgba(0, 0, 0, 0.3)',
    '0 6px 12px rgba(0, 0, 0, 0.3)',
    '0 8px 16px rgba(0, 0, 0, 0.3)',
    '0 10px 20px rgba(0, 0, 0, 0.4)',
    '0 12px 24px rgba(0, 0, 0, 0.4)',
    '0 14px 28px rgba(0, 0, 0, 0.4)',
    '0 16px 32px rgba(0, 0, 0, 0.4)',
    '0 18px 36px rgba(0, 0, 0, 0.4)',
    '0 20px 40px rgba(0, 0, 0, 0.4)',
    '0 22px 44px rgba(0, 0, 0, 0.4)',
    '0 24px 48px rgba(0, 0, 0, 0.4)',
    '0 26px 52px rgba(0, 0, 0, 0.4)',
    '0 28px 56px rgba(0, 0, 0, 0.4)',
    '0 30px 60px rgba(0, 0, 0, 0.4)',
    '0 32px 64px rgba(0, 0, 0, 0.4)',
    '0 34px 68px rgba(0, 0, 0, 0.4)',
    '0 36px 72px rgba(0, 0, 0, 0.4)',
    '0 38px 76px rgba(0, 0, 0, 0.4)',
    '0 40px 80px rgba(0, 0, 0, 0.4)',
    '0 42px 84px rgba(0, 0, 0, 0.4)',
    '0 44px 88px rgba(0, 0, 0, 0.4)',
    '0 0 30px rgba(99, 102, 241, 0.3)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#6366f1 transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        filled: {
          '&.MuiChip-colorSuccess': {
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          },
          '&.MuiChip-colorWarning': {
            background: 'rgba(249, 115, 22, 0.15)',
            color: '#f97316',
            border: '1px solid rgba(249, 115, 22, 0.3)',
          },
          '&.MuiChip-colorError': {
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
          '&.MuiChip-colorInfo': {
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#06b6d4',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            color: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '8px 12px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          fontWeight: 600,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366f1',
          },
        },
      },
    },
  },
});

export default theme;
