import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cursosAPI, usuariosAPI, aulasAPI } from '../../services/api';
import api from '../../services/api';
import Header from '../Header/Header';
import '../../styles/admin-bigtech.css';

const Admin = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursosPendentes, setCursosPendentes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [activeTab, setActiveTab] = useState('cursos');
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    url: '',
    categoria: '',
    instrutor: '',
    duracao: ''
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Aulas
  const [cursoAulasId, setCursoAulasId] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [showAulasForm, setShowAulasForm] = useState(false);

  useEffect(() => {
    carregarCursos();
    carregarUsuarios();
    carregarCursosPendentes();
    carregarSolicitacoes();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await cursosAPI.listarTodos();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const carregarCursosPendentes = async () => {
    try {
      const response = await cursosAPI.listarPendentes();
      setCursosPendentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos pendentes:', error);
    }
  };

  const carregarSolicitacoes = async () => {
    try {
      const response = await usuariosAPI.listarSolicitacoesPendentes();
      setSolicitacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  const aprovarColaborador = async (id) => {
    try {
      await usuariosAPI.aprovarColaborador(id);
      alert('Colaborador aprovado!');
      carregarSolicitacoes();
      carregarUsuarios();
    } catch { alert('Erro ao aprovar'); }
  };

  const recusarColaborador = async (id) => {
    try {
      await usuariosAPI.recusarColaborador(id);
      alert('Solicitação recusada.');
      carregarSolicitacoes();
    } catch { alert('Erro ao recusar'); }
  };

  const aprovarCurso = async (id) => {
    try {
      await cursosAPI.aprovar(id);
      alert('Curso aprovado!');
      carregarCursosPendentes();
      carregarCursos();
    } catch { alert('Erro ao aprovar curso'); }
  };

  const rejeitarCurso = async (id) => {
    try {
      await cursosAPI.rejeitar(id);
      alert('Curso rejeitado.');
      carregarCursosPendentes();
    } catch { alert('Erro ao rejeitar curso'); }
  };

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data.usuarios || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  // Recarregar usuários a cada 5 segundos quando na aba usuários
  useEffect(() => {
    if (activeTab === 'usuarios') {
      const interval = setInterval(carregarUsuarios, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const dadosCurso = {
      ...form,
      duracao: Math.round((parseFloat(form.duracao) || 0) * 60) // Converter horas para minutos
    };
    
    try {
      if (editando) {
        await cursosAPI.atualizar(editando, dadosCurso);
        alert('Curso atualizado com sucesso!');
        setEditando(null);
      } else {
        await cursosAPI.criar(dadosCurso);
        alert('Curso criado com sucesso!');
      }
      resetForm();
      carregarCursos();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert('Erro: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ titulo: '', descricao: '', url: '', categoria: '', instrutor: '', duracao: '' });
    setEditando(null);
  };

  const editar = (curso) => {
    setForm({
      ...curso,
      duracao: String(Math.round((curso.duracao / 60) * 10) / 10) // Converter minutos para horas com 1 decimal
    });
    setEditando(curso.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletar = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja deletar o curso "${titulo}"?\n\nEsta ação não pode ser desfeita.`)) {
      setLoading(true);
      try {
        await cursosAPI.deletar(id);
        alert('Curso deletado com sucesso!');
        carregarCursos();
      } catch (error) {
        console.error('Erro ao deletar curso:', error);
        alert('Erro ao deletar curso');
      } finally {
        setLoading(false);
      }
    }
  };

  const gerenciarAulas = async (cursoId) => {
    setCursoAulasId(cursoId);
    setShowAulasForm(true);
    try {
      const res = await aulasAPI.listarPorCurso(cursoId);
      setAulas(res.data || []);
    } catch {
      setAulas([]);
    }
  };

  const adicionarAula = () => {
    setAulas([...aulas, { titulo: '', url: '', descricao: '', ordem: aulas.length + 1 }]);
  };

  const removerAula = (index) => {
    setAulas(aulas.filter((_, i) => i !== index));
  };

  const atualizarAula = (index, campo, valor) => {
    const novasAulas = [...aulas];
    novasAulas[index][campo] = valor;
    setAulas(novasAulas);
  };

  const salvarAulas = async () => {
    if (!cursoAulasId) return;
    
    // Validar aulas antes de salvar
    const aulasValidas = aulas.filter(a => a.titulo && a.url);
    if (aulasValidas.length === 0) {
      alert('Adicione pelo menos uma aula com título e URL');
      return;
    }
    
    setLoading(true);
    try {
      // Garantir que cada aula tenha a estrutura correta
      const aulasParaSalvar = aulasValidas.map((aula, index) => ({
        titulo: aula.titulo.trim(),
        url: aula.url.trim(),
        descricao: aula.descricao ? aula.descricao.trim() : '',
        ordem: index + 1
      }));
      
      console.log('Enviando aulas:', aulasParaSalvar);
      const response = await aulasAPI.salvarAulas(cursoAulasId, aulasParaSalvar);
      console.log('Resposta:', response.data);
      
      alert('Aulas salvas com sucesso! A URL do curso foi atualizada automaticamente.');
      setShowAulasForm(false);
      setCursoAulasId(null);
      setAulas([]);
      carregarCursos();
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Resposta do servidor:', error.response?.data);
      const mensagemErro = error.response?.data?.error || error.response?.data?.message || error.message || 'Erro desconhecido';
      alert('Erro ao salvar aulas: ' + mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.instrutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || curso.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categorias = ['Frontend', 'Backend', 'Data Science', 'Database', 'DevOps'];

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Painel Administrativo</h1>
            <p>Gerencie os cursos da plataforma Learnly</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{cursos.length}</span>
              <span className="stat-label">Total de Cursos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cursosPendentes.length}</span>
              <span className="stat-label">Cursos Pendentes</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{usuarios.length}</span>
              <span className="stat-label">Usuários</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{solicitacoes.length}</span>
              <span className="stat-label">Solicitações</span>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}>Cursos</button>
          <button className={`tab-btn ${activeTab === 'pendentes' ? 'active' : ''}`} onClick={() => setActiveTab('pendentes')}>
            Cursos Pendentes {cursosPendentes.length > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', marginLeft: '6px' }}>{cursosPendentes.length}</span>}
          </button>
          <button className={`tab-btn ${activeTab === 'solicitacoes' ? 'active' : ''}`} onClick={() => setActiveTab('solicitacoes')}>
            Solicitações {solicitacoes.length > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', marginLeft: '6px' }}>{solicitacoes.length}</span>}
          </button>
          <button className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>Usuários</button>
        </div>

        {activeTab === 'cursos' && (
          <div className="admin-actions">
            <button 
              className="btn-new-course"
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) resetForm();
              }}
            >
              {showForm ? 'Cancelar' : 'Novo Curso'}
            </button>
          </div>
        )}

        {activeTab === 'cursos' && showForm && (
          <div className="course-form-container">
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-header">
                <h2>{editando ? 'Editar Curso' : 'Criar Novo Curso'}</h2>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Título do Curso *</label>
                  <input
                    type="text"
                    placeholder="Ex: React Completo"
                    value={form.titulo}
                    onChange={(e) => setForm({...form, titulo: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({...form, categoria: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Descrição *</label>
                  <textarea
                    placeholder="Descreva o conteúdo do curso..."
                    value={form.descricao}
                    onChange={(e) => setForm({...form, descricao: e.target.value})}
                    required
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>URL do Curso *</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.url}
                    onChange={(e) => setForm({...form, url: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Instrutor</label>
                  <input
                    type="text"
                    placeholder="Nome do instrutor"
                    value={form.instrutor}
                    onChange={(e) => setForm({...form, instrutor: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Duração</label>
                  <div className="duration-input-group">
                    <input
                      type="number"
                      placeholder="8"
                      value={form.duracao}
                      onChange={(e) => setForm({...form, duracao: e.target.value})}
                      min="0.5"
                      step="0.5"
                    />
                    <span className="duration-unit">horas</span>
                  </div>
                  <small className="duration-help">Digite a duração em horas (ex: 8 para 8 horas)</small>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Salvando...' : (editando ? 'Atualizar Curso' : 'Criar Curso')}
                </button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div className="courses-management">
          <div className="management-header">
            <h2>Cursos Cadastrados</h2>
            
            <div className="filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar por título ou instrutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="courses-grid">
            {filteredCursos.map(curso => (
              <div key={curso.id} className="course-card">
                <div className="course-header">
                  <div className="course-category">
                    {curso.categoria}
                  </div>
                  <div className="course-duration">
                    {formatDuration(curso.duracao)}
                  </div>
                </div>
                
                <div className="course-content">
                  <h3 className="course-title">{curso.titulo}</h3>
                  <p className="course-description">{curso.descricao}</p>
                  <div className="course-instructor">
                    Instrutor: {curso.instrutor}
                  </div>
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => editar(curso)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deletar(curso.id, curso.titulo)}
                    disabled={loading}
                  >
                    Deletar
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/curso/${curso.id}`)}
                  >
                    Ver Curso
                  </button>
                  <button
                    className="btn-edit"
                    style={{ background: '#8b5cf6' }}
                    onClick={() => gerenciarAulas(curso.id)}
                  >
                    Aulas
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCursos.length === 0 && (
            <div className="no-courses">
              <div className="no-courses-icon"></div>
              <h3>Nenhum curso encontrado</h3>
              <p>Tente ajustar os filtros ou criar um novo curso</p>
            </div>
          )}
        </div>
        )}

        {showAulasForm && (
          <div className="modal-overlay" onClick={() => { setShowAulasForm(false); setCursoAulasId(null); setAulas([]); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Gerenciar Aulas do Curso</h2>
                <button onClick={() => { setShowAulasForm(false); setCursoAulasId(null); setAulas([]); }} className="modal-close-btn">✕</button>
              </div>
              
              <div className="modal-body">
                <div style={{ marginBottom: '20px' }}>
                  <button onClick={adicionarAula} className="btn-submit" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.9rem' }}>
                    + Adicionar Aula
                  </button>
                </div>

                {aulas.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>Nenhuma aula cadastrada. Clique em "Adicionar Aula" para começar.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                    {aulas.map((aula, index) => (
                      <div key={index} style={{ background: '#1a1a1a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ color: '#FFD700', margin: 0, fontSize: '0.95rem' }}>Aula {index + 1}</h4>
                          <button onClick={() => removerAula(index)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Remover</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#ccc' }}>Título da Aula *</label>
                            <input
                              type="text"
                              placeholder="Ex: Introdução ao React"
                              value={aula.titulo}
                              onChange={(e) => atualizarAula(index, 'titulo', e.target.value)}
                              style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#ccc' }}>URL do Vídeo *</label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={aula.url}
                              onChange={(e) => atualizarAula(index, 'url', e.target.value)}
                              style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
                              required
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#ccc' }}>Descrição</label>
                            <textarea
                              placeholder="Descrição da aula (opcional)"
                              value={aula.descricao || ''}
                              onChange={(e) => atualizarAula(index, 'descricao', e.target.value)}
                              rows="2"
                              style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #444', borderRadius: '6px', color: '#fff', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={salvarAulas} className="btn-submit" disabled={loading || aulas.length === 0} style={{ flex: 1 }}>
                  {loading ? 'Salvando...' : 'Salvar Aulas'}
                </button>
                <button onClick={() => { setShowAulasForm(false); setCursoAulasId(null); setAulas([]); }} className="btn-cancel" style={{ flex: 1 }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pendentes' && (
          <div className="courses-management">
            <div className="management-header">
              <h2>Cursos Aguardando Aprovação</h2>
            </div>
            <div className="courses-grid">
              {cursosPendentes.map(curso => (
                <div key={curso.id} className="course-card">
                  <div className="course-header">
                    <div className="course-category">{curso.categoria}</div>
                    <span style={{ background: '#fbbf24', color: '#000', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>Pendente</span>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{curso.titulo}</h3>
                    <p className="course-description">{curso.descricao}</p>
                    <div className="course-instructor">Instrutor: {curso.instrutor}</div>
                  </div>
                  <div className="course-actions">
                    <button className="btn-edit" style={{ background: '#34d399', color: '#000' }} onClick={() => aprovarCurso(curso.id)}>✓ Aprovar</button>
                    <button className="btn-delete" onClick={() => rejeitarCurso(curso.id)}>✗ Rejeitar</button>
                  </div>
                </div>
              ))}
            </div>
            {cursosPendentes.length === 0 && (
              <div className="no-courses"><h3>Nenhum curso pendente</h3><p>Todos os cursos foram revisados!</p></div>
            )}
          </div>
        )}

        {activeTab === 'solicitacoes' && (
          <div className="users-management">
            <div className="management-header">
              <h2>Solicitações de Colaborador</h2>
            </div>
            <div className="users-grid">
              {solicitacoes.map((usuario) => (
                <div key={usuario.id} className="user-card">
                  <div className="user-avatar">
                    {usuario.foto
                      ? <img src={usuario.foto} alt={usuario.nome} />
                      : <div className="avatar-placeholder">{usuario.nome?.charAt(0).toUpperCase()}</div>
                    }
                  </div>
                  <div className="user-info">
                    <h3>{usuario.nome}</h3>
                    <p className="user-email">{usuario.email}</p>
                    {usuario.justificativaColaborador && (
                      <p style={{ color: '#ccc', fontSize: '0.85rem', margin: '8px 0', fontStyle: 'italic', background: '#111', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #FFD700' }}>
                        "{usuario.justificativaColaborador}"
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button className="btn-edit" style={{ background: '#34d399', color: '#000', flex: 1 }} onClick={() => aprovarColaborador(usuario.id)}>✓ Aprovar</button>
                      <button className="btn-delete" style={{ flex: 1 }} onClick={() => recusarColaborador(usuario.id)}>✗ Recusar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {solicitacoes.length === 0 && (
              <div className="no-users"><h3>Nenhuma solicitação pendente</h3></div>
            )}
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="users-management">
            <div className="management-header">
              <h2>Usuários Cadastrados</h2>
            </div>

            <div className="users-grid">
              {usuarios.map((usuario, index) => (
                <div key={index} className="user-card">
                  <div className="user-avatar">
                    {usuario.foto ? (
                      <img src={usuario.foto} alt={usuario.nome || usuario.email} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(usuario.nome || usuario.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{usuario.nome || 'Nome não informado'}</h3>
                    <p className="user-email">{usuario.email}</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span className={`user-role ${usuario.role}`}>
                        {usuario.role === 'admin' ? 'Admin' : usuario.role === 'colaborador' ? 'Colaborador' : 'Usuário'}
                      </span>
                      {usuario.role === 'colaborador' && (
                        <span style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>
                          Pode criar cursos
                        </span>
                      )}
                      {usuario.statusSolicitacao === 'pendente' && (
                        <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>
                          Solicitação pendente
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {usuarios.length === 0 && (
              <div className="no-users">
                <div className="no-users-icon"></div>
                <h3>Nenhum usuário cadastrado</h3>
                <p>Os usuários aparecerão aqui quando se cadastrarem na plataforma</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;