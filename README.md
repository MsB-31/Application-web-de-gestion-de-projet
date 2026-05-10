# Digital Solutions - Gestion de Projets

Une plateforme collaborative de gestion de projets tout-en-un, développée avec Laravel (backend) et React/TypeScript (frontend).

## 🚀 Fonctionnalités

- **Gestion des projets** : Création, modification et suivi des projets
- **Gestion des tâches** : Assignation, statut, commentaires et historique
- **Gestion des membres** : Ajout/suppression de membres aux projets
- **Authentification sécurisée** : Inscription, connexion avec Sanctum
- **Interface moderne** : UI/UX avec ShadCN et Tailwind CSS
- **API RESTful** : Endpoints complets pour toutes les fonctionnalités

## 🛠️ Technologies utilisées

### Backend (Laravel)
- **Framework** : Laravel 11
- **Base de données** : SQLite (configurable pour MySQL/PostgreSQL)
- **Authentification** : Laravel Sanctum
- **API** : RESTful avec validation
- **Tests** : PHPUnit

### Frontend (React)
- **Framework** : React 18 avec TypeScript
- **Build tool** : Vite
- **UI Library** : ShadCN/UI + Radix UI
- **Styling** : Tailwind CSS
- **State management** : React hooks + Context
- **HTTP client** : Axios
- **Routing** : React Router

## 📋 Prérequis

- PHP 8.2+
- Composer
- Node.js 18+
- npm ou bun

## 🚀 Installation et Configuration

### 1. Cloner le dépôt
```bash
git clone <votre-repo-url>
cd digital-solutions
```

### 2. Configuration du Backend
```bash
cd laravel-temp
composer install
cp .env.example .env
php artisan key:generate
```

Configurer la base de données dans `.env` :
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

```bash
php artisan migrate
php artisan serve --port=5000
```

### 3. Configuration du Frontend
```bash
cd ../task-gleam-desk-redesign
npm install
npm run dev
```

### 4. Accès à l'application
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:5000/api

## 🔐 Compte de démonstration

- **Email** : demo@digitalsolutions.fr
- **Mot de passe** : demo1234

## 📁 Structure du projet

```
digital-solutions/
├── laravel-temp/          # Backend Laravel
│   ├── app/              # Code de l'application
│   ├── database/         # Migrations et seeders
│   ├── routes/           # Routes API
│   └── config/           # Configuration
├── server/               # Instance serveur supplémentaire
└── task-gleam-desk-redesign/  # Frontend React
    ├── src/
    │   ├── components/   # Composants réutilisables
    │   ├── pages/        # Pages de l'application
    │   ├── services/     # Services API
    │   └── types/        # Types TypeScript
    └── public/           # Assets statiques
```

## 🧪 Tests

### Backend
```bash
cd laravel-temp
php artisan test
```

### Frontend
```bash
cd task-gleam-desk-redesign
npm run test
```

## 📚 API Documentation

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Projets
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/{id}` - Détails du projet
- `PUT /api/projects/{id}` - Modifier un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Tâches
- `GET /api/projects/{project}/taches` - Tâches d'un projet
- `POST /api/taches` - Créer une tâche
- `PATCH /api/taches/{id}/statut` - Changer le statut
- `PATCH /api/taches/{id}/assignation` - Assigner une tâche

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développeur** : [Votre nom]
- **Technologies** : Laravel, React, TypeScript

---

Développé avec ❤️ pour la gestion collaborative de projets.</content>
<parameter name="filePath">/home/sylvestre/Documents/Digitale-solution/README.md