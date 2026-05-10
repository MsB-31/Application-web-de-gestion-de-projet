import { Calendar, User, GripVertical, MessageSquare, Flag } from 'lucide-react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  onStatusChange?: (id: string, status: Task['statut']) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  HAUTE: { label: 'Haute', cls: 'prio-high', color: 'hsl(var(--prio-high))' },
  MOYENNE: { label: 'Moyenne', cls: 'prio-medium', color: 'hsl(var(--prio-medium))' },
  BASSE: { label: 'Basse', cls: 'prio-low', color: 'hsl(var(--prio-low))' },
};

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const TaskCard = ({ task, onClick, onDelete, isDragging }: TaskCardProps) => {
  const prio = priorityConfig[task.priorite ?? 'MOYENNE'];
  const isOverdue = task.dateEcheance && task.statut !== 'TERMINE'
    && new Date(task.dateEcheance) < new Date();

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-4 cursor-pointer transition-all group
        ${isDragging ? 'shadow-xl scale-105 rotate-1' : 'hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5'}`}
      onClick={() => onClick?.(task)}
    >
      {/* Top row */}
      <div className="flex items-start gap-2 mb-3">
        <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors cursor-grab" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{task.titre}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{task.description}</p>
          )}
        </div>
      </div>

      {/* Priority + badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className={prio.cls} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Flag className="w-2.5 h-2.5" /> {prio.label}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        {task.assigneA ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white border border-card"
              style={{ fontSize: '8px', fontWeight: 700, background: avatarGradient(task.assigneA.id) }}>
              {`${task.assigneA.prenom?.[0] ?? ''}${task.assigneA.nom?.[0] ?? ''}`.toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[90px]">
              {task.assigneA.prenom} {task.assigneA.nom}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground/50">
            <User className="w-3 h-3" /> Non assigné
          </div>
        )}

        {task.dateEcheance && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dateEcheance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
