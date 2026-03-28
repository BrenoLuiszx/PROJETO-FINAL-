import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cursosAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import '../../styles/admin-bigtech.css';

const Colaborador = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '', descricao: '', url: '', categoria: '', instrutor: '', duracao: ''
  });

  const categorias = ['Frontend', 'Backend', 'Data Science', 'Database', 'DevOps', 'Mobile'];

  useEffect(() => {
    carregarMeusCursos();
  }, []);

  const carregarMeusCursos = async () => {
    try {
      const response = await cursosAPI.meusCursos();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dados = { ...form, duracao: Math.round((parseFloat(form.duracao) || 0) * 60) };
    try {
      if (editando) {
        await cursosAPI.atualizar(editando, dados);
        alert('Curso atualizado! Aguardando aprovação do admin.');
      } else {
        await cursosAPI.criar(dados);
        alert('Curso enviado para aprovação do admin!');
      }
      resetForm();
      carregarMeusCursos();
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao salvar curso');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ titulo: '', descricao: '', url: '', categoria: '', instrutor: '', duracao: '' });
    setEditando(null);
  };

  const editar = (curso) => {
    setForm({ ...curso, duracao: String(Math.round((curso.duracao / 60) * 10) / 10) });
    setEditando(curso.id);
    setShowForm(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      aprovado: { label: 'Aprovado', color: '#34d399' },
      pendente: { label: 'Pendente', color: '#fbbf24' },
      rejeitado: { label: 'Rejeitado', color: '#ef4444' },
    };
    const s = map[status] || map.pendente;
    return <span style={{ background: s.color, color: '#000', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>{s.label}</span>;
  };

  return (
    <div>
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Área do Colaborador</h1>
            <p>Olá, {usuario?.nome}! Gerencie seus cursos aqui.</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{cursos.length}</span>
              <span className="stat-label">Meus Cursos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cursos.filter(c => c.status === 'aprovado').length}</span>
              <span className="stat-label">Aprovados</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{cursos.filter(c => c.status === 'pendente').length}</span>
              <span className="stat-label">Pendentes</span>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn-new-course" onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }}>
            {showForm ? 'Cancelar' : '+ Novo Curso'}
          </button>
        </div>

        {showForm && (
          <div className="course-form-container">
            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-header">
                <h2>{editando ? 'Editar Curso' : 'Enviar Novo Curso'}</h2>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>O curso será enviado para aprovação do administrador.</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Título *</label>
                  <input type="text" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required placeholder="Ex: React Completo" />
                </div>
                <div className="form-group">
                  <label>Categoria *</label>
                  <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} required>
                    <option value="">Selecione</option>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Descrição *</label>
                  <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required rows="3" placeholder="Descreva o conteúdo..." />
                </div>
                <div className="form-group">
                  <label>URL do Curso *</label>
                  <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Instrutor</label>
                  <input type="text" value={form.instrutor} onChange={(e) => setForm({ ...form, instrutor: e.target.value })} placeholder="Nome do instrutor" />
                </div>
                <div className="form-group">
                  <label>Duração (horas)</label>
                  <input type="number" value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} min="0.5" step="0.5" placeholder="8" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Enviando...' : (editando ? 'Atualizar' : 'Enviar para Aprovação')}
                </button>
                <button type="button" className="btn-cancel" onClick={() => { resetForm(); setShowForm(false); }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="courses-management">
          <div className="management-header">
            <h2>Meus Cursos</h2>
          </div>
          <div className="courses-grid">
            {cursos.map(curso => (
              <div key={curso.id} className="course-card">
                <div className="course-header">
                  <div className="course-category">{curso.categoria}</div>
                  {getStatusBadge(curso.status)}
                </div>
                <div className="course-content">
                  <h3 className="course-title">{curso.titulo}</h3>
                  <p className="course-description">{curso.descricao}</p>
                </div>
                <div className="course-actions">
                  {curso.status !== 'aprovado' && (
                    <button className="btn-edit" onClick={() => editar(curso)}>Editar</button>
                  )}
                  {curso.status === 'aprovado' && (
                    <button className="btn-view" onClick={() => navigate(`/curso/${curso.id}`)}>Ver Curso</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {cursos.length === 0 && (
            <div className="no-courses">
              <h3>Nenhum curso ainda</h3>
              <p>Clique em "Novo Curso" para enviar seu primeiro curso!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Colaborador;
