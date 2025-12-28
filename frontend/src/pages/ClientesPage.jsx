// src/pages/ClientesPage.jsx
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
  InputAdornment
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useClientes } from '../hooks';
import Loading from '../components/common/Loading';

export default function ClientesPage() {
  const { clientes, loading, buscarClientes } = useClientes();
  const [termoBusca, setTermoBusca] = useState('');

  const handleBusca = (e) => {
    const termo = e.target.value;
    setTermoBusca(termo);
    buscarClientes(termo);
  };

  if (loading && !clientes.length) return <Loading />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Clientes
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Gerenciar clientes cadastrados
      </Typography>

      {/* Busca */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, CPF ou placa..."
          value={termoBusca}
          onChange={handleBusca}
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
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CPF</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Veículos</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente, idx) => (
                <TableRow key={cliente.cpf || idx} hover>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>{cliente.telefone || '-'}</TableCell>
                  <TableCell>{cliente.totalVeiculos || 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={cliente.status || 'PENDENTE'}
                      size="small"
                      color={
                        cliente.status === 'PAGO' ? 'success' :
                        cliente.status === 'ATRASADO' ? 'error' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {clientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum cliente encontrado
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
