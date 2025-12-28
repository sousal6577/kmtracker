// src/pages/ChangePasswordPage.jsx - Tela de Troca de Senha (Primeiro Acesso)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, Security } from '@mui/icons-material';
import { motion } from 'framer-motion';
import authApi from '../api/authApi';

export default function ChangePasswordPage() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const user = authApi.getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.changePassword(user?.id, null, novaSenha);
      
      if (result.success) {
        setSuccess('Senha alterada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setError(result.message || 'Erro ao alterar senha');
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
        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
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
            maxWidth: 450,
            borderRadius: 3
          }}
        >
          <Box textAlign="center" mb={3}>
            <Security sx={{ fontSize: 60, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Primeiro Acesso
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Por segurança, você precisa criar uma nova senha
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Olá, {user?.nome || user?.id}!</strong><br />
              Esta é sua primeira vez acessando o sistema. 
              Por favor, crie uma senha segura com pelo menos 6 caracteres.
            </Typography>
          </Alert>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type={showPassword ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              margin="normal"
              required
              error={confirmarSenha && novaSenha !== confirmarSenha}
              helperText={confirmarSenha && novaSenha !== confirmarSenha ? 'As senhas não conferem' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
              size="large"
              disabled={loading || !novaSenha || !confirmarSenha}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Alterar Senha'}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
