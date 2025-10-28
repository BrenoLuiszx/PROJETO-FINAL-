import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cursosAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header/Header";
import "../../styles/curso-detalhes.css";

const CursoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarCurso();
  }, [id]);

  const carregarCurso = async () => {
    try {
      setLoading(true);
      const response = await cursosAPI.buscarPorId(id);
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      setError("Curso não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const handleAcessarCurso = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    window.open(curso.url, "_blank");
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="curso-detalhes-loading">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes do curso...</p>
        </div>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div>
        <Header />
        <div className="curso-detalhes-error">
          <h2>Curso não encontrado</h2>
          <p>O curso que você está procurando não existe ou foi removido.</p>
          <button onClick={() => navigate(-1)} className="btn-voltar">
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="curso-detalhes-container">
        <div className="curso-detalhes-hero">
          <div className="curso-detalhes-breadcrumb">
            <button onClick={() => navigate(-1)} className="breadcrumb-link">
              ← Voltar
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{curso.titulo}</span>
          </div>

          <div className="curso-detalhes-header">
            <div className="curso-detalhes-info">
              <div className="curso-categoria-badge">{curso.categoria}</div>
              <h1 className="curso-titulo">{curso.titulo}</h1>
              <p className="curso-descricao-resumo">{curso.descricao}</p>
              
              <div className="curso-meta">
                <div className="meta-item">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Carga Horária: {formatDuration(curso.duracao)}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>Modalidade: {curso.formaAplicacao}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="curso-video-section">
            <div className="video-preview">
              <div className="video-thumbnail">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="video-overlay">
                  <span className="video-duration">{formatDuration(curso.duracao)}</span>
                </div>
              </div>
            </div>
            
            <div className="curso-detalhes-actions">
              {user ? (
                <button onClick={handleAcessarCurso} className="btn-acessar-curso">
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Acessar Curso Completo
                </button>
              ) : (
                <div className="acesso-restrito">
                  <div className="acesso-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </div>
                  <h3>Acesso Restrito</h3>
                  <p>Faça login para acessar o conteúdo completo do curso</p>
                  <button onClick={() => navigate("/login")} className="btn-fazer-login">
                    Fazer Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="curso-detalhes-content">
          <div className="curso-detalhes-main">
            <section className="curso-section">
              <h2>Sobre o Curso</h2>
              <div className="descricao-content">
                <p>{curso.descricao}</p>
                <div className="curso-highlights">
                  <div className="highlight-item">
                    <h4>Modalidade de Ensino</h4>
                    <p>{curso.formaAplicacao}</p>
                  </div>
                  <div className="highlight-item">
                    <h4>Duração Total</h4>
                    <p>{formatDuration(curso.duracao)}</p>
                  </div>
                  <div className="highlight-item">
                    <h4>Categoria</h4>
                    <p>{curso.categoria}</p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="curso-section">
              <h2>O que você vai aprender</h2>
              <div className="learning-objectives">
                <div className="objective-item">
                  <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Fundamentos sólidos da tecnologia</span>
                </div>
                <div className="objective-item">
                  <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Projetos práticos e aplicações reais</span>
                </div>
                <div className="objective-item">
                  <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Melhores práticas da indústria</span>
                </div>
                <div className="objective-item">
                  <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>Preparação para o mercado de trabalho</span>
                </div>
              </div>
            </section>
          </div>

          <div className="curso-detalhes-sidebar">
            <div className="instrutor-card">
              <h3>Seu Instrutor</h3>
              <div className="instrutor-info">
                <div className="instrutor-avatar">
                  {curso.instrutorFoto ? (
                    <img src={curso.instrutorFoto} alt={curso.instrutor} />
                  ) : (
                    <div className="avatar-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="instrutor-details">
                  <h4>{curso.instrutor}</h4>
                  <p className="instrutor-bio">
                    {curso.instrutorBio || "Instrutor especializado na área"}
                  </p>
                </div>
              </div>
            </div>

            <div className="curso-specs">
              <h3>Especificações do Curso</h3>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-label">Duração:</span>
                  <span className="spec-value">{formatDuration(curso.duracao)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Modalidade:</span>
                  <span className="spec-value">{curso.formaAplicacao}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Categoria:</span>
                  <span className="spec-value">{curso.categoria}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Nível:</span>
                  <span className="spec-value">Intermediário</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoDetalhes;