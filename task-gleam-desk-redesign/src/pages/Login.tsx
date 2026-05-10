import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Circle, Shield, Zap, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => { return () => { clearError(); }; }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format d'email invalide.";
    if (!form.motDePasse) e.motDePasse = 'Le mot de passe est requis.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    const ok = await login({ email: form.email.trim(), motDePasse: form.motDePasse });
    if (ok) navigate('/dashboard');
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    if (error) clearError();
  };

  const features = [
    { icon: Shield, title: 'Sécurisé', desc: 'Authentification JWT et données chiffrées' },
    { icon: Zap, title: 'Rapide', desc: 'Interface réactive et temps réel' },
    { icon: Users, title: 'Collaboratif', desc: "Travaillez en équipe efficacement" },
  ];

  return (
    <div className="min-h-screen flex" aria-label="Page de connexion">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 text-white relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'var(--gradient-primary)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'var(--gradient-primary)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 border border-white" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}>
            <Circle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Digital Solutions</span>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Gérez vos projets<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient-primary)' }}>
                avec précision.
              </span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-md">
              Plateforme collaborative tout-en-un pour planifier, suivre et livrer vos projets avec votre équipe.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--gradient-primary)' }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{title}</p>
                  <p className="text-xs text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 relative z-10">
          {[['3+', 'Projets actifs'], ['5+', 'Membres'], ['99%', 'Uptime']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient-primary)' }}>{val}</p>
              <p className="text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}>
              <Circle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground text-lg">Digital Solutions</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Connexion</h2>
            <p className="text-muted-foreground mt-1.5">Accédez à votre espace de travail</p>
          </div>

          {/* Demo box */}
          <div className="mb-6 p-4 rounded-2xl border flex items-start gap-3"
            style={{ background: 'hsl(var(--inprogress-bg))', borderColor: 'hsl(var(--inprogress) / 0.2)' }}>
            <Circle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--inprogress-text))' }} />
            <div>
              <p className="text-sm font-semibold text-foreground">Compte de démo</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Email : <code className="font-mono bg-card px-1.5 py-0.5 rounded text-xs">demo@digitalsolutions.fr</code>
              </p>
              <p className="text-xs text-muted-foreground">
                Mot de passe : <code className="font-mono bg-card px-1.5 py-0.5 rounded text-xs">demo1234</code>
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="label-field">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input id="email" type="email" className="input-field pl-11"
                  placeholder="vous@example.com" value={form.email}
                  onChange={e => handleChange('email', e.target.value)} autoComplete="email" />
              </div>
              {formErrors.email && <p className="error-text">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="motDePasse" className="label-field">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input id="motDePasse" type={showPassword ? 'text' : 'password'} className="input-field pl-11 pr-11"
                  placeholder="••••••••" value={form.motDePasse}
                  onChange={e => handleChange('motDePasse', e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.motDePasse && <p className="error-text">{formErrors.motDePasse}</p>}
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2" disabled={loading}>
              {loading ? (
                <><span className="loading-spinner w-4 h-4" /> Connexion en cours...</>
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: 'hsl(var(--primary))' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
