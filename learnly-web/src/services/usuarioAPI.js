import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const usuarioAPI = {
  registrar: (usuario) => api.post('/usuarios/registrar', usuario),
  login: (credentials) => api.post('/usuarios/login', credentials)
};

export default api;