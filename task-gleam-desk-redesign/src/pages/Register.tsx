import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => { return () => { clearError(); }; }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis.';
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.email.trim()) e.email = 'L\'email est requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format d\'email invalide.';
    if (!form.motDePasse) e.motDePasse = 'Le mot de passe est requis.';
    else if (form.motDePasse.length < 8) e.motDePasse = 'Au moins 8 caractères requis.';
    if (form.motDePasse !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const ok = await register({
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      email: form.email.trim(),
      motDePasse: form.motDePasse,
    });
    if (ok) navigate('/dashboard');
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    if (error) clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background" aria-label="Page d'inscription">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-lg">Digital Solutions</span>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Créer un compte</h2>
          <p className="text-muted-foreground mt-1">Rejoignez votre équipe dès aujourd'hui</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prenom" className="label-field">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="prenom"
                  type="text"
                  className="input-field pl-10"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={e => handleChange('prenom', e.target.value)}
                  aria-describedby={formErrors.prenom ? 'prenom-error' : undefined}
                  autoComplete="given-name"
                />
              </div>
              {formErrors.prenom && <p id="prenom-error" className="error-text">{formErrors.prenom}</p>}
            </div>
            <div>
              <label htmlFor="nom" className="label-field">Nom</label>
              <input
                id="nom"
                type="text"
                className="input-field"
                placeholder="Dupont"
                value={form.nom}
                onChange={e => handleChange('nom', e.target.value)}
                aria-describedby={formErrors.nom ? 'nom-error' : undefined}
                autoComplete="family-name"
              />
              {formErrors.nom && <p id="nom-error" className="error-text">{formErrors.nom}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="label-field">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="reg-email"
                type="email"
                className="input-field pl-10"
                placeholder="vous@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                aria-describedby={formErrors.email ? 'reg-email-error' : undefined}
                autoComplete="email"
              />
            </div>
            {formErrors.email && <p id="reg-email-error" className="error-text">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="reg-pwd" className="label-field">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="reg-pwd"
                type={showPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-10"
                placeholder="Min. 8 caractères"
                value={form.motDePasse}
                onChange={e => handleChange('motDePasse', e.target.value)}
                aria-describedby={formErrors.motDePasse ? 'reg-pwd-error' : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formErrors.motDePasse && <p id="reg-pwd-error" className="error-text">{formErrors.motDePasse}</p>}
          </div>

          <div>
            <label htmlFor="confirm-pwd" className="label-field">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="confirm-pwd"
                type={showPassword ? 'text' : 'password'}
                className="input-field pl-10"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                aria-describedby={formErrors.confirmPassword ? 'confirm-error' : undefined}
                autoComplete="new-password"
              />
            </div>
            {formErrors.confirmPassword && <p id="confirm-error" className="error-text">{formErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading-spinner w-4 h-4" />
                Création en cours...
              </span>
            ) : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
