// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import {
  People,
  DirectionsCar,
  AttachMoney,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { clienteApi, pagamentoApi } from '../api';
import Loading from '../components/common/Loading';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [atrasados, setAtrasados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, atrasadosRes] = await Promise.all([
          clienteApi.estatisticas(),
          pagamentoApi.listarAtrasados()
        ]);
        
        if (statsRes.success) setStats(statsRes.estatisticas);
        if (atrasadosRes.success) setAtrasados(atrasadosRes.atrasados || []);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Visão geral do sistema
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Clientes"
            value={stats?.totalClientes || 0}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Veículos"
            value={stats?.totalVeiculos || 0}
            icon={<DirectionsCar fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pagos"
            value={stats?.pagos || 0}
            icon={<AttachMoney fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Atrasados"
            value={atrasados.length}
            icon={<Warning fontSize="large" />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Lista de Atrasados */}
      {atrasados.length > 0 && (
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
            ⚠️ Pagamentos Atrasados
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {atrasados.slice(0, 5).map((item, idx) => (
              <li key={idx}>
                <Typography>
                  {item.nome} - {item.veiculo} ({item.n_placa})
                </Typography>
              </li>
            ))}
            {atrasados.length > 5 && (
              <Typography color="text.secondary" mt={1}>
                ... e mais {atrasados.length - 5} atrasados
              </Typography>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
