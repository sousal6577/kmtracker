// src/components/ui/GlassCard.jsx - Card com efeito Glassmorphism
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  variant = 'default',
  hover = true,
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

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    hover: hover ? { 
      y: -4,
      boxShadow: glow 
        ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)'
        : '0 20px 40px rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      transition: { duration: 0.2 }
    } : {},
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={cardVariants}
    >
      <Box
        sx={{
          ...variants[variant],
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding,
          transition: 'all 0.3s ease',
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </motion.div>
  );
}
