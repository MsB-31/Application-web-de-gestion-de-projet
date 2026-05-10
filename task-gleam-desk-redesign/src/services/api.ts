import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur de requête : ajoute le JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token expiré ou invalide → déconnexion
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      const message =
        data?.message ||
        data?.error ||
        getDefaultErrorMessage(status);

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(new Error('Impossible de contacter le serveur. Vérifiez votre connexion.'));
    }

    return Promise.reject(new Error('Une erreur inattendue s\'est produite.'));
  }
);

function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Données invalides.',
    401: 'Non autorisé. Veuillez vous reconnecter.',
    403: 'Accès refusé.',
    404: 'Ressource introuvable.',
    409: 'Conflit : cette ressource existe déjà.',
    422: 'Données non traitables.',
    500: 'Erreur interne du serveur.',
    502: 'Serveur temporairement indisponible.',
    503: 'Service indisponible.',
  };
  return messages[status] || 'Une erreur est survenue.';
}

export default api;
