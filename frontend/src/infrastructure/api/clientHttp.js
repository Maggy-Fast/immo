import axios from 'axios';

/**
 * Client HTTP — Instance Axios configurée
 * Gère le token d'authentification et les erreurs globales
 */
const clientHttp = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
    timeout: 15000,
});

/* Intercepteur requête — injection du token + gestion FormData */
clientHttp.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Si le corps est un FormData, supprimer le Content-Type par défaut
        // pour qu'Axios le définisse automatiquement avec le bon boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        // 🔍 LOG DEBUG — Suivi de l'appel
        const urlComplete = `${config.baseURL || ''}${config.url}`;
        console.log(`[API] ➡️ ${config.method?.toUpperCase()} ${urlComplete}`);
        return config;
    },
    (erreur) => Promise.reject(erreur)
);

/* Intercepteur réponse — gestion erreurs globales */
clientHttp.interceptors.response.use(
    (reponse) => reponse,
    (erreur) => {
        if (erreur.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('utilisateur');
            window.location.href = '/connexion';
        }
        return Promise.reject(erreur);
    }
);

export default clientHttp;
