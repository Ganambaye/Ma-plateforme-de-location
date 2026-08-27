# SAMA Logement — Cahier des Charges Complet pour Développement IA

## 1. CONTEXTE ET OBJECTIFS DU PROJET

- **Nom de la plateforme** : SAMA Logement
- **Objectif** : Plateforme web responsive & PWA de recherche de logements et de colocations pour les étudiants à Dakar (Sénégal), garantissant la sécurité et l'absence d'arnaques.
- **Cible** : Étudiants dakarois (Locataires) et Bailleurs (Propriétaires).
- **Administrateurs** : Gana et Rody uniquement (Accès exclusif au panneau d'administration).

---

## 2. STACK TECHNIQUE OBLIGATOIRE

| Composant | Technologie |
|---|---|
| Base de données | MongoDB Atlas (Cloud) avec ORM Mongoose |
| Backend | Node.js + Express.js (Architecture API REST, découplée) |
| Frontend | React.js (SPA) + Tailwind CSS (Mobile-First, UI moderne et fluide) |
| Authentification & Sécurité | JWT (JSON Web Token) + Bcrypt.js (hachage mots de passe) |
| Gestion des Fichiers (Photos) | Cloudinary ou Multer (stockage des photos d'annonces vérifiées) |
| PWA | manifest.json + serviceWorker.js (Installable sur smartphone, accès hors-ligne aux annonces, UI native) |

---

## 3. RÔLES ET PERMISSIONS (3 PROFILS)

### A. Étudiant (Locataire)
- Créer un compte / Se connecter (JWT).
- Parcourir les annonces avec recherche et filtres dynamiques (Quartier, Prix max, Colocation/Studio/Chambre).
- Voir le détail d'un logement (Photos, prix certifié, géolocalisation, commodités).
- Réserver une visite guidée avec l'équipe.
- Accéder au Module Colocation (poster ou chercher un profil de colocataire).

### B. Bailleur (Propriétaire)
- Créer un compte / Se connecter.
- Proposer un logement via un formulaire (Titre, description, prix, zone, photos).
- Suivre le statut de son annonce (En attente de vérification, Validée, Louée).

### C. Administrateurs (Gana & Rody)
- **Accès restreint** : Seuls les comptes associés aux emails de Gana et Rody ont le rôle `ROLE_ADMIN`.
- **Validation des Annonces (Modération)** : Chaque annonce soumise par un bailleur est `En attente`. Gana ou Rody doivent effectuer la vérification physique sur le terrain puis cliquer sur "Approuver" pour qu'elle devienne visible par les étudiants.
- **Gestion Globale** : Bloquer/Supprimer des comptes frauduleux, voir les statistiques (Nombre d'étudiants inscrits, annonces actives, demandes de visites).

---

## 4. SCHÉMAS DE BASE DE DONNÉES (MONGODB ATLAS)

### 1. Schema Utilisateur (User)
```
- nom           : String (obligatoire)
- prenom        : String (obligatoire)
- email         : String (unique, obligatoire)
- telephone     : String (obligatoire)
- password      : String (haché avec Bcrypt, obligatoire)
- role          : Enum ['etudiant', 'bailleur', 'admin']
- avatar        : String (URL)
- etablissement : String (pour les étudiants)
- createdAt     : Date
```

### 2. Schema Annonce (Annonce)
```
- titre         : String (obligatoire)
- description   : String (obligatoire)
- type          : Enum ['chambre', 'studio', 'appartement']
- prix          : Number (obligatoire)
- quartier      : String (obligatoire, ex: Liberté 6, Fann, Mermoz)
- images        : [String] (tableau d'URLs Cloudinary)
- bailleur      : ObjectId ref 'User'
- isVerified    : Boolean (default: false → Validé uniquement par Gana/Rody)
- isAvailable   : Boolean (default: true)
- createdAt     : Date
```

### 3. Schema Colocation
```
- etudiant      : ObjectId ref 'User'
- budgetMax     : Number
- quartierRecherche : String
- description   : String
- statut        : String (enum: ['cherche', 'propose'])
```

### 4. Schema Visite
```
- annonce       : ObjectId ref 'Annonce'
- etudiant      : ObjectId ref 'User'
- dateVisite    : Date (obligatoire)
- statut        : Enum ['en_attente', 'confirmee', 'effectuee']
```

---

## 5. ARCHITECTURE ET ROUTES DE L'API REST (NODE.JS / EXPRESS)

### Auth & Profils (`/api/auth`)

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription (crée un utilisateur avec rôle `etudiant` ou `bailleur`). |
| POST | `/api/auth/login` | Connexion & Génération du Token JWT. |
| GET | `/api/auth/me` | Récupérer le profil connecté (Protégé par JWT). |

### Annonces (`/api/annonces`)

| Méthode | Route | Description | Rôle requis |
|---|---|---|---|
| GET | `/api/annonces` | Récupérer toutes les annonces validées (`isVerified: true`) avec filtres (quartier, prix max, type). | Public |
| GET | `/api/annonces/:id` | Détails d'une annonce (avec infos bailleur, photos, commodités). | Public |
| POST | `/api/annonces` | Dépôt d'annonce par un bailleur (`isVerified: false` automatiquement). | `bailleur` |

### Admin — réservé à Gana & Rody (`/api/admin`)

> **Middleware** : `isAdmin` — vérifie que le JWT de l'utilisateur correspond à un compte dont l'email est celui de Gana ou Rody, et que le rôle est `admin`.

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/admin/pending-annonces` | Liste des annonces en attente de vérification sur le terrain. |
| PUT | `/api/admin/verify-annonce/:id` | Valider l'annonce après contrôle par Gana/Rody (met `isVerified: true`). |
| DELETE | `/api/admin/annonces/:id` | Supprimer une annonce suspecte. |
| GET | `/api/admin/stats` | Tableau de bord des statistiques (Nombre d'étudiants inscrits, annonces actives, demandes de visites). |

---

## 6. CONFIGURATION PWA & FRONTEND (REACT.JS)

### Design
- **Tailwind CSS** pour le styling (Mobile-First).
- **Composants réutilisables** : Cards, Modals, Navbar, Sidebar Admin.
- **Mobile-First** : Interface pensée prioritairement pour écran smartphone.

### Service Worker & Manifest
- **`manifest.json`** préconfiguré :
  - Nom : `SAMA Logement`
  - Icons (icônes 192x192 et 512x512)
  - Theme Color
  - `display: "standalone"`
- **Cache** :
  - Cache des pages clés pour consultation hors-ligne.
  - Cache des photos annoncées pour accès hors-ligne.

---

## 7. Règles de Développement

1. **Langue** : Tout le code, les commentaires et le contenu affiché à l'utilisateur doivent être en **français**.
2. **Sécurité** : Les mots de passe doivent toujours être hachés avec Bcrypt.js. JWT avec expiration courte (1h) + refresh token.
3. **Validation** : Toutes les entrées côté serveur doivent être validées (express-validator ou mongoose validation).
4. **Erreurs** : Responses d'erreur structurées en JSON avec un champ `message` en français.
5. **PWA** : L'application doit être installable sur smartphone et fonctionner en mode hors-ligne pour la consultation des annonces.
6. **Modération** : Aucune annonce n'est visible par les étudiants tant qu'elle n'a pas été validée manuellement par Gana ou Rody.
7. **Admin exclusif** : Le rôle admin est réservé strictement aux deux administrateurs (Gana et Rody). Aucun autre utilisateur ne peut obtenir ce rôle via l'interface.