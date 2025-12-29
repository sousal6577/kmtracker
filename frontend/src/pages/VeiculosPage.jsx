// src/pages/VeiculosPage.jsx - Página de Veículos Responsiva
import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  DirectionsCar,
  Refresh,
  Badge,
  AttachMoney,
  ExpandMore,
  ExpandLess,
  Phone,
  Person,
  CalendarMonth,
  Router,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useVeiculos, useClientes } from '../hooks';
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
import { VeiculoModal } from '../components/modals';
import Loading from '../components/common/Loading';
import { formatDate } from '../utils/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Card de Veículo para Mobile
function VeiculoCard({ veiculo, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAGO': return { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' };
      case 'ATRASADO': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
      default: return { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308' };
    }
  };

  const statusStyle = getStatusColor(veiculo.statusVeiculo || veiculo.situacao);

  return (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          mb: 2,
          backgroundColor: 'rgba(30, 30, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flex: 1 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                }}
              >
                <VehicleIcon type={veiculo.tipoVeiculo || 'carro'} size={28} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} noWrap>
                  {veiculo.modelo || veiculo.veiculo || 'Veículo'}
                </Typography>
                <Chip
                  label={veiculo.placa || veiculo.n_placa || 'N/A'}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 22,
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" onClick={() => onEdit(veiculo)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Info Básica */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {veiculo.clienteNome || 'N/A'}
              </Typography>
            </Box>
            <Chip
              icon={<AttachMoney sx={{ fontSize: 16 }} />}
              label={`R$ ${parseFloat(veiculo.valor || 0).toFixed(2)}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#22c55e' },
              }}
            />
          </Box>

          {/* Detalhes Expandidos */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {veiculo.tipoVeiculo || 'Carro'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Vencimento</Typography>
                <Typography variant="body2">Dia {veiculo.diaVencimento || 10}</Typography>
              </Box>
              {veiculo.imei && (
                <Box>
                  <Typography variant="caption" color="text.secondary">IMEI</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{veiculo.imei}</Typography>
                </Box>
              )}
              {veiculo.numeroSim && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Nº SIM</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{veiculo.numeroSim}</Typography>
                </Box>
              )}
              {veiculo.equipamento && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Equipamento</Typography>
                  <Typography variant="body2">{veiculo.equipamento}</Typography>
                </Box>
              )}
              {veiculo.tipoAquisicao && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Aquisição</Typography>
                  <Typography variant="body2">{veiculo.tipoAquisicao}</Typography>
                </Box>
              )}
              {veiculo.dataInstalacao && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Instalação</Typography>
                  <Typography variant="body2">{formatDate(veiculo.dataInstalacao)}</Typography>
                </Box>
              )}
              {veiculo.cidade && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Cidade</Typography>
                  <Typography variant="body2">{veiculo.cidade}</Typography>
                </Box>
              )}
              {veiculo.obs && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" color="text.secondary">Observação</Typography>
                  <Typography variant="body2">{veiculo.obs}</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onDelete(veiculo)}
                sx={{ fontSize: '0.75rem' }}
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

export default function VeiculosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const { veiculos, loading, excluirVeiculo, adicionarVeiculo, atualizarVeiculo, carregarVeiculos } = useVeiculos();
  const { clientes } = useClientes();
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [clientePreSelecionado, setClientePreSelecionado] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Se vier de Clientes com um cliente pré-selecionado, abre o modal automaticamente
  useEffect(() => {
    if (location.state?.novoClienteId) {
      setClientePreSelecionado({
        id: location.state.novoClienteId,
        nome: location.state.novoClienteNome
      });
      setModalOpen(true);
      // Limpa o state para não abrir novamente se voltar à página
      window.history.replaceState({}, document.title);
    }
    // Se vier para editar um veículo específico
    if (location.state?.editarVeiculoId) {
      const veiculo = veiculos.find(v => v.id === location.state.editarVeiculoId);
      if (veiculo) {
        setVeiculoSelecionado(veiculo);
        setModalOpen(true);
      }
      // Limpa o state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, veiculos]);

  // Filtrar veículos
  const veiculosFiltrados = useMemo(() => {
    if (!termoBusca) return veiculos;
    const termo = termoBusca.toLowerCase();
    return veiculos.filter(
      (v) =>
        v.clienteNome?.toLowerCase().includes(termo) ||
        v.placa?.toLowerCase().includes(termo) ||
        v.n_placa?.toLowerCase().includes(termo) ||
        v.modelo?.toLowerCase().includes(termo) ||
        v.veiculo?.toLowerCase().includes(termo)
    );
  }, [veiculos, termoBusca]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarVeiculos();
    setTermoBusca('');
    setRefreshing(false);
  };

  const handleOpenModal = (veiculo = null) => {
    setVeiculoSelecionado(veiculo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setVeiculoSelecionado(null);
    setClientePreSelecionado(null);
  };

  const handleSaveVeiculo = async (data) => {
    setSubmitting(true);
    try {
      // Busca o cliente selecionado para pegar o CPF
      const clienteSelecionado = clientes.find(c => c.id === data.clienteId);
      
      // Transforma os dados para o formato esperado pelo backend
      const dadosParaEnviar = {
        clienteId: data.clienteId,
        clienteCpf: clienteSelecionado?.cpf || '',
        clienteNome: clienteSelecionado?.nome || '',
        placa: data.placa,
        modelo: data.modelo,
        marca: data.marca,
        tipoVeiculo: data.tipo,
        ano: data.ano,
        cor: data.cor,
        valor: data.valor ? parseFloat(data.valor.toString().replace(/\./g, '').replace(',', '.')) : 0,
        dataInstalacao: data.dataInstalacao,
        imei: data.imei || '',
        numeroSim: data.numeroSim || '',
        equipamento: data.equipamento || '',
        tipoAquisicao: data.tipoAquisicao || '',
        obs: data.obs || '',
      };

      if (veiculoSelecionado) {
        await atualizarVeiculo(veiculoSelecionado.id, dadosParaEnviar);
      } else {
        await adicionarVeiculo(dadosParaEnviar);
      }
      handleCloseModal();
      await carregarVeiculos();
    } catch (err) {
      console.error('Erro ao salvar veículo:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (veiculo) => {
    setVeiculoParaExcluir(veiculo);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (veiculoParaExcluir) {
      setSubmitting(true);
      try {
        await excluirVeiculo(veiculoParaExcluir.id);
      } catch (err) {
        console.error('Erro ao excluir veículo:', err);
      } finally {
        setSubmitting(false);
        setDeleteDialogOpen(false);
        setVeiculoParaExcluir(null);
      }
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: veiculos.length,
    emDia: veiculos.filter(v => v.situacao === 'PAGO' || v.statusVeiculo === 'ativo').length,
    atrasados: veiculos.filter(v => v.situacao === 'ATRASADO').length,
  }), [veiculos]);

  // Colunas para DataTable (desktop)
  const columns = [
    {
      id: 'veiculo',
      label: 'Veículo',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
            }}
          >
            <VehicleIcon type={row.tipoVeiculo || 'carro'} size={28} />
          </Box>
          <Box>
            <Typography fontWeight={600}>
              {row.modelo || row.veiculo || 'Veículo'}
            </Typography>
            <Chip
              label={row.placa || row.n_placa || 'N/A'}
              size="small"
              sx={{
                mt: 0.5,
                height: 22,
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>
      ),
    },
    {
      id: 'cliente',
      label: 'Cliente',
      render: (row) => (
        <Typography variant="body2">{row.clienteNome || 'N/A'}</Typography>
      ),
    },
    {
      id: 'valor',
      label: 'Valor Mensal',
      render: (row) => (
        <Chip
          icon={<AttachMoney sx={{ fontSize: 16 }} />}
          label={`R$ ${parseFloat(row.valor || 0).toFixed(2)}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#22c55e' },
          }}
        />
      ),
    },
    {
      id: 'tipo',
      label: 'Tipo',
      render: (row) => (
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {row.tipoVeiculo || 'Carro'}
        </Typography>
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
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

  if (loading && !veiculos.length) return <Loading />;

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
              Veículos
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie todos os veículos rastreados
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
              {isMobile ? '' : 'Novo Veículo'}
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<DirectionsCar />}
            label={`${stats.total} veículos`}
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${stats.emDia} ativos`}
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 500,
            }}
          />
          {stats.atrasados > 0 && (
            <Chip
              label={`${stats.atrasados} atrasados`}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
      </motion.div>

      {/* Busca */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: 2, mb: 3 }}>
          <SearchInput
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por cliente, placa, modelo..."
            onClear={() => setTermoBusca('')}
          />
        </GlassCard>
      </motion.div>

      {/* Lista / Tabela */}
      <motion.div variants={itemVariants}>
        {veiculosFiltrados.length > 0 ? (
          isMobile ? (
            <Box>
              <AnimatePresence>
                {veiculosFiltrados.map((veiculo) => (
                  <VeiculoCard
                    key={veiculo.id}
                    veiculo={veiculo}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteDialog}
                  />
                ))}
              </AnimatePresence>
            </Box>
          ) : (
            <GlassCard sx={{ overflow: 'hidden' }}>
              <DataTable
                columns={columns}
                data={veiculosFiltrados}
                loading={loading}
                emptyMessage="Nenhum veículo encontrado"
              />
            </GlassCard>
          )
        ) : (
          <EmptyState
            icon={<DirectionsCar />}
            title="Nenhum veículo encontrado"
            description={
              termoBusca
                ? 'Tente ajustar os termos da busca'
                : 'Clique no botão acima para adicionar o primeiro veículo'
            }
            action={
              !termoBusca && (
                <Button
                  variant="contained"
                  icon={<Add />}
                  onClick={() => handleOpenModal()}
                >
                  Adicionar Veículo
                </Button>
              )
            }
          />
        )}
      </motion.div>

      {/* Modal de Veículo */}
      <VeiculoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVeiculo}
        veiculo={veiculoSelecionado}
        clientes={clientes}
        clientePreSelecionado={clientePreSelecionado}
        loading={submitting}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Veículo"
        message={`Tem certeza que deseja excluir o veículo "${veiculoParaExcluir?.placa || veiculoParaExcluir?.n_placa}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        loading={submitting}
      />
    </Box>
  );
}
