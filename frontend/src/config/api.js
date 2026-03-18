// Configuration API dans le frontend React

// src/config/api.js
const API_CONFIG = {
  // Environnement de développement
  development: {
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
  },
  
  // Environnement de production (backend AWS)
  production: {
    baseURL: 'https://votre-api-backend.com/api',
    timeout: 10000,
  },
  
  // Environnement de staging
  staging: {
    baseURL: 'https://api-staging.votre-domaine.com/api',
    timeout: 10000,
  }
};

// Configuration actuelle
const currentConfig = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;

// Configuration Axios
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Pour le développement local avec proxy
if (process.env.NODE_ENV === 'development') {
  // Utiliser le proxy Vite
  // Note: Cette exportation sera remplacée par celle ci-dessus en production
  module.exports = { API_BASE_URL: '/api' };
}
