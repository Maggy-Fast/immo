/**
 * Service API — Adhérents Coopérative
 * Gère les appels HTTP pour les adhérents de la coopérative
 */

import clientHttp from './clientHttp';

const BASE_URL = '/adherents';

export const serviceAdherent = {
  /**
   * Lister tous les adhérents avec filtres optionnels
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
   * Obtenir un adhérent par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouvel adhérent
   */
  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      id_groupe: donnees.id_groupe || null,
      nom: donnees.nom,
      prenom: donnees.prenom,
      cin: donnees.cin || null,
      telephone: donnees.telephone,
      email: donnees.email || null,
      adresse: donnees.adresse || null,
      date_adhesion: donnees.dateAdhesion || null,
    });
    return reponse.data;
  },

  /**
   * Modifier un adhérent existant
   */
  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      id_groupe: donnees.id_groupe || null,
      nom: donnees.nom,
      prenom: donnees.prenom,
      cin: donnees.cin || null,
      telephone: donnees.telephone,
      email: donnees.email || null,
      adresse: donnees.adresse || null,
      statut: donnees.statut,
    });
    return reponse.data;
  },

  /**
   * Supprimer un adhérent
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Vérifier l'éligibilité d'un adhérent pour une parcelle
   */
  async verifierEligibilite(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}/eligibilite`);
    return reponse.data;
  },

  /**
   * Obtenir les statistiques des adhérents
   */
  async obtenirStatistiques() {
    const reponse = await clientHttp.get(`${BASE_URL}/statistiques`);
    return reponse.data;
  },
};
