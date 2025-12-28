// src/components/modals/PagamentoModal.jsx - Modal de Pagamento Moderno
import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Chip,
  Alert,
} from '@mui/material';
import {
  Payment,
  CalendarMonth,
  AttachMoney,
  Receipt,
  Save,
  Add,
  DirectionsCar,
  Person,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const statusOptions = [
  { 
    value: 'PENDENTE', 
    label: 'Pendente', 
    icon: <Schedule />, 
    color: '#f59e0b',
    description: 'Aguardando pagamento'
  },
  { 
    value: 'PAGO', 
    label: 'Pago', 
    icon: <CheckCircle />, 
    color: '#22c55e',
    description: 'Pagamento confirmado'
  },
  { 
    value: 'ATRASADO', 
    label: 'Atrasado', 
    icon: <Warning />, 
    color: '#ef4444',
    description: 'Vencimento ultrapassado'
  },
];

const metodosOptions = [
  { value: 'PIX', label: 'PIX', color: '#00BFA5' },
  { value: 'BOLETO', label: 'Boleto', color: '#6366f1' },
  { value: 'CARTAO', label: 'Cartão', color: '#f59e0b' },
  { value: 'DINHEIRO', label: 'Dinheiro', color: '#22c55e' },
  { value: 'TRANSFERENCIA', label: 'Transferência', color: '#3b82f6' },
];

export default function PagamentoModal({
  open,
  onClose,
  onSave,
  pagamento = null,
  veiculos = [],
  clientes = [],
  loading = false,
}) {
  const isEditing = Boolean(pagamento);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      veiculoId: '',
      clienteId: '',
      valor: '',
      dataVencimento: new Date().toISOString().split('T')[0],
      dataPagamento: '',
      status: 'PENDENTE',
      metodo: '',
      referencia: '',
      observacao: '',
    },
  });

  const status = watch('status');

  useEffect(() => {
    if (pagamento) {
      reset({
        veiculoId: pagamento.veiculoId || '',
        clienteId: pagamento.clienteId || '',
        valor: pagamento.valor || '',
        dataVencimento: pagamento.dataVencimento || '',
        dataPagamento: pagamento.dataPagamento || '',
        status: pagamento.status || 'PENDENTE',
        metodo: pagamento.metodo || '',
        referencia: pagamento.referencia || '',
        observacao: pagamento.observacao || '',
      });
      
      const veiculo = veiculos.find(v => v.id === pagamento.veiculoId);
      setSelectedVeiculo(veiculo || null);
    } else {
      reset({
        veiculoId: '',
        clienteId: '',
        valor: '',
        dataVencimento: new Date().toISOString().split('T')[0],
        dataPagamento: '',
        status: 'PENDENTE',
        metodo: '',
        referencia: '',
        observacao: '',
      });
      setSelectedVeiculo(null);
    }
  }, [pagamento, reset, open, veiculos]);

  const onSubmit = (data) => {
    onSave(data);
  };

  const handleVeiculoChange = (veiculo) => {
    setSelectedVeiculo(veiculo);
    setValue('veiculoId', veiculo?.id || '');
    setValue('clienteId', veiculo?.clienteId || '');
    if (veiculo?.valor) {
      setValue('valor', veiculo.valor);
    }
  };

  const formatMoney = (value) => {
    const numbers = String(value).replace(/\D/g, '');
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getMesReferencia = () => {
    const date = new Date();
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[date.getMonth()]}/${date.getFullYear()}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Pagamento' : 'Novo Pagamento'}
      subtitle={isEditing ? 'Atualize os dados do pagamento' : 'Registre um novo pagamento'}
      icon={isEditing ? <Payment /> : <Add />}
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
            {isEditing ? 'Salvar Alterações' : 'Registrar Pagamento'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Seleção de Veículo */}
          {!isEditing && veiculos.length > 0 && (
            <>
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
                  <DirectionsCar fontSize="small" />
                  Selecione o Veículo
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Autocomplete
                    options={veiculos}
                    getOptionLabel={(option) => 
                      `${option.placa} - ${option.marca} ${option.modelo}`
                    }
                    value={selectedVeiculo}
                    onChange={(_, newValue) => handleVeiculoChange(newValue)}
                    renderOption={(props, option) => {
                      const cliente = clientes.find(c => c.id === option.clienteId);
                      return (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {option.placa} - {option.marca} {option.modelo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {cliente?.nome || 'Cliente não encontrado'} • R$ {option.valor}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Veículo"
                        error={!!errors.veiculoId}
                        helperText={errors.veiculoId?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                          },
                        }}
                      />
                    )}
                  />
                </motion.div>
              </Grid>

              {selectedVeiculo && (
                <Grid item xs={12}>
                  <Alert
                    severity="info"
                    icon={<Person />}
                    sx={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Cliente:</strong>{' '}
                      {clientes.find(c => c.id === selectedVeiculo.clienteId)?.nome || 'Não encontrado'}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              </Grid>
            </>
          )}

          {/* Dados do Pagamento */}
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
              <Receipt fontSize="small" />
              Dados do Pagamento
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="valor"
                control={control}
                rules={{ required: 'Valor é obrigatório' }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value}
                    onChange={(e) => {
                      const formatted = formatMoney(e.target.value);
                      onChange(formatted);
                    }}
                    label="Valor"
                    icon={<AttachMoney />}
                    placeholder="0,00"
                    error={!!errors.valor}
                    helperText={errors.valor?.message}
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
                name="referencia"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Mês de Referência"
                    placeholder={getMesReferencia()}
                    icon={<CalendarMonth />}
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
                name="dataVencimento"
                control={control}
                rules={{ required: 'Data de vencimento é obrigatória' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Data de Vencimento"
                    type="date"
                    icon={<CalendarMonth />}
                    error={!!errors.dataVencimento}
                    helperText={errors.dataVencimento?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </motion.div>
          </Grid>

          {status === 'PAGO' && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Controller
                  name="dataPagamento"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Data do Pagamento"
                      type="date"
                      icon={<CheckCircle />}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </motion.div>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          </Grid>

          {/* Status */}
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
              <CheckCircle fontSize="small" />
              Status e Método
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {statusOptions.map((option) => (
                      <Chip
                        key={option.value}
                        icon={option.icon}
                        label={option.label}
                        onClick={() => field.onChange(option.value)}
                        sx={{
                          px: 1,
                          height: 40,
                          borderRadius: '12px',
                          fontWeight: 600,
                          backgroundColor:
                            field.value === option.value
                              ? `${option.color}30`
                              : 'rgba(255,255,255,0.05)',
                          border: '1px solid',
                          borderColor:
                            field.value === option.value
                              ? option.color
                              : 'rgba(255,255,255,0.1)',
                          color: field.value === option.value ? option.color : 'text.primary',
                          '& .MuiChip-icon': {
                            color: field.value === option.value ? option.color : 'text.secondary',
                          },
                          '&:hover': {
                            backgroundColor: `${option.color}20`,
                            borderColor: option.color,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </Box>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Controller
                name="metodo"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {metodosOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        onClick={() => field.onChange(option.value)}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 500,
                          backgroundColor:
                            field.value === option.value
                              ? option.color
                              : 'rgba(255,255,255,0.05)',
                          border: '1px solid',
                          borderColor:
                            field.value === option.value
                              ? option.color
                              : 'rgba(255,255,255,0.1)',
                          color: field.value === option.value ? '#fff' : 'text.secondary',
                          '&:hover': {
                            backgroundColor: field.value === option.value ? option.color : 'rgba(255,255,255,0.1)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </Box>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Controller
                name="observacao"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Observação"
                    multiline
                    rows={2}
                    placeholder="Observações adicionais..."
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
