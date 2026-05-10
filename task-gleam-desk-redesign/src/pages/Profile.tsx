import { useState } from 'react';
import { User, Mail, Shield, Edit2, Save, X, Camera, Key, LogOut } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const Profile = () => {
  const { user, updateProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<'info' | 'security'>('info');
  const [form, setForm] = useState({ nom: user?.nom ?? '', prenom: user?.prenom ?? '', email: user?.email ?? '', role: user?.role ?? '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis.';
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.email.trim()) e.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide.';
    return e;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await updateProfile(form);
    setEditing(false);
  };

  const initials = user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() : '?';

  return (
    <AppLayout title="Mon Profil">
      <div className="max-w-3xl mx-auto">

        {/* Profile hero */}
        <div className="card-elevated overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-28 relative" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: 'var(--gradient-primary)' }} />
            </div>
          </div>
          {/* Avatar + info */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap items-end gap-4 -mt-12 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-bold text-white border-4 border-card shadow-lg"
                  style={{ background: avatarGradient(user?.id ?? '0') }}>
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: 'var(--gradient-primary)' }} title="Changer la photo">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h2 className="text-xl font-bold text-foreground">{user?.prenom} {user?.nom}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'hsl(var(--inprogress-bg))', color: 'hsl(var(--inprogress-text))' }}>
                    <Shield className="w-3 h-3" />{user?.role ?? 'Utilisateur'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pb-1">
                {!editing && (
                  <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
                    <Edit2 className="w-4 h-4" /> Modifier
                  </button>
                )}
                <button onClick={() => { logout(); navigate('/login'); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>

            {/* Account info row */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <span>Membre depuis : <strong className="text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </strong></span>
              <span>ID : <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs text-foreground">{user?.id ?? '—'}</code></span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-muted w-fit">
          {[
            { key: 'info', label: 'Informations', icon: User },
            { key: 'security', label: 'Sécurité', icon: Key },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'info' && (
          <div className="card-elevated p-6 animate-fade-in">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Prénom</label>
                    <input type="text" className="input-field" value={form.prenom}
                      onChange={e => { setForm(p => ({ ...p, prenom: e.target.value })); setErrors(p => ({ ...p, prenom: '' })); }} />
                    {errors.prenom && <p className="error-text">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="label-field">Nom</label>
                    <input type="text" className="input-field" value={form.nom}
                      onChange={e => { setForm(p => ({ ...p, nom: e.target.value })); setErrors(p => ({ ...p, nom: '' })); }} />
                    {errors.nom && <p className="error-text">{errors.nom}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-field">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" className="input-field pl-11" value={form.email}
                      onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }} />
                  </div>
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div>
                  <label className="label-field">Rôle</label>
                  <input type="text" className="input-field" value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2">
                    <X className="w-4 h-4" /> Annuler
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                    {loading ? <span className="loading-spinner w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: User, label: 'Prénom', value: user?.prenom },
                  { icon: User, label: 'Nom', value: user?.nom },
                  { icon: Mail, label: 'Email', value: user?.email },
                  { icon: Shield, label: 'Rôle', value: user?.role },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl p-4 bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1.5">
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{value ?? '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'security' && (
          <div className="card-elevated p-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Changer le mot de passe
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label-field">Mot de passe actuel</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="label-field">Nouveau mot de passe</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="label-field">Confirmer le nouveau mot de passe</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Mettre à jour le mot de passe
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
