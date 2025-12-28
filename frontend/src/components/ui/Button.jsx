// src/components/ui/Button.jsx - Botões Modernos
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'contained',
  color = 'primary',
  loading = false,
  icon,
  fullWidth = false,
  size = 'medium',
  ...props
}) {
  const sizes = {
    small: { py: 1, px: 2, fontSize: '0.85rem' },
    medium: { py: 1.5, px: 3, fontSize: '0.95rem' },
    large: { py: 2, px: 4, fontSize: '1rem' },
  };

  const getGradient = () => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    }
  };

  const getHoverGradient = () => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)';
      case 'success':
        return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      case 'error':
        return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)';
      default:
        return 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
    }
  };

  const getShadow = () => {
    switch (color) {
      case 'primary':
        return '0 4px 15px rgba(99, 102, 241, 0.4)';
      case 'secondary':
        return '0 4px 15px rgba(6, 182, 212, 0.4)';
      case 'success':
        return '0 4px 15px rgba(16, 185, 129, 0.4)';
      case 'error':
        return '0 4px 15px rgba(239, 68, 68, 0.4)';
      case 'warning':
        return '0 4px 15px rgba(249, 115, 22, 0.4)';
      default:
        return '0 4px 15px rgba(99, 102, 241, 0.4)';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <MuiButton
        variant={variant}
        fullWidth={fullWidth}
        disabled={loading || props.disabled}
        startIcon={!loading && icon}
        sx={{
          ...sizes[size],
          borderRadius: '12px',
          fontWeight: 600,
          textTransform: 'none',
          position: 'relative',
          overflow: 'hidden',
          ...(variant === 'contained' && {
            background: getGradient(),
            boxShadow: getShadow(),
            '&:hover': {
              background: getHoverGradient(),
              boxShadow: getShadow().replace('0.4', '0.6'),
            },
          }),
          ...(variant === 'outlined' && {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'text.primary',
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          }),
          ...(variant === 'text' && {
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'text.primary',
            },
          }),
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&.Mui-disabled': {
            opacity: 0.6,
          },
        }}
        {...props}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: 'inherit' }} />
        ) : (
          children
        )}
      </MuiButton>
    </motion.div>
  );
}
