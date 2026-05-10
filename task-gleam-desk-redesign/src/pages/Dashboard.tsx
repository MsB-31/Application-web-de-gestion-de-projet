import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckCircle2, Clock, PauseCircle, TrendingUp, Users, ArrowRight, CalendarDays, AlertCircle, Circle, Target } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { MOCK_PROJECTS, MOCK_TASKS } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#3b82f6,#6366f1)',
];
const avatarGradient = (id: string) => gradients[(id?.charCodeAt(id.length - 1) ?? 0) % gradients.length];

const Dashboard = () => {
  const { user } = useAuth();
  const totalProjects = MOCK_PROJECTS.length;
  const activeProjects = MOCK_PROJECTS.filter(p => p.statut === 'ACTIF').length;
  const pausedProjects = MOCK_PROJECTS.filter(p => p.statut === 'EN_PAUSE').length;
  const doneProjects = MOCK_PROJECTS.filter(p => p.statut === 'TERMINE').length;
  const totalTasks = MOCK_TASKS.length;
  const todoTasks = MOCK_TASKS.filter(t => t.statut === 'A_FAIRE').length;
  const inProgressTasks = MOCK_TASKS.filter(t => t.statut === 'EN_COURS').length;
  const doneTasks = MOCK_TASKS.filter(t => t.statut === 'TERMINE').length;

  const barData = [
    { name: 'À faire', value: todoTasks, color: 'hsl(var(--todo))' },
    { name: 'En cours', value: inProgressTasks, color: 'hsl(var(--inprogress))' },
    { name: 'Terminées', value: doneTasks, color: 'hsl(var(--done))' },
  ];
  const pieData = [
    { name: 'Actifs', value: activeProjects, fill: 'hsl(var(--inprogress))' },
    { name: 'En pause', value: pausedProjects, fill: 'hsl(var(--todo))' },
    { name: 'Terminés', value: doneProjects, fill: 'hsl(var(--done))' },
  ];

  const recentProjects = [...MOCK_PROJECTS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const urgentTasks = MOCK_TASKS
    .filter(t => t.statut !== 'TERMINE' && t.dateEcheance)
    .sort((a, b) => new Date(a.dateEcheance!).getTime() - new Date(b.dateEcheance!).getTime())
    .slice(0, 5);

  const taskStatusColors: Record<string, string> = {
    A_FAIRE: 'badge-todo', EN_COURS: 'badge-inprogress', TERMINE: 'badge-done',
  };
  const taskStatusLabels: Record<string, string> = {
    A_FAIRE: 'À faire', EN_COURS: 'En cours', TERMINE: 'Terminée',
  };

  const statCards = [
    { label: 'Projets actifs', value: activeProjects, icon: TrendingUp, gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', iconBg: 'hsl(var(--inprogress-bg))', iconColor: 'hsl(var(--inprogress-text))' },
    { label: 'En pause', value: pausedProjects, icon: PauseCircle, gradient: 'linear-gradient(135deg,#f59e0b,#f97316)', iconBg: 'hsl(var(--todo-bg))', iconColor: 'hsl(var(--todo-text))' },
    { label: 'Terminés', value: doneProjects, icon: CheckCircle2, gradient: 'linear-gradient(135deg,#10b981,#059669)', iconBg: 'hsl(var(--done-bg))', iconColor: 'hsl(var(--done-text))' },
    { label: 'Total tâches', value: totalTasks, icon: Target, gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)', iconBg: 'hsl(243 75% 95%)', iconColor: 'hsl(243 75% 45%)' },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl p-6 text-white"
          style={{ background: 'var(--gradient-hero)' }}>
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style={{ background: 'var(--gradient-primary)' }} />
          <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'var(--gradient-primary)' }} />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Circle className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-white/60">Tableau de bord</span>
              </div>
              <h2 className="text-2xl font-bold">Bonjour, {user?.prenom} 👋</h2>
              <p className="text-white/60 text-sm mt-1">Voici un aperçu de l'activité de Digital Solutions</p>
            </div>
            <Link to="/projects" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <FolderKanban className="w-4 h-4" /> Voir les projets
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="card-elevated p-5 flex items-center gap-4 card-hover">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: iconBg }}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="card-elevated p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Répartition des tâches</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{totalTasks} tâches au total</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-foreground mb-1">Projets</h3>
            <p className="text-xs text-muted-foreground mb-4">{totalProjects} projets</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent tasks */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Tâches à venir</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Prochaines échéances</p>
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--todo-bg))' }}>
                <AlertCircle className="w-4 h-4" style={{ color: 'hsl(var(--todo-text))' }} />
              </div>
            </div>
            <div className="space-y-2">
              {urgentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune tâche urgente 🎉</p>
              ) : urgentTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.titre}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dateEcheance!).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${taskStatusColors[task.statut]}`} style={{
                    background: task.statut === 'A_FAIRE' ? 'hsl(var(--todo-bg))' : task.statut === 'EN_COURS' ? 'hsl(var(--inprogress-bg))' : 'hsl(var(--done-bg))',
                    color: task.statut === 'A_FAIRE' ? 'hsl(var(--todo-text))' : task.statut === 'EN_COURS' ? 'hsl(var(--inprogress-text))' : 'hsl(var(--done-text))',
                    padding: '2px 10px', borderRadius: '99px'
                  }}>
                    {taskStatusLabels[task.statut]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent projects */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Projets récents</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Derniers mis à jour</p>
              </div>
              <Link to="/projects" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Voir tout <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentProjects.map(project => {
                const members = project.membres ?? [];
                return (
                  <Link key={project.id} to={`/projects/${project.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'hsl(var(--inprogress-bg))' }}>
                      <FolderKanban className="w-4 h-4" style={{ color: 'hsl(var(--inprogress-text))' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {project.nom}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {/* Avatar overlap mini */}
                        <div className="flex items-center">
                          {members.slice(0, 3).map((m, i) => (
                            <div key={m.id} className="w-4 h-4 rounded-full text-white flex items-center justify-center border border-card"
                              style={{ fontSize: '8px', fontWeight: 700, background: avatarGradient(m.id), marginLeft: i > 0 ? '-4px' : '0' }}>
                              {`${m.prenom?.[0] ?? ''}`.toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{members.length} membre(s)</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: project.statut === 'ACTIF' ? 'hsl(var(--inprogress-bg))' : project.statut === 'TERMINE' ? 'hsl(var(--done-bg))' : 'hsl(var(--todo-bg))',
                        color: project.statut === 'ACTIF' ? 'hsl(var(--inprogress-text))' : project.statut === 'TERMINE' ? 'hsl(var(--done-text))' : 'hsl(var(--todo-text))',
                      }}>
                      {project.statut === 'ACTIF' ? 'Actif' : project.statut === 'TERMINE' ? 'Terminé' : 'En pause'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
