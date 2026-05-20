<template>
  <div class="dashboard">
    <header class="topbar">
      <div>
        <h1>Espace Étudiant</h1>
        <span class="welcome">Bonjour, {{ auth.user?.prenom }} {{ auth.user?.nom }}</span>
      </div>
      <button class="logout" @click="handleLogout">Déconnexion</button>
    </header>

    <main class="content">
      <!-- Formations disponibles -->
      <section class="card">
        <h2>Formations disponibles</h2>
        <div v-if="formations.length > 0" class="grid">
          <div v-for="f in formations" :key="f.id" class="formation-card">
            <div class="formation-info">
              <h3>{{ f.titre }}</h3>
              <span class="badge">{{ f.duree }}h</span>
            </div>
            <button
              @click="handleInscrire(f.id)"
              :disabled="estInscrit(f.id)"
              :class="estInscrit(f.id) ? 'btn-inscrit' : 'btn-inscrire'"
            >
              {{ estInscrit(f.id) ? 'Déjà inscrit' : "S'inscrire" }}
            </button>
          </div>
        </div>
        <p v-else class="empty">Aucune formation disponible.</p>
        <p v-if="msgInscription" class="success">{{ msgInscription }}</p>
      </section>

      <!-- Mes inscriptions -->
      <section class="card">
        <h2>Mes inscriptions ({{ mesInscriptions.length }})</h2>
        <table v-if="mesInscriptions.length > 0">
          <thead>
            <tr><th>Formation</th><th>Durée</th><th>Date d'inscription</th></tr>
          </thead>
          <tbody>
            <tr v-for="i in mesInscriptions" :key="i.id">
              <td>{{ i.titre }}</td>
              <td>{{ i.duree }}h</td>
              <td>{{ new Date(i.date_inscription).toLocaleDateString('fr-FR') }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">Vous n'êtes inscrit à aucune formation.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getFormations, inscrire, getMesInscriptions } from '../services/api';

const router = useRouter();
const auth = useAuthStore();

const formations = ref([]);
const mesInscriptions = ref([]);
const msgInscription = ref('');

const loadData = async () => {
  const [f, i] = await Promise.all([getFormations(), getMesInscriptions()]);
  formations.value = f.data;
  mesInscriptions.value = i.data;
};

const estInscrit = (formationId) => {
  return mesInscriptions.value.some((i) => i.id === formationId);
};

const handleInscrire = async (id) => {
  try {
    await inscrire(id);
    msgInscription.value = 'Inscription réussie !';
    await loadData();
    setTimeout(() => (msgInscription.value = ''), 3000);
  } catch (err) {
    msgInscription.value = err.response?.data?.message || 'Erreur.';
  }
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

onMounted(loadData);
</script>

<style scoped>
.dashboard { min-height: 100vh; background: #f4f6f9; }
.topbar {
  background: #0f766e; color: white; padding: 1rem 2rem;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.topbar h1 { font-size: 20px; margin: 0 0 4px; }
.welcome { font-size: 13px; opacity: 0.85; }
.logout {
  background: rgba(255,255,255,0.2); color: white;
  border: 1px solid rgba(255,255,255,0.4); padding: 8px 16px;
  border-radius: 8px; cursor: pointer;
}
.content { padding: 2rem; max-width: 900px; margin: auto; }
.card {
  background: white; border-radius: 12px; padding: 1.5rem;
  margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
h2 { margin: 0 0 1rem; color: #1a1a2e; font-size: 17px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.formation-card {
  border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem;
  display: flex; flex-direction: column; gap: 12px;
}
.formation-info { display: flex; justify-content: space-between; align-items: flex-start; }
.formation-info h3 { margin: 0; font-size: 15px; color: #1a1a2e; flex: 1; }
.badge {
  background: #e0f2fe; color: #0369a1;
  padding: 3px 10px; border-radius: 20px; font-size: 12px; white-space: nowrap;
}
.btn-inscrire {
  padding: 8px; background: #0f766e; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 13px;
}
.btn-inscrire:hover { background: #0d5c56; }
.btn-inscrit {
  padding: 8px; background: #f0fdf4; color: #38a169;
  border: 1px solid #86efac; border-radius: 8px; font-size: 13px; cursor: default;
}
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; padding: 10px; background: #f8f9fa; color: #555; font-weight: 500; }
td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
.empty { color: #888; font-size: 14px; }
.success { color: #38a169; font-size: 13px; margin-top: 0.75rem; }
</style>