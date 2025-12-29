// src/components/ui/Logo.jsx - Logo KMTracker
import { Box, Typography } from '@mui/material';

export default function Logo({ size = 'medium', showText = true }) {
  const sizes = {
    small: { logo: 32, text: '1rem' },
    medium: { logo: 44, text: '1.25rem' },
    large: { logo: 64, text: '1.75rem' },
    xlarge: { logo: 80, text: '2rem' },
  };

  // Aceita número direto ou string predefinida
  const sizeConfig = typeof size === 'number' 
    ? { logo: size, text: `${size * 0.025}rem` }
    : (sizes[size] || sizes.medium);
  
  const { logo: logoSize, text: textSize } = sizeConfig;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        '&:hover .logo-box': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {/* Logo Icon */}
      <Box
        className="logo-box"
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
          transition: 'transform 0.15s ease',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
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
  );
}
