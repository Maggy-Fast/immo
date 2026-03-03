/**
 * Service API — Locataires
 * Gère les appels HTTP pour les locataires
 */

import clientHttp from './clientHttp';

const BASE_URL = '/locataires';

export const serviceLocataire = {
  /**
   * Lister tous les locataires avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un locataire par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau locataire
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      cin: donnees.cin || '',
      profession: donnees.profession || '',
    });
    return reponse.data;
  },

  /**
   * Modifier un locataire existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      cin: donnees.cin || '',
      profession: donnees.profession || '',
    });
    return reponse.data;
  },

  /**
   * Supprimer un locataire
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
