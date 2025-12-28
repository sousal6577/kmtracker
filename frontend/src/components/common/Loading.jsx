// src/components/common/Loading.jsx
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress size={40} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
