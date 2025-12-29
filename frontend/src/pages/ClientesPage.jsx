// src/pages/ClientesPage.jsx - Página de Clientes Responsiva
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Collapse,
  useMediaQuery,
  useTheme,
  Divider,
  Switch,
  Badge,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Phone,
  Email,
  DirectionsCar,
  Refresh,
  FileDownload,
  People,
  ExpandMore,
  ExpandLess,
  LocationCity,
  ToggleOn,
  ToggleOff,
  AttachMoney,
  CalendarMonth,
  Router,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientes } from '../hooks';
import { veiculoApi } from '../api';
import { 
  GlassCard, 
  SearchInput, 
  DataTable, 
  Button, 
  StatusBadge, 
  EmptyState,
  ConfirmDialog,
  VehicleIcon,
} from '../components/ui';
import { ClienteModal } from '../components/modals';
import Loading from '../components/common/Loading';
import { formatDate } from '../utils/formatters';

// Animações simplificadas para melhor performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Gera avatar com iniciais
function stringAvatar(nome) {
  if (!nome) return { children: '?' };
  const partes = nome.split(' ');
  const iniciais = partes.length > 1 
    ? `${partes[0][0]}${partes[partes.length - 1][0]}`
    : partes[0][0];
  
  // Gera cor baseada no nome
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  
  return {
    children: iniciais.toUpperCase(),
    sx: {
      bgcolor: `hsl(${hue}, 70%, 50%)`,
      color: '#fff',
      fontWeight: 600,
    },
  };
}

