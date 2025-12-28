// src/App.jsx - Componente Principal com Design Moderno
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Layout } from './components/layout';
import theme from './styles/theme';
import './styles/index.css';

// Pages
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import ClientesPage from './pages/ClientesPage';
import VeiculosPage from './pages/VeiculosPage';
import PagamentosPage from './pages/PagamentosPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
