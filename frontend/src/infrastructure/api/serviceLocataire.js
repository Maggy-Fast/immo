/**
 * Service API — Locataires
 * Gère les appels HTTP pour les locataires
 */

import clientHttp from './clientHttp';

const BASE_URL = '/locataires';

export const serviceLocataire = {
  /**
   * Lister tous les locataires avec filtres optionnels
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
   * Obtenir un locataire par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau locataire
   */
  async creer(donnees) {
    // Si on a une photo (File), on utilise FormData
    if (donnees.photo instanceof File) {
      const corps = new FormData();
      corps.append('nom', donnees.nom);
      corps.append('telephone', donnees.telephone);
      corps.append('email', donnees.email);
      corps.append('cin', donnees.cin || '');
      corps.append('profession', donnees.profession || '');
      corps.append('photo', donnees.photo);

      // Content-Type à undefined pour qu'Axios supprime le défaut JSON et mette multipart/form-data avec boundary
      const reponse = await clientHttp.post(BASE_URL, corps, {
        headers: { 'Content-Type': undefined },
      });
      return reponse.data;
    }

    // Sinon, envoi JSON classique
    const corps = {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      cin: donnees.cin || '',
      profession: donnees.profession || '',
    };

    const reponse = await clientHttp.post(BASE_URL, corps);
    return reponse.data;
  },

  /**
   * Modifier un locataire existant
   */
  async modifier(id, donnees) {
    // Si la photo est un nouveau fichier, on utilise FormData + POST avec _method=PUT
    if (donnees.photo instanceof File) {
      const corps = new FormData();
      corps.append('_method', 'PUT');
      corps.append('nom', donnees.nom);
      corps.append('telephone', donnees.telephone);
      corps.append('email', donnees.email);
      corps.append('cin', donnees.cin || '');
      corps.append('profession', donnees.profession || '');
      corps.append('photo', donnees.photo);

      // Content-Type à undefined pour qu'Axios supprime le défaut JSON et mette multipart/form-data avec boundary
      const reponse = await clientHttp.post(`${BASE_URL}/${id}`, corps, {
        headers: { 'Content-Type': undefined },
      });
      return reponse.data;
    }

    // Sinon, envoi JSON classique (sans renvoyer la photo URL au backend)
    const corps = {
      nom: donnees.nom,
      telephone: donnees.telephone,
      email: donnees.email,
      cin: donnees.cin || '',
      profession: donnees.profession || '',
    };
    // NE PAS envoyer la photo si c'est une URL string — Laravel la rejetterait car ce n'est pas un fichier
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, corps);
    return reponse.data;
  },

  /**
   * Supprimer un locataire
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
