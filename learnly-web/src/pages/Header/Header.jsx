import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from '../../components/UserDropdown';

const Header = () => {
  const { usuario, isAuthenticated } = useAuth();

  return (
    <header>
      <div className="começo">
        <div className="logo">
          <Link to="/">
            <img
              className="img"
              src="/img/imagemdaescola.jpg"
              alt="Logo"
            />
          </Link>
        </div>

        <nav className="menu-desktop">
          <ul>
            <li>
              <Link to="/cursos">Cursos</Link>
            </li>
            {isAuthenticated && usuario?.role === 'admin' && (
              <>
                <li>
                  <Link to="/cadastro">Cadastro Curso</Link>
                </li>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;