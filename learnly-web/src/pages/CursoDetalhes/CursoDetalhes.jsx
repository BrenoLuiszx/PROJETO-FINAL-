import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cursosAPI, progressoAPI, avaliacoesAPI, certificadosAPI, aulasAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header/Header";
import "../../styles/curso-detalhes.css";

// Extrai ID do YouTube de qualquer formato de URL
const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const StarRating = ({ value, onChange, readonly = false }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        onClick={() => !readonly && onChange && onChange(star)}
        viewBox="0 0 24 24"
        fill={star <= value ? "#FFD700" : "none"}
        stroke="#FFD700"
        strokeWidth="1.5"
        style={{ width: 20, height: 20, cursor: readonly ? "default" : "pointer", flexShrink: 0 }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const CursoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: user } = useAuth();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de vídeo
  const [videoAberto, setVideoAberto] = useState(false);
  const [videoInteragido, setVideoInteragido] = useState(false);
  const [videoAtual, setVideoAtual] = useState(null);

  // Aulas
  const [aulas, setAulas] = useState([]);
  const [aulaAtual, setAulaAtual] = useState(null);
  const [progressoAulas, setProgressoAulas] = useState([]);
  const [percentualAulas, setPercentualAulas] = useState(0);

  // Progresso
  const [concluido, setConcluido] = useState(false);
  const [progressoLoading, setProgressoLoading] = useState(false);

  // Avaliações
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [avaliacaoLoading, setAvaliacaoLoading] = useState(false);
  const [avaliacaoMsg, setAvaliacaoMsg] = useState("");

  // Certificado
  const [temCertificado, setTemCertificado] = useState(false);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    carregarCurso();
  }, [id]);

  useEffect(() => {
    if (curso) {
      carregarAvaliacoes();
      carregarAulas();
      if (user) {
        carregarProgresso();
        carregarCertificado();
        carregarProgressoAulas();
      }
    }
  }, [curso, user]);

  const carregarCurso = async () => {
    try {
      setLoading(true);
      const response = await cursosAPI.buscarPorId(id);
      setCurso(response.data);
    } catch {
      setError("Curso não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const carregarProgresso = async () => {
    try {
      const res = await progressoAPI.statusCurso(id);
      setConcluido(res.data.concluido === true);
    } catch {}
  };

  const carregarAvaliacoes = async () => {
    try {
      const res = await avaliacoesAPI.listarPorCurso(id);
      setAvaliacoes(Array.isArray(res.data) ? res.data : []);
    } catch {}
    if (user) {
      try {
        const res = await avaliacoesAPI.minhaAvaliacao(id);
        if (res.status === 200 && res.data) {
          setMinhaAvaliacao(res.data);
          setNota(res.data.nota);
          setComentario(res.data.comentario || "");
        }
      } catch {}
    }
  };

  const carregarCertificado = async () => {
    try {
      const res = await certificadosAPI.meusCertificados();
      setTemCertificado((res.data || []).some((c) => c.cursoId === Number(id)));
    } catch {}
  };

  const carregarAulas = async () => {
    try {
      const res = await aulasAPI.listarPorCurso(id);
      const aulasData = res.data || [];
      setAulas(aulasData);
      // Se não tem aula selecionada e tem aulas disponíveis, seleciona a primeira
      if (aulasData.length > 0 && !aulaAtual) {
        setAulaAtual(aulasData[0]);
        setVideoAtual(aulasData[0].url);
      }
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    }
  };

  const carregarProgressoAulas = async () => {
    try {
      const [prog, perc] = await Promise.all([
        aulasAPI.progresso(id),
        aulasAPI.percentual(id)
      ]);
      setProgressoAulas(prog.data || []);
      setPercentualAulas(perc.data?.percentual || 0);
    } catch {}
  };

  const toggleAulaConcluida = async (aula) => {
    if (!user) return navigate("/login");
    const jaConcluida = progressoAulas.some(p => p.aulaId === aula.id && p.concluido);
    
    console.log('Toggle aula:', aula.id, 'Concluída:', jaConcluida);
    
    try {
      let response;
      if (jaConcluida) {
        console.log('Desmarcando aula como concluída...');
        response = await aulasAPI.desconcluir(aula.id);
      } else {
        console.log('Marcando aula como concluída...');
        response = await aulasAPI.concluir(aula.id);
      }
      console.log('Resposta do servidor:', response.data);
      
      // Recarregar progresso
      await carregarProgressoAulas();
      setAvaliacaoMsg(jaConcluida ? 'Aula desmarcada como concluída!' : 'Aula marcada como concluída!');
      setTimeout(() => setAvaliacaoMsg(''), 3000);
    } catch (error) {
      console.error("Erro completo ao atualizar progresso da aula:", error);
      console.error("Resposta do servidor:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      const mensagemErro = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro desconhecido';
      setAvaliacaoMsg(`Erro ao atualizar progresso da aula: ${mensagemErro}`);
    }
  };

  const abrirVideo = (url = null) => {
    if (!user) return navigate("/login");
    // Não faz nada, o vídeo já está visível na página
  };

  const assistirAula = (aula) => {
    if (!user) return navigate("/login");
    setAulaAtual(aula);
    setVideoAtual(aula.url);
    // Scroll suave até o player
    document.querySelector('.video-preview')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const toggleConcluido = async () => {
    if (!user) return navigate("/login");
    
    // Verificar se todas as aulas foram concluídas
    if (!concluido && aulas.length > 0) {
      const todasConcluidas = aulas.every(aula => 
        progressoAulas.some(p => p.aulaId === aula.id && p.concluido)
      );
      
      if (!todasConcluidas) {
        setAvaliacaoMsg("Você precisa concluir todas as aulas antes de marcar o curso como concluído.");
        return;
      }
    }
    
    setProgressoLoading(true);
    setAvaliacaoMsg("");
    try {
      if (concluido) {
        await progressoAPI.desmarcarConcluido(id);
        setConcluido(false);
      } else {
        await progressoAPI.marcarConcluido(id);
        setConcluido(true);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setAvaliacaoMsg("Sessão expirada. Faça login novamente.");
      } else {
        setAvaliacaoMsg("Erro ao atualizar progresso. Tente novamente.");
      }
    }
    setProgressoLoading(false);
  };

  const emitirCertificado = async () => {
    if (!user) return navigate("/login");
    if (!concluido) {
      setAvaliacaoMsg("Conclua o curso antes de emitir o certificado.");
      return;
    }
    setCertLoading(true);
    try {
      await certificadosAPI.emitir(id, {});
      setTemCertificado(true);
      setAvaliacaoMsg("Certificado emitido com sucesso! Acesse em Meu Perfil.");
    } catch {
      setAvaliacaoMsg("Erro ao emitir certificado.");
    }
    setCertLoading(false);
  };

  const enviarAvaliacao = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (nota < 1) { setAvaliacaoMsg("Selecione uma nota."); return; }
    setAvaliacaoLoading(true);
    setAvaliacaoMsg("");
    try {
      await avaliacoesAPI.avaliar(id, { nota, comentario });
      setAvaliacaoMsg("Avaliação enviada com sucesso!");
      carregarAvaliacoes();
    } catch {
      setAvaliacaoMsg("Erro ao enviar avaliação.");
    }
    setAvaliacaoLoading(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const parseJSON = (str) => {
    if (!str) return [];
    try { return JSON.parse(str) || []; } catch { return []; }
  };

  const linksExternos = parseJSON(curso?.linksExternos);
  const anexos = parseJSON(curso?.anexos);
  const mediaAval = avaliacoes.length
    ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1)
    : null;
  const youtubeId = getYouTubeId(curso?.url);

  if (loading) return (
    <div>
      <Header />
      <div className="curso-detalhes-loading">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes do curso...</p>
      </div>
    </div>
  );

  if (error || !curso) return (
    <div>
      <Header />
      <div className="curso-detalhes-error">
        <h2>Curso não encontrado</h2>
        <p>O curso que você está procurando não existe ou foi removido.</p>
        <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
      </div>
    </div>
  );

  return (
    <div>
      <Header />

      <div className="curso-detalhes-container">
        <div className="curso-detalhes-hero">
          <div className="curso-detalhes-breadcrumb">
            <button onClick={() => navigate(-1)} className="breadcrumb-link">← Voltar</button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{curso.titulo}</span>
          </div>

          {/* Banner de imagem */}
          {curso.imagem && (
            <div className="curso-imagem-banner">
              <img src={curso.imagem} alt={curso.titulo} />
            </div>
          )}

          <div className="curso-detalhes-header">
            <div className="curso-detalhes-info">
              <div className="curso-categoria-badge">{curso.categoria}</div>
              <h1 className="curso-titulo">{curso.titulo}</h1>
              <p className="curso-descricao-resumo">{curso.descricao}</p>

              {mediaAval && (
                <div className="curso-rating-resumo">
                  <StarRating value={Math.round(Number(mediaAval))} readonly />
                  <span style={{ color: "#FFD700", fontWeight: 700 }}>{mediaAval}</span>
                  <span style={{ color: "#999", fontSize: "0.85rem" }}>({avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"})</span>
                </div>
              )}

              <div className="curso-meta">
                <div className="meta-item">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                  <span>Carga Horária: {formatDuration(curso.duracao)}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                  <span>Modalidade: {curso.formaAplicacao || "Online"}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Instrutor: {curso.instrutor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de vídeo + ações */}
          <div className="curso-video-section">
            <div className="video-preview">
              {aulaAtual ? (
                <div className="video-player-embed">
                  <div className="video-player-header">
                    <div className="video-player-info">
                      <span className="video-player-badge">Aula {aulaAtual.ordem}</span>
                      <h3 className="video-player-title">{aulaAtual.titulo}</h3>
                    </div>
                    {user && (
                      <button
                        onClick={() => toggleAulaConcluida(aulaAtual)}
                        className={`btn-check-aula-player ${progressoAulas.some(p => p.aulaId === aulaAtual.id && p.concluido) ? 'concluida' : ''}`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        {progressoAulas.some(p => p.aulaId === aulaAtual.id && p.concluido) ? 'Concluída' : 'Marcar como Concluída'}
                      </button>
                    )}
                  </div>
                  <div className="video-player-frame">
                    {getYouTubeId(aulaAtual.url) ? (
                      <iframe
                        key={aulaAtual.id}
                        src={`https://www.youtube.com/embed/${getYouTubeId(aulaAtual.url)}?autoplay=1&rel=0`}
                        title={aulaAtual.titulo}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="video-player-fallback">
                        <p>Não foi possível carregar o vídeo.</p>
                        <a href={aulaAtual.url} target="_blank" rel="noopener noreferrer" className="btn-fazer-login">
                          Abrir link externo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="video-thumbnail"
                  style={youtubeId ? { backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg)`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                >
                  <div className="video-thumbnail-overlay" />
                  <button className="play-button" onClick={() => assistirAula(aulas[0])} aria-label="Assistir vídeo">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                  <div className="video-overlay">
                    <span className="video-duration">{formatDuration(curso.duracao)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="curso-detalhes-actions">
              {user ? (
                <>
                  {!aulaAtual && aulas.length > 0 && (
                    <button onClick={() => assistirAula(aulas[0])} className="btn-acessar-curso">
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      Iniciar Curso
                    </button>
                  )}

                  {/* Barra de progresso */}
                  <div className="progresso-container">
                    <div className="progresso-label">
                      <span>Progresso do curso</span>
                      <span style={{ color: percentualAulas > 0 ? "#34d399" : "#999" }}>{percentualAulas}%</span>
                    </div>
                    <div className="progresso-bar-bg">
                      <div className="progresso-bar-fill" style={{ width: `${percentualAulas}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={toggleConcluido}
                    disabled={progressoLoading}
                    className={`btn-progresso ${concluido ? "concluido" : ""}`}
                  >
                    {progressoLoading ? (
                      <span className="btn-spinner" />
                    ) : concluido ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Concluído
                      </>
                    ) : "Marcar como Concluído"}
                  </button>

                  {concluido && !temCertificado && (
                    <button onClick={emitirCertificado} disabled={certLoading} className="btn-certificado">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                      {certLoading ? "Emitindo..." : "Emitir Certificado"}
                    </button>
                  )}
                  {temCertificado && (
                    <div className="cert-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                      Certificado emitido — veja em Meu Perfil
                    </div>
                  )}

                  {avaliacaoMsg && (
                    <p className={`acao-msg ${avaliacaoMsg.includes("sucesso") || avaliacaoMsg.includes("emitido") ? "sucesso" : "erro"}`}>
                      {avaliacaoMsg}
                    </p>
                  )}
                </>
              ) : (
                <div className="acesso-restrito">
                  <div className="acesso-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <h3>Acesso Restrito</h3>
                  <p>Faça login para acessar o conteúdo completo do curso</p>
                  <button onClick={() => navigate("/login")} className="btn-fazer-login">Fazer Login</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="curso-detalhes-content">
          <div className="curso-detalhes-main">

            {/* Aulas */}
            {aulas.length > 0 && (
              <section className="curso-section">
                <h2>Aulas do Curso</h2>
                <div className="aulas-lista">
                  {aulas.map((aula) => {
                    const concluida = progressoAulas.some(p => p.aulaId === aula.id && p.concluido);
                    return (
                      <div key={aula.id} className={`aula-item ${aulaAtual?.id === aula.id ? 'ativa' : ''}`}>
                        <div className="aula-numero">{aula.ordem}</div>
                        <div className="aula-info">
                          <h4>{aula.titulo}</h4>
                          {aula.descricao && <p>{aula.descricao}</p>}
                        </div>
                        <div className="aula-acoes">
                          {user && (
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleAulaConcluida(aula); }}
                              className={`btn-check-aula ${concluida ? 'concluida' : ''}`}
                              title={concluida ? 'Marcar como não concluída' : 'Marcar como concluída'}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </button>
                          )}
                          <button onClick={() => assistirAula(aula)} className="btn-assistir-aula">
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Assistir
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Sobre o curso */}
            <section className="curso-section">
              <h2>Sobre o Curso</h2>
              <div className="descricao-content">
                <p>{curso.descricaoDetalhada || curso.descricao}</p>
                <div className="curso-highlights">
                  <div className="highlight-item">
                    <h4>Modalidade</h4>
                    <p>{curso.formaAplicacao || "Online"}</p>
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

            {/* Links externos */}
            {linksExternos.length > 0 && (
              <section className="curso-section">
                <h2>Links Externos</h2>
                <div className="links-externos-list">
                  {linksExternos.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="link-externo-item">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
                        <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                      {link.titulo || link.url}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Materiais */}
            {anexos.length > 0 && (
              <section className="curso-section">
                <h2>Materiais Complementares</h2>
                <div className="anexos-list">
                  {anexos.map((anexo, i) => (
                    <a key={i} href={anexo.url} target="_blank" rel="noopener noreferrer" className="anexo-item">
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, flexShrink: 0 }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                      </svg>
                      {anexo.nome || "Baixar material"}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Avaliações */}
            <section className="curso-section">
              <h2>Avaliações</h2>

              {user && (
                <form onSubmit={enviarAvaliacao} className="avaliacao-form">
                  <p style={{ color: "#ccc", marginBottom: 8, fontSize: "0.9rem" }}>
                    {minhaAvaliacao ? "Sua avaliação:" : "Avalie este curso:"}
                  </p>
                  <StarRating value={nota} onChange={setNota} />
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Deixe um comentário (opcional)..."
                    rows={3}
                    maxLength={500}
                    className="avaliacao-textarea"
                  />
                  <button type="submit" disabled={avaliacaoLoading} className="btn-avaliar">
                    {avaliacaoLoading ? "Enviando..." : minhaAvaliacao ? "Atualizar Avaliação" : "Enviar Avaliação"}
                  </button>
                </form>
              )}

              <div className="avaliacoes-lista">
                {avaliacoes.length === 0 ? (
                  <p style={{ color: "#666", textAlign: "center", padding: "20px 0", fontSize: "0.9rem" }}>
                    Nenhuma avaliação ainda. Seja o primeiro!
                  </p>
                ) : (
                  avaliacoes.map((av) => (
                    <div key={av.id} className="avaliacao-item">
                      <div className="avaliacao-header">
                        <span className="avaliacao-autor">{av.nomeUsuario || "Usuário"}</span>
                        <StarRating value={av.nota} readonly />
                      </div>
                      {av.comentario && <p className="avaliacao-comentario">{av.comentario}</p>}
                      <span className="avaliacao-data">
                        {new Date(av.dataCriacao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="curso-detalhes-sidebar">
            <div className="instrutor-card">
              <h3>Instrutor</h3>
              <div className="instrutor-info">
                <div className="instrutor-avatar">
                  {curso.instrutorFoto ? (
                    <img src={curso.instrutorFoto} alt={curso.instrutor} />
                  ) : (
                    <div className="avatar-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="instrutor-details">
                  <h4>{curso.instrutor}</h4>
                  <p className="instrutor-bio">{curso.instrutorBio || "Instrutor especializado na área"}</p>
                </div>
              </div>
            </div>

            <div className="curso-specs">
              <h3>Detalhes do Curso</h3>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-label">Duração</span>
                  <span className="spec-value">{formatDuration(curso.duracao)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Modalidade</span>
                  <span className="spec-value">{curso.formaAplicacao || "Online"}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Categoria</span>
                  <span className="spec-value">{curso.categoria}</span>
                </div>
                {mediaAval && (
                  <div className="spec-item">
                    <span className="spec-label">Avaliação</span>
                    <span className="spec-value" style={{ color: "#FFD700" }}>{mediaAval} / 5</span>
                  </div>
                )}
                {user && (
                  <div className="spec-item">
                    <span className="spec-label">Progresso</span>
                    <span className="spec-value" style={{ color: concluido ? "#34d399" : "#999" }}>
                      {concluido ? "Concluído" : "Em andamento"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoDetalhes;
