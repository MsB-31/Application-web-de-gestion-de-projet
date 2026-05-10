import { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import type { CreateProjectPayload } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProjectPayload) => Promise<unknown>;
  loading?: boolean;
}

const CreateProjectModal = ({ isOpen, onClose, onSubmit, loading }: CreateProjectModalProps) => {
  const [form, setForm] = useState<CreateProjectPayload>({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    membresIds: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (form.nom.length > 100) e.nom = 'Le nom ne doit pas dépasser 100 caractères.';
    if (!form.description.trim()) e.description = 'La description est requise.';
    if (!form.dateDebut) e.dateDebut = 'La date de début est requise.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await onSubmit(form);
    if (result) {
      setForm({ nom: '', description: '', dateDebut: '', dateFin: '' });
      onClose();
    }
  };

  const handleChange = (field: keyof CreateProjectPayload, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="modal-title" className="text-lg font-bold text-foreground">Nouveau Projet</h2>
          <button onClick={onClose} className="btn-ghost p-2" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="nom" className="label-field">Nom du projet <span className="text-destructive">*</span></label>
            <input
              id="nom"
              type="text"
              className="input-field"
              placeholder="Ex: Refonte Site Web"
              value={form.nom}
              onChange={e => handleChange('nom', e.target.value)}
              aria-describedby={errors.nom ? 'nom-error' : undefined}
              maxLength={100}
            />
            {errors.nom && <p id="nom-error" className="error-text">{errors.nom}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label-field">Description <span className="text-destructive">*</span></label>
            <textarea
              id="description"
              className="input-field resize-none"
              rows={3}
              placeholder="Décrivez les objectifs du projet..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              aria-describedby={errors.description ? 'desc-error' : undefined}
            />
            {errors.description && <p id="desc-error" className="error-text">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateDebut" className="label-field">
                <Calendar className="inline w-3.5 h-3.5 mr-1" />
                Début <span className="text-destructive">*</span>
              </label>
              <input
                id="dateDebut"
                type="date"
                className="input-field"
                value={form.dateDebut}
                onChange={e => handleChange('dateDebut', e.target.value)}
                aria-describedby={errors.dateDebut ? 'date-error' : undefined}
              />
              {errors.dateDebut && <p id="date-error" className="error-text">{errors.dateDebut}</p>}
            </div>
            <div>
              <label htmlFor="dateFin" className="label-field">
                <Calendar className="inline w-3.5 h-3.5 mr-1" />
                Fin (optionnel)
              </label>
              <input
                id="dateFin"
                type="date"
                className="input-field"
                value={form.dateFin ?? ''}
                onChange={e => handleChange('dateFin', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-4 h-4" />
                  Création...
                </span>
              ) : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
