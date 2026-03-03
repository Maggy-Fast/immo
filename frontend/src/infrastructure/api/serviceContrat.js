/**
 * Service API — Contrats
 * Gère les appels HTTP pour les contrats de bail
 */

import clientHttp from './clientHttp';

const BASE_URL = '/contrats';

export const serviceContrat = {
  /**
   * Lister tous les contrats avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.idBien) params.append('id_bien', filtres.idBien);
    if (filtres.idLocataire) params.append('id_locataire', filtres.idLocataire);
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un contrat par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau contrat
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      id_bien: donnees.idBien,
      id_locataire: donnees.idLocataire,
      date_debut: donnees.dateDebut,
      date_fin: donnees.dateFin,
      loyer_mensuel: donnees.loyerMensuel,
      caution: donnees.caution,
      statut: donnees.statut || 'actif',
    });
    return reponse.data;
  },

  /**
   * Modifier un contrat existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      id_bien: donnees.idBien,
      id_locataire: donnees.idLocataire,
      date_debut: donnees.dateDebut,
      date_fin: donnees.dateFin,
      loyer_mensuel: donnees.loyerMensuel,
      caution: donnees.caution,
      statut: donnees.statut,
    });
    return reponse.data;
  },

  /**
   * Supprimer un contrat
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
