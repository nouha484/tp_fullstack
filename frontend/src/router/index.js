import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminView from '../views/AdminView.vue';
import EtudiantView from '../views/EtudiantView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/etudiant',
    component: EtudiantView,
    meta: { requiresAuth: true, role: 'etudiant' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navigation
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login');
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    // Rediriger vers la bonne page selon le rôle
    return next(auth.isAdmin ? '/admin' : '/etudiant');
  }

  next();
});

export default router;