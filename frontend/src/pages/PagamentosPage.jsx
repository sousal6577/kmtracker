// src/pages/PagamentosPage.jsx - Página de Pagamentos com Mensagem de Cobrança
import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Collapse,
  useMediaQuery,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import {
  Check,
  Close,
  Refresh,
  Payment,
  Schedule,
  Warning,
  CheckCircle,
  AttachMoney,
  CalendarMonth,
  ExpandMore,
  ExpandLess,
  ContentCopy,
  WhatsApp,
  Receipt,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { usePagamentos } from '../hooks';
import {
  GlassCard,
  SearchInput,
  Button,
  EmptyState,
  VehicleIcon,
} from '../components/ui';
import Loading from '../components/common/Loading';

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

// Dados do PIX (configuráveis)
const PIX_DATA = {
  chave: '11999999999',
  nome: 'KM TRACKER RASTREAMENTO',
  cidade: 'SAO PAULO',
};

// Helper para formatar timestamp do Firestore
const formatDate = (date) => {
  if (!date) return null;
  // Firestore pode retornar _seconds ou seconds dependendo do SDK
  if (date._seconds) return new Date(date._seconds * 1000).toLocaleDateString('pt-BR');
  if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString('pt-BR');
  if (typeof date === 'string') return new Date(date).toLocaleDateString('pt-BR');
  if (date instanceof Date) return date.toLocaleDateString('pt-BR');
  return null;
};

// Componente de Mensagem de Cobrança Múltipla (Todos os veículos do cliente)
function MensagemCobrancaCliente({ clienteNome, pagamentos, onClose }) {
  const [copied, setCopied] = useState(false);
  
  const valorTotal = pagamentos.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
  const veiculosLista = pagamentos.map(p => `• ${p.modelo || 'Veículo'} - ${p.placa} - R$ ${parseFloat(p.valor || 0).toFixed(2)}`).join('\n');

  const mensagem = `🚗 *KM TRACKER - RASTREAMENTO VEICULAR*

Olá ${clienteNome || 'Cliente'}! 👋

Identificamos pendências de pagamento referente aos serviços de rastreamento:

📋 *Veículos:*
${veiculosLista}

💰 *VALOR TOTAL: R$ ${valorTotal.toFixed(2)}*

💳 *Formas de Pagamento:*

📱 *PIX (mais rápido):*
Chave: ${PIX_DATA.chave}
Nome: ${PIX_DATA.nome}

Após o pagamento, envie o comprovante para confirmarmos a quitação.

Agradecemos a preferência! 🙏
Qualquer dúvida, estamos à disposição.

_KM Tracker - Sua segurança em movimento_`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mensagem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const phone = pagamentos[0]?.telefone?.replace(/\D/g, '') || '';
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        backgroundColor: 'rgba(30, 30, 46, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
      }
    }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Receipt sx={{ color: '#6366f1' }} />
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Cobrança Completa - {clienteNome}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {pagamentos.length} veículo(s) • Total: R$ {valorTotal.toFixed(2)}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            maxHeight: 350,
            overflow: 'auto',
          }}
        >
          {mensagem}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} size="small">
          Fechar
        </Button>
        <Button
          variant="contained"
          onClick={handleCopy}
          icon={<ContentCopy />}
          size="small"
          sx={{ backgroundColor: copied ? '#22c55e' : undefined }}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        <Button
          variant="contained"
          onClick={handleWhatsApp}
          icon={<WhatsApp />}
          size="small"
          sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#128C7E' } }}
        >
          WhatsApp
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Card de Cliente com todos os veículos
function ClientePagamentosCard({ clienteNome, clienteId, pagamentos, onConfirmar, onPendente, onMensagemCliente }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const valorTotal = pagamentos.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
  const pagos = pagamentos.filter(p => p.status === 'PAGO').length;
  const pendentes = pagamentos.filter(p => p.status !== 'PAGO');

  const allPaid = pendentes.length === 0;
  const statusColor = allPaid ? '#22c55e' : pendentes.some(p => p.status === 'ATRASADO') ? '#ef4444' : '#eab308';

  return (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          mb: 2,
          backgroundColor: 'rgba(30, 30, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${statusColor}22`,
          borderRadius: '16px',
          borderLeft: `4px solid ${statusColor}`,
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          {/* Header do Cliente */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} noWrap sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {clienteNome || 'Cliente'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
                <Chip
                  label={`${pagamentos.length} veículo(s)`}
                  size="small"
                  sx={{ height: 20, fontSize: '0.65rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}
                />
                <Chip
                  label={`${pagos}/${pagamentos.length} pagos`}
                  size="small"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem', 
                    backgroundColor: allPaid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                    color: allPaid ? '#22c55e' : '#eab308'
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' }, color: statusColor }}>
                R$ {valorTotal.toFixed(2)}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>total mensal</Typography>
            </Box>
          </Box>

          {/* Lista de Veículos Resumida */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
            {pagamentos.slice(0, expanded ? pagamentos.length : 3).map((p, idx) => {
              const vehicleColor = VEHICLE_COLORS[p.tipoVeiculo] || VEHICLE_COLORS.carro;
              return (
                <Box
                  key={p.id || idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    p: 0.5,
                    px: 1,
                    borderRadius: '8px',
                    backgroundColor: vehicleColor.bg,
                    border: `1px solid ${vehicleColor.color}33`,
                  }}
                >
                  <VehicleIcon type={p.tipoVeiculo || 'carro'} size={16} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500 }}>{p.placa}</Typography>
                  {p.status === 'PAGO' && <CheckCircle sx={{ fontSize: 12, color: '#22c55e' }} />}
                  {p.status === 'ATRASADO' && <Warning sx={{ fontSize: 12, color: '#ef4444' }} />}
                </Box>
              );
            })}
            {!expanded && pagamentos.length > 3 && (
              <Chip
                label={`+${pagamentos.length - 3} mais`}
                size="small"
                onClick={() => setExpanded(true)}
                sx={{ height: 24, fontSize: '0.65rem', cursor: 'pointer' }}
              />
            )}
          </Box>

          {/* Ações */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            
            {pendentes.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onMensagemCliente(clienteNome, pendentes)}
                startIcon={<Receipt />}
                sx={{
                  fontSize: '0.7rem',
                  px: 1.5,
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: '#6366f1' },
                }}
              >
                Cobrar Tudo
              </Button>
            )}
          </Box>

          {/* Detalhes Expandidos */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pagamentos.map((p, idx) => {
                const vehicleColor = VEHICLE_COLORS[p.tipoVeiculo] || VEHICLE_COLORS.carro;
                const isPago = p.status === 'PAGO';
                return (
                  <Box
                    key={p.id || idx}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: '8px',
                      backgroundColor: isPago ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isPago ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VehicleIcon type={p.tipoVeiculo || 'carro'} size={20} />
                      <Box>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {p.modelo || 'Veículo'} - {p.placa}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                          Venc. dia {p.diaVencimento || 10}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: vehicleColor.color }}>
                        R$ {parseFloat(p.valor || 0).toFixed(2)}
                      </Typography>
                      {!isPago ? (
                        <IconButton
                          size="small"
                          onClick={() => onConfirmar(p)}
                          sx={{ 
                            backgroundColor: 'rgba(34, 197, 94, 0.2)', 
                            color: '#22c55e',
                            '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.3)' },
                            p: 0.5
                          }}
                        >
                          <Check sx={{ fontSize: 14 }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => onPendente(p)}
                          sx={{ 
                            backgroundColor: 'rgba(234, 179, 8, 0.2)', 
                            color: '#eab308',
                            '&:hover': { backgroundColor: 'rgba(234, 179, 8, 0.3)' },
                            p: 0.5
                          }}
                        >
                          <Close sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Componente de Mensagem de Cobrança
function MensagemCobranca({ pagamento, onClose }) {
  const [copied, setCopied] = useState(false);
  const vehicleColor = VEHICLE_COLORS[pagamento.tipoVeiculo] || VEHICLE_COLORS.carro;

  const mensagem = `🚗 *KM TRACKER - RASTREAMENTO VEICULAR*

Olá ${pagamento.clienteNome || 'Cliente'}! 👋

Identificamos uma pendência de pagamento referente ao serviço de rastreamento:

📋 *Detalhes:*
• Veículo: ${pagamento.modelo || 'N/A'}
• Placa: ${pagamento.placa || 'N/A'}
• Vencimento: Dia ${pagamento.diaVencimento || 10}
• Valor: *R$ ${parseFloat(pagamento.valor || 0).toFixed(2)}*

💳 *Formas de Pagamento:*

📱 *PIX (mais rápido):*
Chave: ${PIX_DATA.chave}
Nome: ${PIX_DATA.nome}

Após o pagamento, envie o comprovante para confirmarmos a quitação.

Agradecemos a preferência! 🙏
Qualquer dúvida, estamos à disposição.

_KM Tracker - Sua segurança em movimento_`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mensagem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const phone = pagamento.telefone?.replace(/\D/g, '') || '';
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        backgroundColor: 'rgba(30, 30, 46, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
      }
    }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Receipt sx={{ color: vehicleColor.color }} />
        <Typography sx={{ fontWeight: 600 }}>Mensagem de Cobrança</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            maxHeight: 350,
            overflow: 'auto',
          }}
        >
          {mensagem}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} size="small">
          Fechar
        </Button>
        <Button
          variant="contained"
          onClick={handleCopy}
          icon={<ContentCopy />}
          size="small"
          sx={{ backgroundColor: copied ? '#22c55e' : undefined }}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        <Button
          variant="contained"
          onClick={handleWhatsApp}
          icon={<WhatsApp />}
          size="small"
          sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#128C7E' } }}
        >
          WhatsApp
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Card de Pagamento Compacto
function PagamentoCard({ pagamento, onConfirmar, onPendente, onMensagem }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const vehicleColor = VEHICLE_COLORS[pagamento.tipoVeiculo] || VEHICLE_COLORS.carro;

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAGO': return { bg: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', label: 'PAGO' };
      case 'ATRASADO': return { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', label: 'ATRASADO' };
      default: return { bg: 'rgba(234, 179, 8, 0.12)', color: '#eab308', label: 'PENDENTE' };
    }
  };

  const statusStyle = getStatusStyle(pagamento.status);

  return (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          mb: 1.5,
          backgroundColor: 'rgba(30, 30, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          overflow: 'hidden',
          borderLeft: `3px solid ${vehicleColor.color}`,
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: { xs: 0.6, sm: 0.8 },
                borderRadius: '10px',
                background: vehicleColor.gradient,
                display: 'flex',
              }}
            >
              <VehicleIcon type={pagamento.tipoVeiculo || 'carro'} size={isMobile ? 18 : 22} color="#fff" />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }} noWrap>
                {pagamento.clienteNome || 'Cliente'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {pagamento.placa || 'N/A'} • {pagamento.modelo || ''}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip
                label={statusStyle.label}
                size="small"
                sx={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', sm: '0.65rem' },
                  height: { xs: 20, sm: 22 },
                  px: 0.5,
                }}
              />
              <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0.5 }}>
                {expanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Box>

          {/* Valor e Ações */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: '#22c55e' }}>
              R$ {parseFloat(pagamento.valor || 0).toFixed(2)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {pagamento.status !== 'PAGO' && (
                <Tooltip title="Mensagem de Cobrança">
                  <IconButton
                    size="small"
                    onClick={() => onMensagem(pagamento)}
                    sx={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                    }}
                  >
                    <Receipt sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {pagamento.status !== 'PAGO' ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onConfirmar(pagamento)}
                  startIcon={<Check sx={{ fontSize: 14 }} />}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.7rem',
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: '#22c55e' },
                  }}
                >
                  Pagar
                </Button>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onPendente(pagamento)}
                  startIcon={<Close sx={{ fontSize: 14 }} />}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.7rem',
                    borderColor: '#eab308',
                    color: '#eab308',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderColor: '#eab308' },
                  }}
                >
                  Pendente
                </Button>
              )}
            </Box>
          </Box>

          {/* Detalhes Expandidos */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Vencimento</Typography>
                <Typography sx={{ fontSize: '0.8rem' }}>Dia {pagamento.diaVencimento || 10}</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Tipo</Typography>
                <Typography sx={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{pagamento.tipoVeiculo || 'Carro'}</Typography>
              </Box>
              {pagamento.dataPagamento && (
                <Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Pago em</Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>{formatDate(pagamento.dataPagamento)}</Typography>
                </Box>
              )}
              {pagamento.obs && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>Observação</Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>{pagamento.obs}</Typography>
                </Box>
              )}
            </Box>

            {/* Botão de Mensagem quando expandido */}
            {pagamento.status !== 'PAGO' && (
              <Box sx={{ mt: 1.5 }}>
                <Button
                  fullWidth
                  size="small"
                  onClick={() => onMensagem(pagamento)}
                  icon={<Receipt />}
                  sx={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                    fontSize: '0.75rem',
                  }}
                >
                  Gerar Mensagem de Cobrança
                </Button>
              </Box>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Cards de Resumo Compactos
function ResumoCards({ pagamentos }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stats = useMemo(() => {
    const total = pagamentos.length;
    const pagos = pagamentos.filter(p => p.status === 'PAGO');
    const pendentes = pagamentos.filter(p => p.status === 'PENDENTE');
    const atrasados = pagamentos.filter(p => p.status === 'ATRASADO');
    
    const valorTotal = pagamentos.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
    const valorRecebido = pagos.reduce((acc, p) => acc + parseFloat(p.valorPago || p.valor || 0), 0);

    return {
      total,
      pagos: pagos.length,
      pendentes: pendentes.length,
      atrasados: atrasados.length,
      valorTotal,
      valorRecebido,
      valorPendente: valorTotal - valorRecebido,
      percentual: total > 0 ? ((pagos.length / total) * 100).toFixed(0) : 0,
    };
  }, [pagamentos]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: { xs: 1, sm: 1.5 }, mb: 2 }}>
      <GlassCard sx={{ p: { xs: 1.25, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AttachMoney sx={{ color: '#22c55e', fontSize: { xs: 16, sm: 18 } }} />
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Recebido</Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, color: '#22c55e', mt: 0.25 }}>
          R$ {stats.valorRecebido.toFixed(0)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
          {stats.pagos}/{stats.total} ({stats.percentual}%)
        </Typography>
      </GlassCard>

      <GlassCard sx={{ p: { xs: 1.25, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule sx={{ color: '#eab308', fontSize: { xs: 16, sm: 18 } }} />
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Pendente</Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, color: '#eab308', mt: 0.25 }}>
          R$ {stats.valorPendente.toFixed(0)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
          {stats.pendentes} pagamentos
        </Typography>
      </GlassCard>

      <GlassCard sx={{ p: { xs: 1.25, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Warning sx={{ color: '#ef4444', fontSize: { xs: 16, sm: 18 } }} />
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Atrasados</Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, color: '#ef4444', mt: 0.25 }}>
          {stats.atrasados}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
          veículos
        </Typography>
      </GlassCard>

      <GlassCard sx={{ p: { xs: 1.25, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendingUp sx={{ color: '#6366f1', fontSize: { xs: 16, sm: 18 } }} />
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>Total</Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' }, color: '#6366f1', mt: 0.25 }}>
          R$ {stats.valorTotal.toFixed(0)}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.55rem', sm: '0.65rem' } }}>
          {stats.total} veículos
        </Typography>
      </GlassCard>
    </Box>
  );
}

// Seletor de Mês/Ano com opção "Todos"
function MesSeletor({ mesSelecionado, onMudar }) {
  const meses = [
    { value: 0, label: 'Todos' },
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' }, { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
  ];

  const anos = [2024, 2025, 2026];

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <FormControl size="small" sx={{ minWidth: { xs: 100, sm: 120 } }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Mês</InputLabel>
        <Select
          value={mesSelecionado.mes}
          label="Mês"
          onChange={(e) => onMudar(e.target.value, mesSelecionado.ano)}
          sx={{
            fontSize: '0.8rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          {meses.map((mes) => (
            <MenuItem key={mes.value} value={mes.value} sx={{ fontSize: '0.8rem' }}>{mes.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: { xs: 80, sm: 90 } }}>
        <InputLabel sx={{ fontSize: '0.8rem' }}>Ano</InputLabel>
        <Select
          value={mesSelecionado.ano}
          label="Ano"
          onChange={(e) => onMudar(mesSelecionado.mes, e.target.value)}
          sx={{
            fontSize: '0.8rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          {anos.map((ano) => (
            <MenuItem key={ano} value={ano} sx={{ fontSize: '0.8rem' }}>{ano}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default function PagamentosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tab, setTab] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mensagemPagamento, setMensagemPagamento] = useState(null);
  const [mensagemClienteData, setMensagemClienteData] = useState(null);
  const [viewMode, setViewMode] = useState('veiculo'); // 'veiculo' ou 'cliente'

  const {
    pagamentos,
    loading,
    mesSelecionado,
    mudarMes,
    carregarPagamentos,
    confirmarPagamento,
    marcarPendente,
    iniciarNovoMes,
  } = usePagamentos();

  // Filtra pagamentos
  const pagamentosFiltrados = useMemo(() => {
    let filtered = pagamentos;
    
    if (tab === 1) filtered = filtered.filter(p => p.status !== 'PAGO');
    if (tab === 2) filtered = filtered.filter(p => p.status === 'PAGO');
    if (tab === 3) filtered = filtered.filter(p => p.status === 'ATRASADO');
    
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      filtered = filtered.filter(p =>
        p.clienteNome?.toLowerCase().includes(termo) ||
        p.placa?.toLowerCase().includes(termo) ||
        p.modelo?.toLowerCase().includes(termo)
      );
    }
    
    return filtered;
  }, [pagamentos, tab, termoBusca]);

  // Agrupa pagamentos por cliente
  const pagamentosPorCliente = useMemo(() => {
    const grupos = {};
    pagamentosFiltrados.forEach(p => {
      const clienteId = p.clienteId || p.clienteNome || 'sem-cliente';
      if (!grupos[clienteId]) {
        grupos[clienteId] = {
          clienteId,
          clienteNome: p.clienteNome || 'Cliente',
          pagamentos: []
        };
      }
      grupos[clienteId].pagamentos.push(p);
    });
    return Object.values(grupos).sort((a, b) => a.clienteNome.localeCompare(b.clienteNome));
  }, [pagamentosFiltrados]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarPagamentos();
    setRefreshing(false);
  };

  const handleConfirmar = async (pagamento) => {
    setSubmitting(true);
    try {
      await confirmarPagamento(pagamento.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePendente = async (pagamento) => {
    setSubmitting(true);
    try {
      await marcarPendente(pagamento.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMensagemCliente = (clienteNome, pagamentosPendentes) => {
    setMensagemClienteData({ clienteNome, pagamentos: pagamentosPendentes });
  };

  const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  if (loading && !pagamentos.length) return <Loading />;

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 2,
          gap: 1.5,
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
              Pagamentos
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>
              {mesSelecionado.mes === 0 ? `Ano ${mesSelecionado.ano}` : `${meses[mesSelecionado.mes]} de ${mesSelecionado.ano}`}
            </Typography>
          </motion.div>
        </Box>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <MesSeletor mesSelecionado={mesSelecionado} onMudar={mudarMes} />
            
            <Tooltip title="Atualizar">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                size="small"
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                }}
              >
                <Refresh
                  sx={{
                    fontSize: 18,
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>
      </Box>

      {/* Resumo */}
      <motion.div variants={itemVariants}>
        <ResumoCards pagamentos={pagamentos} />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ mb: 2, p: 0 }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, fontSize: { xs: '0.7rem', sm: '0.8rem' }, py: 0.5 },
              '& .MuiTabs-indicator': { backgroundColor: '#6366f1' },
            }}
          >
            <Tab label={`Todos (${pagamentos.length})`} />
            <Tab label={`Pendentes (${pagamentos.filter(p => p.status !== 'PAGO').length})`} />
            <Tab label={`Pagos (${pagamentos.filter(p => p.status === 'PAGO').length})`} />
            <Tab label={`Atrasados (${pagamentos.filter(p => p.status === 'ATRASADO').length})`} />
          </Tabs>
        </GlassCard>
      </motion.div>

      {/* Busca e Toggle de Visualização */}
      <motion.div variants={itemVariants}>
        <GlassCard sx={{ p: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <SearchInput
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar cliente, placa..."
                onClear={() => setTermoBusca('')}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip
                label="Por Veículo"
                onClick={() => setViewMode('veiculo')}
                sx={{
                  backgroundColor: viewMode === 'veiculo' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  border: `1px solid ${viewMode === 'veiculo' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  color: viewMode === 'veiculo' ? '#6366f1' : 'text.secondary',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                }}
              />
              <Chip
                label="Por Cliente"
                onClick={() => setViewMode('cliente')}
                sx={{
                  backgroundColor: viewMode === 'cliente' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  border: `1px solid ${viewMode === 'cliente' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  color: viewMode === 'cliente' ? '#6366f1' : 'text.secondary',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          </Box>
        </GlassCard>
      </motion.div>

      {/* Lista */}
      <motion.div variants={containerVariants}>
        {viewMode === 'cliente' ? (
          // Visualização por Cliente
          pagamentosPorCliente.length > 0 ? (
            <AnimatePresence>
              {pagamentosPorCliente.map((grupo) => (
                <ClientePagamentosCard
                  key={grupo.clienteId}
                  clienteNome={grupo.clienteNome}
                  clienteId={grupo.clienteId}
                  pagamentos={grupo.pagamentos}
                  onConfirmar={handleConfirmar}
                  onPendente={handlePendente}
                  onMensagemCliente={handleMensagemCliente}
                />
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState
              icon={<Payment />}
              title="Nenhum pagamento"
              description={termoBusca ? 'Ajuste a busca' : 'Sem pagamentos para este período'}
            />
          )
        ) : (
          // Visualização por Veículo
          pagamentosFiltrados.length > 0 ? (
            <AnimatePresence>
              {pagamentosFiltrados.map((pagamento) => (
                <PagamentoCard
                  key={pagamento.id}
                  pagamento={pagamento}
                  onConfirmar={handleConfirmar}
                  onPendente={handlePendente}
                  onMensagem={setMensagemPagamento}
                />
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState
              icon={<Payment />}
              title="Nenhum pagamento"
              description={termoBusca ? 'Ajuste a busca' : 'Sem pagamentos para este período'}
            />
          )
        )}
      </motion.div>

      {/* Modal de Mensagem de Veículo */}
      {mensagemPagamento && (
        <MensagemCobranca
          pagamento={mensagemPagamento}
          onClose={() => setMensagemPagamento(null)}
        />
      )}

      {/* Modal de Mensagem de Cliente (múltiplos veículos) */}
      {mensagemClienteData && (
        <MensagemCobrancaCliente
          clienteNome={mensagemClienteData.clienteNome}
          pagamentos={mensagemClienteData.pagamentos}
          onClose={() => setMensagemClienteData(null)}
        />
      )}
    </Box>
  );
}
