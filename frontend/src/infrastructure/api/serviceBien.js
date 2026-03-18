/**
 * Service API — Biens
 * Gère les appels HTTP pour les biens immobiliers
 */

import clientHttp from './clientHttp';

const BASE_URL = '/biens';

export const serviceBien = {
  /**
   * Lister tous les biens avec filtres optionnels
   */
  async lister(filtres = {}) {
    const params = new URLSearchParams();

    if (filtres.type) params.append('type', filtres.type);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.idProprietaire) params.append('id_proprietaire', filtres.idProprietaire);
    if (filtres.page) params.append('page', filtres.page);
    if (filtres.recherche) params.append('recherche', filtres.recherche);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  /**
   * Obtenir un bien par son ID
   */
  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  /**
   * Créer un nouveau bien
   */
  async creer(donnees) {
    let corps;
    let configuration = {};

    // Si on a des images, on utilise FormData
    if (donnees.images && donnees.images.length > 0) {
      corps = new FormData();
      corps.append('type', donnees.type);
      corps.append('adresse', donnees.adresse);
      corps.append('superficie', donnees.superficie);
      corps.append('prix', donnees.prix);
      corps.append('id_proprietaire', donnees.idProprietaire);
      corps.append('statut', donnees.statut || 'disponible');
      corps.append('description', donnees.description || '');

      if (donnees.latitude) corps.append('latitude', donnees.latitude);
      if (donnees.longitude) corps.append('longitude', donnees.longitude);

      // Ajouter les images
      donnees.images.forEach((image, index) => {
        corps.append(`images[${index}]`, image);
      });

      configuration = {
        headers: { 'Content-Type': undefined },
      };
    } else {
      corps = {
        type: donnees.type,
        adresse: donnees.adresse,
        superficie: donnees.superficie,
        prix: donnees.prix,
        id_proprietaire: donnees.idProprietaire,
        statut: donnees.statut || 'disponible',
        latitude: donnees.latitude || null,
        longitude: donnees.longitude || null,
        description: donnees.description || '',
      };
    }

    console.log('[serviceBien] Création bien avec corps:', corps);
    const reponse = await clientHttp.post(BASE_URL, corps, configuration);
    return reponse.data;
  },

  /**
   * Modifier un bien existant
   */
  async modifier(id, donnees) {
    let corps;
    let configuration = {};

    // Si on a des nouvelles images, on utilise FormData
    if (donnees.images && donnees.images.length > 0) {
      corps = new FormData();
      corps.append('_method', 'PUT');
      corps.append('type', donnees.type);
      corps.append('adresse', donnees.adresse);
      corps.append('superficie', donnees.superficie);
      corps.append('prix', donnees.prix);
      corps.append('id_proprietaire', donnees.idProprietaire);
      corps.append('statut', donnees.statut);
      corps.append('description', donnees.description || '');

      if (donnees.latitude) corps.append('latitude', donnees.latitude);
      if (donnees.longitude) corps.append('longitude', donnees.longitude);

      // Nouvelles images (Files)
      donnees.images.forEach((image, index) => {
        corps.append(`images[${index}]`, image);
      });

      // Photos existantes à garder (URLs)
      if (donnees.photos) {
        corps.append('photos', JSON.stringify(donnees.photos));
      }

      configuration = {
        headers: { 'Content-Type': undefined },
      };

      const reponse = await clientHttp.post(`${BASE_URL}/${id}`, corps, configuration);
      return reponse.data;
    } else {
      corps = {
        type: donnees.type,
        adresse: donnees.adresse,
        superficie: donnees.superficie,
        prix: donnees.prix,
        id_proprietaire: donnees.idProprietaire,
        statut: donnees.statut,
        latitude: donnees.latitude || null,
        longitude: donnees.longitude || null,
        description: donnees.description || '',
        photos: donnees.photos || [],
      };
      const reponse = await clientHttp.put(`${BASE_URL}/${id}`, corps);
      return reponse.data;
    }
  },

  /**
   * Supprimer un bien
   */
  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
