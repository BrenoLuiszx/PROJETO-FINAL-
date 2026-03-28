import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      const tokenSalvo = localStorage.getItem('token');
      if (usuarioSalvo && tokenSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
        setToken(tokenSalvo);
      }
    } catch {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = (dadosUsuario, jwtToken) => {
    setUsuario(dadosUsuario);
    setToken(jwtToken);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  // Helpers de role
  const isAdmin = () => usuario?.role === 'admin';
  const isColaborador = () => usuario?.role === 'colaborador';
  const isUser = () => usuario?.role === 'user';

  const value = {
    usuario,
    token,
    login,
    logout,
    isAdmin,
    isColaborador,
    isUser,
    isAuthenticated: !!usuario,
    syncUserData: () => {},
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#FFD700' }}>
        Carregando...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
