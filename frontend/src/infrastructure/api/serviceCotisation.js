/**
 * Service API — Cotisations
 * Gère les appels HTTP pour les cotisations et échéances
 */

import clientHttp from './clientHttp';

const BASE_URL = '/cotisations';

export const serviceCotisation = {
  /**
   * Lister les échéances avec filtres optionnels
   */
  async listerEcheances(filtres = {}) {
    const params = new URLSearchParams();
    
    if (filtres.id_groupe) params.append('id_groupe', filtres.id_groupe);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.id_adherent) params.append('id_adherent', filtres.id_adherent);
    if (filtres.mois) params.append('mois', filtres.mois);
    if (filtres.page) params.append('page', filtres.page);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}/echeances?${queryString}` : `${BASE_URL}/echeances`;
    
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Payer une échéance
   */
  async payerEcheance(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/echeances/${id}/payer`, {
      montant_paye: donnees.montantPaye,
      mode_paiement: donnees.modePaiement,
      reference_paiement: donnees.referencePaiement || null,
    });
    return reponse.data;
  },

  /**
   * Obtenir le paramètre de cotisation actif
   */
  async obtenirParametreActif(idGroupe = null) {
    const params = new URLSearchParams();
    if (idGroupe) params.append('id_groupe', idGroupe);
    const url = params.toString() ? `${BASE_URL}/parametres/actif?${params.toString()}` : `${BASE_URL}/parametres/actif`;
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Créer un nouveau paramètre de cotisation
   */
  async creerParametre(donnees) {
    const reponse = await clientHttp.post(`${BASE_URL}/parametres`, {
      id_groupe: donnees.id_groupe || null,
      montant: donnees.montant,
      frequence: donnees.frequence,
      jour_echeance: donnees.jourEcheance,
      date_debut: donnees.dateDebut,
      periode_grace_jours: donnees.periodeGraceJours,
      max_echeances_retard: donnees.maxEcheancesRetard,
    });
    return reponse.data;
  },

  /**
   * Générer les échéances pour un adhérent
   */
  async genererEcheances(donnees) {
    const reponse = await clientHttp.post(`${BASE_URL}/generer-echeances`, {
      id_adherent: donnees.idAdherent,
      nombre_mois: donnees.nombreMois || 12,
    });
    return reponse.data;
  },

  /**
   * Vérifier les retards
   */
  async verifierRetards() {
    const reponse = await clientHttp.post(`${BASE_URL}/verifier-retards`);
    return reponse.data;
  },

  /**
   * Obtenir les statistiques des cotisations
   */
  async obtenirStatistiques(idGroupe = null) {
    const params = new URLSearchParams();
    if (idGroupe) params.append('id_groupe', idGroupe);
    const url = params.toString() ? `${BASE_URL}/statistiques?${params.toString()}` : `${BASE_URL}/statistiques`;
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },
};
