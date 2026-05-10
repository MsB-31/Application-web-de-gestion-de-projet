import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Pause, CheckCircle, Zap, Trash2, Pencil } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onEdit?: (project: Project) => void;
}

const statusConfig = {
  ACTIF: { label: 'Actif', icon: Zap, bg: 'hsl(var(--inprogress-bg))', color: 'hsl(var(--inprogress-text))' },
  EN_PAUSE: { label: 'En pause', icon: Pause, bg: 'hsl(var(--todo-bg))', color: 'hsl(var(--todo-text))' },
  TERMINE: { label: 'Terminé', icon: CheckCircle, bg: 'hsl(var(--done-bg))', color: 'hsl(var(--done-text))' },
};

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const ProjectCard = ({ project, onDelete, onEdit }: ProjectCardProps) => {
  const status = statusConfig[project.statut] ?? statusConfig.ACTIF;
  const StatusIcon = status.icon;
  const taskCount = project.taches?.length ?? 0;
  const doneCount = project.taches?.filter(t => t.statut === 'TERMINE').length ?? 0;
  const progress = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;
  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—';

  const membres = project.membres ?? [];

  return (
    <article className="card-elevated card-hover group flex flex-col h-full overflow-hidden">
      {/* Gradient top bar */}
      <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={`/projects/${project.id}`}
              className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
              {project.nom}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: status.bg, color: status.color }}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>

        {/* Progress */}
        {taskCount > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{doneCount}/{taskCount} tâches</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: 'var(--gradient-primary)' }}
                role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>
        )}

        {/* Members avatars + date */}
        <div className="flex items-center justify-between mt-auto">
          {/* Avatar overlap */}
          <div className="flex items-center">
            {membres.slice(0, 4).map((m, i) => (
              <div key={m.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-card"
                style={{ background: avatarGradient(m.id), marginLeft: i > 0 ? '-8px' : '0', zIndex: membres.length - i }}
                title={`${m.prenom} ${m.nom}`}>
                {`${m.prenom?.[0] ?? ''}${m.nom?.[0] ?? ''}`.toUpperCase()}
              </div>
            ))}
            {membres.length > 4 && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-muted text-muted-foreground border-2 border-card"
                style={{ marginLeft: '-8px' }}>
                +{membres.length - 4}
              </div>
            )}
            {membres.length === 0 && (
              <span className="text-xs text-muted-foreground">Aucun membre</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(project.dateDebut)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-1">
            {onEdit && (
              <button onClick={() => onEdit(project)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Modifier
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(project.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            )}
          </div>
          <Link to={`/projects/${project.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group">
            Ouvrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
