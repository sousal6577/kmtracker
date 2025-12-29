// src/pages/ConfiguracoesPage.jsx - Página de Configurações
import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Switch,
  Divider,
  TextField,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Settings,
  Notifications,
  Palette,
  Security,
  Payment,
  Save,
  DarkMode,
  PhoneAndroid,
  WhatsApp,
  Pix,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GlassCard, Button, Input } from '../components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ConfiguracoesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [saved, setSaved] = useState(false);

  const [config, setConfig] = useState({
    // Notificações
    notificacaoPush: true,
    notificacaoEmail: false,
    notificacaoWhatsApp: true,
    
    // Aparência
    temaEscuro: true,
    animacoes: true,
    
    // Pagamentos
    diaVencimentoPadrao: 10,
    valorPadrao: '55,00',
    
    // PIX
    pixChave: '11999999999',
    pixNome: 'KM TRACKER RASTREAMENTO',
    pixCidade: 'SAO PAULO',
    
    // WhatsApp
    whatsappNumero: '5511999999999',
  });

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Salvar configurações (localStorage ou backend)
    localStorage.setItem('kmtracker_config', JSON.stringify(config));
    setSaved(true);
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mb: 3 }}>
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
            <Settings sx={{ fontSize: { xs: 28, sm: 36 }, color: '#6366f1' }} />
            Configurações
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
            Personalize o sistema de acordo com suas preferências
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Notificações */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: 3, height: '100%' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications sx={{ color: '#6366f1' }} />
                Notificações
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem' }}>Push Notifications</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Receber alertas no dispositivo
                    </Typography>
                  </Box>
                  <Switch
                    checked={config.notificacaoPush}
                    onChange={(e) => handleChange('notificacaoPush', e.target.checked)}
                  />
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem' }}>E-mail</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Receber resumos por e-mail
                    </Typography>
                  </Box>
                  <Switch
                    checked={config.notificacaoEmail}
                    onChange={(e) => handleChange('notificacaoEmail', e.target.checked)}
                  />
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem' }}>WhatsApp</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Alertas via WhatsApp
                    </Typography>
                  </Box>
                  <Switch
                    checked={config.notificacaoWhatsApp}
                    onChange={(e) => handleChange('notificacaoWhatsApp', e.target.checked)}
                  />
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Aparência */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: 3, height: '100%' }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette sx={{ color: '#8b5cf6' }} />
                Aparência
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem' }}>Tema Escuro</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Interface com cores escuras
                    </Typography>
                  </Box>
                  <Switch
                    checked={config.temaEscuro}
                    onChange={(e) => handleChange('temaEscuro', e.target.checked)}
                    icon={<DarkMode />}
                  />
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem' }}>Animações</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Transições suaves
                    </Typography>
                  </Box>
                  <Switch
                    checked={config.animacoes}
                    onChange={(e) => handleChange('animacoes', e.target.checked)}
                  />
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Dados do PIX */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pix sx={{ color: '#22c55e' }} />
                Dados do PIX
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Chave PIX"
                  value={config.pixChave}
                  onChange={(e) => handleChange('pixChave', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="Nome do Beneficiário"
                  value={config.pixNome}
                  onChange={(e) => handleChange('pixNome', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="Cidade"
                  value={config.pixCidade}
                  onChange={(e) => handleChange('pixCidade', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Pagamentos */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment sx={{ color: '#eab308' }} />
                Pagamentos
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Dia de Vencimento Padrão"
                  type="number"
                  value={config.diaVencimentoPadrao}
                  onChange={(e) => handleChange('diaVencimentoPadrao', e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 1, max: 31 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="Valor Mensal Padrão"
                  value={config.valorPadrao}
                  onChange={(e) => handleChange('valorPadrao', e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography> }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="WhatsApp para Cobranças"
                  value={config.whatsappNumero}
                  onChange={(e) => handleChange('whatsappNumero', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="5511999999999"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Botão Salvar */}
      <motion.div variants={itemVariants}>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            icon={<Save />}
            size="large"
          >
            Salvar Configurações
          </Button>
        </Box>
      </motion.div>

      {/* Snackbar */}
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Configurações salvas com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}
