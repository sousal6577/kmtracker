// src/components/ui/Modal.jsx - Modal Moderno com Glassmorphism
import { forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
  maxWidth = 'sm',
  fullScreenOnMobile = true,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          maxWidth={maxWidth}
          fullWidth
          fullScreen={fullScreenOnMobile && isMobile}
          PaperProps={{
            sx: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: isMobile ? 0 : '20px',
              overflow: 'hidden',
              maxHeight: isMobile ? '100%' : '90vh',
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
            },
          }}
        >
          {/* Header */}
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              p: 3,
              pb: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {icon && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8',
                    }}
                  >
                    {icon}
                  </Box>
                </motion.div>
              )}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mt: 0.5 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'text.primary',
                },
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          {/* Content */}
          <DialogContent
            sx={{
              p: 3,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderRadius: '3px',
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </DialogContent>

          {/* Actions */}
          {actions && (
            <DialogActions
              sx={{
                p: 3,
                pt: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                gap: 1.5,
              }}
            >
              {actions}
            </DialogActions>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
