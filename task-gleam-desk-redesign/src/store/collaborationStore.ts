/**
 * In-memory collaboration store (simulates real-time backend).
 * Persisted to sessionStorage so the data survives component re-mounts
 * within the same browser session.
 */
import type { Comment, HistoryEntry, HistoryAction } from '../types/collaboration';

const KEY_COMMENTS = 'collab_comments';
const KEY_HISTORY = 'collab_history';

// ── Helpers ───────────────────────────────────────────────────────────────────
function load<T>(key: string): T[] {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// ── Comments ──────────────────────────────────────────────────────────────────
export function getComments(taskId: string): Comment[] {
  return load<Comment>(KEY_COMMENTS).filter(c => c.taskId === taskId);
}

export function addComment(
  taskId: string,
  content: string,
  author: { id: string; name: string; initials: string },
): Comment {
  const all = load<Comment>(KEY_COMMENTS);
  const c: Comment = {
    id: `c_${Date.now()}`,
    taskId,
    authorId: author.id,
    authorName: author.name,
    authorInitials: author.initials,
    content,
    createdAt: new Date().toISOString(),
  };
  all.push(c);
  save(KEY_COMMENTS, all);
  return c;
}

export function editComment(commentId: string, content: string): Comment | null {
  const all = load<Comment>(KEY_COMMENTS);
  const idx = all.findIndex(c => c.id === commentId);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], content, editedAt: new Date().toISOString() };
  save(KEY_COMMENTS, all);
  return all[idx];
}

export function deleteComment(commentId: string) {
  const all = load<Comment>(KEY_COMMENTS).filter(c => c.id !== commentId);
  save(KEY_COMMENTS, all);
}

// ── History ───────────────────────────────────────────────────────────────────
export function getHistory(taskId: string): HistoryEntry[] {
  return load<HistoryEntry>(KEY_HISTORY)
    .filter(h => h.taskId === taskId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addHistory(
  taskId: string,
  action: HistoryAction,
  author: { id: string; name: string; initials: string },
  extra?: { field?: string; oldValue?: string; newValue?: string },
): HistoryEntry {
  const all = load<HistoryEntry>(KEY_HISTORY);
  const h: HistoryEntry = {
    id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    taskId,
    action,
    authorId: author.id,
    authorName: author.name,
    authorInitials: author.initials,
    ...extra,
    createdAt: new Date().toISOString(),
  };
  all.push(h);
  save(KEY_HISTORY, all);
  return h;
}

// Seed initial history for existing mock tasks so the panel isn't empty
export function seedHistoryIfEmpty(taskId: string, taskTitle: string) {
  const existing = getHistory(taskId);
  if (existing.length > 0) return;
  const jean = { id: 'u1', name: 'Jean Dupont', initials: 'JD' };
  addHistory(taskId, 'CREATED', jean, { newValue: taskTitle });
}
