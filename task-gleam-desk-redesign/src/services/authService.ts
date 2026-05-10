import api from './api';
import type { LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/me/password', { currentPassword, newPassword });
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignorer l'erreur côté serveur lors de la déconnexion
    }
  },
};
