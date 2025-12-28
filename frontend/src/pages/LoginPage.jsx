// src/pages/LoginPage.jsx - Página de Login Moderna com Glassmorphism
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Logo, GlassCard, Input, Button } from '../components/ui';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      if (response.success) {
        // Verifica se é primeiro acesso
        if (response.primeiroAcesso) {
          navigate('/change-password', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(response.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efeitos de fundo animados */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid de linhas */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <GlassCard
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            maxWidth: 420,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Logo e Título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Logo size={80} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mt: 2,
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KMTracker
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Sistema de Gestão de Rastreamento
              </Typography>
            </motion.div>
          </Box>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  '& .MuiAlert-icon': { color: '#ef4444' },
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                fullWidth
                label="Email ou Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="seu@email.com"
                icon={<Email />}
                sx={{ mb: 2.5 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                icon={<Lock />}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={loading}
                icon={<LoginIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                Entrar no Sistema
              </Button>
            </motion.div>
          </form>

          {/* Rodapé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 4,
              }}
            >
              © {new Date().getFullYear()} KMTracker • Todos os direitos reservados
            </Typography>
          </motion.div>
        </GlassCard>
      </motion.div>
    </Box>
  );
}
