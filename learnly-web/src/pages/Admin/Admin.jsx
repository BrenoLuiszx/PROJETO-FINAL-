import React, { useState, useEffect } from 'react';
import { cursosAPI } from '../../services/api';
import api from '../../services/api';
import Header from '../Header/Header';
import '../../styles/admin-bigtech.css';

const Admin = () => {
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

  useEffect(() => {
    carregarCursos();
    carregarUsuarios();
  }, []);

  const carregarCursos = async () => {
    try {
      const response = await cursosAPI.listarTodos();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      console.log(' Usuários carregados:', response.data);
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
              <span className="stat-number">{usuarios.length}</span>
              <span className="stat-label">Usuários</span>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'cursos' ? 'active' : ''}`}
            onClick={() => setActiveTab('cursos')}
          >
            Cursos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuários
          </button>
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
                  <a 
                    href={curso.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-view"
                  >
                    Ver Curso
                  </a>
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
                      <img 
                        src={usuario.foto} 
                        alt={usuario.nome || usuario.email}
                        onLoad={() => console.log(' Admin foto carregada:', usuario.foto)}
                        onError={() => console.log(' Admin erro ao carregar foto:', usuario.foto)}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {(usuario.nome || usuario.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <h3>{usuario.nome || 'Nome não informado'}</h3>
                    <p className="user-email">{usuario.email}</p>
                    <span className={`user-role ${usuario.role}`}>
                      {usuario.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
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