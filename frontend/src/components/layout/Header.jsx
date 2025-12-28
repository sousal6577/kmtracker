// src/components/layout/Header.jsx - Header Moderno com Glassmorphism
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined,
  Search,
  FullscreenOutlined,
  FullscreenExitOutlined,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SearchInput from '../ui/SearchInput';

export default function Header({ onMenuClick, title, subtitle }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const notifications = [
    { id: 1, message: '3 pagamentos pendentes', time: '5 min', type: 'warning' },
    { id: 2, message: 'Novo cliente cadastrado', time: '1 hora', type: 'info' },
    { id: 3, message: 'Veículo atualizado', time: '2 horas', type: 'success' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 70 } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Title Section */}
        <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              {title || 'Dashboard'}
            </Typography>
            {subtitle && !isMobile && (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 0.3 }}
              >
                {subtitle}
              </Typography>
            )}
          </motion.div>
        </Box>

        {/* Search - Desktop Only */}
        {!isMobile && (
          <Box sx={{ width: 300 }}>
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar..."
            />
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Search Icon - Mobile */}
          {isMobile && (
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'primary.main',
                },
              }}
            >
              <Search />
            </IconButton>
          )}

          {/* Fullscreen - Desktop Only */}
          {!isMobile && (
            <Tooltip title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'} arrow>
              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: 'primary.main',
                  },
                }}
              >
                {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              </IconButton>
            </Tooltip>
          )}

          {/* Notifications */}
          <Tooltip title="Notificações" arrow>
            <IconButton
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'primary.main',
                },
              }}
            >
              <Badge 
                badgeContent={notifications.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    minWidth: 16,
                    height: 16,
                  }
                }}
              >
                <NotificationsOutlined />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={() => setNotificationAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 320,
                maxHeight: 400,
                background: 'rgba(15, 23, 42, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Notificações
              </Typography>
            </Box>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => setNotificationAnchor(null)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 
                        notification.type === 'warning' ? '#f97316' :
                        notification.type === 'success' ? '#10b981' : '#06b6d4',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <MenuItem
              sx={{
                justifyContent: 'center',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                Ver todas
              </Typography>
            </MenuItem>
          </Menu>

          {/* User Avatar - Desktop */}
          {!isMobile && (
            <Box sx={{ ml: 1 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    border: '2px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {user?.nome?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </motion.div>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
