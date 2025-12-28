// src/components/ui/ConfirmDialog.jsx - Dialog de Confirmação Moderno
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, Delete, Close, CheckCircle, Info } from '@mui/icons-material';
import Button from './Button';

const variants = {
  warning: {
    icon: <Warning sx={{ fontSize: 32 }} />,
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.3)',
  },
  danger: {
    icon: <Delete sx={{ fontSize: 32 }} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  success: {
    icon: <CheckCircle sx={{ fontSize: 32 }} />,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  info: {
    icon: <Info sx={{ fontSize: 32 }} />,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.3)',
  },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false,
}) {
  const config = variants[variant] || variants.warning;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { duration: 0.2 },
            sx: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <DialogTitle sx={{ p: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3, pt: 0, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: config.color,
                }}
              >
                {config.icon}
              </Box>
            </motion.div>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant="contained"
              color={variant === 'danger' ? 'error' : variant === 'success' ? 'success' : 'primary'}
              onClick={onConfirm}
              fullWidth
              loading={loading}
            >
              {confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
