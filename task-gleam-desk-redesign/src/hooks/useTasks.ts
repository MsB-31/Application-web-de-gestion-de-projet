import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { fetchTasks, createTask, updateTaskStatus, deleteTask, moveTaskOptimistic } from '../store/slices/taskSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { CreateTaskPayload, TaskStatus } from '../types';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector(s => s.tasks);

  const loadTasks = useCallback((projectId: string, statut?: TaskStatus) => {
    dispatch(fetchTasks({ projectId, statut }));
  }, [dispatch]);

  const handleCreate = async (payload: CreateTaskPayload) => {
    const result = await dispatch(createTask(payload));
    if (createTask.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Tâche créée avec succès !' }));
      return result.payload;
    }
    dispatch(addNotification({ type: 'error', message: result.payload as string || 'Erreur lors de la création.' }));
    return null;
  };

  const handleUpdateStatus = async (id: string, statut: TaskStatus) => {
    dispatch(moveTaskOptimistic({ taskId: id, newStatus: statut }));
    const result = await dispatch(updateTaskStatus({ id, statut }));
    if (!updateTaskStatus.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'error', message: 'Erreur lors du changement de statut.' }));
    }
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Tâche supprimée.' }));
      return true;
    }
    dispatch(addNotification({ type: 'error', message: result.payload as string || 'Erreur lors de la suppression.' }));
    return false;
  };

  const tasksByStatus = {
    A_FAIRE: tasks.filter(t => t.statut === 'A_FAIRE'),
    EN_COURS: tasks.filter(t => t.statut === 'EN_COURS'),
    TERMINE: tasks.filter(t => t.statut === 'TERMINE'),
  };

  return {
    tasks, tasksByStatus, loading, error,
    loadTasks,
    createTask: handleCreate,
    updateTaskStatus: handleUpdateStatus,
    deleteTask: handleDelete,
  };
};
