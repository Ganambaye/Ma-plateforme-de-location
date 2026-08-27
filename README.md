# SAMA Logement

Plateforme web responsive & PWA de recherche de logements et de colocations pour les étudiants à Dakar (Sénégal), garantissant la sécurité et l'absence d'arnaques.

## Stack Technique

- **Backend**: Node.js + Express.js + MongoDB Atlas + Mongoose
- **Frontend**: React.js + Vite + Tailwind CSS + PWA
- **Authentification**: JWT + Bcrypt.js
- **Rôles**: Étudiant, Bailleur, Admin (Gana & Rody uniquement)

## Installation

### Prérequis
- Node.js >= 14
- MongoDB Atlas account

### Backend
```bash
npm install
npm start
```
Le serveur démarre sur le port 5000.

### Frontend
```bash
cd client
npm install
npm run dev
```
Le client démarre sur le port 3001.

## Configuration

Copiez `.env.example` en `.env` et configurez:
- `MONGO_URI`: Votre chaîne de connexion MongoDB Atlas
- `JWT_SECRET`: Votre clé secrète JWT
- `PORT`: Port du serveur (défaut: 5000)

## Endpoints API

| Route | Méthode | Description | Rôle |
|---|---|---|---|
| /api/auth/register | POST | Inscription | Public |
| /api/auth/login | POST | Connexion | Public |
| /api/auth/me | GET | Profil connecté | Authentifié |
| /api/annonces | GET | Liste des annonces validées | Public |
| /api/annonces/:id | GET | Détail d'une annonce | Public |
| /api/annonces | POST | Déposer une annonce | Bailleur |
| /api/admin/pending-annonces | GET | Annonces en attente | Admin |
| /api/admin/verify-annonce/:id | PUT | Valider une annonce | Admin |
| /api/admin/annonces/:id | DELETE | Supprimer une annonce | Admin |
| /api/admin/stats | GET | Statistiques | Admin |
| /api/colocations | GET/POST | Colocations | Authentifié |
| /api/visites | POST | Demander une visite | Étudiant |
| /api/visites/mes-visites | GET | Mes visites | Étudiant |

## Rôles

- **Étudiant**: Chercher un logement, postuler pour une colocation, réserver des visites
- **Bailleur**: Déposer des annonces, suivre leur statut
- **Admin (Gana & Rody)**: Valider les annonces, gérer les utilisateurs, voir les statistiques

## PWA

L'application est installable sur smartphone et fonctionne en mode hors-ligne pour la consultation des annonces.# Ma-plateforme-de-location
