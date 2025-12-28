// src/components/modals/AdminModal.jsx - Modal de Administrador Moderno
import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  PersonAdd,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Badge,
  Security,
  Save,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const roles = [
  {
    value: 'admin',
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    icon: <AdminPanelSettings />,
    color: '#6366f1',
  },
  {
    value: 'manager',
    label: 'Gerente',
    description: 'Gerencia clientes e veículos',
    icon: <Badge />,
    color: '#22c55e',
  },
  {
    value: 'operator',
    label: 'Operador',
    description: 'Visualização e cadastro básico',
    icon: <Security />,
    color: '#f59e0b',
  },
];

export default function AdminModal({
  open,
  onClose,
  onSave,
  loading = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'operator',
    },
  });

  const password = watch('password');
  const selectedRole = watch('role');

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    const { confirmPassword, ...adminData } = data;
    onSave(adminData);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[a-z]/.test(pass)) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Fraca', color: '#ef4444' };
    if (strength <= 50) return { strength, label: 'Média', color: '#f59e0b' };
    if (strength <= 75) return { strength, label: 'Boa', color: '#3b82f6' };
    return { strength, label: 'Forte', color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo Administrador"
      subtitle="Crie uma nova conta de administrador"
      icon={<PersonAdd />}
      maxWidth="sm"
      actions={
        <>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            icon={<Save />}
          >
            Criar Administrador
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Alerta de Segurança */}
          <Grid item xs={12}>
            <Alert
              severity="info"
              icon={<Security />}
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: 'primary.main',
                },
              }}
            >
              <Typography variant="body2">
                O novo administrador receberá acesso imediato ao sistema após a criação.
              </Typography>
            </Alert>
          </Grid>

          {/* Dados Pessoais */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Badge fontSize="small" />
              Dados do Administrador
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Controller
                name="nome"
                control={control}
                rules={{ 
                  required: 'Nome é obrigatório',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nome Completo"
                    icon={<Badge />}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email"
                    type="email"
                    icon={<Email />}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          </Grid>

          {/* Nível de Acesso */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AdminPanelSettings fontSize="small" />
              Nível de Acesso
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                    }}
                  >
                    {roles.map((role) => (
                      <Box
                        key={role.value}
                        onClick={() => field.onChange(role.value)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          backgroundColor: 
                            field.value === role.value 
                              ? `${role.color}20` 
                              : 'rgba(255,255,255,0.03)',
                          border: '1px solid',
                          borderColor: 
                            field.value === role.value 
                              ? role.color 
                              : 'rgba(255,255,255,0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: `${role.color}15`,
                            borderColor: `${role.color}80`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '10px',
                            backgroundColor: `${role.color}20`,
                            color: role.color,
                            display: 'flex',
                          }}
                        >
                          {role.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ 
                              fontWeight: 600,
                              color: field.value === role.value ? role.color : 'text.primary',
                            }}
                          >
                            {role.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                        {field.value === role.value && (
                          <Chip
                            label="Selecionado"
                            size="small"
                            sx={{
                              backgroundColor: role.color,
                              color: '#fff',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          </Grid>

          {/* Senha */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Lock fontSize="small" />
              Credenciais de Acesso
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Controller
                name="password"
                control={control}
                rules={{ 
                  required: 'Senha é obrigatória',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                }}
                render={({ field }) => (
                  <Box>
                    <Input
                      {...field}
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      icon={<Lock />}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {password && (
                      <Box sx={{ mt: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${passwordStrength.strength}%`,
                                height: '100%',
                                backgroundColor: passwordStrength.color,
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{ color: passwordStrength.color, fontWeight: 600 }}
                          >
                            {passwordStrength.label}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ 
                  required: 'Confirme a senha',
                  validate: value => value === password || 'Senhas não conferem'
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={<Lock />}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
