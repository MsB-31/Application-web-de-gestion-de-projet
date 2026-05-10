import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import type { CreateTaskPayload, User } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<unknown>;
  projectId: string;
  membres?: User[];
  loading?: boolean;
}

const CreateTaskModal = ({ isOpen, onClose, onSubmit, projectId, membres = [], loading }: CreateTaskModalProps) => {
  const [form, setForm] = useState<CreateTaskPayload>({
    titre: '',
    description: '',
    priorite: 'MOYENNE',
    projetId: projectId,
    dateEcheance: '',
    assigneAId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.titre.trim()) e.titre = 'Le titre est requis.';
    if (form.titre.length > 150) e.titre = 'Le titre ne doit pas dépasser 150 caractères.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await onSubmit({ ...form, projetId: projectId });
    if (result) {
      setForm({ titre: '', description: '', priorite: 'MOYENNE', projetId: projectId, dateEcheance: '', assigneAId: '' });
      onClose();
    }
  };

  const handleChange = (field: keyof CreateTaskPayload, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-lg animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="task-modal-title" className="text-lg font-bold text-foreground">Nouvelle Tâche</h2>
          <button onClick={onClose} className="btn-ghost p-2" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="titre" className="label-field">Titre <span className="text-destructive">*</span></label>
            <input
              id="titre"
              type="text"
              className="input-field"
              placeholder="Ex: Concevoir la maquette"
              value={form.titre}
              onChange={e => handleChange('titre', e.target.value)}
              aria-describedby={errors.titre ? 'titre-error' : undefined}
              maxLength={150}
            />
            {errors.titre && <p id="titre-error" className="error-text">{errors.titre}</p>}
          </div>

          <div>
            <label htmlFor="task-desc" className="label-field">Description</label>
            <textarea
              id="task-desc"
              className="input-field resize-none"
              rows={2}
              placeholder="Détails de la tâche..."
              value={form.description ?? ''}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priorite" className="label-field">Priorité</label>
              <select
                id="priorite"
                className="input-field"
                value={form.priorite}
                onChange={e => handleChange('priorite', e.target.value)}
              >
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
              </select>
            </div>

            <div>
              <label htmlFor="assigneAId" className="label-field">Assigné à</label>
              <select
                id="assigneAId"
                className="input-field"
                value={form.assigneAId ?? ''}
                onChange={e => handleChange('assigneAId', e.target.value)}
              >
                <option value="">— Non assigné —</option>
                {membres.map(m => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dateEcheance" className="label-field">
              <Calendar className="inline w-3.5 h-3.5 mr-1" />
              Date d'échéance
            </label>
            <input
              id="dateEcheance"
              type="date"
              className="input-field"
              value={form.dateEcheance ?? ''}
              onChange={e => handleChange('dateEcheance', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-4 h-4" />
                  Création...
                </span>
              ) : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
