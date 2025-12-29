// src/components/ui/StatusBadge.jsx - Badge de Status
import { Chip } from '@mui/material';
import { CheckCircle, Warning, Error, Schedule, LocalShipping } from '@mui/icons-material';

const statusConfig = {
  PAGO: {
    color: 'success',
    icon: <CheckCircle sx={{ fontSize: 14 }} />,
    bg: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#10b981',
  },
  PENDENTE: {
    color: 'warning',
    icon: <Schedule sx={{ fontSize: 14 }} />,
    bg: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    textColor: '#f97316',
  },
  ATRASADO: {
    color: 'error',
    icon: <Warning sx={{ fontSize: 14 }} />,
    bg: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    textColor: '#ef4444',
  },
  ATIVO: {
    color: 'info',
    icon: <LocalShipping sx={{ fontSize: 14 }} />,
    bg: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    textColor: '#06b6d4',
  },
  INATIVO: {
    color: 'default',
    icon: <Error sx={{ fontSize: 14 }} />,
    bg: 'rgba(100, 116, 139, 0.15)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
    textColor: '#64748b',
  },
};

export default function StatusBadge({ status, size = 'small', pulse = false }) {
  const config = statusConfig[status?.toUpperCase()] || statusConfig.PENDENTE;

  return (
    <Chip
      icon={config.icon}
      label={status}
      size={size}
      sx={{
        background: config.bg,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        '& .MuiChip-icon': {
          color: config.textColor,
        },
        ...(pulse && {
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 },
          },
        }),
      }}
    />
  );
}
