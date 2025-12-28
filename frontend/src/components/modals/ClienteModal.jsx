// src/components/modals/ClienteModal.jsx - Modal de Cliente Moderno
import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Person,
  Badge,
  Phone,
  LocationCity,
  Email,
  Home,
  Save,
  PersonAdd,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ClienteModal({
  open,
  onClose,
  onSave,
  cliente = null,
  loading = false,
}) {
  const isEditing = Boolean(cliente);
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      cidade: '',
      endereco: '',
      estado: 'BA',
    },
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nome: cliente.nome || '',
        cpf: cliente.cpf || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        cidade: cliente.cidade || '',
        endereco: cliente.endereco || '',
        estado: cliente.estado || 'BA',
      });
    } else {
      reset({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        cidade: '',
        endereco: '',
        estado: 'BA',
      });
    }
  }, [cliente, reset, open]);

  const onSubmit = (data) => {
    onSave(data);
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO',
  ];

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      subtitle={isEditing ? 'Atualize os dados do cliente' : 'Preencha os dados para cadastrar'}
      icon={isEditing ? <Person /> : <PersonAdd />}
      maxWidth="md"
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            icon={<Save />}
          >
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
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
              <Person fontSize="small" />
              Dados Pessoais
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Controller
                name="nome"
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nome Completo"
                    icon={<Person />}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="cpf"
                control={control}
                rules={{ 
                  required: 'CPF é obrigatório',
                  pattern: {
                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: 'CPF inválido'
                  }
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value}
                    onChange={(e) => onChange(formatCPF(e.target.value))}
                    label="CPF"
                    icon={<Badge />}
                    placeholder="000.000.000-00"
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                    inputProps={{ maxLength: 14 }}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="telefone"
                control={control}
                rules={{ required: 'Telefone é obrigatório' }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value}
                    onChange={(e) => onChange(formatPhone(e.target.value))}
                    label="Telefone"
                    icon={<Phone />}
                    placeholder="(00) 00000-0000"
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                    inputProps={{ maxLength: 15 }}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="E-mail (opcional)"
                    icon={<Email />}
                    type="email"
                  />
                )}
              />
            </motion.div>
          </Grid>

          {/* Endereço */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mt: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Home fontSize="small" />
              Endereço
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="endereco"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Endereço"
                    icon={<Home />}
                    placeholder="Rua, número, bairro..."
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Controller
                name="cidade"
                control={control}
                rules={{ required: 'Cidade é obrigatória' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Cidade"
                    icon={<LocationCity />}
                    error={!!errors.cidade}
                    helperText={errors.cidade?.message}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      {...field}
                      label="Estado"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(99, 102, 241, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                      }}
                    >
                      {estados.map((uf) => (
                        <MenuItem key={uf} value={uf}>
                          {uf}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
