import { useState, useEffect } from 'react';
import { Search, Plus, SortAsc, SortDesc, ChevronLeft, ChevronRight, FolderKanban, LayoutGrid, List } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { useProjects } from '../hooks/useProjects';
import { MOCK_PROJECTS } from '../data/mockData';

const ITEMS_PER_PAGE = 9;

const Projects = () => {
  const { createProject } = useProjects();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [localProjects, setLocalProjects] = useState(MOCK_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleDelete = (id: string) => setLocalProjects(prev => prev.filter(p => p.id !== id));

  const handleCreate = async (payload: Parameters<typeof createProject>[0]) => {
    const newProject = {
      id: Date.now().toString(), ...payload, statut: 'ACTIF' as const,
      membres: [], taches: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setLocalProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const filtered = localProjects
    .filter(p => {
      const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || p.statut === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? diff : -diff;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [search, sortOrder, statusFilter]);

  const statCounts = {
    total: localProjects.length,
    actif: localProjects.filter(p => p.statut === 'ACTIF').length,
    pause: localProjects.filter(p => p.statut === 'EN_PAUSE').length,
    termine: localProjects.filter(p => p.statut === 'TERMINE').length,
  };

  const statusFilters = [
    { key: 'ALL', label: 'Tous', count: statCounts.total },
    { key: 'ACTIF', label: 'Actifs', count: statCounts.actif },
    { key: 'EN_PAUSE', label: 'En pause', count: statCounts.pause },
    { key: 'TERMINE', label: 'Terminés', count: statCounts.termine },
  ];

  return (
    <AppLayout title="Projets">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="page-header flex-wrap gap-4">
          <div>
            <h2 className="section-title">Mes Projets</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{statCounts.total} projets au total</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau projet
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {statusFilters.map(f => (
            <button key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === f.key
                  ? 'text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              style={statusFilter === f.key ? { background: 'var(--gradient-primary)' } : {}}>
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="search" className="input-field pl-10 py-2" placeholder="Rechercher..."
                value={search} onChange={e => setSearch(e.target.value)} style={{ width: '220px' }} />
            </div>
            <button onClick={() => setSortOrder(v => v === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary flex items-center gap-2 py-2">
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="hidden sm:inline text-sm">{sortOrder === 'asc' ? 'Plus ancien' : 'Plus récent'}</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="card-elevated flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'hsl(var(--inprogress-bg))' }}>
              <FolderKanban className="w-7 h-7" style={{ color: 'hsl(var(--inprogress-text))' }} />
            </div>
            <p className="font-semibold text-foreground mb-1">
              {search ? 'Aucun résultat' : 'Aucun projet'}
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              {search ? `Aucun projet ne correspond à "${search}"` : 'Créez votre premier projet pour commencer.'}
            </p>
            {!search && (
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Créer mon premier projet
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map(project => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-secondary px-3 py-2 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    p === page ? 'text-white shadow-sm' : 'btn-ghost'
                  }`}
                  style={p === page ? { background: 'var(--gradient-primary)' } : {}}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="btn-secondary px-3 py-2 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>

      <CreateProjectModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
    </AppLayout>
  );
};

export default Projects;
