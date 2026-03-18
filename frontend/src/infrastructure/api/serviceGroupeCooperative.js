/**
 * Service API — Groupes Coopérative
 * Gère les appels HTTP pour les groupes de coopérative
 */

import clientHttp from './clientHttp';

const BASE_URL = '/cooperative-groupes';

export const serviceGroupeCooperative = {
  async lister() {
    const reponse = await clientHttp.get(BASE_URL);
    return reponse.data;
  },

  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, {
      nom: donnees.nom,
      description: donnees.description || null,
    });
    return reponse.data;
  },

  async modifier(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, {
      nom: donnees.nom,
      description: donnees.description || null,
    });
    return reponse.data;
  },

  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
