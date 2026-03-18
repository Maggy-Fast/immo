/**
 * Service API — Tableau de bord Coopérative
 * Gère les appels HTTP pour le tableau de bord de la coopérative
 */

import clientHttp from './clientHttp';

export const serviceCooperative = {
  /**
   * Obtenir toutes les statistiques du tableau de bord
   */
  async obtenirTableauDeBord(idGroupe = null) {
    const params = new URLSearchParams();
    if (idGroupe) params.append('id_groupe', idGroupe);
    const url = params.toString() ? `/cooperative/tableau-bord?${params.toString()}` : '/cooperative/tableau-bord';
    const reponse = await clientHttp.get(url);
    return reponse.data;
  },
};
