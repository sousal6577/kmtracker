// src/pages/VeiculosPage.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  InputAdornment,
  Button
} from '@mui/material';
import { Search, Edit, Delete, Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useVeiculos } from '../hooks';
import Loading from '../components/common/Loading';

export default function VeiculosPage() {
  const { veiculos, loading, excluirVeiculo } = useVeiculos();
  const [termoBusca, setTermoBusca] = useState('');

  const veiculosFiltrados = veiculos.filter(v => 
    !termoBusca || 
    v.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    v.n_placa?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    v.veiculo?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleExcluir = async (cpf, veiculoId) => {
    if (confirm('Deseja realmente excluir este veículo?')) {
      await excluirVeiculo(cpf, veiculoId);
    }
  };

  if (loading && !veiculos.length) return <Loading />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Veículos
          </Typography>
          <Typography color="text.secondary">
            Gerenciar veículos cadastrados
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Novo Veículo
        </Button>
      </Box>

      {/* Busca */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, placa ou veículo..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Tabela */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Veículo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Placa</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {veiculosFiltrados.map((veiculo, idx) => (
                <TableRow key={veiculo.id || idx} hover>
                  <TableCell>{veiculo.nome}</TableCell>
                  <TableCell>{veiculo.veiculo}</TableCell>
                  <TableCell>
                    <Chip label={veiculo.n_placa} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    R$ {parseFloat(veiculo.valor || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={veiculo.status || 'PENDENTE'}
                      size="small"
                      color={
                        veiculo.status === 'PAGO' ? 'success' :
                        veiculo.status === 'ATRASADO' ? 'error' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleExcluir(veiculo.cpf, veiculo.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {veiculosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum veículo encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
}
