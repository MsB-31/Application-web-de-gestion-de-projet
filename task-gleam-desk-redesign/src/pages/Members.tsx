import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, X, Save, Mail, Briefcase, FolderKanban, AlertTriangle } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../hooks/useAuth';
import { getMembers, addMember, updateMember, deleteMember } from '../store/membresStore';
import { MOCK_PROJECTS } from '../data/mockData';
import type { User } from '../types';

// ------ Types ------
interface MemberForm { prenom: string; nom: string; email: string; role: string; }
const EMPTY_FORM: MemberForm = { prenom: '', nom: '', email: '', role: '' };

// ------ Helpers ------
const initials = (m: User) => `${m.prenom[0] ?? ''}${m.nom[0] ?? ''}`.toUpperCase();

const ROLE_SUGGESTIONS = ['Développeur', 'Designer', 'Chef de projet', 'DevOps', 'QA', 'Product Owner', 'Scrum Master'];

const gradients = [
  'linear-gradient(135deg,hsl(213,94%,55%),hsl(240,80%,60%))',
  'linear-gradient(135deg,hsl(142,71%,45%),hsl(170,80%,40%))',
  'linear-gradient(135deg,hsl(38,92%,50%),hsl(20,90%,55%))',
  'linear-gradient(135deg,hsl(280,80%,60%),hsl(320,70%,55%))',
  'linear-gradient(135deg,hsl(0,80%,55%),hsl(30,90%,55%))',
];
const avatarGradient = (id: string) => gradients[id.charCodeAt(id.length - 1) % gradients.length];

function validate(form: MemberForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!form.prenom.trim()) e.prenom = 'Le prénom est requis.';
  if (!form.nom.trim()) e.nom = 'Le nom est requis.';
  if (!form.email.trim()) e.email = 'L\'email est requis.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide.';
  if (!form.role.trim()) e.role = 'Le rôle est requis.';
  return e;
}

// ------ Modal Component ------
interface MemberModalProps {
  isOpen: boolean;
  editTarget: User | null;
  onClose: () => void;
  onSaved: () => void;
  existingEmails: string[];
}

