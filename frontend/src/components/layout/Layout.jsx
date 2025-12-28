// src/components/layout/Layout.jsx - Layout Principal Moderno
import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const DRAWER_WIDTH = 280;

export default function Layout({ children, title, subtitle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: '#020617',
        position: 'relative',
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Header 
          onMenuClick={handleMobileToggle} 
          title={title}
          subtitle={subtitle}
        />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
