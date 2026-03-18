import clientHttp from './clientHttp';

const BASE_URL = '/documents-fonciers';

export const serviceDocumentsFonciers = {
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    if (filtres.idBien) params.append('id_bien', filtres.idBien);
    if (filtres.type) params.append('type', filtres.type);
    if (filtres.recherche) params.append('recherche', filtres.recherche);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  async creer(donnees) {
    const corps = new FormData();
    corps.append('id_bien', donnees.idBien);
    corps.append('titre', donnees.titre);
    corps.append('type', donnees.type);
    corps.append('fichier', donnees.fichier);

    const reponse = await clientHttp.post(BASE_URL, corps, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return reponse.data;
  },

  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  async telecharger(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}/telecharger`, {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    });

    return reponse;
  },

  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
