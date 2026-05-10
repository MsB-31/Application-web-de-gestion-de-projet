import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { fetchProjects, fetchProject, createProject, updateProject, deleteProject, setPage } from '../store/slices/projectSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { CreateProjectPayload } from '../types';

export const useProjects = () => {
  const dispatch = useAppDispatch();
  const { projects, currentProject, loading, error, total, page, pageSize } = useAppSelector(s => s.projects);

  const loadProjects = useCallback((params?: { page?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    dispatch(fetchProjects(params || {}));
  }, [dispatch]);

  const loadProject = useCallback((id: string) => {
    dispatch(fetchProject(id));
  }, [dispatch]);

  const handleCreate = async (payload: CreateProjectPayload) => {
    const result = await dispatch(createProject(payload));
    if (createProject.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Projet créé avec succès !' }));
      return result.payload;
    }
    dispatch(addNotification({ type: 'error', message: result.payload as string || 'Erreur lors de la création.' }));
    return null;
  };

  const handleUpdate = async (id: string, payload: Partial<CreateProjectPayload>) => {
    const result = await dispatch(updateProject({ id, payload }));
    if (updateProject.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Projet mis à jour !' }));
      return true;
    }
    dispatch(addNotification({ type: 'error', message: result.payload as string || 'Erreur lors de la mise à jour.' }));
    return false;
  };

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Projet supprimé.' }));
      return true;
    }
    dispatch(addNotification({ type: 'error', message: result.payload as string || 'Erreur lors de la suppression.' }));
    return false;
  };

  return {
    projects, currentProject, loading, error, total, page, pageSize,
    loadProjects, loadProject,
    createProject: handleCreate,
    updateProject: handleUpdate,
    deleteProject: handleDelete,
    setPage: (p: number) => dispatch(setPage(p)),
  };
};
