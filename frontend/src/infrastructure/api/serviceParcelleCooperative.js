/**
 * Service API — Parcelles Coopérative
 * Gère les appels HTTP pour les parcelles de la coopérative
 */

import clientHttp from './clientHttp';

const BASE_URL = '/parcelles-cooperative';

export const serviceParcelleCooperative = {
  /**
   * Lister toutes les parcelles avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();

    if (filtres.id_groupe) params.append('id_groupe', filtres.id_groupe);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir une parcelle par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer une nouvelle parcelle
   */
  async creer(formData) {
    const reponse = await clientHttp.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return reponse.data;
  },

  /**
   * Modifier une parcelle existante
   */
  async modifier(id, formData) {
    const reponse = await clientHttp.post(`${BASE_URL}/${id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return reponse.data;
  },

  /**
   * Supprimer une parcelle
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Attribuer une parcelle à un adhérent
   */
  async attribuer(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}/attribuer`, donnees);
    return reponse.data;
  },

  /**
   * Retirer l'attribution d'une parcelle
   */
  async retirer(id, motif = null) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}/retirer`, {
      motif: motif,
    });
    return reponse.data;
  },

  /**
   * Obtenir les statistiques des parcelles
   */
  async obtenirStatistiques() {
    const reponse = await clientHttp.get(`${BASE_URL}/statistiques`);
    return reponse.data;
  },
};
