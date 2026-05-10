# Cahier des Charges
## Plateforme de Gestion de Projets Collaboratifs
### Digital Solutions

---

**Version :** 1.0  
**Date :** Février 2026  
**Statut :** Validé  
**Auteur :** Équipe Digital Solutions

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs](#2-objectifs)
3. [Périmètre fonctionnel](#3-périmètre-fonctionnel)
4. [Spécifications fonctionnelles détaillées](#4-spécifications-fonctionnelles-détaillées)
5. [Spécifications techniques](#5-spécifications-techniques)
6. [Interfaces utilisateur](#6-interfaces-utilisateur)
7. [Contraintes et exigences](#7-contraintes-et-exigences)
8. [Critères d'acceptation](#8-critères-dacceptation)

---

## 1. Présentation du projet

### 1.1 Contexte

Digital Solutions est une entreprise de développement logiciel dont les équipes gèrent simultanément plusieurs projets clients. Le suivi des projets, tâches et membres était jusqu'ici réalisé via des tableurs et e-mails, générant perte d'information et manque de visibilité.

### 1.2 Description du projet

Développement d'une **plateforme web de gestion de projets collaboratifs** permettant aux équipes de :
- Créer et suivre des projets avec leurs membres
- Organiser les tâches par statut (Kanban)
- Gérer les membres de l'équipe et leurs rôles
- Collaborer via commentaires et historique d'actions
- Exporter des rapports de projets

### 1.3 Parties prenantes

| Rôle            | Responsabilités                                      |
|-----------------|------------------------------------------------------|
| Chef de projet  | Création de projets, gestion des membres, validation |
| Membre          | Consultation, mise à jour des tâches qui lui sont assignées |
| Administrateur  | Gestion complète : utilisateurs, projets, tâches     |

---

## 2. Objectifs

### 2.1 Objectifs fonctionnels
- ✅ Centraliser la gestion des projets et tâches
- ✅ Offrir une vue Kanban claire par projet
- ✅ Permettre l'assignation de tâches aux membres
- ✅ Tracer l'historique des modifications
- ✅ Exporter les données en PDF

### 2.2 Objectifs non-fonctionnels
- Temps de réponse < 2 secondes pour toutes les pages
- Interface responsive (desktop, tablette, mobile)
- Disponibilité 99 % en heures ouvrées
- Sécurisation par JWT (token d'authentification)

---

## 3. Périmètre fonctionnel

### 3.1 Inclus dans le périmètre

| Module               | Fonctionnalités                                                     |
|----------------------|---------------------------------------------------------------------|
| **Authentification** | Inscription, connexion, déconnexion, profil, changement de mdp     |
| **Tableau de bord**  | KPIs globaux, graphiques de progression, liste des projets actifs  |
| **Projets**          | CRUD projets, gestion statut, ajout/retrait membres, export PDF    |
| **Tâches**           | CRUD tâches, Kanban drag & drop, filtres, assignation, priorités   |
| **Membres**          | CRUD membres, filtre par rôle, recherche, vue projets du membre    |
| **Profil**           | Modification informations personnelles, changement de mot de passe |

### 3.2 Hors périmètre (évolutions futures)
- Notifications en temps réel (WebSocket)
- Application mobile native
- Intégration calendrier externe (Google, Outlook)
- Facturation / gestion des coûts de projets

---

## 4. Spécifications fonctionnelles détaillées

### 4.1 Module Authentification

#### 4.1.1 Inscription
- **Champs requis :** Nom, Prénom, Email, Mot de passe (min. 8 caractères)
- **Validation :** Email unique, format valide
- **Résultat :** Compte créé, connexion automatique, redirection tableau de bord

#### 4.1.2 Connexion
- **Champs requis :** Email, Mot de passe
- **Sécurité :** Token JWT stocké en localStorage, expiration configurable
- **Résultat :** Accès à la plateforme, toast de bienvenue

#### 4.1.3 Déconnexion
- Révocation du token côté serveur
- Redirection vers la page de connexion

#### 4.1.4 Profil utilisateur
- Modification : Nom, Prénom, Email, Rôle
- Changement de mot de passe (confirmation ancien mdp requis)

---

### 4.2 Module Tableau de bord

#### Métriques affichées
| Indicateur              | Description                                      |
|-------------------------|--------------------------------------------------|
| Projets actifs          | Nombre de projets avec statut ACTIF              |
| Tâches en cours         | Total des tâches EN_COURS tous projets confondus |
| Tâches terminées        | Total des tâches TERMINE                         |
| Membres de l'équipe     | Nombre total d'utilisateurs                      |

#### Graphiques
- **Répartition des tâches par statut** : Diagramme en barres
- **Progression des projets** : Taux de complétion par projet
- **Activité récente** : Liste des dernières actions

---

### 4.3 Module Projets

#### 4.3.1 Liste des projets
- Affichage en grille (cartes)
- Filtres : recherche textuelle, tri (nom, date)
- Pagination : 9 projets par page
- Indicateur visuel du statut (ACTIF / EN_PAUSE / TERMINÉ)

#### 4.3.2 Création d'un projet
| Champ       | Type     | Requis | Règles                            |
|-------------|----------|--------|-----------------------------------|
| Nom         | Texte    | ✓      | Max 255 caractères                |
| Description | Texte    | ✓      | Libre                             |
| Date début  | Date     | ✓      | Format DD/MM/YYYY                 |
| Date fin    | Date     | ✗      | Postérieure à la date de début    |
| Membres     | Multi    | ✗      | Sélection depuis la liste globale |

#### 4.3.3 Détail d'un projet
- Vue Kanban : 3 colonnes (À faire / En cours / Terminé)
- Drag & drop des tâches entre colonnes
- Panneau de détail d'une tâche (slide-in)
- Export PDF du projet (tâches, membres, progression)

#### 4.3.4 Statuts de projet
| Statut    | Signification                     | Actions disponibles     |
|-----------|-----------------------------------|-------------------------|
| ACTIF     | En cours de réalisation           | Modifier, Supprimer     |
| EN_PAUSE  | Temporairement suspendu           | Réactiver, Supprimer    |
| TERMINE   | Livré et clôturé                  | Archiver, Consulter     |

---

### 4.4 Module Tâches

#### 4.4.1 Création d'une tâche
| Champ         | Type     | Requis | Valeurs possibles              |
|---------------|----------|--------|--------------------------------|
| Titre         | Texte    | ✓      | Max 255 caractères             |
| Description   | Texte    | ✗      | Libre                          |
| Priorité      | Enum     | ✓      | BASSE / MOYENNE / HAUTE        |
| Assigné à     | User     | ✗      | Membre de l'équipe globale     |
| Date d'échéance | Date  | ✗      | Sélecteur de date              |

#### 4.4.2 Statuts de tâche
```
A_FAIRE → EN_COURS → TERMINE
```
- Transition par drag & drop (Kanban)
- Transition par sélecteur dans le panneau de détail
- Chaque changement est tracé dans l'historique

#### 4.4.3 Niveaux de priorité
| Priorité | Couleur | Description                      |
|----------|---------|----------------------------------|
| HAUTE    | Rouge   | Bloquant, à traiter en urgence   |
| MOYENNE  | Orange  | Important, planifié cette semaine|
| BASSE    | Vert    | Peut attendre                    |

#### 4.4.4 Panneau de détail d'une tâche
- Modification de tous les champs
- Commentaires (ajouter, modifier, supprimer)
- Historique chronologique des actions

---

### 4.5 Module Membres

#### 4.5.1 Liste des membres
- Affichage en grille (cartes avec avatar initiales)
- Recherche textuelle (nom, prénom, email, rôle)
- **Filtre par rôle** : pills dynamiques générées depuis les rôles existants
- Actions : Modifier, Supprimer (uniquement pour les chefs de projet)

#### 4.5.2 Création d'un membre
| Champ        | Type   | Requis | Règles              |
|--------------|--------|--------|---------------------|
| Nom          | Texte  | ✓      | Max 100 caractères  |
| Prénom       | Texte  | ✓      | Max 100 caractères  |
| Email        | Email  | ✓      | Unique en base      |
| Rôle         | Texte  | ✓      | Libre               |
| Mot de passe | MDP    | ✓      | Min 8 caractères    |

#### 4.5.3 Vue projets du membre
- Liste des projets auxquels le membre participe
- Nombre de tâches assignées par projet

---

## 5. Spécifications techniques

### 5.1 Architecture globale

```
┌─────────────────────┐         ┌──────────────────────┐
│    Frontend React   │  HTTP   │   Backend Laravel API │
│  (Vite + TypeScript)│ ◄────► │  (PHP 8.2 + MySQL 8)  │
│    Port 5173        │  JWT   │      Port 8000         │
└─────────────────────┘         └──────────────────────┘
```

### 5.2 Stack Frontend
| Technologie       | Version  | Usage                           |
|-------------------|----------|---------------------------------|
| React             | 18.3     | Framework UI                    |
| TypeScript        | 5.x      | Typage statique                 |
| Vite              | 5.x      | Bundler / Dev server            |
| Redux Toolkit     | 2.x      | State management                |
| React Router      | 6.x      | Routing SPA                     |
| Axios             | 1.x      | Appels HTTP                     |
| TailwindCSS       | 3.x      | Styling utilitaire              |
| Shadcn/UI         | latest   | Composants UI                   |
| @hello-pangea/dnd | 18.x     | Drag & drop Kanban              |
| jsPDF             | 4.x      | Export PDF                      |
| Recharts          | 2.x      | Graphiques dashboard            |
| React Hook Form   | 7.x      | Gestion des formulaires         |
| Zod               | 3.x      | Validation des schémas          |

### 5.3 Stack Backend
| Technologie      | Version | Usage                        |
|------------------|---------|------------------------------|
| PHP              | 8.2+    | Langage serveur               |
| Laravel          | 11.x    | Framework backend             |
| Laravel Sanctum  | 4.x     | Authentification par token    |
| MySQL            | 8.x     | Base de données relationnelle |
| Composer         | 2.x     | Gestionnaire de dépendances   |

### 5.4 Schéma de base de données

```
users ──────────┐
                ├── project_members ──── projects
                │                            │
                └── tasks ◄──────────────────┘
                      │
                      ├── task_comments
                      └── task_history
```

### 5.5 Sécurité
- Authentification : Laravel Sanctum (Bearer Token)
- Hashage des mots de passe : bcrypt (cost factor 12)
- CORS : configuré pour le domaine frontend uniquement
- Validation : toutes les entrées validées côté serveur (FormRequest)
- Autorisation : middleware `auth:sanctum` sur toutes les routes privées

---

## 6. Interfaces utilisateur

### 6.1 Pages de l'application

| Route             | Page              | Accès        |
|-------------------|-------------------|--------------|
| `/login`          | Connexion         | Public       |
| `/register`       | Inscription       | Public       |
| `/dashboard`      | Tableau de bord   | Authentifié  |
| `/projects`       | Liste des projets | Authentifié  |
| `/projects/:id`   | Détail projet     | Authentifié  |
| `/members`        | Membres           | Authentifié  |
| `/profile`        | Mon profil        | Authentifié  |

### 6.2 Navigation
- **Sidebar** collapsible à gauche avec icônes et libellés
- **Navbar** top avec nom utilisateur, avatar et lien profil
- **Routes protégées** : redirection automatique vers `/login` si non authentifié

### 6.3 Responsive Design
| Breakpoint | Appareil   | Comportement                        |
|------------|------------|-------------------------------------|
| < 768px    | Mobile     | Sidebar masquée (burger menu)       |
| 768-1024px | Tablette   | Sidebar icons uniquement            |
| > 1024px   | Desktop    | Sidebar complète déployée           |

---

## 7. Contraintes et exigences

### 7.1 Contraintes techniques
- Le frontend est une SPA (Single Page Application) sans Server-Side Rendering
- L'API doit être RESTful et retourner du JSON
- La communication frontend ↔ backend se fait exclusivement via HTTP/HTTPS
- Le token JWT doit être envoyé dans le header `Authorization: Bearer {token}`

### 7.2 Contraintes fonctionnelles
- Un projet doit avoir au moins un nom et une date de début
- Une tâche doit obligatoirement être rattachée à un projet
- La suppression d'un projet supprime en cascade toutes ses tâches (DELETE CASCADE)
- Un membre supprimé se voit désassigné de ses tâches (SET NULL)

### 7.3 Exigences de performance
- Chargement initial de la page < 3 secondes (connexion standard)
- Réponse API < 500 ms pour les opérations CRUD simples
- Pagination côté serveur pour les listes > 50 éléments

---

## 8. Critères d'acceptation

| Fonctionnalité           | Critère d'acceptation                                                  |
|--------------------------|------------------------------------------------------------------------|
| Inscription              | Un utilisateur peut créer un compte et se connecter immédiatement      |
| Connexion / Déconnexion  | Le token est révoqué à la déconnexion, l'accès est bloqué              |
| Création de projet       | Le projet apparaît dans la liste et dans le tableau de bord            |
| Kanban drag & drop       | Le déplacement d'une tâche met à jour son statut en base               |
| Filtre membres par rôle  | Seuls les membres du rôle sélectionné sont affichés                    |
| Assignation de tâche     | Le membre nouvellement créé apparaît dans la liste d'assignation       |
| Export PDF               | Le PDF généré contient toutes les tâches et membres du projet          |
| Responsive               | L'interface est utilisable sur mobile (320px minimum)                  |
