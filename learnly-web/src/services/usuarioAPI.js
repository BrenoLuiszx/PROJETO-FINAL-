import api from './api';

export const usuarioAPI = {
  registrar: (usuario) => api.post('/usuarios/registrar', usuario),
  login: (credentials) => api.post('/usuarios/login', credentials)
};

export default usuarioAPI;
