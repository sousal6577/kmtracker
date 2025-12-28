// src/pages/PagamentosPage.jsx - Página de Pagamentos Moderna
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge as MuiBadge,
} from '@mui/material';
import {
  Check,
  Close,
  Refresh,
  Add,
  Payment,
  Schedule,
  Warning,
  CheckCircle,
  MoreVert,
  Edit,
  AttachMoney,
  CalendarMonth,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePagamentos, useVeiculos, useClientes } from '../hooks';
import {
  GlassCard,
  SearchInput,
  DataTable,
  Button,
  StatusBadge,
  EmptyState,
  ConfirmDialog,
} from '../components/ui';
import { PagamentoModal } from '../components/modals';
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

function TabPanel({ children, value, index }) {
  return (
    <AnimatePresence mode="wait">
      {value === index && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Box sx={{ pt: 3 }}>{children}</Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PagamentosPage() {
  const [tab, setTab] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [novoMesDialogOpen, setNovoMesDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [actionVeiculo, setActionVeiculo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { veiculos, loading: loadingVeiculos, carregarVeiculos } = useVeiculos();
  const { clientes } = useClientes();
  const {
    atrasados,
    loading: loadingPag,
    carregarAtrasados,
    confirmarPagamento,
    marcarPendente,
    iniciarNovoMes,
  } = usePagamentos();

  useEffect(() => {
    carregarAtrasados();
  }, [carregarAtrasados]);

  const handleConfirmar = async (veiculo) => {
    setSubmitting(true);
    try {
      await confirmarPagamento(veiculo.cpf, veiculo.id);
      await carregarVeiculos();
      await carregarAtrasados();
    } finally {
      setSubmitting(false);
    }
    handleCloseActionMenu();
  };

  const handlePendente = async (veiculo) => {
    setSubmitting(true);
    try {
      await marcarPendente(veiculo.cpf, veiculo.id);
      await carregarVeiculos();
      await carregarAtrasados();
    } finally {
      setSubmitting(false);
    }
    handleCloseActionMenu();
  };

  const handleNovoMes = async () => {
    setSubmitting(true);
    try {
      await iniciarNovoMes();
      await carregarVeiculos();
      await carregarAtrasados();
    } finally {
      setSubmitting(false);
      setNovoMesDialogOpen(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([carregarVeiculos(), carregarAtrasados()]);
    setRefreshing(false);
  };

  const handleOpenModal = (pagamento = null) => {
    setPagamentoSelecionado(pagamento);
    setModalOpen(true);
    handleCloseActionMenu();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPagamentoSelecionado(null);
  };

  const handleSavePagamento = async (data) => {
    setSubmitting(true);
    try {
      // Implementar lógica de salvar pagamento
      console.log('Salvar pagamento:', data);
      handleCloseModal();
      await handleRefresh();
    } catch (err) {
      console.error('Erro ao salvar pagamento:', err);
    } finally {
      setSubmitting(false);
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

  const loading = loadingVeiculos || loadingPag;

  // Filtra veículos por status
  const pendentes = useMemo(() => 
    veiculos.filter((v) =>
      v.status === 'PENDENTE' &&
      (!termoBusca ||
        v.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        v.n_placa?.toLowerCase().includes(termoBusca.toLowerCase()))
    ),
    [veiculos, termoBusca]
  );

  const pagos = useMemo(() =>
    veiculos.filter((v) =>
      v.status === 'PAGO' &&
      (!termoBusca ||
        v.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        v.n_placa?.toLowerCase().includes(termoBusca.toLowerCase()))
    ),
    [veiculos, termoBusca]
  );

  const atrasadosFiltrados = useMemo(() =>
    atrasados.filter((v) =>
      !termoBusca ||
      v.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      v.n_placa?.toLowerCase().includes(termoBusca.toLowerCase())
    ),
    [atrasados, termoBusca]
  );

  const getColumns = (status) => [
    {
      id: 'cliente',
      label: 'Cliente',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor:
                status === 'PAGO'
                  ? 'rgba(34, 197, 94, 0.2)'
                  : status === 'ATRASADO'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(245, 158, 11, 0.2)',
              color:
                status === 'PAGO'
                  ? '#22c55e'
                  : status === 'ATRASADO'
                  ? '#ef4444'
                  : '#f59e0b',
              width: 40,
              height: 40,
            }}
          >
            {row.nome?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{row.nome}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.veiculo}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'placa',
      label: 'Placa',
      render: (row) => (
        <Chip
          label={row.n_placa}
          size="small"
          sx={{
            backgroundColor:
              status === 'PAGO'
                ? 'rgba(34, 197, 94, 0.15)'
                : status === 'ATRASADO'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
            color:
              status === 'PAGO'
                ? '#22c55e'
                : status === 'ATRASADO'
                ? '#ef4444'
                : '#f59e0b',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'valor',
      label: 'Valor',
      render: (row) => (
        <Typography fontWeight={600}>
          R$ {parseFloat(row.valor || 0).toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'acoes',
      label: 'Ações',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {status !== 'PAGO' && (
            <Tooltip title="Confirmar Pagamento">
              <IconButton
                size="small"
                onClick={() => handleConfirmar(row)}
                disabled={submitting}
                sx={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e',
                  '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
                }}
              >
                <Check />
              </IconButton>
            </Tooltip>
          )}
          {status === 'PAGO' && (
            <Tooltip title="Marcar como Pendente">
              <IconButton
                size="small"
                onClick={() => handlePendente(row)}
                disabled={submitting}
                sx={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Mais ações">
            <IconButton
              size="small"
              onClick={(e) => handleOpenActionMenu(e, row)}
              sx={{
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
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
              Pagamentos
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie os pagamentos mensais dos clientes
            </Typography>
          </motion.div>
        </Box>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
              variant="outlined"
              icon={<CalendarMonth />}
              onClick={() => setNovoMesDialogOpen(true)}
              sx={{
                borderColor: 'rgba(245, 158, 11, 0.5)',
                color: '#f59e0b',
                '&:hover': {
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                },
              }}
            >
              Novo Mês
            </Button>
            <Button
              variant="contained"
              icon={<Add />}
              onClick={() => handleOpenModal()}
            >
              Registrar Pagamento
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
            icon={<Schedule />}
            label={`${pendentes.length} pendentes`}
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<CheckCircle />}
            label={`${pagos.length} pagos`}
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<Warning />}
            label={`${atrasadosFiltrados.length} atrasados`}
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
            placeholder="Buscar por cliente ou placa..."
            onClear={() => setTermoBusca('')}
          />
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 56,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule fontSize="small" />
                  Pendentes
                  <MuiBadge
                    badgeContent={pendentes.length}
                    color="warning"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle fontSize="small" />
                  Pagos
                  <MuiBadge
                    badgeContent={pagos.length}
                    color="success"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning fontSize="small" />
                  Atrasados
                  <MuiBadge
                    badgeContent={atrasadosFiltrados.length}
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
          </Tabs>
        </GlassCard>
      </motion.div>

      {/* Tab Pendentes */}
      <TabPanel value={tab} index={0}>
        {pendentes.length > 0 ? (
          <GlassCard variant="warning" sx={{ overflow: 'hidden' }}>
            <DataTable
              columns={getColumns('PENDENTE')}
              data={pendentes}
              loading={loading}
            />
          </GlassCard>
        ) : (
          <EmptyState
            icon={<Schedule />}
            title="Nenhum pagamento pendente"
            description="Todos os pagamentos deste mês foram confirmados"
          />
        )}
      </TabPanel>

      {/* Tab Pagos */}
      <TabPanel value={tab} index={1}>
        {pagos.length > 0 ? (
          <GlassCard variant="success" sx={{ overflow: 'hidden' }}>
            <DataTable
              columns={getColumns('PAGO')}
              data={pagos}
              loading={loading}
            />
          </GlassCard>
        ) : (
          <EmptyState
            icon={<CheckCircle />}
            title="Nenhum pagamento confirmado"
            description="Os pagamentos aparecerão aqui quando forem confirmados"
          />
        )}
      </TabPanel>

      {/* Tab Atrasados */}
      <TabPanel value={tab} index={2}>
        {atrasadosFiltrados.length > 0 ? (
          <GlassCard variant="danger" sx={{ overflow: 'hidden' }}>
            <DataTable
              columns={getColumns('ATRASADO')}
              data={atrasadosFiltrados}
              loading={loading}
            />
          </GlassCard>
        ) : (
          <EmptyState
            icon={<CheckCircle />}
            title="Nenhum pagamento atrasado"
            description="Excelente! Todos os clientes estão em dia"
          />
        )}
      </TabPanel>

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
          <ListItemText>Editar Pagamento</ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Pagamento */}
      <PagamentoModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePagamento}
        pagamento={pagamentoSelecionado}
        veiculos={veiculos}
        clientes={clientes}
        loading={submitting}
      />

      {/* Diálogo de Confirmação - Novo Mês */}
      <ConfirmDialog
        open={novoMesDialogOpen}
        onClose={() => setNovoMesDialogOpen(false)}
        onConfirm={handleNovoMes}
        title="Iniciar Novo Mês"
        message="Isso irá resetar todos os pagamentos para PENDENTE e mover os não pagos para ATRASADO. Deseja continuar?"
        variant="warning"
        loading={submitting}
        confirmText="Iniciar Novo Mês"
      />
    </Box>
  );
}
