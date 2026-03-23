import { BASE_URL } from '../services/apiService';

/**
 * Transforme un chemin d'image (relatif ou absolu) en URL utilisable par le navigateur.
 * Si le chemin commence par /storage, on ajoute l'URL de base du backend.
 * 
 * @param {string} path Le chemin de l'image (ex: /storage/uploads/bien/...)
 * @param {string} placeholder Le chemin du placeholder si l'image est absente
 * @returns {string} L'URL complète de l'image
 */
export const getImageUrl = (path, placeholder = '/images/placeholders/placeholder.svg') => {
  if (!path) return placeholder;
  
  // Si c'est déjà une URL absolue ou un flux base64
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }
  
  // Si c'est un chemin de stockage Laravel relatif
  if (path.startsWith('/storage')) {
    return `${BASE_URL}${path}`;
  }
  
  return path;
};
