import axios from 'axios';

// ============================================
// MOCK DATA — remplace par vrai API plus tard
// ============================================

const mockFormations = [
  { id: 1, titre: 'Développement Web', duree: 120 },
  { id: 2, titre: 'Base de données', duree: 60 },
  { id: 3, titre: 'React JS', duree: 80 },
  { id: 4, titre: 'Node.js Avancé', duree: 90 },
];

const mockUsers = [
  { id: 1, nom: 'Admin', prenom: 'Super', email: 'admin@app.ma', password: 'admin123', role: 'admin' },
  { id: 2, nom: 'Alami', prenom: 'Youssef', email: 'youssef@test.ma', password: '123456', role: 'etudiant' },
];

let mockInscriptions = [
  { etudiant_id: 2, formation_id: 1, date_inscription: '2024-01-15', titre: 'Développement Web', duree: 120 },
];

let nextFormationId = 5;

// Simule un délai réseau
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// ============================================
// AUTH
// ============================================
export const login = async ({ email, password }) => {
  await delay();
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) throw { response: { data: { message: 'Email ou mot de passe incorrect.' } } };
  const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
  return { data: { token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role } } };
};

export const register = async ({ nom, prenom, email, password }) => {
  await delay();
  const exists = mockUsers.find(u => u.email === email);
  if (exists) throw { response: { data: { message: 'Email déjà utilisé.' } } };
  const newUser = { id: mockUsers.length + 1, nom, prenom, email, password, role: 'etudiant' };
  mockUsers.push(newUser);
  return { data: { message: 'Compte créé avec succès.' } };
};

// ============================================
// FORMATIONS
// ============================================
export const getFormations = async () => {
  await delay();
  return { data: [...mockFormations] };
};

export const createFormation = async ({ titre, duree }) => {
  await delay();
  const newF = { id: nextFormationId++, titre, duree: Number(duree) };
  mockFormations.push(newF);
  return { data: { message: 'Formation créée.', id: newF.id } };
};

export const updateFormation = async (id, { titre, duree }) => {
  await delay();
  const f = mockFormations.find(f => f.id === Number(id));
  if (!f) throw { response: { data: { message: 'Formation introuvable.' } } };
  f.titre = titre;
  f.duree = Number(duree);
  return { data: { message: 'Formation mise à jour.' } };
};

export const deleteFormation = async (id) => {
  await delay();
  const index = mockFormations.findIndex(f => f.id === Number(id));
  if (index === -1) throw { response: { data: { message: 'Formation introuvable.' } } };
  mockFormations.splice(index, 1);
  return { data: { message: 'Formation supprimée.' } };
};

export const inscrire = async (formationId) => {
  await delay();
  const user = JSON.parse(localStorage.getItem('user'));
  const already = mockInscriptions.find(
    i => i.etudiant_id === user.id && i.formation_id === Number(formationId)
  );
  if (already) throw { response: { data: { message: 'Déjà inscrit.' } } };
  const formation = mockFormations.find(f => f.id === Number(formationId));
  mockInscriptions.push({
    etudiant_id: user.id,
    formation_id: Number(formationId),
    date_inscription: new Date().toISOString().split('T')[0],
    titre: formation.titre,
    duree: formation.duree,
  });
  return { data: { message: 'Inscription réussie.' } };
};

export const getMesInscriptions = async () => {
  await delay();
  const user = JSON.parse(localStorage.getItem('user'));
  const result = mockInscriptions
    .filter(i => i.etudiant_id === user?.id)
    .map(i => ({
      id: i.formation_id,
      titre: i.titre,
      duree: i.duree,
      date_inscription: i.date_inscription,
    }));
  return { data: result };
};

export const getInscrits = async (formationId) => {
  await delay();
  const result = mockInscriptions
    .filter(i => i.formation_id === Number(formationId))
    .map(i => {
      const u = mockUsers.find(u => u.id === i.etudiant_id);
      return { id: u?.id, nom: u?.nom, prenom: u?.prenom, email: u?.email, date_inscription: i.date_inscription };
    });
  return { data: result };
};

export default { login, register, getFormations, createFormation, updateFormation, deleteFormation, inscrire, getMesInscriptions, getInscrits };