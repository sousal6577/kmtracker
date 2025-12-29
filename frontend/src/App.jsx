// src/App.jsx - Componente Principal com Design Moderno
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Layout } from './components/layout';
import { InstallPWAModal, usePWAInstall } from './components/pwa';
import theme from './styles/theme';
import './styles/index.css';

// Pages
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import VeiculosPage from './pages/VeiculosPage';
import PagamentosPage from './pages/PagamentosPage';
import AdminPage from './pages/AdminPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

// Registra Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((error) => {
        console.log('SW registration failed: ', error);
      });
  });
}

function AppContent() {
  const { isInstallable, isInstalled, installPWA, showManualInstructions, deferredPrompt } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Mostra o modal após 2 segundos se o app for instalável e não está instalado
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
        
        // Se foi dispensado há mais de 24h, mostra novamente
        if (dismissedTime) {
          const timeSinceDismissed = Date.now() - parseInt(dismissedTime);
          if (timeSinceDismissed > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('pwa-install-dismissed');
            localStorage.removeItem('pwa-install-dismissed-time');
          }
        }
        
        if (!dismissed) {
          setShowInstallModal(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const installed = await installPWA();
    if (installed) {
      setShowInstallModal(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallModal(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: 'rgba(30, 30, 46, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Rotas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ClientesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/veiculos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VeiculosPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pagamentos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PagamentosPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ConfiguracoesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

      {/* Modal de Instalação PWA */}
      <InstallPWAModal
        open={showInstallModal}
        onClose={handleDismiss}
        onInstall={handleInstall}
        showManualInstructions={showManualInstructions}
        hasPrompt={!!deferredPrompt}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
