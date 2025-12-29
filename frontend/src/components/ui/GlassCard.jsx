// src/components/ui/GlassCard.jsx - Card com efeito Glassmorphism (Otimizado)
import { Box } from '@mui/material';

export default function GlassCard({ 
  children, 
  variant = 'default',
  hover = false,
  glow = false,
  padding = 3,
  ...props 
}) {
  const variants = {
    default: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    primary: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
    },
    success: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    warning: {
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%)',
      border: '1px solid rgba(249, 115, 22, 0.2)',
    },
    danger: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
  };

  return (
    <Box
      sx={{
        ...variants[variant],
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
