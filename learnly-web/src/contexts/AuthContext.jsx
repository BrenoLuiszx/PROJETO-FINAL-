import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      if (usuarioSalvo) {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        
        // Verificar se tem as propriedades necessárias
        if (dadosUsuario && dadosUsuario.id && dadosUsuario.nome) {
          setUsuario(dadosUsuario);
        } else {
          localStorage.removeItem('usuario');
        }
      }
    } catch (error) {
      localStorage.removeItem('usuario');
    }
    setLoading(false);
  }, []);

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const syncUserData = async () => {
    if (usuario && usuario.email) {
      try {
        const response = await fetch('http://localhost:8080/api/usuarios');
        const data = await response.json();
        const updatedUser = data.usuarios.find(u => u.email === usuario.email);
        if (updatedUser) {
          setUsuario(updatedUser);
          localStorage.setItem('usuario', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Erro ao sincronizar dados do usuário:', error);
      }
    }
  };

  const value = {
    usuario,
    login,
    logout,
    syncUserData,
    isAuthenticated: !!usuario
  };
  


  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#fff',
        color: '#333'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};