import React, { useState } from 'react';
import { cursosAPI } from '../../services/api';
import Header from '../Header/Header';
import '../../styles/cadastro-bigtech.css';

const Cadastro = () => {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    url: '',
    categoria: '',
    instrutor: '',
    duracao: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    const dadosCurso = {
      ...form,
      duracao: parseInt(form.duracao) || 0
    };

    try {
      await cursosAPI.criar(dadosCurso);
      setMensagem('Curso cadastrado com sucesso!');
      setForm({ titulo: '', descricao: '', url: '', categoria: '', instrutor: '', duracao: '' });
      setStep(1);
      setTimeout(() => setMensagem(''), 5000);
    } catch (error) {
      setMensagem('Erro ao cadastrar curso. Verifique se o backend está rodando.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <Header />
      <div className="cadastro-container">
        <div className="cadastro-header">
          <h1>Cadastrar Novo Curso</h1>
          <p>Compartilhe conhecimento com a comunidade Learnly</p>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <label>Informações Básicas</label>
          </div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <label>Detalhes do Curso</label>
          </div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>Revisão e Envio</label>
          </div>
        </div>

        {mensagem && (
          <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form">
          {step === 1 && (
            <div className="form-step">
              <h2>Informações Básicas</h2>
              
              <div className="form-group">
                <label>Título do Curso *</label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: React do Zero ao Avançado"
                />
              </div>

              <div className="form-group">
                <label>Categoria *</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div className="form-group">
                <label>URL do Curso *</label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  required
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={nextStep} className="btn-next" disabled={!form.titulo || !form.categoria || !form.url}>
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Detalhes do Curso</h2>
              
              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  required
                  placeholder="Descreva o que o aluno vai aprender neste curso..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instrutor *</label>
                  <input
                    type="text"
                    name="instrutor"
                    value={form.instrutor}
                    onChange={handleChange}
                    required
                    placeholder="Nome do instrutor ou canal"
                  />
                </div>

                <div className="form-group">
                  <label>Duração (minutos)</label>
                  <input
                    type="number"
                    name="duracao"
                    value={form.duracao}
                    onChange={handleChange}
                    placeholder="480"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={prevStep} className="btn-prev">
                  ← Anterior
                </button>
                <button type="button" onClick={nextStep} className="btn-next" disabled={!form.descricao || !form.instrutor}>
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Revisão e Envio</h2>
              
              <div className="course-preview">
                <div className="preview-header">
                  <div className="preview-category">
                    {form.categoria}
                  </div>
                  {form.duracao && (
                    <div className="preview-duration">
                      {Math.floor(form.duracao / 60)}h {form.duracao % 60}min
                    </div>
                  )}
                </div>
                
                <h3 className="preview-title">{form.titulo}</h3>
                <p className="preview-description">{form.descricao}</p>
                
                {form.instrutor && (
                  <div className="preview-instructor">
                    Instrutor: {form.instrutor}
                  </div>
                )}
                
                <div className="preview-url">
                  <a href={form.url} target="_blank" rel="noopener noreferrer">
                    {form.url}
                  </a>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={prevStep} className="btn-prev">
                  ← Anterior
                </button>
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? 'Cadastrando...' : 'Cadastrar Curso'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Cadastro;