import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { usuario, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h2>Learnly</h2>
          </div>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Início</Link></li>
        <li><Link to="/cursos">Cursos</Link></li>
        {isAuthenticated && usuario.role === 'admin' && (
          <>
            <li><Link to="/cadastro">Cadastro</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </>
        )}
      </ul>
      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <div className="user-info">
              <img 
                src={usuario.foto || 'https://via.placeholder.com/40x40?text=U'} 
                alt={usuario.nome}
                className="user-avatar"
              />
              <span className="user-name">{usuario.nome}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;