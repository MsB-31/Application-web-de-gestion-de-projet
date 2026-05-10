# Interfaces de l'Application — Digital Solutions · Gestion de Projets

> Captures d'écran réalisées sur le projet en état de démonstration (données fictives).  
> URL de prévisualisation : `https://task-gleam-desk.lovable.app`  
> Résolution de capture : **1366 × 768 px** (Desktop HD)

---

## 1. Page de Connexion (`/login`)

**Route :** `/login`  
**Accès :** Public (non authentifié)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PANNEAU GAUCHE (fond sombre #0f172a)    │  PANNEAU DROIT (clair)   │
│                                          │                           │
│  🗂️ Digital Solutions                   │  Connexion                │
│                                          │  Accédez à votre espace   │
│  Gérez vos projets                       │                           │
│  avec efficacité.                        │  🚀 Compte de démo        │
│                                          │  Email: demo@...          │
│  Une plateforme collaborative pour       │  MDP: demo1234            │
│  planifier, suivre et livrer vos         │                           │
│  projets avec votre équipe.              │  [Email input]            │
│                                          │  [Password input]  👁      │
│  100+ | 50+ | 99%                        │                           │
│  Projets | Équipes | Satisfaction        │  [Se connecter]           │
│                                          │  Pas de compte ? Créer    │
└─────────────────────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Split-screen bicolore : gauche sombre (branding + hero), droite claire (formulaire)
- Bandeau "Compte de démo" avec credentials pré-remplis
- Validation inline avec messages d'erreur en rouge
- Lien vers la page d'inscription
- Statistiques marketing en bas à gauche (100+ projets, 50+ équipes, 99% satisfaction)

---

## 2. Page d'Inscription (`/register`)

**Route :** `/register`  
**Accès :** Public (non authentifié)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PANNEAU GAUCHE                          │  PANNEAU DROIT           │
│                                          │                           │
│  🗂️ Digital Solutions                   │  Créer un compte          │
│  (même branding que Login)               │  Rejoignez la plateforme  │
│                                          │                           │
│                                          │  [Prénom]  [Nom]          │
│                                          │  [Email]                  │
│                                          │  [Mot de passe]           │
│                                          │  [Confirmer MDP]          │
│                                          │                           │
│                                          │  [Créer mon compte]       │
│                                          │  Déjà un compte ? Login   │
└─────────────────────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Même layout split-screen que Login
- Formulaire à 5 champs (prénom, nom, email, mot de passe × 2)
- Validation zod en temps réel
- Lien retour vers la connexion

---

## 3. Dashboard (`/dashboard`)

**Route :** `/dashboard`  
**Accès :** Authentifié

```
┌──────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR     │  HEADER : Dashboard                    🔔  JD        │
│              ├──────────────────────────────────────────────────────┤
│  🗂️ Logo     │  Bonjour, Jean 👋              [Voir tous les projets]│
│              │  Voici un aperçu de l'activité                        │
│  📊 Dashboard│                                                       │
│  📁 Projets  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  👥 Membres  │  │   3    │ │   1    │ │   1    │ │   5    │        │
│  👤 Profil   │  │Actifs  │ │En pause│ │Terminés│ │ Total  │        │
│              │  └────────┘ └────────┘ └────────┘ └────────┘        │
│              │                                                       │
│              │  ┌─────────────────────┐ ┌────────────────────────┐  │
│              │  │ Répartition tâches  │ │  Tâches à venir        │  │
│              │  │ [Bar chart]         │ │  • Conception UX/UI     │  │
│              │  │ À faire|En cours|   │ │    19/01 - En cours     │  │
│              │  │ Terminées           │ │  • Migration BDD        │  │
│              │  └─────────────────────┘ │    29/01 - En cours     │  │
│  ──────────  │                          │  • Audit sécurité       │  │
│  JD Jean     │  Projets récents →       │    09/02 - À faire      │  │
│  Déconnexion │  [cards...]              └────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Sidebar de navigation fixe (250px) avec avatar + déconnexion en bas
- 4 KPI cards (Actifs, En pause, Terminés, Total) avec icônes colorées
- Bar chart Recharts (répartition tâches par statut)
- Widget "Tâches à venir" avec badges de statut colorés
- Section "Projets récents" avec cards miniatures
- Header fixe avec titre de page + cloche notifications + avatar utilisateur

---

## 4. Page Projets (`/projects`)

**Route :** `/projects`  
**Accès :** Authentifié

```
┌──────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR     │  Mes Projets                    [+ Nouveau projet]    │
│  (identique) │  5 projets au total                                   │
│              │                                                       │
│              │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│              │  │  5   │ │  3   │ │  1   │ │  1   │               │
│              │  │Total │ │Actifs│ │Pause │ │TermN.│               │
│              │  └──────┘ └──────┘ └──────┘ └──────┘               │
│              │                                                       │
│              │  [🔍 Rechercher...]              [↕ Date décroissant] │
│              │                                                       │
│              │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │
│              │  │ Portail RH   │ │Infrastructure│ │ Refonte     │  │
│              │  │ 🔵 Actif     │ │ 🔵 Actif     │ │ Site Web    │  │
│              │  │ Description  │ │ Progression  │ │ 🔵 Actif    │  │
│              │  │              │ │ ████░░ 33%   │ │ ████░ 20%   │  │
│              │  │ 📅 janv.2025 │ │ 1/3 tâches   │ │ 1/5 tâches  │  │
│              │  │ 👥 3 membres │ │ 👥 3 membres  │ │ 👥 4 membres│  │
│              │  │ [Suppr][Ouvr]│ │ [Suppr][Ouvr]│ │ [Suppr][Ouv]│  │
│              │  └──────────────┘ └──────────────┘ └─────────────┘  │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Éléments UI :**
- 4 stat cards en haut (Total / Actifs / En pause / Terminés)
- Barre de recherche + bouton tri par date (croissant/décroissant)
- Grille responsive 3 colonnes (1 sur mobile, 2 tablette, 3 desktop)
- Chaque ProjectCard : nom, statut badge, description, barre de progression, dates, nombre de membres
- Boutons "Supprimer" (rouge) et "Ouvrir →" par carte
- Pagination si > 9 projets
- Modale de création de projet (overlay)

---

## 5. Détails d'un Projet — Kanban (`/projects/:id`)

**Route :** `/projects/p1`  
**Accès :** Authentifié

```
┌──────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR     │  ← Retour aux projets                                │
│  (identique) │                                                       │
│              │  Refonte Site Web  🔵 Actif  [PDF] [Stats] [+ Tâche] │
│              │  Refonte complète du site vitrine...                  │
│              │  📅 31 oct. 2024 → 30 mars 2025  👥 4 membres        │
│              │                                                       │
│              │  Filtre: [Tous●] [À faire 2] [En cours 2] [Terminé 1]│
│              │                                                       │
│              │  ┌───────────────┐ ┌───────────────┐ ┌────────────┐ │
│              │  │  À faire   2  │ │  En cours  2  │ │ Terminé  1 │ │
│              │  │ ─────────── ─ │ │ ─────────── ─ │ │ ──────── ─ │ │
│              │  │ Tests intégr. │ │ Conception UI │ │ Analyse    │ │
│              │  │ 🚩 14 mars    │ │ 🚩 LD 19 janv │ │ besoins    │ │
│              │  │ [À faire ▼] ✕ │ │ [En cours ▼]✕ │ │ SM 14 déc. │ │
│              │  │               │ │               │ │ [Terminé▼]✕│ │
│              │  │ Déploiement   │ │ Dév. frontend │ │            │ │
│              │  │ 🚩 29 mars    │ │ 🚩 EB 27 févr │ │            │ │
│              │  │ [À faire ▼] ✕ │ │ [En cours ▼]✕ │ │            │ │
│              │  └───────────────┘ └───────────────┘ └────────────┘ │
│              │                                                       │
│              │  👥 Membres de l'équipe (4)                           │
│              │  [JD Jean] [SM Sophie] [LD Lucas] [EB Emma]           │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Éléments UI :**
- En-tête projet : nom, statut, description, dates, compteur membres
- Boutons d'action : Export PDF, Statistiques (toggle), Nouvelle tâche
- Graphique bar chart (toggle, animé) montrant la répartition par statut
- Filtres pills : Tous / À faire (n) / En cours (n) / Terminé (n)
- **Kanban Board** : 3 colonnes codées couleur (jaune/bleu/vert)
  - Drag & Drop avec @hello-pangea/dnd
  - TaskCards : titre, priorité (🚩 rouge = HAUTE), assigné (avatar initiales), date d'échéance, select de statut, suppression
  - Zone de drop en pointillés quand vide
- Section membres en bas : cards avec avatar gradient + nom + rôle

---

## 6. Panneau Détail d'une Tâche (Drawer latéral)

**Déclenché par :** Clic sur le titre d'une TaskCard  
**Composant :** `TaskDetailPanel` — Slide-in depuis la droite

```
┌────────────────────────────────────────────────────────────┐
│  (Overlay semi-transparent)            ┌───────────────────┤
│                                        │ Détail de la tâche│
│                                        │ ─────────────────  │
│                                        │ Conception UX/UI  │
│                                        │                   │
│                                        │ Statut: [En cours]│
│                                        │ Priorité: HAUTE 🚩 │
│                                        │ Assigné: LD Lucas │
│                                        │ Échéance: 19 janv.│
│                                        │                   │
│                                        │ Description:      │
│                                        │ Créer les         │
│                                        │ maquettes et      │
│                                        │ prototypes...     │
│                                        │                   │
│                                        │ [Fermer]          │
│                                        └───────────────────┤
└────────────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Drawer slide-in depuis la droite (animation CSS)
- Overlay sombre sur le reste de l'écran
- Affiche : titre, statut modifiable, priorité, assigné (avatar + nom), date d'échéance, description complète
- Compteur de commentaires
- Bouton de fermeture

---

## 7. Page Membres (`/members`)

**Route :** `/members`  
**Accès :** Authentifié

```
┌──────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR     │  Membres de l'équipe           [+ Nouveau membre]     │
│  (identique) │  4 membres enregistrés                                │
│              │                                                       │
│              │  [📧 Rechercher un membre...]                         │
│              │                                                       │
│              │  [Tous●] [Chef de projet] [Designer] [DevOps]         │
│              │  [Développeur]                                        │
│              │                                                       │
│              │  ┌──────────────────┐ ┌──────────────────┐ ┌──────┐  │
│              │  │ 🔴 JD            │ │ 🔵 SM            │ │🟢 LD │  │
│              │  │ Jean Dupont      │ │ Sophie Martin    │ │Lucas │  │
│              │  │ jean@ds.com      │ │ sophie@ds.com    │ │Dubois│  │
│              │  │ 💼 Chef projet   │ │ 💼 Développeur   │ │Design│  │
│              │  │ 📁 4 projets     │ │ 📁 5 projets     │ │4 proj│  │
│              │  │ [Modifier][Suppr]│ │ [Modifier][Suppr]│ │[Mod] │  │
│              │  └──────────────────┘ └──────────────────┘ └──────┘  │
│              │  ┌──────────────────┐                                 │
│              │  │ 🟠 EB            │                                 │
│              │  │ Emma Bernard     │                                 │
│              │  │ emma@ds.com      │                                 │
│              │  │ 💼 DevOps        │                                 │
│              │  │ 📁 3 projets     │                                 │
│              │  │ [Modifier][Suppr]│                                 │
│              │  └──────────────────┘                                 │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Recherche par email/nom en temps réel
- **Filtres par rôle dynamiques** : pills générées depuis les rôles existants (Tous + chaque rôle unique)
- Grille responsive 3 colonnes de MemberCards
  - Avatar circulaire avec dégradé coloré + initiales
  - Nom, email, rôle (badge), nombre de projets associés
  - Actions : Modifier (modale d'édition), Supprimer (avec confirmation)
- Message d'état vide si aucun résultat
- Modale d'ajout/édition de membre

---

## 8. Modale Création de Tâche

**Déclenchée par :** Bouton "Nouvelle tâche" sur ProjectDetails  
**Composant :** `CreateTaskModal`

```
┌─────────────────────────────────────────┐
│  Nouvelle tâche                       ✕ │
│  ─────────────────────────────────────  │
│  Titre *                                │
│  [Titre de la tâche                   ] │
│                                         │
│  Description                            │
│  [                                    ] │
│  [                                    ] │
│                                         │
│  Priorité          Assigner à           │
│  [MOYENNE ▼]       [Choisir... ▼]       │
│                                         │
│  Date d'échéance                        │
│  [jj/mm/aaaa                          ] │
│                                         │
│            [Annuler]  [Créer la tâche]  │
└─────────────────────────────────────────┘
```

**Éléments UI :**
- Overlay modal centré avec fond flouté
- Titre obligatoire, description optionnelle (textarea)
- Select priorité : BASSE / MOYENNE / HAUTE
- Select "Assigner à" : liste de membres depuis `membresStore` (synchronisé)
- Date picker natif
- Boutons Annuler / Créer avec validation

---

## 9. Modale Création de Projet

**Déclenchée par :** Bouton "Nouveau projet"  
**Composant :** `CreateProjectModal`

```
┌─────────────────────────────────────────┐
│  Nouveau projet                       ✕ │
│  ─────────────────────────────────────  │
│  Nom du projet *                        │
│  [                                    ] │
│                                         │
│  Description *                          │
│  [                                    ] │
│  [                                    ] │
│                                         │
│  Date de début *   Date de fin          │
│  [jj/mm/aaaa    ]  [jj/mm/aaaa       ] │
│                                         │
│  Membres (optionnel)                    │
│  [Sélectionner des membres... ▼]        │
│                                         │
│            [Annuler]  [Créer le projet] │
└─────────────────────────────────────────┘
```

---

## 10. Page Profil (`/profile`)

**Route :** `/profile`  
**Accès :** Authentifié

```
┌──────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR     │  Mon Profil                           [✏ Modifier]    │
│  (identique) │                                                       │
│              │  ┌──────────────────────────────────────────────────┐ │
│              │  │  🔵 JD  Jean Dupont                              │ │
│              │  │        demo@digitalsolutions.fr                  │ │
│              │  │        🛡️ Chef de projet                         │ │
│              │  └──────────────────────────────────────────────────┘ │
│              │                                                       │
│              │  ┌──────────────────┐ ┌──────────────────────────┐   │
│              │  │ 👤 Prénom        │ │ 👤 Nom                   │   │
│              │  │ Jean             │ │ Dupont                   │   │
│              │  └──────────────────┘ └──────────────────────────┘   │
│              │                                                       │
│              │  ┌──────────────────┐ ┌──────────────────────────┐   │
│              │  │ ✉ Email          │ │ 🛡️ Rôle                  │   │
│              │  │ demo@digital...  │ │ Chef de projet           │   │
│              │  └──────────────────┘ └──────────────────────────┘   │
│              │                                                       │
│              │  ┌──────────────────────────────────────────────────┐ │
│              │  │ Informations du compte                           │ │
│              │  │ Membre depuis : 14 janvier 2024                  │ │
│              │  │ ID : demo-1                                      │ │
│              │  └──────────────────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Éléments UI :**
- Card principale : avatar gradient + initiales, nom complet, email, badge rôle
- 4 champs d'info en 2 colonnes (Prénom, Nom, Email, Rôle)
- Bouton "Modifier" ouvre le mode édition inline
- Card "Informations du compte" : date d'inscription + ID utilisateur

---

## Récapitulatif des Routes

| Route | Page | Accès |
|-------|------|-------|
| `/` ou `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/dashboard` | Tableau de bord | Authentifié |
| `/projects` | Liste des projets | Authentifié |
| `/projects/:id` | Détail projet (Kanban) | Authentifié |
| `/members` | Gestion des membres | Authentifié |
| `/profile` | Profil utilisateur | Authentifié |
| `*` | Page 404 | Tous |

---

## Design System utilisé

| Élément | Valeur |
|---------|--------|
| Framework CSS | Tailwind CSS v3 |
| Composants UI | shadcn/ui (Radix UI primitives) |
| Palette principale | HSL tokens (--primary, --background, --foreground…) |
| Thème | Clair avec sidebar sombre |
| Typographie | Police système (Inter-like) |
| Animations | tailwindcss-animate + CSS transitions |
| Icônes | Lucide React |
| Charts | Recharts (BarChart, ResponsiveContainer) |
| Drag & Drop | @hello-pangea/dnd |
| Breakpoints | Mobile (< 768px) / Tablet (768–1024px) / Desktop (> 1024px) |
