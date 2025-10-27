import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usuarioAPI } from '../../services/usuarioAPI';
import '../../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const response = await usuarioAPI.login(form);

      
      setMensagem('Login realizado com sucesso!');
      
      // Fazer login no contexto
      login(response.data.usuario);
      
      // Redirecionar para home
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao fazer login';
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
            <p className="brand-subtitle">Sua plataforma de cursos gratuitos</p>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-form">
            <h2>Bem-vindo de volta!</h2>
            <p className="login-subtitle">Faça login para continuar</p>
            
            {mensagem && (
              <div className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-error'}`}>
                {mensagem}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu email"
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
                  placeholder="Digite sua senha"
                  className="login-input"
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="login-footer">
              <p>Não tem uma conta? <a href="/registro" className="register-link">Cadastre-se aqui</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;