import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Calendar, Zap, BarChart2, Filter, Download } from 'lucide-react';
import { exportProjectPDF } from '../utils/exportProjectPDF';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AppLayout from '../components/AppLayout';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailPanel from '../components/TaskDetailPanel';
import { MOCK_PROJECTS, MOCK_TASKS } from '../data/mockData';
import { getComments } from '../store/collaborationStore';
import { getMembers } from '../store/membresStore';
import type { Task, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLUMNS: { id: TaskStatus; label: string; colorClass: string; headerClass: string }[] = [
  { id: 'A_FAIRE', label: 'À faire', colorClass: 'badge-todo', headerClass: 'border-t-status-todo' },
  { id: 'EN_COURS', label: 'En cours', colorClass: 'badge-inprogress', headerClass: 'border-t-status-inprogress' },
  { id: 'TERMINE', label: 'Terminé', colorClass: 'badge-done', headerClass: 'border-t-status-done' },
];

const CHART_COLORS = [
  'hsl(38,92%,50%)',
  'hsl(213,94%,55%)',
  'hsl(142,71%,45%)',
];

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = MOCK_PROJECTS.find(p => p.id === id) ?? MOCK_PROJECTS[0];
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS.filter(t => t.projetId === (id ?? 'p1')));
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [showChart, setShowChart] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasksByStatus = {
    A_FAIRE: tasks.filter(t => t.statut === 'A_FAIRE'),
    EN_COURS: tasks.filter(t => t.statut === 'EN_COURS'),
    TERMINE: tasks.filter(t => t.statut === 'TERMINE'),
  };

  const chartData = [
    { name: 'À faire', count: tasksByStatus.A_FAIRE.length },
    { name: 'En cours', count: tasksByStatus.EN_COURS.length },
    { name: 'Terminé', count: tasksByStatus.TERMINE.length },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as TaskStatus;
    setTasks(prev =>
      prev.map(t => t.id === draggableId ? { ...t, statut: newStatus } : t)
    );
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, statut: status } : t));
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleCreate = async (payload: import('../types').CreateTaskPayload) => {
    const newTask: Task = {
      id: Date.now().toString(),
      titre: payload.titre,
      description: payload.description,
      statut: 'A_FAIRE',
      priorite: payload.priorite,
      projetId: id ?? 'p1',
      dateEcheance: payload.dateEcheance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assigneA: getMembers().find(m => m.id === payload.assigneAId),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const getFilteredTasks = (status: TaskStatus) => {
    const col = tasksByStatus[status];
    return filterStatus === 'ALL' ? col : filterStatus === status ? col : [];
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <AppLayout title={project?.nom}>
      <div className="max-w-full">
        {/* Back + Header */}
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour aux projets
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="section-title">{project?.nom}</h2>
                <span className="badge-inprogress flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {project?.statut === 'ACTIF' ? 'Actif' : project?.statut}
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-2xl">{project?.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(project?.dateDebut)} → {formatDate(project?.dateFin)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {project?.membres?.length ?? 0} membres
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => exportProjectPDF(project, tasks)}
                className="btn-secondary flex items-center gap-2"
                aria-label="Exporter en PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button
                onClick={() => setShowChart(v => !v)}
                className="btn-secondary flex items-center gap-2"
                aria-label="Afficher/masquer le graphique"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Statistiques</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary flex items-center gap-2"
                aria-label="Ajouter une tâche"
              >
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        {showChart && (
          <div className="card-elevated p-5 mb-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4">Répartition des tâches par statut</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 13 }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" name="Tâches" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm text-muted-foreground">Filtre :</span>
          {(['ALL', 'A_FAIRE', 'EN_COURS', 'TERMINE'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                filterStatus === s
                  ? 'bg-primary text-primary-foreground shadow-primary'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={filterStatus === s}
            >
              {s === 'ALL' ? 'Tous' : s === 'A_FAIRE' ? 'À faire' : s === 'EN_COURS' ? 'En cours' : 'Terminé'}
              {s !== 'ALL' && (
                <span className="ml-1.5 opacity-60">{tasksByStatus[s].length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map(col => {
              const colTasks = getFilteredTasks(col.id);
              return (
                <div key={col.id} className={`rounded-xl border-t-4 bg-muted/40 border border-border ${col.headerClass}`}>
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm">{col.label}</h3>
                      <span className={`${col.colorClass}`}>{tasksByStatus[col.id].length}</span>
                    </div>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 min-h-32 space-y-2 transition-colors ${snapshot.isDraggingOver ? 'bg-accent/10' : ''}`}
                        aria-label={`Colonne ${col.label}`}
                      >
                        {colTasks.length === 0 ? (
                          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50 border-2 border-dashed border-border rounded-lg">
                            {snapshot.isDraggingOver ? 'Déposer ici' : 'Aucune tâche'}
                          </div>
                        ) : (
                          colTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                >
                                  <TaskCard
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                    onOpenDetail={setSelectedTask}
                                    isDragging={snap.isDragging}
                                    commentCount={getComments(task.id).length}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Members */}
        {project?.membres && project.membres.length > 0 && (
          <div className="card-elevated p-5 mt-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Membres de l'équipe ({project.membres.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.membres.map(m => (
                <div key={m.id} className="flex items-center gap-2.5 bg-muted rounded-lg px-3 py-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
                    style={{ background: 'var(--gradient-primary)' }}
                    aria-hidden="true"
                  >
                    {m.prenom[0]}{m.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.prenom} {m.nom}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
        projectId={id ?? 'p1'}
        membres={getMembers()}
      />

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={(taskId, status) => {
          handleStatusChange(taskId, status);
          // Keep the panel open with updated task
          setSelectedTask(prev => prev ? { ...prev, statut: status } : null);
        }}
      />
    </AppLayout>
  );
};

export default ProjectDetails;
