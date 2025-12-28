// src/components/modals/VeiculoModal.jsx - Modal de Veículo Moderno
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
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  DirectionsCar,
  Badge,
  CalendarMonth,
  AttachMoney,
  Save,
  Add,
  Speed,
  ColorLens,
  Business,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { VehicleTypeSelector } from '../ui/VehicleIcon';

export default function VeiculoModal({
  open,
  onClose,
  onSave,
  veiculo = null,
  clientes = [],
  loading = false,
}) {
  const isEditing = Boolean(veiculo);
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      clienteId: '',
      placa: '',
      marca: '',
      modelo: '',
      ano: '',
      cor: '',
      valor: '',
      dataInstalacao: new Date().toISOString().split('T')[0],
      tipo: 'carro',
    },
  });

  useEffect(() => {
    if (veiculo) {
      reset({
        clienteId: veiculo.clienteId || '',
        placa: veiculo.placa || '',
        marca: veiculo.marca || '',
        modelo: veiculo.modelo || '',
        ano: veiculo.ano || '',
        cor: veiculo.cor || '',
        valor: veiculo.valor || '',
        dataInstalacao: veiculo.dataInstalacao || new Date().toISOString().split('T')[0],
        tipo: veiculo.tipo || 'carro',
      });
      setTipoVeiculo(veiculo.tipo || 'carro');
    } else {
      reset({
        clienteId: '',
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        valor: '',
        dataInstalacao: new Date().toISOString().split('T')[0],
        tipo: 'carro',
      });
      setTipoVeiculo('carro');
    }
  }, [veiculo, reset, open]);

  const handleTipoChange = (tipo) => {
    setTipoVeiculo(tipo);
    setValue('tipo', tipo);
  };

  const onSubmit = (data) => {
    onSave({ ...data, tipo: tipoVeiculo });
  };

  const formatPlaca = (value) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/^([A-Z]{3})([0-9])/, '$1-$2')
      .slice(0, 8);
  };

  const formatMoney = (value) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const marcas = {
    carro: ['Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan', 'Renault', 'Toyota', 'Volkswagen'],
    moto: ['BMW', 'Dafra', 'Harley-Davidson', 'Honda', 'Kawasaki', 'Suzuki', 'Triumph', 'Yamaha'],
    caminhao: ['DAF', 'Iveco', 'MAN', 'Mercedes-Benz', 'Scania', 'Volvo', 'Volkswagen'],
    van: ['Fiat', 'Ford', 'Mercedes-Benz', 'Peugeot', 'Renault', 'Volkswagen'],
    trator: ['Case IH', 'John Deere', 'Massey Ferguson', 'New Holland', 'Valtra'],
    eletrico: ['BYD', 'Chevrolet', 'JAC', 'Nissan', 'Renault', 'Tesla', 'Volvo'],
    motocicleta: ['BMW', 'Honda', 'Kawasaki', 'Suzuki', 'Triumph', 'Yamaha'],
    onibus: ['Marcopolo', 'Mercedes-Benz', 'Scania', 'Volkswagen', 'Volvo'],
  };

  const cores = [
    'Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 
    'Amarelo', 'Marrom', 'Bege', 'Laranja', 'Vinho', 'Dourado',
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Veículo' : 'Novo Veículo'}
      subtitle={isEditing ? 'Atualize os dados do veículo' : 'Selecione o tipo e preencha os dados'}
      icon={isEditing ? <DirectionsCar /> : <Add />}
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
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
          </Button>
        </>
      }
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Tipo de Veículo */}
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
              Tipo de Veículo
            </Typography>
            <VehicleTypeSelector 
              value={tipoVeiculo} 
              onChange={handleTipoChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
          </Grid>

          {/* Dados do Veículo */}
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
              Dados do Veículo
            </Typography>
          </Grid>

          {/* Cliente */}
          {!isEditing && clientes.length > 0 && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Controller
                  name="clienteId"
                  control={control}
                  rules={{ required: 'Selecione um cliente' }}
                  render={({ field }) => (
                    <Autocomplete
                      options={clientes}
                      getOptionLabel={(option) => 
                        option.nome ? `${option.nome} - ${option.cpf}` : ''
                      }
                      value={clientes.find(c => c.id === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.id || '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cliente"
                          error={!!errors.clienteId}
                          helperText={errors.clienteId?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </motion.div>
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="placa"
                control={control}
                rules={{ 
                  required: 'Placa é obrigatória',
                  pattern: {
                    value: /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/,
                    message: 'Placa inválida'
                  }
                }}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value}
                    onChange={(e) => onChange(formatPlaca(e.target.value))}
                    label="Placa"
                    icon={<Badge />}
                    placeholder="ABC-1234"
                    error={!!errors.placa}
                    helperText={errors.placa?.message}
                    inputProps={{ maxLength: 8 }}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Controller
                name="marca"
                control={control}
                rules={{ required: 'Marca é obrigatória' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.marca}>
                    <InputLabel>Marca</InputLabel>
                    <Select
                      {...field}
                      label="Marca"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      {(marcas[tipoVeiculo] || marcas.carro).map((marca) => (
                        <MenuItem key={marca} value={marca}>
                          {marca}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Controller
                name="modelo"
                control={control}
                rules={{ required: 'Modelo é obrigatório' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Modelo"
                    icon={<Speed />}
                    error={!!errors.modelo}
                    helperText={errors.modelo?.message}
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Controller
                name="ano"
                control={control}
                rules={{ 
                  required: 'Ano é obrigatório',
                  min: { value: 1990, message: 'Ano inválido' },
                  max: { value: new Date().getFullYear() + 1, message: 'Ano inválido' }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Ano"
                    type="number"
                    icon={<CalendarMonth />}
                    error={!!errors.ano}
                    helperText={errors.ano?.message}
                    inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
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
                name="cor"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Cor</InputLabel>
                    <Select
                      {...field}
                      label="Cor"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      {cores.map((cor) => (
                        <MenuItem key={cor} value={cor}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backgroundColor: 
                                  cor === 'Branco' ? '#fff' :
                                  cor === 'Preto' ? '#000' :
                                  cor === 'Prata' ? '#c0c0c0' :
                                  cor === 'Cinza' ? '#808080' :
                                  cor === 'Vermelho' ? '#dc2626' :
                                  cor === 'Azul' ? '#2563eb' :
                                  cor === 'Verde' ? '#16a34a' :
                                  cor === 'Amarelo' ? '#eab308' :
                                  cor === 'Marrom' ? '#78350f' :
                                  cor === 'Bege' ? '#d4c4a8' :
                                  cor === 'Laranja' ? '#f97316' :
                                  cor === 'Vinho' ? '#7f1d1d' :
                                  '#d4af37',
                              }}
                            />
                            {cor}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    label="Valor Mensal"
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
              transition={{ delay: 0.45 }}
            >
              <Controller
                name="dataInstalacao"
                control={control}
                rules={{ required: 'Data é obrigatória' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Data de Instalação"
                    type="date"
                    icon={<CalendarMonth />}
                    error={!!errors.dataInstalacao}
                    helperText={errors.dataInstalacao?.message}
                    InputLabelProps={{ shrink: true }}
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
