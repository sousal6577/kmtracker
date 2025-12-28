// src/components/ui/Logo.jsx - Logo Animado KMTracker
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Logo({ size = 'medium', showText = true, animate = true }) {
  const sizes = {
    small: { logo: 32, text: '1rem' },
    medium: { logo: 44, text: '1.25rem' },
    large: { logo: 64, text: '1.75rem' },
  };

  const { logo: logoSize, text: textSize } = sizes[size];

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(99, 102, 241, 0.3)',
        '0 0 40px rgba(99, 102, 241, 0.5)',
        '0 0 20px rgba(99, 102, 241, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      initial={animate ? 'initial' : false}
      animate="animate"
      whileHover="hover"
      variants={logoVariants}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
        }}
      >
        {/* Logo Icon */}
        <motion.div variants={animate ? glowVariants : {}}>
          <Box
            sx={{
              width: logoSize,
              height: logoSize,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 3s infinite',
              },
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' },
              },
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: logoSize * 0.45,
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              KM
            </Typography>
          </Box>
        </motion.div>

        {/* Logo Text */}
        {showText && (
          <Box>
            <Typography
              sx={{
                fontSize: textSize,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                lineHeight: 1,
              }}
            >
              KMTracker
            </Typography>
            <Typography
              sx={{
                fontSize: '0.65rem',
                color: 'text.secondary',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                mt: 0.2,
              }}
            >
              Rastreamento
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
