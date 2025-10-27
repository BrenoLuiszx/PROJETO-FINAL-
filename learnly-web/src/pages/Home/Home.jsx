import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cursosAPI } from "../../services/api";
import Header from '../Header/Header';
import "../../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [currentInstructor, setCurrentInstructor] = useState(0);
  const sectionsRef = useRef([]);

  const instructors = [
    {
      name: "Gustavo Guanabara",
      role: "Especialista em Programação",
      description: "Professor com mais de 20 anos de experiência em desenvolvimento e educação tecnológica. Criador do Curso em Vídeo, uma das maiores plataformas de ensino gratuito do Brasil.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      students: "2M+",
      courses: "15+",
      experience: "20+"
    },
    {
      name: "Filipe Deschamps",
      role: "Full Stack Developer",
      description: "CTO e desenvolvedor com vasta experiência em startups e tecnologias modernas. Especialista em JavaScript, Node.js e arquiteturas escaláveis.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      students: "800k+",
      courses: "10+",
      experience: "15+"
    },
    {
      name: "Rodrigo Branas",
      role: "Arquiteto de Software",
      description: "Especialista em JavaScript, Node.js e arquitetura de sistemas complexos. Consultor e instrutor com foco em clean code e boas práticas.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
      students: "500k+",
      courses: "12+",
      experience: "18+"
    },
    {
      name: "Lucas Montano",
      role: "Tech Lead",
      description: "Desenvolvedor sênior com experiência em grandes empresas de tecnologia. Especialista em React, mobile e metodologias ágeis.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      students: "300k+",
      courses: "8+",
      experience: "12+"
    }
  ];

  useEffect(() => {
    carregarCursos();
    const cleanup = setupScrollAnimations();
    return cleanup;
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await cursosAPI.listarTodos();
      setCursos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  const setupScrollAnimations = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections(prev => new Set([...prev, sectionId]));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '100px' }
    );

    setTimeout(() => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.observe(section);
      });
    }, 100);

    return () => observer.disconnect();
  };

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    setVisibleSections(prev => new Set([...prev, 'hero']));
  }, []);



  return (
    <div className="home-container">
      <Header />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <section className={`hero-section ${visibleSections.has('hero') ? 'animate-in' : ''}`}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-elements">
            <div className="float-element element-1"></div>
            <div className="float-element element-2"></div>
            <div className="float-element element-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transforme sua carreira com
              <span className="gradient-text"> tecnologia</span>
            </h1>
            <p className="hero-subtitle">
              Aprenda as habilidades mais demandadas do mercado com nossos cursos práticos e atualizados.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/registro')}>
                <svg className="btn-icon" viewBox="0 0 24 24">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Começar agora
              </button>
              <button className="btn-secondary" onClick={() => navigate('/cursos')}>
                Ver cursos gratuitos
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="visual-container">
              <div className="code-window">
                <div className="window-header">
                  <div className="window-controls">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="code-content">
                  <div className="code-line">
                    <span className="keyword">const</span> <span className="variable">futuro</span> = <span className="function">aprender</span>(<span className="string">'tecnologia'</span>);
                  </div>
                  <div className="code-line">
                    <span className="keyword">if</span> (<span className="variable">futuro</span>.<span className="function">sucesso</span>()) {'{'}
                  </div>
                  <div className="code-line">
                    {'  '}<span className="function">console</span>.<span className="function">log</span>(<span className="string">'Carreira transformada!'</span>);
                  </div>
                  <div className="code-line">
                    {'}'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        className={`stats-section ${visibleSections.has('stats') ? 'animate-in' : ''}`}
        data-section="stats"
        ref={addToRefs}
      >
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Cursos disponíveis</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50k+</div>
            <div className="stat-label">Estudantes ativos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Taxa de satisfação</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Acesso ilimitado</div>
          </div>
        </div>
      </section>

      <section 
        className={`features-section ${visibleSections.has('features') ? 'animate-in' : ''}`}
        data-section="features"
        ref={addToRefs}
      >
        <div className="features-container">
          <div className="section-header">
            <h2>Por que escolher o Learnly?</h2>
            <p>Tecnologia avançada para uma experiência de aprendizado superior</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Aprendizado Acelerado</h3>
              <p>Metodologia otimizada para absorção rápida de conhecimento com técnicas comprovadas.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Qualidade Premium</h3>
              <p>Conteúdo curado por especialistas da indústria com foco em aplicação prática.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Comunidade Ativa</h3>
              <p>Conecte-se com outros profissionais e compartilhe experiências de aprendizado.</p>
            </div>
          </div>
        </div>
      </section>

      <section 
        className={`home-courses-section ${visibleSections.has('courses') ? 'animate-in' : ''}`}
        data-section="courses"
        ref={addToRefs}
      >
        <div className="home-courses-container">
          <div className="section-header">
            <h2>Cursos em Destaque</h2>
            <p>Explore nossa seleção de cursos mais populares</p>
          </div>
          
          <div className="home-courses-grid">
            {cursos.slice(0, 6).map((curso, index) => (
              <div 
                key={curso.id} 
                className="home-course-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="home-course-header">
                  <div className="home-course-category">{curso.categoria}</div>
                  <div className="home-course-level">Intermediário</div>
                </div>
                <div className="home-course-content">
                  <h3>{curso.titulo}</h3>
                  <p>{curso.descricao}</p>
                  <div className="home-course-meta">
                    <span className="home-instructor">{curso.instrutor}</span>
                    <span className="home-duration">{Math.floor(curso.duracao / 60)}h</span>
                  </div>
                </div>
                <div className="home-course-footer">
                  <button className="home-course-btn">
                    Começar curso
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="home-courses-cta">
            <button className="btn-outline" onClick={() => navigate('/cursos')}>
              Ver todos os cursos
            </button>
          </div>
        </div>
      </section>

      <section 
        className={`instructors-section ${visibleSections.has('instructors') ? 'animate-in' : ''}`}
        data-section="instructors"
        ref={addToRefs}
      >
        <div className="instructors-container">
          <div className="section-header">
            <h2>Nossos Instrutores</h2>
            <p>Aprenda com especialistas reconhecidos no mercado</p>
          </div>
          
          <div className="carousel-container">
            <div className="carousel-nav">
              {instructors.map((instructor, index) => (
                <button 
                  key={index}
                  className={`nav-dot ${currentInstructor === index ? 'active' : ''}`}
                  onClick={() => setCurrentInstructor(index)}
                >
                  <img src={instructor.image} alt={instructor.name} />
                </button>
              ))}
            </div>
            
            <div className="instructor-showcase">
              {instructors[currentInstructor] && (
                <div className="instructor-card-large">
                  <div className="instructor-photo">
                    <img src={instructors[currentInstructor].image} alt={instructors[currentInstructor].name} />
                  </div>
                  <div className="instructor-content">
                    <h3>{instructors[currentInstructor].name}</h3>
                    <p className="role">{instructors[currentInstructor].role}</p>
                    <p className="description">{instructors[currentInstructor].description}</p>
                    <div className="stats">
                      <div className="stat">
                        <span className="number">{instructors[currentInstructor].students}</span>
                        <span className="label">Alunos</span>
                      </div>
                      <div className="stat">
                        <span className="number">{instructors[currentInstructor].courses}</span>
                        <span className="label">Cursos</span>
                      </div>
                      <div className="stat">
                        <span className="number">{instructors[currentInstructor].experience}</span>
                        <span className="label">Anos</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section 
        className={`cta-section ${visibleSections.has('cta') ? 'animate-in' : ''}`}
        data-section="cta"
        ref={addToRefs}
      >
        <div className="cta-container">
          <div className="cta-content">
            <h2>Pronto para começar sua jornada?</h2>
            <p>Junte-se a milhares de profissionais que já transformaram suas carreiras</p>
            <button className="btn-primary large" onClick={() => navigate('/registro')}>
              Criar conta gratuita
            </button>
          </div>
          <div className="cta-visual">
            <div className="success-animation">
              <div className="check-circle">
                <svg viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        className={`especialidades-section ${visibleSections.has('especialidades') ? 'animate-in' : ''}`}
        data-section="especialidades"
        ref={addToRefs}
      >
        <div className="especialidades-container">
          <div className="section-header">
            <h2>Nossas Especialidades</h2>
            <p>Áreas de conhecimento que dominamos para seu crescimento profissional</p>
          </div>
          
          <div className="especialidades-grid">
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3>Desenvolvimento Web</h3>
              <p>Frontend, Backend, Full Stack e tecnologias modernas para criar aplicações robustas e escaláveis.</p>
            </div>
            
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="7.5,4.21 12,6.81 16.5,4.21" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="7.5,19.79 7.5,14.6 3,12" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="21,12 16.5,14.6 16.5,19.79" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="12,22.81 12,17" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3>Ciência de Dados</h3>
              <p>Machine Learning, IA, análise de dados e visualização para transformar dados em insights valiosos.</p>
            </div>
            
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3>Design & UX/UI</h3>
              <p>Design thinking, prototipagem, experiência do usuário e interfaces que encantam e convertem.</p>
            </div>
            
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Marketing Digital</h3>
              <p>SEO, redes sociais, análise de métricas e estratégias para aumentar sua presença online.</p>
            </div>
            
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Segurança Digital</h3>
              <p>Cybersecurity, ethical hacking, proteção de dados e melhores práticas de segurança.</p>
            </div>
            
            <div className="especialidade-card">
              <div className="especialidade-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>DevOps & Cloud</h3>
              <p>AWS, Docker, Kubernetes, CI/CD e automação para deploy e gerenciamento de aplicações.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sobre-nos-section">
        <div className="sobre-container">
          <div className="sobre-content">
            <div className="sobre-text">
              <h2>Sobre nós</h2>
              <p>
                Somos uma plataforma dedicada a democratizar o acesso à educação de qualidade. 
                Nossa missão é conectar pessoas com conhecimento, oferecendo cursos gratuitos 
                e de alta qualidade para todos.
              </p>
              <p>
                Com instrutores especialistas e conteúdo sempre atualizado, 
                preparamos você para os desafios do mercado de trabalho moderno.
              </p>
            </div>
            <div className="sobre-stats">
              <div className="stat">
                <h3>10k+</h3>
                <p>Alunos formados</p>
              </div>
              <div className="stat">
                <h3>200+</h3>
                <p>Cursos disponíveis</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Instrutores especialistas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Learnly</h3>
              <p>Transformando carreiras através da educação de qualidade.</p>
              <div className="footer-social">
                <a href="https://github.com/learnly" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://instagram.com/learnly" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://facebook.com/learnly" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/learnly" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Plataforma</h4>
                <ul>
                  <li><a href="/cursos">Cursos</a></li>
                  <li><a href="/registro">Criar Conta</a></li>
                  <li><a href="/login">Entrar</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Empresa</h4>
                <ul>
                  <li><a href="#">Sobre Nós</a></li>
                  <li><a href="#">Carreiras</a></li>
                  <li><a href="#">Imprensa</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Suporte</h4>
                <ul>
                  <li><a href="#">Central de Ajuda</a></li>
                  <li><a href="#">Contato</a></li>
                  <li><a href="#">Status</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacidade</a></li>
                  <li><a href="#">Termos</a></li>
                  <li><a href="#">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Learnly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;