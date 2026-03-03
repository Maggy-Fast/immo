import axios from 'axios';

/**
 * Client HTTP — Instance Axios configurée
 * Gère le token d'authentification et les erreurs globales
 */
const clientHttp = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 15000,
});

/* Intercepteur requête — injection du token */
clientHttp.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
