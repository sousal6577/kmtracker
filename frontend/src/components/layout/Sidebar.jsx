// src/components/layout/Sidebar.jsx - Sidebar Moderna com Glassmorphism
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  DirectionsCar,
  Payment,
  Logout,
  ChevronLeft,
  ChevronRight,
  Settings,
  AdminPanelSettings,
  NotificationsOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED = 80;

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <Dashboard />, 
    path: '/',
    description: 'Visão geral do sistema'
  },
  { 
    text: 'Clientes', 
    icon: <People />, 
    path: '/clientes',
    description: 'Gerenciar clientes'
  },
  { 
    text: 'Veículos', 
    icon: <DirectionsCar />, 
    path: '/veiculos',
    description: 'Gerenciar veículos'
  },
  { 
    text: 'Pagamentos', 
    icon: <Payment />, 
    path: '/pagamentos',
    description: 'Controle de pagamentos',
    badge: 3
  },
];

const bottomMenuItems = [
  { 
    text: 'Administradores', 
    icon: <AdminPanelSettings />, 
    path: '/admin',
    adminOnly: true 
  },
  { 
    text: 'Configurações', 
    icon: <Settings />, 
    path: '/configuracoes' 
  },
];

export default function Sidebar({ open, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const DrawerContent = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 2 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="medium" />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="small" showText={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && !collapsed && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              color: 'text.secondary',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Expand Button when collapsed */}
      {collapsed && !isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <IconButton
            onClick={() => setCollapsed(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      )}

      {/* Main Menu */}
      <List sx={{ flex: 1, py: 2, px: collapsed ? 1 : 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Tooltip 
                title={collapsed ? item.text : ''} 
                placement="right"
                arrow
              >
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      px: collapsed ? 1.5 : 2,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(99, 102, 241, 0.3)'
                        : '1px solid transparent',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                      },
                      '&::before': isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '60%',
                        borderRadius: '0 4px 4px 0',
                        background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
                      } : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 40,
                        color: isActive ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      <Badge 
                        badgeContent={item.badge} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            minWidth: 16,
                            height: 16,
                          }
                        }}
                      >
                        {item.icon}
                      </Badge>
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.text}
                        secondary={!isActive ? null : item.description}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'text.primary' : 'text.secondary',
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.7rem',
                          color: 'text.secondary',
                          sx: { mt: 0.3 },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </motion.div>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mx: 2 }} />

      {/* Bottom Menu */}
      <List sx={{ py: 1, px: collapsed ? 1 : 2 }}>
        {bottomMenuItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          const isActive = location.pathname === item.path;
          
          return (
            <Tooltip 
              key={item.path}
              title={collapsed ? item.text : ''} 
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    px: collapsed ? 1.5 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* User Section */}
      <Box
        sx={{
          p: collapsed ? 1.5 : 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 1.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Avatar
              sx={{
                width: collapsed ? 40 : 44,
                height: collapsed ? 40 : 44,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontWeight: 600,
                fontSize: collapsed ? '0.9rem' : '1rem',
                cursor: 'pointer',
              }}
            >
              {user?.nome?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </motion.div>

          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.nome || user?.username || 'Usuário'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                }}
              >
                {user?.role === 'admin' ? 'Administrador' : 'Operador'}
              </Typography>
            </Box>
          )}

          {!collapsed && (
            <Tooltip title="Sair" arrow>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {collapsed && (
          <Tooltip title="Sair" arrow placement="right">
            <IconButton
              onClick={handleLogout}
              sx={{
                mt: 1,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                },
              }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            border: 'none',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DrawerContent />
      </Drawer>
    );
  }

  // Desktop Drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          border: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <DrawerContent />
    </Drawer>
  );
}
