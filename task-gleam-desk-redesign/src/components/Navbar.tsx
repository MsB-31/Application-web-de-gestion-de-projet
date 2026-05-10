import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, FolderKanban, CheckSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROJECTS, MOCK_TASKS } from '../data/mockData';

interface NavbarProps { onMenuToggle: () => void; title?: string; }

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const MOCK_NOTIFS = [
  { id: '1', text: 'Sophie a terminé "Maquettes Figma"', time: 'Il y a 5 min', read: false, type: 'task' },
  { id: '2', text: 'Nouveau projet "App Mobile RH" créé', time: 'Il y a 1h', read: false, type: 'project' },
  { id: '3', text: 'Lucas vous a assigné une tâche', time: 'Il y a 2h', read: true, type: 'task' },
  { id: '4', text: 'Réunion de sprint demain à 9h', time: 'Hier', read: true, type: 'info' },
];

const Navbar = ({ onMenuToggle, title }: NavbarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() : '?';
  const unreadCount = notifs.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search results
  const q = search.toLowerCase().trim();
  const projectResults = q ? MOCK_PROJECTS.filter(p =>
    p.nom.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  ).slice(0, 3) : [];
  const taskResults = q ? MOCK_TASKS.filter(t =>
    t.titre.toLowerCase().includes(q)
  ).slice(0, 3) : [];
  const hasResults = projectResults.length > 0 || taskResults.length > 0;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 md:px-6 bg-card border-b border-border"
      style={{ boxShadow: 'var(--shadow-sm)' }} role="banner">

      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="btn-icon lg:hidden" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>
        {title && <h1 className="text-base font-semibold text-foreground hidden md:block">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">

        {/* Global Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <button
            onClick={() => setShowSearch(v => !v)}
            className="btn-icon w-auto px-3 gap-2 flex items-center text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl"
            style={{ height: '36px', minWidth: '200px' }}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Recherche globale...</span>
            <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </button>

          {showSearch && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in-up">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Projets, tâches, membres..."
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-muted-foreground" /></button>}
              </div>
              {search && !hasResults && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun résultat pour "{search}"</div>
              )}
              {hasResults && (
                <div className="max-h-80 overflow-y-auto p-2">
                  {projectResults.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Projets</p>
                      {projectResults.map(p => (
                        <button key={p.id} onClick={() => { navigate(`/projects/${p.id}`); setShowSearch(false); setSearch(''); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'hsl(var(--inprogress-bg))' }}>
                            <FolderKanban className="w-4 h-4" style={{ color: 'hsl(var(--inprogress-text))' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.nom}</p>
                            <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                  {taskResults.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Tâches</p>
                      {taskResults.map(t => (
                        <button key={t.id} onClick={() => { setShowSearch(false); setSearch(''); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'hsl(var(--todo-bg))' }}>
                            <CheckSquare className="w-4 h-4" style={{ color: 'hsl(var(--todo-text))' }} />
                          </div>
                          <p className="text-sm font-medium text-foreground truncate flex-1">{t.titre}</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotifs(v => !v)}
            className="btn-icon relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse-glow"
                style={{ background: 'var(--gradient-primary)', fontSize: '10px' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-in-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(n => (
                  <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted border-b border-border last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!n.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: avatarGradient(user?.id ?? '0') }}>
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
