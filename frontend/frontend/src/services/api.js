import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Formations
export const getFormations = () => api.get('/formations');
export const createFormation = (data) => api.post('/formations', data);
export const updateFormation = (id, data) => api.put(`/formations/${id}`, data);
export const deleteFormation = (id) => api.delete(`/formations/${id}`);
export const inscrire = (id) => api.post(`/formations/${id}/inscrire`);
export const getInscrits = (id) => api.get(`/formations/${id}/inscrits`);
export const getMesInscriptions = () => api.get('/formations/mes-inscriptions');

export default api;
