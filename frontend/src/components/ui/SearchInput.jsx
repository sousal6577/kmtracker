// src/components/ui/SearchInput.jsx - Input de Busca Moderno
import { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search, Close, FilterList } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  onFilter,
  showFilter = false,
}) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '14px',
          border: focused 
            ? '1px solid rgba(99, 102, 241, 0.5)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          boxShadow: focused 
            ? '0 0 0 3px rgba(99, 102, 241, 0.15)' 
            : 'none',
          '&:hover': {
            borderColor: focused 
              ? 'rgba(99, 102, 241, 0.5)' 
              : 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <motion.div
          animate={{ scale: focused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search 
            sx={{ 
              color: focused ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s ease',
            }} 
          />
        </motion.div>

        <InputBase
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{
            flex: 1,
            color: 'text.primary',
            '& input': {
              padding: '4px 0',
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 0.7,
              },
            },
          }}
        />

        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'text.primary',
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>

        {showFilter && (
          <IconButton
            size="small"
            onClick={onFilter}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
              },
            }}
          >
            <FilterList fontSize="small" />
          </IconButton>
        )}
      </Box>
    </motion.div>
  );
}
