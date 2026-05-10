import api from './api';
import type { Task, CreateTaskPayload, TaskStatus } from '../types';

export const taskService = {
  async getTasksByProject(projectId: string, params?: {
    statut?: TaskStatus;
    assigneAId?: string;
  }): Promise<Task[]> {
    const response = await api.get(`/projects/${projectId}/taches`, { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/taches/${id}`);
    return response.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await api.post('/taches', payload);
    return response.data;
  },

  async updateTask(id: string, payload: Partial<CreateTaskPayload & { statut: TaskStatus }>): Promise<Task> {
    const response = await api.put(`/taches/${id}`, payload);
    return response.data;
  },

  async updateTaskStatus(id: string, statut: TaskStatus): Promise<Task> {
    const response = await api.patch(`/taches/${id}/statut`, { statut });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/taches/${id}`);
  },

  async assignTask(id: string, userId: string): Promise<Task> {
    const response = await api.patch(`/taches/${id}/assignation`, { userId });
    return response.data;
  },
};
