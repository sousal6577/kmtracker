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
  InputAdornment,
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
  Notes,
  Router,
  SimCard,
  Settings,
  ShoppingCart,
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
  clientePreSelecionado = null,
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
      imei: '',
      numeroSim: '',
      equipamento: '',
      tipoAquisicao: '',
      obs: '',
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
        imei: veiculo.imei || '',
        numeroSim: veiculo.numeroSim || '',
        equipamento: veiculo.equipamento || '',
        tipoAquisicao: veiculo.tipoAquisicao || '',
        obs: veiculo.obs || '',
      });
      setTipoVeiculo(veiculo.tipo || 'carro');
    } else if (clientePreSelecionado) {
      // Pré-seleciona o cliente se vier da página de clientes
      reset({
        clienteId: clientePreSelecionado.id,
        placa: '',
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        valor: '',
        dataInstalacao: new Date().toISOString().split('T')[0],
        tipo: 'carro',
        imei: '',
        numeroSim: '',
        equipamento: '',
        tipoAquisicao: '',
        obs: '',
      });
      setTipoVeiculo('carro');
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
        imei: '',
        numeroSim: '',
        equipamento: '',
        tipoAquisicao: '',
        obs: '',
      });
      setTipoVeiculo('carro');
    }
  }, [veiculo, clientePreSelecionado, reset, open]);

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
    carro: [
      'Audi', 'BMW', 'BYD', 'Caoa Chery', 'Chevrolet', 'Citroën', 'Dodge', 'Fiat', 
      'Ford', 'GWM', 'Honda', 'Hyundai', 'JAC', 'Jeep', 'Kia', 'Land Rover', 
      'Lexus', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Peugeot', 
      'Porsche', 'RAM', 'Renault', 'Subaru', 'Suzuki', 'Toyota', 'Volvo', 'Volkswagen',
    ],
    moto: [
      'Avelloz', 'BMW', 'Bull', 'Dafra', 'Ducati', 'Haojue', 'Harley-Davidson', 
      'Honda', 'Husqvarna', 'Indian', 'Kawasaki', 'KTM', 'MV Agusta', 'Royal Enfield', 
      'Shineray', 'Suzuki', 'Triumph', 'Yamaha',
    ],
    caminhao: [
      'Agrale', 'DAF', 'Ford', 'Foton', 'Hyundai', 'International', 'Iveco', 
      'MAN', 'Mercedes-Benz', 'Scania', 'Sinotruk', 'Volkswagen', 'Volvo',
    ],
    van: [
      'Citroën', 'Fiat', 'Ford', 'Iveco', 'JAC', 'Mercedes-Benz', 'Peugeot', 
      'Renault', 'Volkswagen',
    ],
    trator: [
      'AGCO', 'Agrale', 'Case IH', 'Deutz-Fahr', 'John Deere', 'Kubota', 
      'Landini', 'LS Tractor', 'Mahindra', 'Massey Ferguson', 'New Holland', 
      'Valtra', 'Yanmar',
    ],
    eletrico: [
      'Audi', 'BMW', 'BYD', 'Caoa Chery', 'Chevrolet', 'Ford', 'GWM', 
      'JAC', 'Mercedes-Benz', 'Mini', 'Nissan', 'Peugeot', 'Porsche', 
      'Renault', 'Tesla', 'Volvo', 'Volkswagen',
    ],
    motocicleta: [
      'Avelloz', 'BMW', 'Dafra', 'Ducati', 'Haojue', 'Harley-Davidson', 
      'Honda', 'Kawasaki', 'KTM', 'Royal Enfield', 'Shineray', 'Suzuki', 
      'Triumph', 'Yamaha',
    ],
    onibus: [
      'Agrale', 'Busscar', 'Caio', 'Comil', 'Irizar', 'Marcopolo', 
      'Mercedes-Benz', 'Neobus', 'Scania', 'Volkswagen', 'Volvo',
    ],
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

          {/* Campos Técnicos */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 2, mb: 1 }}>
              Informações do Rastreador
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Controller
                name="imei"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="IMEI"
                    icon={<Router />}
                    placeholder="Ex: 123456789012345"
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Controller
                name="numeroSim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Número do SIM"
                    icon={<SimCard />}
                    placeholder="Ex: 5511999999999"
                  />
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Controller
                name="equipamento"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Equipamento</InputLabel>
                    <Select
                      {...field}
                      value={field.value?.toUpperCase() || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      label="Equipamento"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="GT06">GT06</MenuItem>
                      <MenuItem value="ST310">ST310</MenuItem>
                      <MenuItem value="TK103">TK103</MenuItem>
                      <MenuItem value="GPS103">GPS103</MenuItem>
                      <MenuItem value="E3+">E3+</MenuItem>
                      <MenuItem value="E3">E3</MenuItem>
                      <MenuItem value="JV200">JV200</MenuItem>
                      <MenuItem value="SUNTECH">Suntech</MenuItem>
                      <MenuItem value="OUTRO">Outro</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Controller
                name="tipoAquisicao"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Aquisição</InputLabel>
                    <Select
                      {...field}
                      value={field.value?.toUpperCase() || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      label="Tipo de Aquisição"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      <MenuItem value="COMODATO">Comodato</MenuItem>
                      <MenuItem value="VENDA">Venda</MenuItem>
                      <MenuItem value="ALUGUEL">Aluguel</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </motion.div>
          </Grid>

          {/* Observações */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Controller
                name="obs"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observações"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Anotações sobre o veículo ou instalação..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <Notes sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
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
        </Grid>
      </Box>
    </Modal>
  );
}
