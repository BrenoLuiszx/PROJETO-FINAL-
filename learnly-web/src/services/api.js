import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const cursosAPI = {
  listarTodos: () => api.get('/cursos'),
  buscarPorId: (id) => api.get(`/cursos/${id}`),
  buscarPorCategoria: (categoria) => api.get(`/cursos/categoria/${categoria}`),
  buscarPorTitulo: (titulo) => api.get(`/cursos/buscar?titulo=${titulo}`),
  criar: (curso) => api.post('/cursos', curso),
  atualizar: (id, curso) => api.put(`/cursos/${id}`, curso),
  deletar: (id) => api.delete(`/cursos/${id}`)
};

export const usuariosAPI = {
  listarTodos: () => api.get('/usuarios'),
  registrar: (usuario) => api.post('/usuarios/registrar', usuario),
  login: (credenciais) => api.post('/usuarios/login', credenciais)
};

export default api;