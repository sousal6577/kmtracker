// src/components/common/Loading.jsx - Loading Moderno
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Logo } from '../ui';

export default function Loading({ message = 'Carregando...', fullScreen = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '400px',
        gap: 3,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
          zIndex: 9999,
        }),
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Logo size={60} />
      </motion.div>

      {/* Loading bar */}
      <Box
        sx={{
          width: 120,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
            borderRadius: 2,
          }}
        />
      </Box>

      <Typography
        color="text.secondary"
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
