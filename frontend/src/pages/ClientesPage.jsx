// src/pages/ClientesPage.jsx - Página de Clientes Moderna
import { useState, useMemo } from 'react';
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useClientes } from '../hooks';
import { 
  GlassCard, 
  SearchInput, 
  DataTable, 
  Button, 
  StatusBadge, 
  EmptyState,
  ConfirmDialog,
} from '../components/ui';
import { ClienteModal } from '../components/modals';
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

export default function ClientesPage() {
  const { clientes, loading, error, buscarClientes, adicionarCliente, atualizarCliente, removerCliente } = useClientes();
  const [termoBusca, setTermoBusca] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [actionCliente, setActionCliente] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar clientes pelo termo de busca
  const clientesFiltrados = useMemo(() => {
    if (!termoBusca) return clientes;
    const termo = termoBusca.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nome?.toLowerCase().includes(termo) ||
        c.cpf?.includes(termo) ||
        c.telefone?.includes(termo)
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
    handleCloseActionMenu();
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
      } else {
        await adicionarCliente(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (cliente) => {
    setClienteParaExcluir(cliente);
    setDeleteDialogOpen(true);
    handleCloseActionMenu();
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

  const handleOpenActionMenu = (event, cliente) => {
    setActionMenuAnchor(event.currentTarget);
    setActionCliente(cliente);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setActionCliente(null);
  };

  const columns = [
    {
      id: 'nome',
      label: 'Cliente',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              width: 40,
              height: 40,
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {row.nome?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{row.nome}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.cpf}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Phone fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
              <Typography variant="body2">{row.telefone}</Typography>
            </Box>
          )}
          {row.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Email fontSize="small" sx={{ color: 'text.secondary', fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: 'veiculos',
      label: 'Veículos',
      align: 'center',
      render: (row) => (
        <Chip
          icon={<DirectionsCar />}
          label={row.totalVeiculos || 0}
          size="small"
          sx={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'primary.main',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: 'primary.main',
            },
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
              Clientes
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie todos os clientes cadastrados no sistema
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
              Novo Cliente
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
            icon={<People />}
            label={`${clientes.length} clientes`}
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${clientes.filter((c) => c.status === 'PAGO').length} em dia`}
            sx={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              fontWeight: 500,
            }}
          />
          <Chip
            label={`${clientes.filter((c) => c.status === 'ATRASADO').length} atrasados`}
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
            onChange={handleBusca}
            placeholder="Buscar por nome, CPF ou telefone..."
            onClear={() => {
              setTermoBusca('');
              buscarClientes('');
            }}
          />
        </GlassCard>
      </motion.div>

      {/* Tabela */}
      <motion.div variants={itemVariants}>
        {clientesFiltrados.length > 0 ? (
          <GlassCard sx={{ overflow: 'hidden' }}>
            <DataTable
              columns={columns}
              data={clientesFiltrados}
              loading={loading}
              emptyMessage="Nenhum cliente encontrado"
            />
          </GlassCard>
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
        <MenuItem onClick={() => handleOpenModal(actionCliente)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleOpenModal(actionCliente)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Detalhes</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleOpenDeleteDialog(actionCliente)}
          sx={{ color: '#ef4444' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>

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
