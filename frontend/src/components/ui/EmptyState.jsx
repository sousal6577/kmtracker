// src/components/ui/EmptyState.jsx - Estado Vazio Moderno
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SearchOff, Inbox, FolderOff } from '@mui/icons-material';

export default function EmptyState({
  icon,
  title = 'Nenhum resultado encontrado',
  description,
  action,
  type = 'search', // search, empty, error
}) {
  const icons = {
    search: <SearchOff sx={{ fontSize: 64 }} />,
    empty: <Inbox sx={{ fontSize: 64 }} />,
    error: <FolderOff sx={{ fontSize: 64 }} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 4,
          textAlign: 'center',
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              color: 'primary.main',
            }}
          >
            {icon || icons[type]}
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

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              maxWidth: 400,
              mb: 3,
            }}
          >
            {description}
          </Typography>
        )}

        {action && (
          <Box sx={{ mt: 2 }}>
            {action}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
