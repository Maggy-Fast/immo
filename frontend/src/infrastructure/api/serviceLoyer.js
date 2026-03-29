/**
 * Service API — Loyers
 * Gère les appels HTTP pour les loyers
 */

import clientHttp from './clientHttp';

const BASE_URL = '/loyers';

export const serviceLoyer = {
  /**
   * Lister tous les loyers avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.idContrat) params.append('id_contrat', filtres.idContrat);
    if (filtres.mois) params.append('mois', filtres.mois);
    if (filtres.recherche) params.append('recherche', filtres.recherche);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un loyer par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau loyer
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      id_contrat: donnees.idContrat,
      mois: donnees.mois,
      montant: donnees.montant,
    });
    return reponse.data;
  },

  /**
   * Enregistrer un paiement
   */
  async enregistrerPaiement(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}/payer`, {
      montant: donnees.montant,
      mode_paiement: donnees.modePaiement,
      date_paiement: donnees.datePaiement,
    });
    return reponse.data;
  },

  /**
   * Télécharger la quittance PDF
   */
  async telechargerQuittance(idLoyer) {
    const reponse = await clientHttp.get(`/quittances/${idLoyer}/pdf`, {
      responseType: 'blob',
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([reponse.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quittance-${idLoyer}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return reponse.data;
  },

  /**
   * Supprimer un loyer
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Générer les loyers pour le mois en cours (Automatique)
   */
  async generer() {
    const reponse = await clientHttp.post(`${BASE_URL}/generer`);
    return reponse.data;
  },
};
