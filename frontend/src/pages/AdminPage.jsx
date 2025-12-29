// src/pages/AdminPage.jsx - Página de Administração com Gerenciamento de Usuários
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Divider,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  DirectionsCar,
  Payment,
  Settings,
  Security,
  PersonAdd,
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  Check,
  Close,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GlassCard, Button, LoadingOverlay } from '../components/ui';
import authApi from '../api/authApi';
import clienteApi from '../api/clienteApi';

// Animações simplificadas para melhor performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function AdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalVeiculos: 0,
    totalUsuarios: 0,
  });

  // Modal de criar usuário
  const [openUserModal, setOpenUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'operador',
  });

  // Carrega dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        authApi.listUsers(),
        clienteApi.obterEstatisticas(),
      ]);

      if (usersRes.success) {
        setUsers(usersRes.users || []);
      }
      if (statsRes.success) {
        setStats({
          totalClientes: statsRes.estatisticas?.totalClientes || 0,
          totalVeiculos: statsRes.estatisticas?.totalVeiculos || 0,
          totalUsuarios: usersRes.users?.length || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        nome: user.nome || '',
        email: user.email || '',
        senha: '',
        role: user.role || 'operador',
      });
    } else {
      setEditingUser(null);
      setUserForm({
        nome: '',
        email: '',
        senha: '',
        role: 'operador',
      });
    }
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
    setEditingUser(null);
    setUserForm({ nome: '', email: '', senha: '', role: 'operador' });
    setShowPassword(false);
  };

  const handleSaveUser = async () => {
    if (!userForm.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      // Senha padrão para novos usuários: mudar123
      const senhaParaEnviar = editingUser 
        ? (userForm.senha.trim() || undefined) 
        : (userForm.senha.trim() || 'mudar123');
      
      const result = await authApi.register({
        nome: userForm.nome,
        email: userForm.email,
        senha: senhaParaEnviar,
        role: userForm.role,
      });

      if (result.success) {
        toast.success(editingUser ? 'Usuário atualizado!' : 'Usuário criado!');
        handleCloseUserModal();
        loadData();
      } else {
        toast.error(result.message || 'Erro ao salvar usuário');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <LoadingOverlay loading={loading} />
      
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AdminPanelSettings sx={{ fontSize: { xs: 28, sm: 36 }, color: '#6366f1' }} />
              Administração
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
              Gerencie usuários e visualize estatísticas
            </Typography>
          </Box>
          <Button
            startIcon={<PersonAdd />}
            onClick={() => handleOpenUserModal()}
            sx={{ minWidth: 150 }}
          >
            Novo Usuário
          </Button>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <GlassCard sx={{ p: 2, textAlign: 'center' }}>
              <People sx={{ fontSize: 32, color: '#6366f1', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>{stats.totalClientes}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Clientes</Typography>
            </GlassCard>
          </Grid>
          <Grid item xs={4}>
            <GlassCard sx={{ p: 2, textAlign: 'center' }}>
              <DirectionsCar sx={{ fontSize: 32, color: '#22c55e', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>{stats.totalVeiculos}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Veículos</Typography>
            </GlassCard>
          </Grid>
          <Grid item xs={4}>
            <GlassCard sx={{ p: 2, textAlign: 'center' }}>
              <Security sx={{ fontSize: 32, color: '#eab308', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>{stats.totalUsuarios}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>Usuários</Typography>
            </GlassCard>
          </Grid>
        </Grid>
      </motion.div>

      {/* Tabela de Usuários */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ color: '#6366f1' }} />
              Usuários do Sistema
            </Typography>
            <IconButton onClick={loadData} size="small" sx={{ color: '#6366f1' }}>
              <Refresh />
            </IconButton>
          </Box>
          
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 600 }}>Nome</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 600 }}>Função</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', fontWeight: 600 }} align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Nenhum usuário cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.nome}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'admin' ? 'Admin' : 'Operador'}
                          size="small"
                          sx={{
                            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                            color: user.role === 'admin' ? '#ef4444' : '#6366f1',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {user.ativo !== false ? (
                            <>
                              <Check sx={{ fontSize: 16, color: '#22c55e' }} />
                              <Typography sx={{ fontSize: '0.75rem', color: '#22c55e' }}>Ativo</Typography>
                            </>
                          ) : (
                            <>
                              <Close sx={{ fontSize: 16, color: '#ef4444' }} />
                              <Typography sx={{ fontSize: '0.75rem', color: '#ef4444' }}>Inativo</Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenUserModal(user)} sx={{ color: '#6366f1' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      </motion.div>

      {/* System Info */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings sx={{ color: '#6366f1' }} />
            Informações do Sistema
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Versão</Typography>
              <Chip label="2.0.0" size="small" color="primary" />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Banco de Dados</Typography>
              <Chip label="Firestore" size="small" sx={{ backgroundColor: '#eab308', color: '#000' }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Status</Typography>
              <Chip label="Online" size="small" sx={{ backgroundColor: '#22c55e' }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Última Atualização</Typography>
              <Typography sx={{ fontSize: '0.85rem' }}>{new Date().toLocaleDateString('pt-BR')}</Typography>
            </Box>
          </Box>
        </GlassCard>
      </motion.div>

      {/* Modal de Criar/Editar Usuário */}
      <Dialog
        open={openUserModal}
        onClose={handleCloseUserModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(20, 20, 35, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd sx={{ color: '#6366f1' }} />
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nome"
            value={userForm.nome}
            onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
            fullWidth
            required
            autoFocus
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          />
          
          <TextField
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          />
          
          <TextField
            label={editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha (opcional - padrão: mudar123)'}
            type={showPassword ? 'text' : 'password'}
            value={userForm.senha}
            onChange={(e) => setUserForm({ ...userForm, senha: e.target.value })}
            fullWidth
            placeholder={editingUser ? '' : 'mudar123'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={!editingUser ? 'Se não informar, será usada a senha padrão: mudar123' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Função</InputLabel>
            <Select
              value={userForm.role}
              label="Função"
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
              }}
            >
              <MenuItem value="operador">Operador</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
          
          {!editingUser && (
            <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0.5 }}>
              Senha padrão: <strong>mudar123</strong> - O usuário deverá alterá-la no primeiro acesso.
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button variant="outlined" onClick={handleCloseUserModal}>
            Cancelar
          </Button>
          <Button onClick={handleSaveUser} disabled={loading}>
            {editingUser ? 'Salvar' : 'Criar Usuário'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
