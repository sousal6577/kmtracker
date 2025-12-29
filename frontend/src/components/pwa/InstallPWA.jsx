// src/components/pwa/InstallPWA.jsx - Modal de Instalação PWA
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Close,
  GetApp,
  PhoneAndroid,
  OfflineBolt,
  Notifications,
  Speed,
  IosShare,
  MoreVert,
  AddBox,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Detecta se é iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// Detecta se é Android
const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Hook para gerenciar instalação PWA
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      return;
    }

    // Se já foi instalado antes, marca como instalado
    if (localStorage.getItem('pwa-installed') === 'true') {
      setIsInstalled(true);
      return;
    }

    // Captura o evento beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('PWA: beforeinstallprompt capturado!');
    };

    // Detecta quando o app foi instalado
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      console.log('PWA: App instalado!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Se não capturou o prompt após 3s, mostra instruções manuais
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setShowManualInstructions(true);
        setIsInstallable(true); // Permite mostrar o modal com instruções manuais
        console.log('PWA: Mostrando instruções manuais');
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        localStorage.setItem('pwa-installed', 'true');
        return true;
      }
      return false;
    }
    // Se não tem prompt, mostra instruções
    setShowManualInstructions(true);
    return false;
  };

  return { isInstallable, isInstalled, installPWA, showManualInstructions, deferredPrompt };
}

// Componente Feature Item
function FeatureItem({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          p: 1.5,
          borderRadius: '12px',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {title}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

// Instruções de instalação por plataforma
function InstallInstructions() {
  const ios = isIOS();
  const android = isAndroid();
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 1.5, color: '#fff' }}>
        📱 Como instalar:
      </Typography>
      
      {ios ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <IosShare sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>1. Toque no ícone de compartilhar</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <AddBox sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>2. Selecione "Adicionar à Tela de Início"</Typography>
          </Box>
        </Box>
      ) : android ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <MoreVert sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>1. Toque no menu (⋮) do navegador</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <GetApp sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>2. Selecione "Instalar app" ou "Adicionar à tela inicial"</Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <MoreVert sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>1. Clique no ícone de instalar na barra de endereço</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2 }}>
            <Box sx={{ bgcolor: '#6366f1', borderRadius: 1, p: 0.5, display: 'flex' }}>
              <GetApp sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography sx={{ fontSize: '0.8rem' }}>2. Ou menu ⋮ → "Instalar KM Tracker"</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Modal de Instalação PWA
export default function InstallPWAModal({ open, onClose, onInstall, showManualInstructions = false, hasPrompt = false }) {
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
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.3 },
            sx: {
              backgroundColor: 'rgba(20, 20, 35, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              overflow: 'hidden',
            },
          }}
        >
          {/* Header animado */}
          <Box
            sx={{
              position: 'relative',
              p: 3,
              pb: 2,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary',
              }}
            >
              <Close />
            </IconButton>

            {/* Ícone animado */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <GetApp sx={{ fontSize: 40, color: '#fff' }} />
                  </motion.div>
                </Box>
              </motion.div>
            </Box>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Instale o App
              </Typography>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                  mt: 0.5,
                }}
              >
                Tenha acesso rápido ao KM Tracker
              </Typography>
            </motion.div>
          </Box>

          <DialogContent sx={{ p: 2.5 }}>
            {/* Features */}
            <FeatureItem
              icon={Speed}
              title="Acesso Rápido"
              description="Abra diretamente da sua tela inicial"
              delay={0.3}
            />
            <FeatureItem
              icon={OfflineBolt}
              title="Funciona Offline"
              description="Acesse dados mesmo sem internet"
              delay={0.4}
            />
            <FeatureItem
              icon={Notifications}
              title="Notificações"
              description="Receba alertas de pagamentos"
              delay={0.5}
            />
            <FeatureItem
              icon={PhoneAndroid}
              title="Como um App Nativo"
              description="Experiência fluida e moderna"
              delay={0.6}
            />

            {/* Instruções manuais ou botão */}
            {showManualInstructions && !hasPrompt ? (
              <InstallInstructions />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Box
                  component="button"
                  onClick={onInstall}
                  sx={{
                    width: '100%',
                    mt: 2,
                    p: 1.5,
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(99, 102, 241, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  <GetApp />
                  Instalar Agora
                </Box>
              </motion.div>
            )}

            {/* Link para depois */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography
                onClick={onClose}
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  mt: 2,
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Talvez depois
              </Typography>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
