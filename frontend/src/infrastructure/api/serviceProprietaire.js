/**
 * Service API — Propriétaires
 * Gère les appels HTTP pour les propriétaires
 */

import clientHttp from './clientHttp';

const BASE_URL = '/proprietaires';

export const serviceProprietaire = {
  /**
   * Lister tous les propriétaires avec filtres optionnels
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
   * Obtenir un propriétaire par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau propriétaire
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      adresse: donnees.adresse || '',
      cin: donnees.cin || '',
    });
    return reponse.data;
  },

  /**
   * Modifier un propriétaire existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      adresse: donnees.adresse || '',
      cin: donnees.cin || '',
    });
    return reponse.data;
  },

  /**
   * Supprimer un propriétaire
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
