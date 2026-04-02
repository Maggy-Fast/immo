/**
 * Service API — Promoteurs
 * Gère les appels HTTP pour les promoteurs
 */

import clientHttp from './clientHttp';

const BASE_URL = '/promoteurs';

export const servicePromoteur = {
  /**
   * Lister tous les promoteurs avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    
    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un promoteur par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau promoteur
   */
  async creer(donnees) {
    const formData = new FormData();
    
    Object.keys(donnees).forEach(key => {
      if (donnees[key] !== null && donnees[key] !== undefined && !(donnees[key] instanceof File)) {
        formData.append(key, donnees[key]);
      }
    });
    
    if (donnees.photo instanceof File) formData.append('photo', donnees.photo);
    if (donnees.licence instanceof File) formData.append('licence', donnees.licence);
    if (donnees.registre_commerce instanceof File) formData.append('registre_commerce', donnees.registre_commerce);
    
    const reponse = await clientHttp.post(BASE_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return reponse.data;
  },

  /**
   * Modifier un promoteur existant
   */
  async modifier(id, donnees) {
    const formData = new FormData();
    
    Object.keys(donnees).forEach(key => {
      if (donnees[key] !== null && donnees[key] !== undefined && !(donnees[key] instanceof File)) {
        formData.append(key, donnees[key]);
      }
    });
    
    if (donnees.photo instanceof File) formData.append('photo', donnees.photo);
    if (donnees.licence instanceof File) formData.append('licence', donnees.licence);
    if (donnees.registre_commerce instanceof File) formData.append('registre_commerce', donnees.registre_commerce);
    
    const reponse = await clientHttp.post(`${BASE_URL}/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return reponse.data;
  },

  /**
   * Supprimer un promoteur
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
