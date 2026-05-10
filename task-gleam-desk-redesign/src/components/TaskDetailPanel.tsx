import { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Clock, Send, Pencil, Trash2, Flag, Calendar, User, ChevronRight } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import type { Comment, HistoryEntry } from '../types/collaboration';
import {
  getComments, addComment, editComment, deleteComment,
  getHistory, addHistory, seedHistoryIfEmpty,
} from '../store/collaborationStore';

// ── Demo current user ─────────────────────────────────────────────────────────
const ME = { id: 'u1', name: 'Jean Dupont', initials: 'JD' };

const STATUS_LABEL: Record<TaskStatus, string> = {
  A_FAIRE: 'À faire',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
};

const PRIORITY_LABEL: Record<string, string> = {
  BASSE: 'Basse', MOYENNE: 'Moyenne', HAUTE: 'Haute',
};

const ACTION_LABEL: Record<string, (h: HistoryEntry) => string> = {
  CREATED: (h) => `a créé la tâche "${h.newValue}"`,
  STATUS_CHANGED: (h) => `a changé le statut : ${h.oldValue} → ${h.newValue}`,
  PRIORITY_CHANGED: (h) => `a changé la priorité : ${h.oldValue} → ${h.newValue}`,
  ASSIGNED: (h) => `a assigné à ${h.newValue}`,
  UNASSIGNED: (h) => `a retiré l'assignation`,
  TITLE_CHANGED: (h) => `a renommé la tâche`,
  DESCRIPTION_CHANGED: (h) => `a modifié la description`,
  COMMENT_ADDED: (h) => `a ajouté un commentaire`,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Avatar({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs';
  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center font-bold text-primary-foreground shrink-0`}
      style={{ background: 'var(--gradient-primary)' }}
    >
      {initials}
    </div>
  );
}

function CommentBubble({
  comment,
  onEdit,
  onDelete,
}: {
  comment: Comment;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const isMe = comment.authorId === ME.id;

  const handleSave = () => {
    if (draft.trim()) {
      onEdit(comment.id, draft.trim());
      setEditing(false);
    }
  };

  return (
    <div className="flex gap-2.5 group">
      <Avatar initials={comment.authorInitials} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-foreground">{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">{relativeTime(comment.createdAt)}</span>
          {comment.editedAt && (
            <span className="text-xs text-muted-foreground/60 italic">(modifié)</span>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-1.5">
            <textarea
              className="input-field text-xs resize-none"
              rows={2}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button onClick={handleSave} className="btn-primary text-xs px-3 py-1">Sauvegarder</button>
              <button onClick={() => { setEditing(false); setDraft(comment.content); }} className="btn-secondary text-xs px-3 py-1">Annuler</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed break-words">
            {comment.content}
          </p>
        )}
      </div>

      {isMe && !editing && (
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-muted-foreground hover:text-foreground rounded"
            title="Modifier"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="p-1 text-muted-foreground hover:text-destructive rounded"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const label = ACTION_LABEL[entry.action]?.(entry) ?? entry.action;
  return (
    <div className="flex gap-2.5 items-start">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <Avatar initials={entry.authorInitials} size="sm" />
        <div className="w-px h-full bg-border" style={{ minHeight: 12 }} />
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-xs text-foreground leading-relaxed">
          <span className="font-semibold">{entry.authorName}</span>
          {' '}
          <span className="text-muted-foreground">{label}</span>
        </p>
        <span className="text-xs text-muted-foreground/60">{relativeTime(entry.createdAt)}</span>
      </div>
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────────
interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

export default function TaskDetailPanel({ task, onClose, onStatusChange }: TaskDetailPanelProps) {
  const [tab, setTab] = useState<'comments' | 'history'>('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load data when task changes
  useEffect(() => {
    if (!task) return;
    seedHistoryIfEmpty(task.id, task.titre);
    setComments(getComments(task.id));
    setHistory(getHistory(task.id));
    setDraft('');
  }, [task?.id]);

  // Auto-scroll comments to bottom on new message
  useEffect(() => {
    if (tab === 'comments') bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments, tab]);

  if (!task) return null;

  // Overlay backdrop
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!onStatusChange) return;
    const old = STATUS_LABEL[task.statut];
    const nw = STATUS_LABEL[newStatus];
    addHistory(task.id, 'STATUS_CHANGED', ME, { oldValue: old, newValue: nw });
    onStatusChange(task.id, newStatus);
    setHistory(getHistory(task.id));
  };

  const handleAddComment = () => {
    if (!draft.trim()) return;
    const c = addComment(task.id, draft.trim(), ME);
    addHistory(task.id, 'COMMENT_ADDED', ME);
    setComments(getComments(task.id));
    setHistory(getHistory(task.id));
    setDraft('');
  };

  const handleEditComment = (id: string, content: string) => {
    editComment(id, content);
    setComments(getComments(task.id));
  };

  const handleDeleteComment = (id: string) => {
    deleteComment(id);
    setComments(getComments(task.id));
  };

  const dateInfo = task.dateEcheance
    ? new Date(task.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const isOverdue = task.dateEcheance && new Date(task.dateEcheance) < new Date() && task.statut !== 'TERMINE';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label={`Détail de la tâche : ${task.titre}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground text-base leading-snug">{task.titre}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`badge-${task.statut === 'A_FAIRE' ? 'todo' : task.statut === 'EN_COURS' ? 'inprogress' : 'done'}`}>
                {STATUS_LABEL[task.statut]}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                task.priorite === 'HAUTE' ? 'bg-destructive/10 text-destructive' :
                task.priorite === 'MOYENNE' ? 'bg-status-todo/10 text-status-todo' :
                'bg-muted text-muted-foreground'
              }`}>
                <Flag className="inline w-3 h-3 mr-1" />
                {PRIORITY_LABEL[task.priorite]}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 shrink-0" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meta */}
        <div className="px-5 py-3 border-b border-border shrink-0 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>
              {task.assigneA
                ? <><span className="font-medium text-foreground">{task.assigneA.prenom} {task.assigneA.nom}</span> <span className="text-muted-foreground/60">({task.assigneA.role})</span></>
                : 'Non assigné'
              }
            </span>
          </div>
          <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{isOverdue && <span className="font-semibold">⚠ En retard · </span>}{dateInfo}</span>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">{task.description}</p>
          )}

          {/* Quick status change */}
          {onStatusChange && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground shrink-0">Statut :</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['A_FAIRE', 'EN_COURS', 'TERMINE'] as TaskStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-all border ${
                      task.statut === s
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => setTab('comments')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
              tab === 'comments'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Commentaires
            {comments.length > 0 && (
              <span className="ml-0.5 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0">{comments.length}</span>
            )}
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
              tab === 'history'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Historique
            {history.length > 0 && (
              <span className="ml-0.5 text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0">{history.length}</span>
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'comments' && (
            <div className="px-5 py-4 space-y-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucun commentaire pour l'instant.</p>
                  <p className="text-xs text-muted-foreground/60">Soyez le premier à commenter !</p>
                </div>
              ) : (
                comments.map(c => (
                  <CommentBubble
                    key={c.id}
                    comment={c}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                ))
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {tab === 'history' && (
            <div className="px-5 py-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <Clock className="w-10 h-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Aucune modification enregistrée.</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {history.map(h => <HistoryItem key={h.id} entry={h} />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment input (only in comments tab) */}
        {tab === 'comments' && (
          <div className="px-5 py-4 border-t border-border shrink-0 bg-card">
            <div className="flex gap-2.5 items-end">
              <Avatar initials={ME.initials} />
              <div className="flex-1 flex gap-2 items-end">
                <textarea
                  className="input-field text-sm resize-none flex-1"
                  rows={2}
                  placeholder="Ajouter un commentaire…"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment();
                  }}
                  aria-label="Nouveau commentaire"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!draft.trim()}
                  className="btn-primary px-3 py-2.5 disabled:opacity-40"
                  aria-label="Envoyer le commentaire"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/50 mt-1.5 ml-9">Ctrl+Entrée pour envoyer</p>
          </div>
        )}
      </aside>
    </>
  );
}
