/**
 * Service API — Lotissements
 * Gère les appels HTTP pour les lotissements
 */

import clientHttp from './clientHttp';

const BASE_URL = '/lotissements';

export const serviceLotissement = {
  /**
   * Lister tous les lotissements avec filtres optionnels
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
   * Obtenir un lotissement par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau lotissement
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      nom: donnees.nom,
      localisation: donnees.localisation,
      superficie_totale: donnees.superficieTotale,
      nombre_parcelles: donnees.nombreParcelles,
      latitude: donnees.latitude || null,
      longitude: donnees.longitude || null,
    });
    return reponse.data;
  },

  /**
   * Modifier un lotissement existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      nom: donnees.nom,
      localisation: donnees.localisation,
      superficie_totale: donnees.superficieTotale,
      nombre_parcelles: donnees.nombreParcelles,
      latitude: donnees.latitude || null,
      longitude: donnees.longitude || null,
    });
    return reponse.data;
  },

  /**
   * Supprimer un lotissement
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
