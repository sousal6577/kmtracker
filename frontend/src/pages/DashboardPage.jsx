// src/pages/DashboardPage.jsx - Dashboard Moderno e Responsivo para Mobile
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  People,
  DirectionsCar,
  Warning,
  CheckCircle,
  Schedule,
  Refresh,
  ArrowForward,
  Speed,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { clienteApi, pagamentoApi } from '../api';
import { GlassCard, VehicleIcon } from '../components/ui';
import Loading from '../components/common/Loading';
import { useNavigate } from 'react-router-dom';

// Animações simplificadas para melhor performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Cores por tipo de veículo
const VEHICLE_COLORS = {
  moto: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' },
  carro: { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' },
  caminhao: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' },
  van: { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308', gradient: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)' },
  trator: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' },
  onibus: { bg: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' },
};

// Card de Estatística Compacto para Mobile
function MiniStatsCard({ title, value, icon, color = '#6366f1', subtitle }) {
  return (
    <GlassCard
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              color: color,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.55rem', sm: '0.65rem' }, mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: { xs: 0.75, sm: 1 },
            borderRadius: '10px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
      </Box>
    </GlassCard>
  );
}

// Card de Veículo Atrasado Compacto
function AtrasadoCard({ veiculo, onClick }) {
  const vehicleColor = VEHICLE_COLORS[veiculo.tipoVeiculo] || VEHICLE_COLORS.carro;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Box
        onClick={onClick}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          mb: 1,
          borderRadius: '10px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderColor: 'rgba(239, 68, 68, 0.25)',
          },
        }}
      >
        <Box
          sx={{
            p: 0.6,
            borderRadius: '8px',
            background: vehicleColor.gradient,
            display: 'flex',
          }}
        >
          <VehicleIcon type={veiculo.tipoVeiculo || 'carro'} size={isMobile ? 16 : 20} color="#fff" />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }} noWrap>
            {veiculo.clienteNome || veiculo.nome || veiculo.cliente || 'Cliente'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }} noWrap>
            {veiculo.placa || veiculo.n_placa} • {veiculo.modelo || veiculo.veiculo}
          </Typography>
        </Box>

        <Chip
          label={`R$ ${parseFloat(veiculo.valor || 55).toFixed(0)}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            height: { xs: 20, sm: 24 },
          }}
        />
      </Box>
    </motion.div>
  );
}

// Card de Pagamento Recente Compacto
function PagamentoRecenteCard({ pagamento }) {
  return (
    <Box
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        mb: 1,
        borderRadius: '10px',
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          p: 0.6,
          borderRadius: '8px',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          display: 'flex',
        }}
      >
        <CheckCircle sx={{ fontSize: { xs: 16, sm: 20 }, color: '#22c55e' }} />
      </Box>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }} noWrap>
          {pagamento.clienteNome || 'Cliente'}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }} noWrap>
          {pagamento.placa} • {pagamento.modelo}
        </Typography>
      </Box>

      <Typography sx={{ color: '#22c55e', fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
        R$ {parseFloat(pagamento.valorPago || pagamento.valor || 0).toFixed(0)}
      </Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
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
      
      console.log('Stats:', statsRes);
      console.log('Atrasados:', atrasadosRes);
      console.log('Pagamentos:', pagamentosRes);
      
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

  // Valores seguros com fallback para 0
  const totalClientes = stats?.totalClientes || 0;
  const totalVeiculos = stats?.totalVeiculos || 0;
  const mesAtual = stats?.mesAtual || {};
  const pagos = mesAtual.pagos || 0;
  const pendentes = mesAtual.pendentes || 0;
  const atrasadosCount = mesAtual.atrasados || atrasados.length || 0;
  const totalPagamentos = pagos + pendentes + atrasadosCount;
  const taxaPagamento = totalPagamentos > 0 ? Math.round((pagos / totalPagamentos) * 100) : 0;
  
  // Valores financeiros reais
  const valorTotalEsperado = mesAtual.totalValor || 0;
  const valorRecebido = mesAtual.totalPago || 0;
  const valorPendente = valorTotalEsperado - valorRecebido;

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Header Compacto */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box>
          <motion.div variants={itemVariants}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
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
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>
              Resumo do sistema
            </Typography>
          </motion.div>
        </Box>
        
        <motion.div variants={itemVariants}>
          <Tooltip title="Atualizar">
            <IconButton
              onClick={() => loadData(true)}
              disabled={refreshing}
              size="small"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
              }}
            >
              <Refresh
                sx={{
                  fontSize: { xs: 18, sm: 22 },
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
                }}
              />
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      {/* Stats Cards - Grid 2x2 no Mobile */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={6} lg={3}>
          <motion.div variants={itemVariants}>
            <MiniStatsCard
              title="Clientes"
              value={totalClientes}
              icon={<People sx={{ fontSize: { xs: 18, sm: 22 } }} />}
              color="#6366f1"
              subtitle="ativos"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <motion.div variants={itemVariants}>
            <MiniStatsCard
              title="Veículos"
              value={totalVeiculos}
              icon={<DirectionsCar sx={{ fontSize: { xs: 18, sm: 22 } }} />}
              color="#8b5cf6"
              subtitle="rastreados"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <motion.div variants={itemVariants}>
            <MiniStatsCard
              title="Pagos"
              value={pagos}
              icon={<CheckCircle sx={{ fontSize: { xs: 18, sm: 22 } }} />}
              color="#22c55e"
              subtitle="este mês"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} lg={3}>
          <motion.div variants={itemVariants}>
            <MiniStatsCard
              title="Atrasados"
              value={atrasados.length}
              icon={<Warning sx={{ fontSize: { xs: 18, sm: 22 } }} />}
              color="#ef4444"
              subtitle="pendentes"
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Taxa de Pagamento - Card Compacto */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: { xs: 2, sm: 2.5 }, mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed sx={{ color: '#6366f1', fontSize: { xs: 20, sm: 24 } }} />
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Taxa de Pagamento
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, color: '#22c55e' }}>
              {taxaPagamento}%
            </Typography>
          </Box>
          
          {/* Barra de Progresso */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
                {pagos} pagos
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, color: 'text.secondary' }}>
                {totalPagamentos} total
              </Typography>
            </Box>
            <Box
              sx={{
                height: { xs: 6, sm: 8 },
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${taxaPagamento}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)',
                  transition: 'width 0.5s ease',
                }}
              />
            </Box>
          </Box>
        </GlassCard>
      </motion.div>

      {/* Grid Principal */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {/* Atrasados */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning sx={{ color: '#ef4444', fontSize: { xs: 18, sm: 20 } }} />
                  <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Atrasados ({atrasados.length})
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => navigate('/pagamentos')}>
                  <ArrowForward sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {atrasados.length > 0 ? (
                <Box sx={{ maxHeight: { xs: 200, sm: 280 }, overflow: 'auto' }}>
                  <AnimatePresence>
                    {atrasados.slice(0, 5).map((v, i) => (
                      <AtrasadoCard
                        key={v.id || i}
                        veiculo={v}
                        onClick={() => navigate('/pagamentos')}
                      />
                    ))}
                  </AnimatePresence>
                  {atrasados.length > 5 && (
                    <Typography
                      sx={{
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        color: 'primary.main',
                        cursor: 'pointer',
                        mt: 1,
                      }}
                      onClick={() => navigate('/pagamentos')}
                    >
                      Ver todos ({atrasados.length})
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#22c55e', mb: 1 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    Nenhum pagamento atrasado!
                  </Typography>
                </Box>
              )}
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Pagamentos Recentes */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: { xs: 1.5, sm: 2 }, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: '#22c55e', fontSize: { xs: 18, sm: 20 } }} />
                  <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                    Pagos Recentes
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => navigate('/pagamentos')}>
                  <ArrowForward sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {recentPagamentos.length > 0 ? (
                <Box sx={{ maxHeight: { xs: 200, sm: 280 }, overflow: 'auto' }}>
                  <AnimatePresence>
                    {recentPagamentos.map((p, i) => (
                      <motion.div key={p.id || i} variants={itemVariants}>
                        <PagamentoRecenteCard pagamento={p} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Schedule sx={{ fontSize: 32, color: '#eab308', mb: 1 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    Nenhum pagamento recente
                  </Typography>
                </Box>
              )}
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Resumo Financeiro Compacto */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: { xs: 1.5, sm: 2 }, mt: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <TrendingUp sx={{ color: '#6366f1', fontSize: { xs: 18, sm: 20 } }} />
            <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
              Resumo Financeiro - Mês Atual
            </Typography>
          </Box>
          
          <Grid container spacing={1.5}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                  Pendente
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#eab308' }}>
                  R$ {valorPendente.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                  Recebido
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#22c55e' }}>
                  R$ {valorRecebido.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                  Total Esperado
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1.1rem' }, color: '#6366f1' }}>
                  R$ {valorTotalEsperado.toFixed(2).replace('.', ',')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </GlassCard>
      </motion.div>
    </Box>
  );
}
