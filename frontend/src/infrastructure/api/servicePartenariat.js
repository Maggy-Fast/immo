/**
 * Service API — Partenariats
 * Gère les appels HTTP pour les partenariats
 */

import clientHttp from './clientHttp';

const BASE_URL = '/partenariats';

export const servicePartenariat = {
  /**
   * Lister tous les partenariats avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.idLotissement) params.append('id_lotissement', filtres.idLotissement);
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un partenariat par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau partenariat
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      id_promoteur: donnees.idPromoteur,
      id_proprietaire: donnees.idProprietaire,
      id_lotissement: donnees.idLotissement,
      ticket_entree: donnees.ticketEntree,
      pourcentage_promoteur: donnees.pourcentagePromoteur,
      pourcentage_proprietaire: donnees.pourcentagePropriétaire,
    });
    return reponse.data;
  },

  /**
   * Modifier un partenariat existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      id_promoteur: donnees.idPromoteur,
      id_proprietaire: donnees.idProprietaire,
      id_lotissement: donnees.idLotissement,
      ticket_entree: donnees.ticketEntree,
      pourcentage_promoteur: donnees.pourcentagePromoteur,
      pourcentage_proprietaire: donnees.pourcentagePropriétaire,
    });
    return reponse.data;
  },

  /**
   * Supprimer un partenariat
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Calculer la répartition des bénéfices
   */
  async calculerRepartition(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}/calculer-repartition`);
    return reponse.data;
  },
};
