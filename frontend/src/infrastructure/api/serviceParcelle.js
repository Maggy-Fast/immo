/**
 * Service API — Parcelles
 * Gère les appels HTTP pour les parcelles
 */

import clientHttp from './clientHttp';

const BASE_URL = '/parcelles';

export const serviceParcelle = {
  /**
   * Lister toutes les parcelles avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.idLotissement) params.append('id_lotissement', filtres.idLotissement);
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
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      id_lotissement: donnees.idLotissement,
      numero: donnees.numero,
      superficie: donnees.superficie,
      prix: donnees.prix,
      statut: donnees.statut || 'disponible',
    });
    return reponse.data;
  },

  /**
   * Modifier une parcelle existante
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      id_lotissement: donnees.idLotissement,
      numero: donnees.numero,
      superficie: donnees.superficie,
      prix: donnees.prix,
      statut: donnees.statut,
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
};
