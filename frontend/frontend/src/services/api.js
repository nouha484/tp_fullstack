import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// FORMATIONS
export const getFormations = () => api.get('/formations');
export const createFormation = (data) => api.post('/formations', data);
export const updateFormation = (id, data) => api.put(`/formations/${id}`, data);
export const deleteFormation = (id) => api.delete(`/formations/${id}`);

// INSCRIPTIONS
export const inscrire = (formationId) => api.post('/inscriptions', { formationId });
export const getMesInscriptions = () => api.get('/inscriptions/mes-inscriptions');
export const getInscrits = (formationId) => api.get(`/inscriptions/formation/${formationId}`);

export default api;
