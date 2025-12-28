// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 3
          }}
        >
          <Box textAlign="center" mb={3}>
            <DirectionsCar sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              KMTracker
            </Typography>
            <Typography color="text.secondary">
              Gestão de Rastreamento de Veículos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email ou Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              placeholder="lgcdsousa@gmail.com ou ADMIN"
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
