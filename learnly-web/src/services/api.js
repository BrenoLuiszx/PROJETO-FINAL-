import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor - adiciona token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cursosAPI = {
  listarTodos: () => api.get('/cursos'),
  buscarPorId: (id) => api.get(`/cursos/${id}`),
  buscarPorCategoria: (categoria) => api.get(`/cursos/categoria/${categoria}`),
  buscarPorTitulo: (titulo) => api.get(`/cursos/buscar?titulo=${titulo}`),
  criar: (curso) => api.post('/cursos', curso),
  atualizar: (id, curso) => api.put(`/cursos/${id}`, curso),
  deletar: (id) => api.delete(`/cursos/${id}`),
  meusCursos: () => api.get('/cursos/meus'),
  listarPendentes: () => api.get('/cursos/pendentes'),
  aprovar: (id) => api.put(`/cursos/${id}/aprovar`),
  rejeitar: (id) => api.put(`/cursos/${id}/rejeitar`),
};

export const usuariosAPI = {
  listarTodos: () => api.get('/usuarios'),
  registrar: (usuario) => api.post('/usuarios/registrar', usuario),
  login: (credenciais) => api.post('/usuarios/login', credenciais),
  solicitarColaborador: (id, justificativa) => api.post(`/usuarios/${id}/solicitar-colaborador`, { justificativa }),
  listarSolicitacoesPendentes: () => api.get('/usuarios/solicitacoes/pendentes'),
  aprovarColaborador: (id) => api.put(`/usuarios/solicitacoes/${id}/aprovar`),
  recusarColaborador: (id) => api.put(`/usuarios/solicitacoes/${id}/recusar`),
};

export const progressoAPI = {
  marcarConcluido: (cursoId) => api.post(`/progresso/cursos/${cursoId}/concluir`),
  desmarcarConcluido: (cursoId) => api.post(`/progresso/cursos/${cursoId}/desconcluir`),
  meuProgresso: () => api.get('/progresso/meus'),
  meusConcluidos: () => api.get('/progresso/meus/concluidos'),
  statusCurso: (cursoId) => api.get(`/progresso/cursos/${cursoId}/status`),
};

export const avaliacoesAPI = {
  avaliar: (cursoId, dados) => api.post(`/avaliacoes/cursos/${cursoId}`, dados),
  listarPorCurso: (cursoId) => api.get(`/avaliacoes/cursos/${cursoId}`),
  minhaAvaliacao: (cursoId) => api.get(`/avaliacoes/cursos/${cursoId}/minha`),
};

export const aulasAPI = {
  listarPorCurso: (cursoId) => api.get(`/aulas/curso/${cursoId}`),
  salvarAulas: (cursoId, aulas) => api.post(`/aulas/curso/${cursoId}`, aulas),
  concluir: (aulaId) => api.post(`/aulas/${aulaId}/concluir`),
  desconcluir: (aulaId) => api.post(`/aulas/${aulaId}/desconcluir`),
  progresso: (cursoId) => api.get(`/aulas/curso/${cursoId}/progresso`),
  percentual: (cursoId) => api.get(`/aulas/curso/${cursoId}/percentual`),
};

export const certificadosAPI = {
  emitir: (cursoId, dados) => api.post(`/certificados/cursos/${cursoId}`, dados || {}),
  meusCertificados: () => api.get('/certificados/meus'),
  certificadosPublicos: (usuarioId) => api.get(`/certificados/usuario/${usuarioId}/publicos`),
  alternarVisibilidade: (id) => api.put(`/certificados/${id}/visibilidade`),
};

export const usuarioDashboardAPI = {
  dashboard: () => api.get('/usuarios/dashboard'),
  atualizarPerfil: (id, dados) => api.put(`/usuarios/${id}/perfil`, dados),
  atualizarFoto: (id, foto) => api.put(`/usuarios/${id}/foto`, { foto }),
};

export default api;
