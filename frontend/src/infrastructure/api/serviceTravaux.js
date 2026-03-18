import clientHttp from './clientHttp';

const BASE_URL = '/travaux';

export const serviceTravaux = {
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    if (filtres.idBien) params.append('id_bien', filtres.idBien);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.recherche) params.append('recherche', filtres.recherche);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  async creer(donnees) {
    const reponse = await clientHttp.post(BASE_URL, donnees);
    return reponse.data;
  },

  async mettreAJour(id, donnees) {
    const reponse = await clientHttp.put(`${BASE_URL}/${id}`, donnees);
    return reponse.data;
  },

  async supprimer(id) {
    const reponse = await clientHttp.delete(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },
};
