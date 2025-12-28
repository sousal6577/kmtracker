// src/components/ui/StatsCard.jsx - Card de Estatísticas Moderno
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  delay = 0,
}) {
  const colors = {
    primary: {
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      border: 'rgba(99, 102, 241, 0.2)',
    },
    success: {
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      border: 'rgba(16, 185, 129, 0.2)',
    },
    warning: {
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
      border: 'rgba(249, 115, 22, 0.2)',
    },
    error: {
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
      border: 'rgba(239, 68, 68, 0.2)',
    },
    info: {
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
      iconBg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      border: 'rgba(6, 182, 212, 0.2)',
    },
  };

  const colorConfig = colors[color] || colors.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Box
        sx={{
          background: colorConfig.gradient,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colorConfig.border}`,
          borderRadius: '20px',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
        }}
      >
        {/* Background Decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: colorConfig.iconBg,
            opacity: 0.1,
            filter: 'blur(30px)',
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {value}
              </Typography>
            </motion.div>

            {(subtitle || trend) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                {trend && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1,
                      py: 0.3,
                      borderRadius: '6px',
                      backgroundColor: trend === 'up' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : 'rgba(239, 68, 68, 0.15)',
                      color: trend === 'up' ? '#10b981' : '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                    {trendValue}
                  </Box>
                )}
                {subtitle && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Icon */}
          {icon && (
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: colorConfig.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                  color: 'white',
                }}
              >
                {icon}
              </Box>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
