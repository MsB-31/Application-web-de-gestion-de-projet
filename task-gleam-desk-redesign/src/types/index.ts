// Types partagés pour toute l'application

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  nom: string;
  description: string;
  statut: 'ACTIF' | 'EN_PAUSE' | 'TERMINE';
  dateDebut: string;
  dateFin?: string;
  chef?: User;
  membres: User[];
  taches?: Task[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'A_FAIRE' | 'EN_COURS' | 'TERMINE';

export interface Task {
  id: string;
  titre: string;
  description?: string;
  statut: TaskStatus;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE';
  assigneA?: User;
  projetId: string;
  dateEcheance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface UiState {
  sidebarOpen: boolean;
  notifications: Notification[];
  globalLoading: boolean;
}

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface CreateProjectPayload {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin?: string;
  membresIds?: string[];
}

export interface CreateTaskPayload {
  titre: string;
  description?: string;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE';
  assigneAId?: string;
  dateEcheance?: string;
  projetId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
