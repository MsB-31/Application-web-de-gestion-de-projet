import api from './api';
import type { Project, CreateProjectPayload, PaginatedResponse } from '../types';

export const projectService = {
  async getProjects(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Project>> {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const response = await api.post('/projects', payload);
    return response.data;
  },

  async updateProject(id: string, payload: Partial<CreateProjectPayload>): Promise<Project> {
    const response = await api.put(`/projects/${id}`, payload);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async addMember(projectId: string, userId: string): Promise<Project> {
    const response = await api.post(`/projects/${projectId}/membres`, { userId });
    return response.data;
  },

  async removeMember(projectId: string, userId: string): Promise<Project> {
    const response = await api.delete(`/projects/${projectId}/membres/${userId}`);
    return response.data;
  },
};
