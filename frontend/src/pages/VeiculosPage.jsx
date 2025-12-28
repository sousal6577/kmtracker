// src/pages/VeiculosPage.jsx - Página de Veículos Moderna
import { useState, useMemo } from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function VeiculosPage() {
  const { veiculos, loading, excluirVeiculo, adicionarVeiculo, atualizarVeiculo, carregarVeiculos } = useVeiculos();
  const { clientes } = useClientes();
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [actionVeiculo, setActionVeiculo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar veículos pelo termo de busca
  const veiculosFiltrados = useMemo(() => {
    if (!termoBusca) return veiculos;
    const termo = termoBusca.toLowerCase();
    return veiculos.filter(
      (v) =>
        v.nome?.toLowerCase().includes(termo) ||
        v.n_placa?.toLowerCase().includes(termo) ||
        v.veiculo?.toLowerCase().includes(termo) ||
        v.marca?.toLowerCase().includes(termo)
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
    handleCloseActionMenu();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setVeiculoSelecionado(null);
  };

  const handleSaveVeiculo = async (data) => {
    setSubmitting(true);
    try {
      if (veiculoSelecionado) {
        await atualizarVeiculo(veiculoSelecionado.cpf, veiculoSelecionado.id, data);
      } else {
        await adicionarVeiculo(data.clienteId, data);
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
    handleCloseActionMenu();
  };

  const handleConfirmDelete = async () => {
    if (veiculoParaExcluir) {
      setSubmitting(true);
      try {
        await excluirVeiculo(veiculoParaExcluir.cpf, veiculoParaExcluir.id);
      } catch (err) {
        console.error('Erro ao excluir veículo:', err);
      } finally {
        setSubmitting(false);
        setDeleteDialogOpen(false);
        setVeiculoParaExcluir(null);
      }
    }
  };

  const handleOpenActionMenu = (event, veiculo) => {
    setActionMenuAnchor(event.currentTarget);
    setActionVeiculo(veiculo);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setActionVeiculo(null);
  };

  const getVehicleType = (veiculo) => {
    const name = (veiculo.veiculo || veiculo.tipo || '').toLowerCase();
    if (name.includes('moto')) return 'moto';
    if (name.includes('caminh')) return 'caminhao';
    if (name.includes('van')) return 'van';
    if (name.includes('trator')) return 'trator';
    if (name.includes('onibus') || name.includes('ônibus')) return 'onibus';
    return 'carro';
  };

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
            <VehicleIcon type={getVehicleType(row)} size={28} />
          </Box>
          <Box>
            <Typography fontWeight={600}>
              {row.marca} {row.modelo || row.veiculo}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                icon={<Badge sx={{ fontSize: 14 }} />}
                label={row.n_placa}
                size="small"
                sx={{
                  height: 22,
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': { color: 'primary.main' },
                }}
              />
              {row.ano && (
                <Typography variant="caption" color="text.secondary">
                  {row.ano}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      id: 'cliente',
      label: 'Cliente',
      render: (row) => (
        <Typography variant="body2">{row.nome || 'N/A'}</Typography>
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
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status || 'PENDENTE'} />,
    },
    {
      id: 'acoes',
      label: 'Ações',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Mais ações">
            <IconButton
              size="small"
              onClick={(e) => handleOpenActionMenu(e, row)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                },
              }}
            >
              <MoreVert />
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
          mb: 4,
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
              Novo Veículo
            </Button>
          </Box>
        </motion.div>
      </Box>

      {/* Stats rápidas */}
      <motion.div variants={itemVariants}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            icon={<DirectionsCar />}
            label={`${veiculos.length} veículos`}
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${veiculos.filter((v) => v.status === 'PAGO').length} em dia`}
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${veiculos.filter((v) => v.status === 'ATRASADO').length} atrasados`}
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
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
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por cliente, placa, modelo..."
            onClear={() => setTermoBusca('')}
          />
        </GlassCard>
      </motion.div>

      {/* Tabela */}
      <motion.div variants={itemVariants}>
        {veiculosFiltrados.length > 0 ? (
          <GlassCard sx={{ overflow: 'hidden' }}>
            <DataTable
              columns={columns}
              data={veiculosFiltrados}
              loading={loading}
              emptyMessage="Nenhum veículo encontrado"
            />
          </GlassCard>
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

      {/* Menu de Ações */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => handleOpenModal(actionVeiculo)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenDeleteDialog(actionVeiculo)}
          sx={{ color: '#ef4444' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Veículo */}
      <VeiculoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVeiculo}
        veiculo={veiculoSelecionado}
        clientes={clientes}
        loading={submitting}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Veículo"
        message={`Tem certeza que deseja excluir o veículo "${veiculoParaExcluir?.n_placa}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        loading={submitting}
      />
    </Box>
  );
}
