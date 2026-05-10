import type { Project, Task } from '../types';

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', titre: 'Analyse des besoins', description: 'Recueillir et analyser les besoins clients',
    statut: 'TERMINE', priorite: 'HAUTE', projetId: 'p1',
    dateEcheance: '2024-12-15', createdAt: '2024-11-01T00:00:00Z', updatedAt: '2024-12-14T00:00:00Z',
    assigneA: { id: 'u2', nom: 'Martin', prenom: 'Sophie', email: 'sophie@ds.com', role: 'Dev', createdAt: '2024-01-01T00:00:00Z' },
  },
  {
    id: 't2', titre: 'Conception UX/UI', description: 'Créer les maquettes et prototypes interactifs',
    statut: 'EN_COURS', priorite: 'HAUTE', projetId: 'p1',
    dateEcheance: '2025-01-20', createdAt: '2024-11-10T00:00:00Z', updatedAt: '2024-12-20T00:00:00Z',
    assigneA: { id: 'u3', nom: 'Dubois', prenom: 'Lucas', email: 'lucas@ds.com', role: 'Designer', createdAt: '2024-01-01T00:00:00Z' },
  },
  {
    id: 't3', titre: 'Développement frontend', description: 'Implémentation React avec TypeScript',
    statut: 'EN_COURS', priorite: 'HAUTE', projetId: 'p1',
    dateEcheance: '2025-02-28', createdAt: '2024-12-01T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
    assigneA: { id: 'u4', nom: 'Bernard', prenom: 'Emma', email: 'emma@ds.com', role: 'Dev', createdAt: '2024-01-01T00:00:00Z' },
  },
  {
    id: 't4', titre: 'Tests d\'intégration', description: 'Tester les endpoints et l\'intégration API',
    statut: 'A_FAIRE', priorite: 'MOYENNE', projetId: 'p1',
    dateEcheance: '2025-03-15', createdAt: '2024-12-15T00:00:00Z', updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 't5', titre: 'Déploiement production', description: 'Mise en ligne sur les serveurs de production',
    statut: 'A_FAIRE', priorite: 'HAUTE', projetId: 'p1',
    dateEcheance: '2025-03-30', createdAt: '2024-12-15T00:00:00Z', updatedAt: '2024-12-15T00:00:00Z',
  },
  {
    id: 't6', titre: 'Audit de sécurité', description: 'Analyse des vulnérabilités et correctifs',
    statut: 'A_FAIRE', priorite: 'HAUTE', projetId: 'p2',
    dateEcheance: '2025-02-10', createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-05T00:00:00Z',
  },
  {
    id: 't7', titre: 'Migration base de données', description: 'Migration vers PostgreSQL',
    statut: 'EN_COURS', priorite: 'HAUTE', projetId: 'p2',
    dateEcheance: '2025-01-30', createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z',
    assigneA: { id: 'u2', nom: 'Martin', prenom: 'Sophie', email: 'sophie@ds.com', role: 'Dev', createdAt: '2024-01-01T00:00:00Z' },
  },
  {
    id: 't8', titre: 'Configuration CI/CD', description: 'Mise en place du pipeline d\'intégration continue',
    statut: 'TERMINE', priorite: 'MOYENNE', projetId: 'p2',
    dateEcheance: '2025-01-15', createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-14T00:00:00Z',
    assigneA: { id: 'u4', nom: 'Bernard', prenom: 'Emma', email: 'emma@ds.com', role: 'Dev', createdAt: '2024-01-01T00:00:00Z' },
  },
];

const MEMBRES = [
  { id: 'u1', nom: 'Dupont', prenom: 'Jean', email: 'jean@ds.com', role: 'Chef de projet', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', nom: 'Martin', prenom: 'Sophie', email: 'sophie@ds.com', role: 'Développeur', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u3', nom: 'Dubois', prenom: 'Lucas', email: 'lucas@ds.com', role: 'Designer', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u4', nom: 'Bernard', prenom: 'Emma', email: 'emma@ds.com', role: 'DevOps', createdAt: '2024-01-01T00:00:00Z' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', nom: 'Refonte Site Web', description: 'Refonte complète du site vitrine avec nouvelle identité visuelle et optimisation SEO.',
    statut: 'ACTIF', dateDebut: '2024-11-01', dateFin: '2025-03-31',
    membres: MEMBRES.slice(0, 4), taches: MOCK_TASKS.filter(t => t.projetId === 'p1'),
    createdAt: '2024-11-01T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'p2', nom: 'Infrastructure Cloud', description: 'Migration et modernisation de l\'infrastructure vers le cloud AWS avec containerisation Docker.',
    statut: 'ACTIF', dateDebut: '2025-01-05', dateFin: '2025-06-30',
    membres: MEMBRES.slice(1, 4), taches: MOCK_TASKS.filter(t => t.projetId === 'p2'),
    createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'p3', nom: 'Application Mobile', description: 'Développement d\'une application mobile React Native pour les commerciaux terrain.',
    statut: 'EN_PAUSE', dateDebut: '2024-09-01',
    membres: MEMBRES.slice(0, 2), taches: [],
    createdAt: '2024-09-01T00:00:00Z', updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'p4', nom: 'CRM Interne', description: 'Développement d\'un CRM personnalisé pour la gestion des relations clients et du pipeline commercial.',
    statut: 'TERMINE', dateDebut: '2024-01-15', dateFin: '2024-10-31',
    membres: MEMBRES, taches: [],
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-10-31T00:00:00Z',
  },
  {
    id: 'p5', nom: 'Portail RH', description: 'Plateforme de gestion des ressources humaines : congés, notes de frais, onboarding.',
    statut: 'ACTIF', dateDebut: '2025-01-20',
    membres: MEMBRES.slice(0, 3), taches: [],
    createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z',
  },
];

export const MOCK_MEMBERS = MEMBRES;
