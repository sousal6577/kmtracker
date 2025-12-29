// src/components/ui/LoadingOverlay.jsx - Overlay de carregamento
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingOverlay({ loading, message = 'Carregando...' }) {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <CircularProgress size={48} sx={{ color: '#6366f1' }} />
      {message && (
        <Typography sx={{ mt: 2, color: '#fff', fontSize: '0.9rem' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
