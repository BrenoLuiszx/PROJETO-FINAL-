import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/settingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { usuario } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profilePhoto, setProfilePhoto] = useState(usuario?.foto || '');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Configurações</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <div className="section-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <h3>Perfil</h3>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {usuario?.nome?.charAt(0).toUpperCase()}
                  </div>
                )}
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
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="avatar-edit">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </label>
              </div>
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Nome</span>
                  <span className="value">{usuario?.nome}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email</span>
                  <span className="value">{usuario?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3>Aparência</h3>
            </div>
            <div className="theme-switcher">
              <div 
                className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className="theme-preview dark">
                  <div className="preview-bar"></div>
                  <div className="preview-content">
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                  </div>
                </div>
                <span>Escuro</span>
              </div>
              <div 
                className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className="theme-preview light">
                  <div className="preview-bar"></div>
                  <div className="preview-content">
                    <div className="preview-line"></div>
                    <div className="preview-line short"></div>
                  </div>
                </div>
                <span>Claro</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11H7v9a2 2 0 002 2h8a2 2 0 002-2V9h-2M9 11V9a4 4 0 118 0v2M9 11h8"/>
              </svg>
              <h3>Estatísticas</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Cursos</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0h</div>
                <div className="stat-label">Tempo</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0</div>
                <div className="stat-label">Concluídos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;