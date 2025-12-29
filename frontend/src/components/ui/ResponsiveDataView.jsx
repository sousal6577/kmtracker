// src/components/ui/ResponsiveDataView.jsx - Visualização Responsiva (Tabela/Cards)
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Skeleton,
  Collapse,
  Avatar,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  ExpandLess,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';
import VehicleIcon from './VehicleIcon';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
};

// Card individual para mobile
function DataCard({ 
  item, 
  type = 'cliente', 
  onEdit, 
  onDelete, 
  onView,
  expanded,
  onToggleExpand,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleAction = (action) => {
    handleMenuClose();
    if (action === 'edit' && onEdit) onEdit(item);
    if (action === 'delete' && onDelete) onDelete(item);
    if (action === 'view' && onView) onView(item);
  };

  // Renderização baseada no tipo
  const renderContent = () => {
    switch (type) {
      case 'cliente':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                {item.nome?.charAt(0)?.toUpperCase() || '?'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>
                  {item.nome || 'Sem nome'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CPF: {item.cpf || 'N/A'}
                </Typography>
              </Box>
              <StatusBadge status={item.status === 'ativo' ? 'ATIVO' : 'INATIVO'} size="small" />
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {item.telefone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{item.telefone}</Typography>
                  </Box>
                )}
                {item.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" noWrap>{item.email}</Typography>
                  </Box>
                )}
                {item.cidade && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{item.cidade}</Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        );

      case 'veiculo':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                }}
              >
                <VehicleIcon type={item.tipoVeiculo || 'carro'} size={24} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>
                  {item.modelo || item.veiculo || 'Sem modelo'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={item.placa || item.n_placa || 'SEM PLACA'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(99,102,241,0.2)',
                      color: '#818cf8',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontWeight={700} color="success.main">
                  R$ {parseFloat(item.valor || 0).toFixed(2)}
                </Typography>
                <StatusBadge status={item.situacao || item.status || 'PENDENTE'} size="small" />
              </Box>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <InfoItem label="Cliente" value={item.clienteNome || item.nome} />
                  <InfoItem label="Equipamento" value={item.equipamento} />
                  <InfoItem label="IMEI" value={item.imei} />
                  <InfoItem label="Vencimento" value={`Dia ${item.diaVencimento || item.vencimento}`} />
                </Box>
                {item.obs && (
                  <Box sx={{ mt: 2, p: 1.5, borderRadius: '8px', backgroundColor: 'rgba(249,115,22,0.1)' }}>
                    <Typography variant="caption" color="warning.main" fontWeight={600}>
                      Observação:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {item.obs}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        );

      case 'pagamento':
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  background: item.status === 'PAGO' 
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.1))'
                    : item.status === 'ATRASADO'
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))'
                    : 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,179,8,0.1))',
                }}
              >
                <VehicleIcon type={item.tipoVeiculo || 'carro'} size={24} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>
                  {item.clienteNome || 'Cliente'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.placa} • {item.modelo}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontWeight={700} color={item.status === 'PAGO' ? 'success.main' : 'warning.main'}>
                  R$ {parseFloat(item.valor || 0).toFixed(2)}
                </Typography>
                <StatusBadge status={item.status || 'PENDENTE'} size="small" />
              </Box>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <InfoItem label="Referência" value={`${String(item.mes).padStart(2,'0')}/${item.ano}`} />
                  <InfoItem label="Vencimento" value={`Dia ${item.diaVencimento}`} />
                  <InfoItem label="Valor Pago" value={`R$ ${parseFloat(item.valorPago || 0).toFixed(2)}`} />
                  <InfoItem label="Data Pgto" value={item.dataPagamento || '-'} />
                </Box>
              </Box>
            </Collapse>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div variants={cardVariants} layout>
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          mb: 2,
          overflow: 'visible',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(99,102,241,0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          },
        }}
        onClick={onToggleExpand}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {renderContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <IconButton 
              size="small" 
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              sx={{ color: 'text.secondary' }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            
            <Box>
              <IconButton size="small" onClick={handleMenuOpen} sx={{ color: 'text.secondary' }}>
                <MoreVert />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(30,30,46,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
        }}
      >
        {onView && (
          <MenuItem onClick={() => handleAction('view')}>
            <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
            <ListItemText>Visualizar</ListItemText>
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => handleAction('edit')}>
            <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
            <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </motion.div>
  );
}

// Item de informação auxiliar
function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  );
}

// Componente principal de visualização responsiva
export default function ResponsiveDataView({
  data = [],
  type = 'cliente',
  loading = false,
  onEdit,
  onDelete,
  onView,
  emptyMessage = 'Nenhum dado encontrado',
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={120}
            sx={{ borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.05)' }}
          />
        ))}
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))',
      }}
    >
      <AnimatePresence>
        {data.map((item, index) => (
          <DataCard
            key={item.id || item.cpf || index}
            item={item}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            expanded={expandedId === (item.id || item.cpf || index)}
            onToggleExpand={() => handleToggleExpand(item.id || item.cpf || index)}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
}
