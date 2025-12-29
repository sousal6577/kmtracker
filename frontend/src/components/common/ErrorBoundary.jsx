// src/components/common/ErrorBoundary.jsx - Captura erros de renderização
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
            color: 'white',
            p: 4,
            textAlign: 'center',
          }}
        >
          <ErrorOutline sx={{ fontSize: 80, color: '#ef4444', mb: 3 }} />
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Oops! Algo deu errado
          </Typography>
          
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 500 }}>
            Ocorreu um erro inesperado. Por favor, tente recarregar a página.
          </Typography>

          {this.state.error && (
            <Box
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 2,
                p: 2,
                mb: 4,
                maxWidth: 600,
                overflow: 'auto',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#f87171',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {'\n\nComponent Stack:'}
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleReload}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            Recarregar Página
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
