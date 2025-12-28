// src/pages/PagamentosPage.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { Check, Close, Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePagamentos, useVeiculos } from '../hooks';
import Loading from '../components/common/Loading';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function PagamentosPage() {
  const [tab, setTab] = useState(0);
  const { veiculos, loading: loadingVeiculos, carregarVeiculos } = useVeiculos();
  const { 
    atrasados, 
    loading: loadingPag, 
    carregarAtrasados,
    confirmarPagamento,
    marcarPendente,
    iniciarNovoMes 
  } = usePagamentos();

  useEffect(() => {
    carregarAtrasados();
  }, [carregarAtrasados]);

  const handleConfirmar = async (veiculo) => {
    await confirmarPagamento(veiculo.cpf, veiculo.id);
    carregarVeiculos();
    carregarAtrasados();
  };

  const handlePendente = async (veiculo) => {
    await marcarPendente(veiculo.cpf, veiculo.id);
    carregarVeiculos();
    carregarAtrasados();
  };

  const handleNovoMes = async () => {
    await iniciarNovoMes();
    carregarVeiculos();
    carregarAtrasados();
  };

  const loading = loadingVeiculos || loadingPag;

  // Filtra veículos por status
  const pendentes = veiculos.filter(v => v.status === 'PENDENTE');
  const pagos = veiculos.filter(v => v.status === 'PAGO');

  if (loading && !veiculos.length) return <Loading />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Pagamentos
          </Typography>
          <Typography color="text.secondary">
            Gerenciar pagamentos mensais
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="warning"
          startIcon={<Refresh />}
          onClick={handleNovoMes}
        >
          Iniciar Novo Mês
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label={`Pendentes (${pendentes.length})`} />
          <Tab label={`Pagos (${pagos.length})`} />
          <Tab label={`Atrasados (${atrasados.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Pendentes */}
      <TabPanel value={tab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'warning.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Veículo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Placa</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendentes.map((v, idx) => (
                <TableRow key={v.id || idx} hover>
                  <TableCell>{v.nome}</TableCell>
                  <TableCell>{v.veiculo}</TableCell>
                  <TableCell><Chip label={v.n_placa} size="small" /></TableCell>
                  <TableCell>R$ {parseFloat(v.valor || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="success" onClick={() => handleConfirmar(v)}>
                      <Check />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab Pagos */}
      <TabPanel value={tab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'success.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Veículo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Placa</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.map((v, idx) => (
                <TableRow key={v.id || idx} hover>
                  <TableCell>{v.nome}</TableCell>
                  <TableCell>{v.veiculo}</TableCell>
                  <TableCell><Chip label={v.n_placa} size="small" color="success" /></TableCell>
                  <TableCell>R$ {parseFloat(v.valor || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="warning" onClick={() => handlePendente(v)}>
                      <Close />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab Atrasados */}
      <TabPanel value={tab} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'error.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Veículo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Placa</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {atrasados.map((v, idx) => (
                <TableRow key={v.id || idx} hover>
                  <TableCell>{v.nome}</TableCell>
                  <TableCell>{v.veiculo}</TableCell>
                  <TableCell><Chip label={v.n_placa} size="small" color="error" /></TableCell>
                  <TableCell>R$ {parseFloat(v.valor || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="success" onClick={() => handleConfirmar(v)}>
                      <Check />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}
