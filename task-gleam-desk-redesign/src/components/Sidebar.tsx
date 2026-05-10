import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, User, Users, LogOut,
  ChevronLeft, ChevronRight, Circle, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projets' },
  { to: '/members', icon: Users, label: 'Membres' },
  { to: '/profile', icon: User, label: 'Mon Profil' },
];

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(d => !d);
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user ? `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase() : '?';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={onToggle} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}`}
        style={{ background: 'var(--gradient-hero)', borderRight: '1px solid hsl(var(--sidebar-border))' }}
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 ${!isOpen && 'justify-center'}`}
          style={{ borderBottom: '1px solid hsl(var(--sidebar-border))' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}>
            <Circle className="w-4 h-4 text-white" />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Digital Solutions</p>
              <p className="text-xs truncate" style={{ color: 'hsl(var(--sidebar-fg))' }}>Gestion Projets</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1" role="navigation">
          {isOpen && (
            <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: 'hsl(var(--sidebar-fg))' }}>
              Navigation
            </p>
          )}
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link key={to} to={to}
                className={`sidebar-item ${active ? 'active' : ''} ${!isOpen ? 'justify-center px-2' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 space-y-1" style={{ borderTop: '1px solid hsl(var(--sidebar-border))' }}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className={`sidebar-item w-full text-left ${!isOpen ? 'justify-center px-2' : ''}`}
            aria-label="Basculer mode sombre"
          >
            {dark ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            {isOpen && <span>{dark ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>

          {/* User info */}
          {isOpen && user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl mt-1"
              style={{ background: 'hsl(var(--sidebar-hover-bg))' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: avatarGradient(user.id ?? '0') }}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user.prenom} {user.nom}</p>
                <p className="text-xs truncate" style={{ color: 'hsl(var(--sidebar-fg))' }}>{user.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`sidebar-item w-full text-left hover:text-red-400 ${!isOpen ? 'justify-center px-2' : ''}`}
            aria-label="Se déconnecter"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isOpen && <span>Déconnexion</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-20 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}
          aria-label={isOpen ? 'Réduire' : 'Ouvrir'}
        >
          {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
