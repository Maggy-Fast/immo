/**
 * Service API — Biens
 * Gère les appels HTTP pour les biens immobiliers
 */

import clientHttp from './clientHttp';

const BASE_URL = '/biens';

export const serviceBien = {
  /**
   * Lister tous les biens avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.type) params.append('type', filtres.type);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.idProprietaire) params.append('id_proprietaire', filtres.idProprietaire);
    if (filtres.page) params.append('page', filtres.page);
    if (filtres.recherche) params.append('recherche', filtres.recherche);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un bien par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau bien
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      type: donnees.type,
      adresse: donnees.adresse,
      superficie: donnees.superficie,
      prix: donnees.prix,
      id_proprietaire: donnees.idProprietaire,
      statut: donnees.statut || 'disponible',
      latitude: donnees.latitude || null,
      longitude: donnees.longitude || null,
      description: donnees.description || '',
    });
    return reponse.data;
  },

  /**
   * Modifier un bien existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      type: donnees.type,
      adresse: donnees.adresse,
      superficie: donnees.superficie,
      prix: donnees.prix,
      id_proprietaire: donnees.idProprietaire,
      statut: donnees.statut,
      latitude: donnees.latitude || null,
      longitude: donnees.longitude || null,
      description: donnees.description || '',
    });
    return reponse.data;
  },

  /**
   * Supprimer un bien
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
