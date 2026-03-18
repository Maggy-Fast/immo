/**
 * Service API — Propriétaires
 * Gère les appels HTTP pour les propriétaires
 */

import clientHttp from './clientHttp';

const BASE_URL = '/proprietaires';

export const serviceProprietaire = {
  /**
   * Lister tous les propriétaires avec filtres optionnels
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
   * Obtenir un propriétaire par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau propriétaire
   */
  async creer(donnees) {
    if (donnees.photo instanceof File) {
      const corps = new FormData();
      corps.append('nom', donnees.nom);
      corps.append('telephone', donnees.telephone);
      corps.append('email', donnees.email);
      corps.append('adresse', donnees.adresse || '');
      corps.append('cin', donnees.cin || '');
      corps.append('photo', donnees.photo);

      const reponse = await clientHttp.post(BASE_URL, corps, {
        headers: { 'Content-Type': undefined },
      });
      return reponse.data;
    }

    const corps = {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      adresse: donnees.adresse || '',
      cin: donnees.cin || '',
    };

    const reponse = await clientHttp.post(BASE_URL, corps);
    return reponse.data;
  },

  /**
   * Modifier un propriétaire existant
   */
  async modifier(id, donnees) {
    if (donnees.photo instanceof File) {
      const corps = new FormData();
      corps.append('_method', 'PUT');
      corps.append('nom', donnees.nom);
      corps.append('telephone', donnees.telephone);
      corps.append('email', donnees.email);
      corps.append('adresse', donnees.adresse || '');
      corps.append('cin', donnees.cin || '');
      corps.append('photo', donnees.photo);

      const reponse = await clientHttp.post(`${BASE_URL}/${id}`, corps, {
        headers: { 'Content-Type': undefined },
      });
      return reponse.data;
    }

    // Envoi JSON sans la photo (on ne renvoie pas l'URL string au backend)
    const corps = {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      adresse: donnees.adresse || '',
      cin: donnees.cin || '',
    };
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, corps);
    return reponse.data;
  },

  /**
   * Supprimer un propriétaire
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
