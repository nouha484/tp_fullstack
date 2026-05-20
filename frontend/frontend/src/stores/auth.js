import { defineStore } from 'pinia';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isEtudiant: (state) => state.user?.role === 'etudiant',
  },

  actions: {
    async login(email, password) {
      const res = await apiLogin({ email, password });
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    async register(data) {
      await apiRegister(data);
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
