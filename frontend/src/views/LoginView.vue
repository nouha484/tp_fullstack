<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="votre@email.com" required />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <p class="link">Pas de compte ? <router-link to="/register">S'inscrire</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    // Rediriger selon le rôle
    if (auth.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/etudiant');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur de connexion.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f9;
}
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
}
h2 { margin-bottom: 1.5rem; color: #1a1a2e; text-align: center; }
.field { margin-bottom: 1rem; }
label { display: block; font-size: 14px; color: #555; margin-bottom: 6px; }
input {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 14px; box-sizing: border-box;
}
input:focus { outline: none; border-color: #4f46e5; }
button {
  width: 100%; padding: 12px; background: #4f46e5; color: white;
  border: none; border-radius: 8px; font-size: 15px; cursor: pointer;
  margin-top: 0.5rem;
}
button:hover { background: #4338ca; }
button:disabled { background: #a5b4fc; cursor: not-allowed; }
.error { color: #e53e3e; font-size: 13px; margin: 0.5rem 0; }
.link { text-align: center; margin-top: 1rem; font-size: 14px; }
.link a { color: #4f46e5; text-decoration: none; }
</style>