const MemberModal = ({ isOpen, editTarget, onClose, onSaved, existingEmails }: MemberModalProps) => {
  const [form, setForm] = useState<MemberForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(editTarget
        ? { prenom: editTarget.prenom, nom: editTarget.nom, email: editTarget.email, role: editTarget.role }
        : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, editTarget]);

  if (!isOpen) return null;

  const set = (key: keyof MemberForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    // Check email uniqueness
    const isDuplicate = existingEmails
      .filter(em => editTarget ? em !== editTarget.email : true)
      .includes(form.email.trim().toLowerCase());
    if (isDuplicate) errs.email = 'Cet email est déjà utilisé.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    if (editTarget) {
      updateMember(editTarget.id, { prenom: form.prenom.trim(), nom: form.nom.trim(), email: form.email.trim(), role: form.role.trim() });
    } else {
      addMember({ prenom: form.prenom.trim(), nom: form.nom.trim(), email: form.email.trim(), role: form.role.trim() });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {editTarget ? 'Modifier le membre' : 'Nouveau membre'}
          </h3>
          <button onClick={onClose} className="btn-icon" aria-label="Fermer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="m-prenom" className="label-field">Prénom *</label>
              <input id="m-prenom" type="text" className="input-field" value={form.prenom} onChange={set('prenom')}
                placeholder="Sophie" maxLength={50} aria-describedby={errors.prenom ? 'm-prenom-err' : undefined} />
              {errors.prenom && <p id="m-prenom-err" className="error-text">{errors.prenom}</p>}
            </div>
            <div>
              <label htmlFor="m-nom" className="label-field">Nom *</label>
              <input id="m-nom" type="text" className="input-field" value={form.nom} onChange={set('nom')}
                placeholder="Martin" maxLength={50} aria-describedby={errors.nom ? 'm-nom-err' : undefined} />
              {errors.nom && <p id="m-nom-err" className="error-text">{errors.nom}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="m-email" className="label-field">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input id="m-email" type="email" className="input-field pl-10" value={form.email} onChange={set('email')}
                placeholder="sophie@ds.com" maxLength={100} aria-describedby={errors.email ? 'm-email-err' : undefined} />
            </div>
            {errors.email && <p id="m-email-err" className="error-text">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="m-role" className="label-field">Rôle / Poste *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="m-role" type="text" list="roles-list" className="input-field pl-10"
                value={form.role} onChange={set('role')}
                placeholder="Développeur, Designer…" maxLength={80}
                aria-describedby={errors.role ? 'm-role-err' : undefined}
              />
              <datalist id="roles-list">
                {ROLE_SUGGESTIONS.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>
            {errors.role && <p id="m-role-err" className="error-text">{errors.role}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <span className="loading-spinner w-4 h-4" /> : <Save className="w-4 h-4" />}
              {editTarget ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ------ Delete Confirm ------
interface DeleteConfirmProps { member: User; onConfirm: () => void; onCancel: () => void; }
const DeleteConfirm = ({ member, onConfirm, onCancel }: DeleteConfirmProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Supprimer le membre</h3>
          <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
        </div>
      </div>
      <p className="text-sm text-foreground mb-5">
        Voulez-vous vraiment supprimer <strong>{member.prenom} {member.nom}</strong> ?
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">Annuler</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ------ Projects Panel ------
interface ProjectsPanelProps { member: User; onClose: () => void; }
const ProjectsPanel = ({ member, onClose }: ProjectsPanelProps) => {
  const memberProjects = MOCK_PROJECTS.filter(p => p.membres?.some(m => m.id === member.id));
  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      <div className="absolute inset-0 -left-full bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: avatarGradient(member.id) }}>
              {initials(member)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{member.prenom} {member.nom}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Fermer"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-primary" />
            Projets associés ({memberProjects.length})
          </h4>
          {memberProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Aucun projet assigné
            </div>
          ) : (
            <div className="space-y-3">
              {memberProjects.map(p => (
                <div key={p.id} className="bg-muted/50 rounded-xl p-3 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground text-sm">{p.nom}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.statut === 'ACTIF' ? 'bg-status-inprogress/10 text-status-inprogress' :
                      p.statut === 'TERMINE' ? 'bg-status-done/10 text-status-done' :
                      'bg-status-todo/10 text-status-todo'
                    }`}>
                      {p.statut === 'ACTIF' ? 'Actif' : p.statut === 'TERMINE' ? 'Terminé' : 'En pause'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.membres?.length ?? 0} membres</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------ Main Page ------
const Members = () => {
  const { user } = useAuth();
  const isChef = user?.role?.toLowerCase().includes('chef') || user?.role?.toLowerCase().includes('admin');

  const [members, setMembers] = useState<User[]>(() => getMembers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [projectsTarget, setProjectsTarget] = useState<User | null>(null);

  const refresh = () => setMembers(getMembers());

  // Roles uniques extraits dynamiquement
  const uniqueRoles = Array.from(new Set(members.map(m => m.role).filter(Boolean))).sort();

  const filtered = members.filter(m => {
    const matchSearch = `${m.prenom} ${m.nom} ${m.email} ${m.role}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const existingEmails = members.map(m => m.email.toLowerCase());

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMember(deleteTarget.id);
    setDeleteTarget(null);
    refresh();
  };

  const openEdit = (m: User) => {
    setEditTarget(m);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditTarget(null);
    setShowModal(true);
  };

  return (
    <AppLayout title="Membres">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="page-header mb-6">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Membres de l'équipe
            </h2>
            <p className="text-muted-foreground text-sm mt-1">{members.length} membre{members.length > 1 ? 's' : ''} enregistré{members.length > 1 ? 's' : ''}</p>
          </div>
          {isChef && (
            <button onClick={openCreate} className="btn-primary flex items-center gap-2" aria-label="Ajouter un membre">
              <Plus className="w-4 h-4" />
              Nouveau membre
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un membre…" className="input-field pl-10"
            aria-label="Rechercher un membre"
          />
        </div>

        {/* Role filter pills */}
        {uniqueRoles.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                roleFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={roleFilter === 'ALL'}
            >
              Tous
            </button>
            {uniqueRoles.map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(prev => prev === role ? 'ALL' : role)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  roleFilter === role
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={roleFilter === role}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Not chef notice */}
        {!isChef && (
          <div className="mb-4 p-3 rounded-lg bg-muted/60 border border-border text-sm text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Seul un chef de projet peut créer, modifier ou supprimer des membres.
          </div>
        )}

        {/* Members grid */}
        {filtered.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              {search || roleFilter !== 'ALL' ? 'Aucun membre ne correspond à votre filtre.' : 'Aucun membre enregistré.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => {
              const projectCount = MOCK_PROJECTS.filter(p => p.membres?.some(mb => mb.id === m.id)).length;
              return (
                <div key={m.id} className="card-elevated p-4 flex flex-col gap-3 group hover:border-primary/30 transition-all">
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: avatarGradient(m.id) }}
                      aria-hidden="true"
                    >
                      {initials(m)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm truncate">{m.prenom} {m.nom}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">{m.role}</span>
                  </div>

                  {/* Project count */}
                  <button
                    onClick={() => setProjectsTarget(m)}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit"
                    aria-label={`Voir les projets de ${m.prenom} ${m.nom}`}
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    {projectCount} projet{projectCount > 1 ? 's' : ''}
                  </button>

                  {/* Actions (chef only) */}
                  {isChef && (
                    <div className="flex gap-2 pt-1 border-t border-border">
                      <button
                        onClick={() => openEdit(m)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        aria-label={`Modifier ${m.prenom} ${m.nom}`}
                      >
                        <Pencil className="w-3.5 h-3.5" /> Modifier
                      </button>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-muted hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        aria-label={`Supprimer ${m.prenom} ${m.nom}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={showModal}
        editTarget={editTarget}
        onClose={() => setShowModal(false)}
        onSaved={() => { setShowModal(false); refresh(); }}
        existingEmails={existingEmails}
      />

      {deleteTarget && (
        <DeleteConfirm
          member={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {projectsTarget && (
        <ProjectsPanel
          member={projectsTarget}
          onClose={() => setProjectsTarget(null)}
        />
      )}
    </AppLayout>
  );
};

export default Members;
