# Diagrammes UML — Digital Solutions · Gestion de Projets

> Tous les diagrammes sont écrits en syntaxe **Mermaid** et peuvent être rendus sur [mermaid.live](https://mermaid.live), dans VS Code (extension Mermaid), GitHub ou tout éditeur compatible.

---

## 1. Diagramme de Classes

```mermaid
classDiagram
    direction TB

    class User {
        +String id
        +String nom
        +String prenom
        +String email
        +String role
        +String avatar
        +String createdAt
        +login(email, password) AuthToken
        +updateProfile(data) User
    }

    class Project {
        +String id
        +String nom
        +String description
        +String statut
        +String dateDebut
        +String dateFin
        +String createdAt
        +String updatedAt
        +addMember(userId) void
        +removeMember(userId) void
        +getProgress() Number
    }

    class Task {
        +String id
        +String titre
        +String description
        +TaskStatus statut
        +TaskPriority priorite
        +String projetId
        +String dateEcheance
        +String createdAt
        +String updatedAt
        +changeStatus(status) void
        +assign(userId) void
    }

    class Comment {
        +String id
        +String taskId
        +String auteurId
        +String contenu
        +String createdAt
        +edit(contenu) void
        +delete() void
    }

    class Notification {
        +String id
        +String type
        +String message
        +Boolean lue
        +String createdAt
        +markAsRead() void
    }

    class TaskHistory {
        +String id
        +String taskId
        +String userId
        +String action
        +String ancienneValeur
        +String nouvelleValeur
        +String createdAt
    }

    class AuthToken {
        +String token
        +String expiresAt
        +validate() Boolean
        +refresh() AuthToken
    }

    User "1" --> "0..*" Project : chef de
    User "0..*" -- "0..*" Project : membre de
    Project "1" --> "0..*" Task : contient
    Task "0..*" --> "0..1" User : assigné à
    Task "1" --> "0..*" Comment : possède
    Task "1" --> "0..*" TaskHistory : historique
    Comment "0..*" --> "1" User : écrit par
    Notification "0..*" --> "1" User : reçue par
    User "1" --> "0..1" AuthToken : authentifié par

    note for Task "statut: A_FAIRE | EN_COURS | TERMINE\npriorite: BASSE | MOYENNE | HAUTE"
    note for Project "statut: ACTIF | EN_PAUSE | TERMINE"
```

---

## 2. Diagramme Entité-Relation (ER)

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar nom
        varchar prenom
        varchar email UK
        varchar password
        varchar role
        varchar avatar
        timestamp created_at
        timestamp updated_at
    }

    PROJECTS {
        bigint id PK
        varchar nom
        text description
        enum statut
        date date_debut
        date date_fin
        bigint chef_id FK
        timestamp created_at
        timestamp updated_at
    }

    TASKS {
        bigint id PK
        varchar titre
        text description
        enum statut
        enum priorite
        bigint projet_id FK
        bigint assigne_a FK
        date date_echeance
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_MEMBERS {
        bigint project_id FK
        bigint user_id FK
        timestamp joined_at
    }

    TASK_COMMENTS {
        bigint id PK
        bigint task_id FK
        bigint auteur_id FK
        text contenu
        timestamp created_at
        timestamp updated_at
    }

    TASK_HISTORY {
        bigint id PK
        bigint task_id FK
        bigint user_id FK
        varchar action
        text ancienne_valeur
        text nouvelle_valeur
        timestamp created_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar type
        text message
        boolean lue
        timestamp created_at
    }

    USERS ||--o{ PROJECTS : "chef de"
    USERS ||--o{ PROJECT_MEMBERS : "appartient à"
    PROJECTS ||--o{ PROJECT_MEMBERS : "inclut"
    PROJECTS ||--o{ TASKS : "contient"
    USERS ||--o{ TASKS : "assigné à"
    TASKS ||--o{ TASK_COMMENTS : "possède"
    USERS ||--o{ TASK_COMMENTS : "écrit"
    TASKS ||--o{ TASK_HISTORY : "historique"
    USERS ||--o{ TASK_HISTORY : "auteur"
    USERS ||--o{ NOTIFICATIONS : "reçoit"
```

---

## 3. Diagramme de Cas d'Utilisation (Use Case)

```mermaid
flowchart TB
    subgraph Acteurs
        direction TB
        Admin["👤 Administrateur"]
        Chef["👤 Chef de projet"]
        Membre["👤 Membre"]
    end

    subgraph UC_Auth["🔐 Authentification"]
        UC1["Se connecter"]
        UC2["S'inscrire"]
        UC3["Se déconnecter"]
        UC4["Voir / Modifier son profil"]
    end

    subgraph UC_Proj["📁 Gestion des Projets"]
        UC5["Créer un projet"]
        UC6["Lister les projets"]
        UC7["Voir un projet"]
        UC8["Modifier un projet"]
        UC9["Supprimer un projet"]
        UC10["Ajouter un membre"]
        UC11["Exporter en PDF"]
    end

    subgraph UC_Task["✅ Gestion des Tâches"]
        UC12["Créer une tâche"]
        UC13["Voir les tâches (Kanban)"]
        UC14["Déplacer une tâche (drag & drop)"]
        UC15["Changer le statut"]
        UC16["Assigner une tâche"]
        UC17["Supprimer une tâche"]
        UC18["Voir le détail d'une tâche"]
        UC19["Commenter une tâche"]
    end

    subgraph UC_Members["👥 Gestion des Membres"]
        UC20["Lister les membres"]
        UC21["Ajouter un membre"]
        UC22["Modifier un membre"]
        UC23["Supprimer un membre"]
        UC24["Filtrer par rôle"]
    end

    subgraph UC_Stats["📊 Statistiques"]
        UC25["Voir le dashboard"]
        UC26["Voir le graphique projet"]
    end

    Admin --> UC1 & UC2 & UC3 & UC4
    Admin --> UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11
    Admin --> UC20 & UC21 & UC22 & UC23 & UC24
    Admin --> UC25 & UC26

    Chef --> UC1 & UC3 & UC4
    Chef --> UC5 & UC6 & UC7 & UC8 & UC10 & UC11
    Chef --> UC12 & UC13 & UC14 & UC15 & UC16 & UC17 & UC18 & UC19
    Chef --> UC25 & UC26

    Membre --> UC1 & UC3 & UC4
    Membre --> UC6 & UC7
    Membre --> UC13 & UC14 & UC15 & UC18 & UC19
    Membre --> UC24
```

---

## 4. Diagramme de Séquence — Authentification (Login)

```mermaid
sequenceDiagram
    autonumber
    actor User as Utilisateur
    participant UI as Frontend (React)
    participant Store as Redux Store
    participant API as Laravel API
    participant DB as Base de données

    User->>UI: Saisit email + mot de passe
    UI->>UI: Validation form (react-hook-form + zod)
    UI->>Store: dispatch(login({ email, password }))
    Store->>API: POST /api/auth/login
    API->>DB: SELECT * FROM users WHERE email = ?
    DB-->>API: Retourne l'utilisateur
    API->>API: Vérifie le hash bcrypt
    alt Credentials invalides
        API-->>Store: 401 Unauthorized
        Store-->>UI: state.error = "Identifiants incorrects"
        UI-->>User: Affiche message d'erreur en rouge
    else Credentials valides
        API->>API: Génère token Sanctum
        API-->>Store: 200 OK { user, token }
        Store->>Store: state.user = user, state.token = token
        Store-->>UI: isAuthenticated = true
        UI->>UI: navigate('/dashboard')
        UI-->>User: Affiche le Dashboard
    end
```

---

## 5. Diagramme de Séquence — Création d'un Projet

```mermaid
sequenceDiagram
    autonumber
    actor Chef as Chef de projet
    participant UI as Frontend (React)
    participant Modal as CreateProjectModal
    participant Store as Redux Store
    participant API as Laravel API
    participant DB as Base de données

    Chef->>UI: Clique "Nouveau projet"
    UI->>Modal: Ouvre la modale
    Chef->>Modal: Remplit nom, description, dates, membres
    Modal->>Modal: Validation zod
    Chef->>Modal: Soumet le formulaire
    Modal->>Store: dispatch(createProject(payload))
    Store->>API: POST /api/projects { nom, description, dateDebut, dateFin, membresIds[] }
    API->>API: Vérifie Bearer token (Sanctum)
    API->>DB: INSERT INTO projects ...
    DB-->>API: Projet créé (id: 42)
    API->>DB: INSERT INTO project_members (project_id, user_id) ...
    DB-->>API: Membres associés
    API-->>Store: 201 Created { project }
    Store->>Store: state.projects.unshift(project)
    Store-->>UI: Mise à jour de la liste
    UI->>Modal: Ferme la modale
    UI-->>Chef: Nouveau projet affiché en tête de liste
```

---

## 6. Diagramme de Séquence — Déplacement d'une Tâche (Drag & Drop Kanban)

```mermaid
sequenceDiagram
    autonumber
    actor User as Utilisateur
    participant UI as Kanban Board
    participant DnD as @hello-pangea/dnd
    participant State as useState(tasks)
    participant API as Laravel API
    participant DB as Base de données

    User->>UI: Attrape une carte de tâche
    DnD->>UI: onDragStart → carte en mode dragging
    User->>UI: Dépose dans une nouvelle colonne
    DnD->>UI: onDragEnd(result)
    UI->>UI: Vérifie source ≠ destination
    UI->>State: setTasks → mise à jour statut local (optimistic)
    State-->>UI: Re-render immédiat de la colonne
    UI->>API: PATCH /api/tasks/{id} { statut: "EN_COURS" }
    API->>DB: UPDATE tasks SET statut = 'EN_COURS' WHERE id = ?
    DB-->>API: OK
    API->>DB: INSERT INTO task_history (action: "statut_change") ...
    DB-->>API: OK
    API-->>UI: 200 OK
    alt Erreur API
        API-->>UI: 422 / 500
        UI->>State: Rollback → rétablit l'ancien statut
        UI-->>User: Toast d'erreur
    end
```

---

## 7. Diagramme de Séquence — Ajout d'un Membre à la Plateforme

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrateur
    participant UI as Page Membres
    participant Modal as AddMemberModal
    participant Store as membresStore
    participant API as Laravel API
    participant DB as Base de données

    Admin->>UI: Clique "Nouveau membre"
    UI->>Modal: Ouvre la modale
    Admin->>Modal: Remplit prénom, nom, email, rôle
    Admin->>Modal: Soumet
    Modal->>API: POST /api/users { prenom, nom, email, role }
    API->>DB: INSERT INTO users ...
    DB-->>API: User créé
    API-->>Modal: 201 Created { user }
    Modal->>Store: addMember(user)
    Store-->>UI: Liste mise à jour
    UI-->>Admin: Nouveau membre visible dans la grille
    Note over UI: Les pills de filtre se régénèrent<br/>dynamiquement avec le nouveau rôle
```

---

## 8. Diagramme de Séquence — Export PDF d'un Projet

```mermaid
sequenceDiagram
    autonumber
    actor User as Utilisateur
    participant UI as ProjectDetails
    participant Utils as exportProjectPDF.ts
    participant jsPDF as jsPDF + autoTable
    participant Browser as Navigateur

    User->>UI: Clique "Export PDF"
    UI->>Utils: exportProjectPDF(project, tasks)
    Utils->>jsPDF: new jsPDF()
    Utils->>jsPDF: Ajoute entête (nom projet, dates, membres)
    loop Pour chaque statut (À faire, En cours, Terminé)
        Utils->>jsPDF: autoTable({ tâches filtrées })
    end
    jsPDF-->>Utils: Document PDF généré
    Utils->>Browser: doc.save("projet-xxx.pdf")
    Browser-->>User: Téléchargement du fichier PDF
```

---

## 9. Diagramme d'Architecture Globale (Frontend ↔ Backend)

```mermaid
flowchart LR
    subgraph Client["🌐 Client (React + Vite)"]
        direction TB
        Pages["Pages\n(Dashboard, Projects,\nProjectDetails, Members, Profile)"]
        Components["Composants\n(AppLayout, TaskCard,\nProjectCard, Modals...)"]
        Hooks["Hooks\n(useProjects, useTasks,\nuseAuth, useAppStore)"]
        Redux["Redux Toolkit\n(authSlice, projectSlice,\ntaskSlice, uiSlice)"]
        Services["Services Axios\n(authService, projectService,\ntaskService)"]
    end

    subgraph Server["🖥️ Serveur (Laravel 11)"]
        direction TB
        Routes["routes/api.php"]
        Middleware["Middleware\n(auth:sanctum, cors)"]
        Controllers["Controllers\n(AuthController,\nProjectController,\nTaskController,\nUserController)"]
        Models["Eloquent Models\n(User, Project, Task,\nComment, Notification)"]
        DB[("MySQL\nPhpMyAdmin")]
    end

    Pages --> Components
    Components --> Hooks
    Hooks --> Redux
    Redux --> Services
    Services <-->|"HTTP REST API\nBearer Token"| Routes
    Routes --> Middleware --> Controllers
    Controllers --> Models --> DB
```

---

## 10. Diagramme d'État — Cycle de vie d'une Tâche

```mermaid
stateDiagram-v2
    [*] --> A_FAIRE : Création de la tâche

    A_FAIRE --> EN_COURS : Début du travail\n(drag & drop ou select)
    A_FAIRE --> TERMINE : Résolu directement

    EN_COURS --> A_FAIRE : Bloquée / mise en attente
    EN_COURS --> TERMINE : Travail terminé

    TERMINE --> EN_COURS : Reprise / correction
    TERMINE --> [*] : Suppression

    A_FAIRE --> [*] : Suppression
    EN_COURS --> [*] : Suppression

    note right of A_FAIRE
        Couleur : Jaune/Orange
        Badge : À faire
    end note

    note right of EN_COURS
        Couleur : Bleu
        Badge : En cours
    end note

    note right of TERMINE
        Couleur : Vert
        Badge : Terminé
    end note
```
