// src/pages/DashboardPage.jsx - Dashboard Moderno com Glassmorphism
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  DirectionsCar,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
  Refresh,
  ArrowForward,
  Speed,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { clienteApi, pagamentoApi } from '../api';
import { GlassCard, StatsCard } from '../components/ui';
import Loading from '../components/common/Loading';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [atrasados, setAtrasados] = useState([]);
  const [recentPagamentos, setRecentPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      const [statsRes, atrasadosRes, pagamentosRes] = await Promise.all([
        clienteApi.estatisticas(),
        pagamentoApi.listarAtrasados(),
        pagamentoApi.listar(),
      ]);
      
      if (statsRes.success) setStats(statsRes.estatisticas);
      if (atrasadosRes.success) setAtrasados(atrasadosRes.atrasados || []);
      if (pagamentosRes.success) {
        const recentes = (pagamentosRes.pagamentos || [])
          .filter(p => p.status === 'PAGO')
          .slice(0, 5);
        setRecentPagamentos(recentes);
      }
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;

  const taxaPagamento = stats?.totalClientes 
    ? Math.round((stats.pagos / stats.totalClientes) * 100) 
    : 0;

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
              Dashboard
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Bem-vindo! Aqui está o resumo do seu sistema.
            </Typography>
          </motion.div>
        </Box>
        
        <motion.div variants={itemVariants}>
          <Tooltip title="Atualizar dados">
            <IconButton
              onClick={() => loadData(true)}
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
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total de Clientes"
              value={stats?.totalClientes || 0}
              icon={<People />}
              trend={5}
              subtitle="ativos no sistema"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Veículos Rastreados"
              value={stats?.totalVeiculos || 0}
              icon={<DirectionsCar />}
              trend={8}
              subtitle="em monitoramento"
              color="#6366f1"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Pagamentos Recebidos"
              value={stats?.pagos || 0}
              icon={<AttachMoney />}
              trend={12}
              subtitle="este mês"
              color="#22c55e"
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Pagamentos Atrasados"
              value={atrasados.length}
              icon={<Warning />}
              trend={atrasados.length > 0 ? -5 : 0}
              subtitle="precisam de atenção"
              color="#ef4444"
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Conteúdo Principal */}
      <Grid container spacing={3}>
        {/* Taxa de Pagamento */}
        <Grid item xs={12} lg={4}>
          <motion.div variants={itemVariants}>
            <GlassCard
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Speed sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Taxa de Pagamento
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 160,
                    height: 160,
                    mb: 2,
                  }}
                >
                  {/* Background Circle */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '12px solid rgba(255,255,255,0.05)',
                    }}
                  />
                  {/* Progress Circle */}
                  <Box
                    component={motion.div}
                    initial={{ rotate: -90 }}
                    animate={{ rotate: -90 }}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: `conic-gradient(
                        #6366f1 ${taxaPagamento * 3.6}deg,
                        transparent ${taxaPagamento * 3.6}deg
                      )`,
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 12px))',
                      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 12px))',
                    }}
                  />
                  {/* Center Content */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {taxaPagamento}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      em dia
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      icon={<CheckCircle />}
                      label={stats?.pagos || 0}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        '& .MuiChip-icon': { color: '#22c55e' },
                      }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                      Pagos
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      icon={<Schedule />}
                      label={stats?.pendentes || 0}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        '& .MuiChip-icon': { color: '#f59e0b' },
                      }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                      Pendentes
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Pagamentos Atrasados */}
        <Grid item xs={12} lg={8}>
          <motion.div variants={itemVariants}>
            <GlassCard
              variant={atrasados.length > 0 ? 'danger' : 'default'}
              sx={{ p: 3, height: '100%' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning sx={{ color: atrasados.length > 0 ? '#ef4444' : 'text.secondary', mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Pagamentos Atrasados
                  </Typography>
                </Box>
                {atrasados.length > 0 && (
                  <Chip
                    label={`${atrasados.length} pendências`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              {atrasados.length > 0 ? (
                <List sx={{ py: 0 }}>
                  <AnimatePresence>
                    {atrasados.slice(0, 5).map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <ListItem
                          sx={{
                            px: 2,
                            py: 1.5,
                            borderRadius: '12px',
                            mb: 1,
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            },
                          }}
                          secondaryAction={
                            <IconButton edge="end" size="small">
                              <ArrowForward fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                              }}
                            >
                              {item.nome?.charAt(0) || 'C'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography fontWeight={600}>{item.nome}</Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip
                                  label={item.n_placa}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {item.veiculo}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {atrasados.length > 5 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        + {atrasados.length - 5} mais atrasados
                      </Typography>
                    </Box>
                  )}
                </List>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: '#22c55e', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} color="#22c55e">
                    Tudo em dia!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum pagamento atrasado no momento
                  </Typography>
                </Box>
              )}
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Últimos Pagamentos Recebidos */}
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <GlassCard variant="success" sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: '#22c55e', mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Últimos Pagamentos Recebidos
                  </Typography>
                </Box>
              </Box>

              {recentPagamentos.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {recentPagamentos.map((pag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(34, 197, 94, 0.05)',
                          border: '1px solid rgba(34, 197, 94, 0.1)',
                          minWidth: 200,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {pag.clienteNome || 'Cliente'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pag.veiculoPlaca || 'Veículo'}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="h6" color="#22c55e" fontWeight={700}>
                            R$ {pag.valor}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum pagamento recebido recentemente
                </Typography>
              )}
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
