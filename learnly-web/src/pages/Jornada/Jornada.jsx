import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header/Header";
import "../../styles/jornada.css";

const Jornada = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const jornadas = {
    "jornada-backend": {
      titulo: "Jornada Backend",
      descricao: "Domine o desenvolvimento backend com tecnologias modernas",
      icon: "🚀",
      cursos: [
        { id: 1, titulo: "Java Fundamentos", url: "https://www.youtube.com/watch?v=sTX0UEplF54", duracao: 480 },
        { id: 5, titulo: "Spring Boot API", url: "https://www.youtube.com/watch?v=OHn1jLHGptw", duracao: 540 },
        { id: 6, titulo: "MySQL Básico", url: "https://www.youtube.com/watch?v=Ofktsne-utM", duracao: 240 }
      ]
    },
    "jornada-frontend": {
      titulo: "Jornada Frontend",
      descricao: "Crie interfaces modernas e responsivas",
      icon: "🎨",
      cursos: [
        { id: 4, titulo: "JavaScript ES6+", url: "https://www.youtube.com/watch?v=HN1UjzRSdBk", duracao: 300 },
        { id: 1, titulo: "React Completo", url: "https://www.youtube.com/watch?v=FXqX7oof0I0", duracao: 480 },
        { id: 8, titulo: "CSS Grid e Flexbox", url: "https://www.youtube.com/watch?v=x-4z_u8LcGc", duracao: 420 }
      ]
    }
  };

  const jornada = jornadas[slug];

  if (!usuario) {
    return (
      <div>
        <Header />
        <div className="jornada-error">
          <h2>Acesso Restrito</h2>
          <p>Faça login para acessar as jornadas de aprendizado</p>
          <button onClick={() => navigate("/login")} className="btn-voltar">
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  if (!jornada) {
    return (
      <div>
        <Header />
        <div className="jornada-error">
          <h2>Jornada não encontrada</h2>
          <button onClick={() => navigate("/cursos")} className="btn-voltar">
            Voltar aos Cursos
          </button>
        </div>
      </div>
    );
  }

  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    if (stepIndex === currentStep && stepIndex < jornada.cursos.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div>
      <Header />
      <div className="jornada-container">
        <div className="jornada-hero">
          <div className="jornada-header">
            <div className="jornada-icon">{jornada.icon}</div>
            <div className="jornada-info">
              <h1>{jornada.titulo}</h1>
              <p>{jornada.descricao}</p>
              <div className="jornada-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(completedSteps.size / jornada.cursos.length) * 100}%` }}
                  ></div>
                </div>
                <span>{completedSteps.size} de {jornada.cursos.length} concluídos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="jornada-content">
          <div className="jornada-timeline">
            {jornada.cursos.map((curso, index) => (
              <div 
                key={curso.id} 
                className={`timeline-item ${index === currentStep ? 'current' : ''} ${completedSteps.has(index) ? 'completed' : ''}`}
              >
                <div className="timeline-marker">
                  <div className="marker-number">
                    {completedSteps.has(index) ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                </div>
                
                <div className="timeline-content">
                  <div className="curso-card">
                    <div className="curso-header">
                      <h3>{curso.titulo}</h3>
                      <span className="curso-duration">{formatDuration(curso.duracao)}</span>
                    </div>
                    
                    <div className="curso-actions">
                      {index <= currentStep ? (
                        <>
                          <button 
                            className="btn-assistir"
                            onClick={() => window.open(curso.url, '_blank')}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            Assistir Aula
                          </button>
                          {!completedSteps.has(index) && (
                            <button 
                              className="btn-concluir"
                              onClick={() => handleStepComplete(index)}
                            >
                              Marcar como Concluído
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="curso-locked">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                          </svg>
                          Bloqueado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jornada;