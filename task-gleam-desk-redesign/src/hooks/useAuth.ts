import { useAppDispatch, useAppSelector } from './useAppStore';
import { login, register, logout, updateProfile, clearError } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { LoginPayload, RegisterPayload } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector(s => s.auth);

  const handleLogin = async (payload: LoginPayload) => {
    const result = await dispatch(login(payload));
    if (login.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: `Bienvenue, ${result.payload.user.prenom} !` }));
      return true;
    }
    return false;
  };

  const handleRegister = async (payload: RegisterPayload) => {
    const result = await dispatch(register(payload));
    if (register.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Compte créé avec succès !' }));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({ type: 'info', message: 'Vous avez été déconnecté.' }));
  };

  const handleUpdateProfile = async (data: Partial<{ nom: string; prenom: string; email: string }>) => {
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(addNotification({ type: 'success', message: 'Profil mis à jour avec succès !' }));
      return true;
    }
    return false;
  };

  return {
    user, token, isAuthenticated, loading, error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError: () => dispatch(clearError()),
  };
};
