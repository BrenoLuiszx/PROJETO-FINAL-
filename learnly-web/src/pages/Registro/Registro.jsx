import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioAPI } from '../../services/usuarioAPI';
import '../../styles/login.css';

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    foto: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.senha !== form.confirmarSenha) {
      setMensagem('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setMensagem('');

    try {
      const { confirmarSenha, ...dadosUsuario } = form;
      console.log(' Enviando dados:', dadosUsuario);
      console.log(' URL da API:', 'http://localhost:8080/api/usuarios/registrar');
      
      const response = await usuarioAPI.registrar(dadosUsuario);
      console.log(' Resposta recebida:', response);
      
      setMensagem('Usuário cadastrado com sucesso! Redirecionando para login...');
      setForm({ nome: '', email: '', senha: '', confirmarSenha: '', foto: '' });
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(' Erro na requisição:', error);
      console.error(' Detalhes do erro:', error.response);
      const errorMsg = error.response?.data?.error || 'Erro ao cadastrar usuário';
      setMensagem(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="logo-section">
              <span className="logo-icon">📚</span>
              <h1>Learnly</h1>
            </div>
            <p className="brand-subtitle">Junte-se à nossa comunidade de aprendizado</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-form">
            <h2>Criar sua conta</h2>
            <p className="login-subtitle">Preencha os dados para se cadastrar</p>
            
            {mensagem && (
              <div className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-error'}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Seu melhor email"
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  required
                  placeholder="Crie uma senha (mín. 6 caracteres)"
                  className="login-input"
                  minLength="6"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  required
                  placeholder="Confirme sua senha"
                  className="login-input"
                />
              </div>

              <div className="input-group">
                <input
                  type="url"
                  name="foto"
                  value={form.foto}
                  onChange={handleChange}
                  placeholder="URL da sua foto (opcional)"
                  className="login-input"
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>

            <div className="login-footer">
              <p>Já tem uma conta? <a href="/login" className="register-link">Faça login aqui</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;