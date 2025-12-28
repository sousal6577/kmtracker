// src/components/ui/Input.jsx - Input Moderno com Glassmorphism
import { TextField, InputAdornment, Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function Input({
  label,
  icon,
  endIcon,
  error,
  helperText,
  fullWidth = true,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TextField
        label={label}
        fullWidth={fullWidth}
        error={error}
        helperText={helperText}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                {icon}
              </Box>
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                {endIcon}
              </Box>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'text.secondary',
            '&.Mui-focused': {
              color: '#6366f1',
            },
            '&.Mui-error': {
              color: '#ef4444',
            },
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: '8px',
          },
        }}
        {...props}
      />
    </motion.div>
  );
}
