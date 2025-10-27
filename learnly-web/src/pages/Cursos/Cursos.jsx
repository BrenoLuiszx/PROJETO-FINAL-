import React, { useState, useEffect } from "react";
import { cursosAPI } from "../../services/api";
import Header from "../Header/Header";
import "../../styles/cursos-bigtech.css";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await cursosAPI.listarTodos();
      setCursos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      alert(
        "Erro de rede ao carregar cursos. Verifique se o servidor está rodando na porta 8080."
      );
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarCursos = async () => {
    if (!filtro.trim()) {
      carregarCursos();
      return;
    }
    try {
      setLoading(true);
      const response = await cursosAPI.buscarPorTitulo(filtro.trim());
      setCursos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      alert(
        "Erro de rede ao buscar cursos. Verifique se o servidor está rodando."
      );
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCategoria = async (cat) => {
    setCategoria(cat);
    setFiltro("");

    if (!cat) {
      carregarCursos();
      return;
    }

    try {
      setLoading(true);
      const response = await cursosAPI.buscarPorCategoria(cat);
      setCursos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao filtrar cursos:", error);
      alert(
        "Erro de rede ao filtrar cursos. Verifique se o servidor está rodando."
      );
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="courses-loading">
          <div className="loading-spinner"></div>
          <p>Carregando cursos...</p>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div>
      <Header />
      <div className="courses-container">
        <div className="courses-hero">
          <h1>LEARNLY</h1>
          <p>
            A plataforma de cursos mais avançada do Brasil. Conteúdo exclusivo,
            instrutores renomados e tecnologia de ponta para acelerar sua
            carreira.
          </p>
        </div>

        <div className="course-filters">
          <div className="filters-header">
            <h2 className="filters-title">Descubra seu próximo nível</h2>
            <div className="filters-stats">
              <span className="stats-badge">
                {cursos.length} Cursos Premium
              </span>
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Visualização em Grade"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Visualização em Lista"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="filters-controls">
            <div className="search-group">
              <input
                type="text"
                className="search-input"
                placeholder="Digite sua próxima habilidade... (React, Python, Node.js)"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && buscarCursos()}
              />
            </div>

            <select
              className="category-select"
              value={categoria}
              onChange={(e) => filtrarPorCategoria(e.target.value)}
            >
              <option value="">Explorar Tudo</option>
              <option value="Frontend">Frontend & UI/UX</option>
              <option value="Backend">Backend & APIs</option>
              <option value="Data Science">Data Science & AI</option>
              <option value="Database">Banco de Dados</option>
              <option value="DevOps">DevOps & Cloud</option>
              <option value="Mobile">Mobile & Apps</option>
            </select>

            <button className="btn-search" onClick={buscarCursos}>
              Buscar
            </button>

            <button
              className="btn-clear"
              onClick={() => {
                setFiltro("");
                setCategoria("");
                carregarCursos();
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        <div className={`courses-grid ${viewMode}`}>
          {cursos.map((curso, index) => (
            <div
              key={curso.id}
              className="course-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="course-header">
                <div className="course-category">{curso.categoria}</div>
                <div className="course-duration">
                  {formatDuration(curso.duracao)}
                </div>
              </div>

              <h3 className="course-title">{curso.titulo}</h3>
              <p className="course-description">{curso.descricao}</p>

              <div className="course-instructor">
                Instrutor: {curso.instrutor}
              </div>

              <div className="course-actions">
                <a
                  href={curso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-watch"
                >
                  Começar Curso
                </a>
              </div>
            </div>
          ))}
        </div>

        {cursos.length === 0 && (
          <div className="no-courses">
            <svg
              className="no-courses-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h3>Nenhum curso encontrado</h3>
            <p>
              Não encontramos cursos com esses critérios. Tente ajustar seus
              filtros ou explore outras categorias.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setFiltro("");
                setCategoria("");
                carregarCursos();
              }}
            >
              Explorar Todos os Cursos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cursos;