// Card de Cliente para Mobile
function ClienteCard({ cliente, onEdit, onDelete, onView, onToggleStatus, onAddVeiculo, onEditVeiculo }) {
  const [expanded, setExpanded] = useState(false);
  const [veiculos, setVeiculos] = useState([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);

  // Carrega veículos quando expandir
  const handleExpand = useCallback(async () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    if (newExpanded && veiculos.length === 0 && cliente.totalVeiculos > 0) {
      setLoadingVeiculos(true);
      try {
        const response = await veiculoApi.listarPorCliente(cliente.id);
        if (response.success) {
          setVeiculos(response.veiculos || []);
        }
      } catch (err) {
        console.error('Erro ao carregar veículos:', err);
      } finally {
        setLoadingVeiculos(false);
      }
    }
  }, [expanded, veiculos.length, cliente.id, cliente.totalVeiculos]);

  // Calcular valor total dos veículos
  const valorTotal = useMemo(() => {
    return veiculos.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0);
  }, [veiculos]);

  return (
    <motion.div variants={itemVariants}>
      <Card
        onClick={handleExpand}
        sx={{
          mb: 2,
          backgroundColor: 'rgba(30, 30, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          opacity: cliente.status === 'inativo' ? 0.6 : 1,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.3)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Badge de veículos no canto superior direito */}
        {cliente.totalVeiculos > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: ['0 2px 8px rgba(99, 102, 241, 0.4)', '0 2px 16px rgba(99, 102, 241, 0.6)', '0 2px 8px rgba(99, 102, 241, 0.4)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Chip
                icon={<DirectionsCar sx={{ fontSize: 16, color: '#fff !important' }} />}
                label={cliente.totalVeiculos}
                size="small"
                sx={{
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  height: 28,
                  borderRadius: '14px',
                  '& .MuiChip-icon': { color: '#fff' },
                }}
              />
            </motion.div>
          </Box>
        )}

        <CardContent sx={{ p: 2, pt: cliente.totalVeiculos > 0 ? 3 : 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flex: 1, pr: cliente.totalVeiculos > 0 ? 6 : 0 }}>
              <Avatar {...stringAvatar(cliente.nome)} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} noWrap>
                  {cliente.nome || 'Cliente'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CPF: {cliente.cpf || 'N/A'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: cliente.totalVeiculos > 0 ? 3 : 0 }} onClick={(e) => e.stopPropagation()}>
              <Tooltip title={cliente.status === 'ativo' ? 'Desativar' : 'Ativar'}>
                <Switch
                  size="small"
                  checked={cliente.status === 'ativo'}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleStatus(cliente);
                  }}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' },
                  }}
                />
              </Tooltip>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandMore sx={{ color: 'text.secondary' }} />
              </motion.div>
            </Box>
          </Box>

          {/* Contatos Rápidos */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {cliente.telefone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {cliente.telefone}
                </Typography>
              </Box>
            )}
            {cliente.cidade && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationCity sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {cliente.cidade}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Detalhes Expandidos */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            
            {/* Veículos do Cliente */}
            {cliente.totalVeiculos > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Veículos ({cliente.totalVeiculos})
                  </Typography>
                  {valorTotal > 0 && (
                    <Chip
                      size="small"
                      icon={<AttachMoney sx={{ fontSize: 14 }} />}
                      label={`Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`}
                      sx={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                
                {loadingVeiculos ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[1, 2].map((i) => (
                      <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.05)' }} />
                    ))}
                  </Box>
                ) : veiculos.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {veiculos.map((veiculo) => (
                      <motion.div
                        key={veiculo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditVeiculo && onEditVeiculo(veiculo);
                          }}
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.15)',
                              borderColor: 'rgba(99, 102, 241, 0.3)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ p: 0.75, borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
                              <VehicleIcon type={veiculo.tipoVeiculo || 'carro'} size={20} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                  {veiculo.modelo || veiculo.marca || 'Veículo'}
                                </Typography>
                                <Chip
                                  label={veiculo.placa}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                  }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <AttachMoney sx={{ fontSize: 12 }} />
                                  R$ {parseFloat(veiculo.valor || 0).toFixed(2).replace('.', ',')}
                                </Typography>
                                {veiculo.imei && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Router sx={{ fontSize: 12 }} />
                                    {veiculo.imei.slice(-6)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditVeiculo && onEditVeiculo(veiculo);
                              }}
                              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                            >
                              <Edit sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Nenhum veículo encontrado
                  </Typography>
                )}
              </Box>
            )}

            {/* Info adicional */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {cliente.email && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{cliente.email}</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => onAddVeiculo(cliente)}
              >
                <DirectionsCar sx={{ mr: 0.5, fontSize: 16 }} /> Add Veículo
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onEdit(cliente)}
              >
                <Edit sx={{ mr: 0.5, fontSize: 16 }} /> Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onDelete(cliente)}
              >
                <Delete sx={{ mr: 0.5, fontSize: 16 }} /> Excluir
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ClientesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const { clientes, loading, error, buscarClientes, adicionarCliente, atualizarCliente, removerCliente, alternarStatus } = useClientes();
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [redirectToVeiculo, setRedirectToVeiculo] = useState(false);

  // Handler para editar veículo - navega para página de veículos com o veículo selecionado
  const handleEditVeiculo = useCallback((veiculo) => {
    navigate('/veiculos', { state: { editarVeiculoId: veiculo.id } });
  }, [navigate]);

  // Filtrar clientes pelo termo de busca
  const clientesFiltrados = useMemo(() => {
    if (!termoBusca) return clientes;
    const termo = termoBusca.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nome?.toLowerCase().includes(termo) ||
        c.cpf?.includes(termo) ||
        c.telefone?.includes(termo) ||
        c.cidade?.toLowerCase().includes(termo)
    );
  }, [clientes, termoBusca]);

  const handleBusca = (e) => {
    const termo = e.target.value;
    setTermoBusca(termo);
    if (termo.length >= 3 || termo.length === 0) {
      buscarClientes(termo);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await buscarClientes('');
    setTermoBusca('');
    setRefreshing(false);
  };

  const handleOpenModal = (cliente = null) => {
    setClienteSelecionado(cliente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClienteSelecionado(null);
  };

  const handleSaveCliente = async (data) => {
    setSubmitting(true);
    try {
      if (clienteSelecionado) {
        await atualizarCliente(clienteSelecionado.id, data);
        handleCloseModal();
      } else {
        // Novo cliente - redirecionar para adicionar veículo
        const response = await adicionarCliente(data);
        handleCloseModal();
        if (response?.cliente?.id) {
          // Redireciona para página de veículos com o cliente pré-selecionado
          navigate('/veiculos', { state: { novoClienteId: response.cliente.id, novoClienteNome: data.nome } });
        }
      }
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handler para alternar status
  const handleToggleStatus = async (cliente) => {
    try {
      await alternarStatus(cliente.id);
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  // Handler para adicionar veículo a um cliente existente
  const handleAddVeiculo = (cliente) => {
    navigate('/veiculos', { state: { novoClienteId: cliente.id, novoClienteNome: cliente.nome } });
  };

  const handleOpenDeleteDialog = (cliente) => {
    setClienteParaExcluir(cliente);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (clienteParaExcluir) {
      setSubmitting(true);
      try {
        await removerCliente(clienteParaExcluir.id);
      } catch (err) {
        console.error('Erro ao excluir cliente:', err);
      } finally {
        setSubmitting(false);
        setDeleteDialogOpen(false);
        setClienteParaExcluir(null);
      }
    }
  };

  // Colunas para DataTable (desktop)
  const columns = [
    {
      id: 'cliente',
      label: 'Cliente',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar {...stringAvatar(row.nome)} sx={{ width: 40, height: 40, ...stringAvatar(row.nome).sx }} />
          <Box>
            <Typography fontWeight={600}>{row.nome || 'Cliente'}</Typography>
            <Typography variant="caption" color="text.secondary">
              CPF: {row.cpf || 'N/A'}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'contato',
      label: 'Contato',
      render: (row) => (
        <Box>
          {row.telefone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2">{row.telefone}</Typography>
            </Box>
          )}
          {row.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                {row.email}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: 'cidade',
      label: 'Cidade',
      render: (row) => (
        <Typography variant="body2">{row.cidade || 'N/A'}</Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Tooltip title={row.status === 'ativo' ? 'Clique para desativar' : 'Clique para ativar'}>
          <Switch
            size="small"
            checked={row.status === 'ativo'}
            onChange={() => handleToggleStatus(row)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' },
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="Adicionar Veículo">
            <IconButton size="small" onClick={() => handleAddVeiculo(row)} sx={{ color: '#6366f1' }}>
              <DirectionsCar fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenModal(row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading && !clientes.length) return <Loading />;

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Clientes
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie todos os seus clientes
            </Typography>
          </motion.div>
        </Box>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Tooltip title="Atualizar lista">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                }}
              >
                <Refresh
                  sx={{
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              icon={<Add />}
              onClick={() => handleOpenModal()}
            >
              {isMobile ? '' : 'Novo Cliente'}
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<People />}
            label={`${clientes.length} clientes`}
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${clientes.filter(c => c.status === 'ativo').length} ativos`}
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 500,
            }}
          />
        </Box>
      </motion.div>

      {/* Busca */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: 2, mb: 3 }}>
          <SearchInput
            value={termoBusca}
            onChange={handleBusca}
            placeholder="Buscar por nome, CPF, telefone..."
            onClear={() => {
              setTermoBusca('');
              buscarClientes('');
            }}
          />
        </GlassCard>
      </motion.div>

      {/* Lista / Tabela */}
      <motion.div variants={itemVariants}>
        {clientesFiltrados.length > 0 ? (
          isMobile ? (
            <Box>
              <AnimatePresence>
                {clientesFiltrados.map((cliente) => (
                  <ClienteCard
                    key={cliente.id}
                    cliente={cliente}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteDialog}
                    onView={() => {}}
                    onToggleStatus={handleToggleStatus}
                    onAddVeiculo={handleAddVeiculo}
                    onEditVeiculo={handleEditVeiculo}
                  />
                ))}
              </AnimatePresence>
            </Box>
          ) : (
            <GlassCard sx={{ overflow: 'hidden' }}>
              <DataTable
                columns={columns}
                data={clientesFiltrados}
                loading={loading}
                emptyMessage="Nenhum cliente encontrado"
              />
            </GlassCard>
          )
        ) : (
          <EmptyState
            icon={<People />}
            title="Nenhum cliente encontrado"
            description={
              termoBusca
                ? 'Tente ajustar os termos da busca'
                : 'Clique no botão acima para adicionar o primeiro cliente'
            }
            action={
              !termoBusca && (
                <Button
                  variant="contained"
                  icon={<Add />}
                  onClick={() => handleOpenModal()}
                >
                  Adicionar Cliente
                </Button>
              )
            }
          />
        )}
      </motion.div>

      {/* Modal de Cliente */}
      <ClienteModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCliente}
        cliente={clienteSelecionado}
        loading={submitting}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${clienteParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        loading={submitting}
      />
    </Box>
  );
}
