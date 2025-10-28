import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import '../../styles/configuracoes.css';

const Configuracoes = () => {
  const { usuario } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [profilePhoto, setProfilePhoto] = useState(usuario?.foto || '');

  return (
    <div className="configuracoes-page">
      <Header />
      
      <div className="configuracoes-container">
        <div className="configuracoes-header">
          <h1>Configurações</h1>
          <p>Gerencie suas preferências e informações da conta</p>
        </div>

        <div className="configuracoes-grid">
          <div className="config-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <h3>Perfil</h3>
            </div>
            <div className="profile-section">
              <div className="photo-upload">
                <div className="current-photo">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Foto atual" />
                  ) : (
                    <div className="photo-placeholder">
                      {usuario?.nome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setProfilePhoto(e.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                  id="photo-input"
                />
                <label htmlFor="photo-input" className="upload-btn">
                  Alterar Foto
                </label>
              </div>
              <div className="profile-info">
                <div className="info-item">
                  <label>Nome:</label>
                  <span>{usuario?.nome}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{usuario?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="config-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3>Aparência</h3>
            </div>
            <div className="theme-selector">
              <div className="theme-option" onClick={() => setTheme('dark')}>
                <div className={`theme-preview dark ${theme === 'dark' ? 'active' : ''}`}>
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Escuro</span>
              </div>
              <div className="theme-option" onClick={() => setTheme('light')}>
                <div className={`theme-preview light ${theme === 'light' ? 'active' : ''}`}>
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Claro</span>
              </div>
            </div>
          </div>

          <div className="config-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v9a2 2 0 002 2h8a2 2 0 002-2V9h-2M9 11V9a4 4 0 118 0v2M9 11h8"/>
              </svg>
              <h3>Atividade</h3>
            </div>
            <div className="activity-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Cursos Acessados</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Concluídos</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <span className="stat-number">0h</span>
                  <span className="stat-label">Tempo Total</span>
                </div>
              </div>
            </div>
          </div>

          <div className="config-card">
            <div className="card-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <h3>Histórico</h3>
            </div>
            <div className="history-list">
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p>Nenhum curso acessado ainda</p>
              </div>
            </div>
          </div>

          <div className="config-card danger-zone">
            <div className="card-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <h3>Zona de Perigo</h3>
            </div>
            <button className="delete-account-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Deletar Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;