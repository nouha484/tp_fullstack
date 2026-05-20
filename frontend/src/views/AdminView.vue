<template>
  <div class="dashboard">
    <header class="topbar">
      <h1>Dashboard Admin</h1>
      <button class="logout" @click="handleLogout">Déconnexion</button>
    </header>

    <main class="content">
      <!-- Formulaire ajout/édition formation -->
      <section class="card">
        <h2>{{ editing ? 'Modifier la formation' : 'Nouvelle formation' }}</h2>
        <form @submit.prevent="handleSubmit" class="form-row">
          <input v-model="form.titre" type="text" placeholder="Titre de la formation" required />
          <input v-model="form.duree" type="number" placeholder="Durée (heures)" required />
          <button type="submit">{{ editing ? 'Mettre à jour' : 'Ajouter' }}</button>
          <button v-if="editing" type="button" class="btn-cancel" @click="cancelEdit">Annuler</button>
        </form>
        <p v-if="message" :class="messageType">{{ message }}</p>
      </section>

      <!-- Liste des formations -->
      <section class="card">
        <h2>Formations ({{ formations.length }})</h2>
        <table v-if="formations.length > 0">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Durée (h)</th>
              <th>Inscrits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in formations" :key="f.id">
              <td>{{ f.titre }}</td>
              <td>{{ f.duree }}h</td>
              <td>
                <button class="btn-sm" @click="voirInscrits(f)">Voir inscrits</button>
              </td>
              <td class="actions">
                <button class="btn-edit" @click="startEdit(f)">Modifier</button>
                <button class="btn-delete" @click="handleDelete(f.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">Aucune formation pour l'instant.</p>
      </section>

      <!-- Liste des inscrits -->
      <section class="card" v-if="inscrits.length > 0">
        <h2>Inscrits — {{ formationSelectionnee }}</h2>
        <table>
          <thead>
            <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr v-for="e in inscrits" :key="e.id">
              <td>{{ e.nom }}</td>
              <td>{{ e.prenom }}</td>
              <td>{{ e.email }}</td>
              <td>{{ new Date(e.date_inscription).toLocaleDateString('fr-FR') }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  getFormations, createFormation, updateFormation,
  deleteFormation, getInscrits
} from '../services/api';

const router = useRouter();
const auth = useAuthStore();

const formations = ref([]);
const inscrits = ref([]);
const formationSelectionnee = ref('');
const message = ref('');
const messageType = ref('success');
const editing = ref(false);
const editId = ref(null);

const form = reactive({ titre: '', duree: '' });

const loadFormations = async () => {
  const res = await getFormations();
  formations.value = res.data;
};

const handleSubmit = async () => {
  try {
    if (editing.value) {
      await updateFormation(editId.value, form);
      message.value = 'Formation mise à jour.';
    } else {
      await createFormation(form);
      message.value = 'Formation créée avec succès.';
    }
    messageType.value = 'success';
    form.titre = '';
    form.duree = '';
    editing.value = false;
    await loadFormations();
  } catch (err) {
    message.value = err.response?.data?.message || 'Erreur.';
    messageType.value = 'error';
  }
  setTimeout(() => (message.value = ''), 3000);
};

const handleDelete = async (id) => {
  if (!confirm('Supprimer cette formation ?')) return;
  try {
    await deleteFormation(id);
    await loadFormations();
  } catch (err) {
    alert('Erreur lors de la suppression.');
  }
};

const startEdit = (f) => {
  editing.value = true;
  editId.value = f.id;
  form.titre = f.titre;
  form.duree = f.duree;
};

const cancelEdit = () => {
  editing.value = false;
  form.titre = '';
  form.duree = '';
};

const voirInscrits = async (f) => {
  formationSelectionnee.value = f.titre;
  const res = await getInscrits(f.id);
  inscrits.value = res.data;
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

onMounted(loadFormations);
</script>

<style scoped>
.dashboard { min-height: 100vh; background: #f4f6f9; }
.topbar {
  background: #4f46e5; color: white; padding: 1rem 2rem;
  display: flex; justify-content: space-between; align-items: center;
}
.topbar h1 { font-size: 20px; margin: 0; }
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
.form-row { display: flex; gap: 12px; flex-wrap: wrap; }
.form-row input {
  flex: 1; min-width: 180px; padding: 10px 14px;
  border: 1px solid #ddd; border-radius: 8px; font-size: 14px;
}
.form-row button {
  padding: 10px 20px; background: #4f46e5; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
}
.form-row button:hover { background: #4338ca; }
.btn-cancel {
  background: #e2e8f0 !important; color: #444 !important;
}
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; padding: 10px; background: #f8f9fa; color: #555; font-weight: 500; }
td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
.actions { display: flex; gap: 8px; }
.btn-edit {
  padding: 5px 12px; background: #ebf4ff; color: #3182ce;
  border: none; border-radius: 6px; cursor: pointer; font-size: 13px;
}
.btn-delete {
  padding: 5px 12px; background: #fff5f5; color: #e53e3e;
  border: none; border-radius: 6px; cursor: pointer; font-size: 13px;
}
.btn-sm {
  padding: 5px 12px; background: #f0fdf4; color: #38a169;
  border: none; border-radius: 6px; cursor: pointer; font-size: 13px;
}
.empty { color: #888; font-size: 14px; }
.success { color: #38a169; font-size: 13px; margin-top: 0.5rem; }
.error { color: #e53e3e; font-size: 13px; margin-top: 0.5rem; }
</style>