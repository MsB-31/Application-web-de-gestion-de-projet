import type { User } from '../types';

// Initial members from mockData
const INITIAL_MEMBERS: User[] = [
  { id: 'u1', nom: 'Dupont', prenom: 'Jean', email: 'jean@ds.com', role: 'Chef de projet', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', nom: 'Martin', prenom: 'Sophie', email: 'sophie@ds.com', role: 'Développeur', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u3', nom: 'Dubois', prenom: 'Lucas', email: 'lucas@ds.com', role: 'Designer', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u4', nom: 'Bernard', prenom: 'Emma', email: 'emma@ds.com', role: 'DevOps', createdAt: '2024-01-01T00:00:00Z' },
];

const STORAGE_KEY = 'ds_membres';

function loadMembers(): User[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
}

function saveMembers(members: User[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch { /* ignore */ }
}

export function getMembers(): User[] {
  return loadMembers();
}

export function addMember(data: Omit<User, 'id' | 'createdAt'>): User {
  const members = loadMembers();
  const newMember: User = {
    ...data,
    id: `u${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveMembers([...members, newMember]);
  return newMember;
}

export function updateMember(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
  const members = loadMembers();
  const idx = members.findIndex(m => m.id === id);
  if (idx === -1) return null;
  const updated = { ...members[idx], ...data, updatedAt: new Date().toISOString() };
  members[idx] = updated;
  saveMembers(members);
  return updated;
}

export function deleteMember(id: string): boolean {
  const members = loadMembers();
  const filtered = members.filter(m => m.id !== id);
  if (filtered.length === members.length) return false;
  saveMembers(filtered);
  return true;
}
