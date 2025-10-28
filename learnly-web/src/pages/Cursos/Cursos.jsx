import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cursosAPI } from "../../services/api";
import Header from "../Header/Header";
import "../../styles/cursos-bigtech.css";

const Cursos = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("cursos");

  const jornadas = [
    {
      titulo: "Jornada Backend",
      descricao: "Domine o desenvolvimento backend com tecnologias modernas",
      icon: "🚀",
      cursos: ["Java Fundamentos", "Spring Boot API", "MySQL Básico"],
      duracao: "24h",
      nivel: "Intermediário"
    },
    {
      titulo: "Jornada Frontend",
      descricao: "Crie interfaces modernas e responsivas",
      icon: "🎨",
      cursos: ["JavaScript ES6+", "React Completo", "CSS Grid e Flexbox"],
      duracao: "20h",
      nivel: "Iniciante"
    },
    {
      titulo: "Jornada DevOps",
      descricao: "Automatize e otimize o ciclo de desenvolvimento",
      icon: "⚙️",
      cursos: ["Git e GitHub", "Docker Essentials", "CI/CD Pipeline"],
      duracao: "16h",
      nivel: "Avançado"
    },
    {
      titulo: "Jornada Data Science",
      descricao: "Analise dados e crie modelos de machine learning",
      icon: "📊",
      cursos: ["Python Fundamentos", "Pandas & NumPy", "Machine Learning"],
      duracao: "32h",
      nivel: "Intermediário"
    },
    {
      titulo: "Jornada Cybersecurity",
      descricao: "Proteja sistemas e dados contra ameaças digitais",
      icon: "🔒",
      cursos: ["Fundamentos de Segurança", "Ethical Hacking", "Análise de Vulnerabilidades"],
      duracao: "28h",
      nivel: "Avançado"
    },
    {
      titulo: "Jornada Mobile",
      descricao: "Desenvolva aplicativos para iOS e Android",
      icon: "📱",
      cursos: ["React Native", "Flutter Básico", "APIs Mobile"],
      duracao: "22h",
      nivel: "Intermediário"
    }
  ];

  console.log('Jornadas carregadas:', jornadas.length);

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
    <div className="courses-page">
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
                {activeTab === 'cursos' ? `${cursos.length} Cursos Premium` : `${jornadas.length} Jornadas Disponíveis`}
              </span>
              {activeTab === 'cursos' && (
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
              )}
            </div>
          </div>

          {activeTab === 'cursos' && (
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
          )}
        </div>

        <div className="courses-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`} 
            onClick={() => setActiveTab('cursos')}
          >
            Todos os Cursos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'jornadas' ? 'active' : ''}`} 
            onClick={() => setActiveTab('jornadas')}
          >
            Jornadas
          </button>
        </div>

        {activeTab === 'cursos' ? (
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
                    href={`/curso/${curso.id}`}
                    className="btn-watch"
                  >
                    Ver Curso
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="jornadas-grid">
            {jornadas.map((jornada, index) => (
              <div key={index} className="jornada-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="jornada-header">
                  <div className="jornada-icon">{jornada.icon}</div>
                  <div className="jornada-info">
                    <h3 className="jornada-title">{jornada.titulo}</h3>
                    <p className="jornada-description">{jornada.descricao}</p>
                  </div>
                </div>
                <div className="jornada-stats">
                  <span className="stat-item">{jornada.cursos.length} Cursos</span>
                  <span className="stat-item">{jornada.duracao} Total</span>
                  <span className="stat-item">{jornada.nivel}</span>
                </div>
                <div className="jornada-courses">
                  {jornada.cursos.map((curso, idx) => (
                    <div key={idx} className="mini-course">
                      <span className="course-number">{idx + 1}</span>
                      <span className="course-name">{curso}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="btn-jornada"
                  onClick={() => {
                    const slug = jornada.titulo.toLowerCase().replace(/\s+/g, '-');
                    console.log('Navegando para:', `/jornada/${slug}`);
                    navigate(`/jornada/${slug}`);
                  }}
                >
                  Iniciar Jornada
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cursos' && cursos.length === 0 && (
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
