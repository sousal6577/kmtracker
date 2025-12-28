// src/contexts/AuthContext.jsx - Contexto de Autenticação
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const cachedUser = authApi.getUser();
          if (cachedUser) {
            setUser(cachedUser);
          }
          
          // Valida token com servidor
          const response = await authApi.getMe();
          if (response.success) {
            setUser(response.user);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (username, password) => {
    const response = await authApi.login(username, password);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  // Logout
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;
