import clientHttp from './clientHttp';

const BASE_URL = '/depenses';

export const serviceDepenses = {
  async lister(filtres = {}) {
    const params = new URLSearchParams();
    if (filtres.idBien) params.append('id_bien', filtres.idBien);
    if (filtres.idTravaux) params.append('id_travaux', filtres.idTravaux);
    if (filtres.typeDepense) params.append('type_depense', filtres.typeDepense);
    if (filtres.statutPaiement) params.append('statut_paiement', filtres.statutPaiement);
    if (filtres.recherche) params.append('recherche', filtres.recherche);

    const queryString = params.toString();
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;

    const reponse = await clientHttp.get(url);
    return reponse.data;
  },

  async creer(donnees) {
    const corps = new FormData();
    corps.append('id_bien', donnees.idBien);
    corps.append('intitule', donnees.intitule);
    corps.append('montant', donnees.montant);
    corps.append('date_depense', donnees.dateDepense);
    corps.append('type_depense', donnees.typeDepense);
    corps.append('statut_paiement', donnees.statutPaiement);

    if (donnees.idTravaux) corps.append('id_travaux', donnees.idTravaux);
    if (donnees.description) corps.append('description', donnees.description);
    if (donnees.fichierFacture) corps.append('fichier_facture', donnees.fichierFacture);

    const reponse = await clientHttp.post(BASE_URL, corps, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return reponse.data;
  },

  async mettreAJour(id, donnees) {
    const corps = new FormData();
    
    if (donnees.idBien !== undefined) corps.append('id_bien', donnees.idBien);
    if (donnees.idTravaux !== undefined) corps.append('id_travaux', donnees.idTravaux);
    if (donnees.intitule !== undefined) corps.append('intitule', donnees.intitule);
    if (donnees.description !== undefined) corps.append('description', donnees.description);
    if (donnees.montant !== undefined) corps.append('montant', donnees.montant);
    if (donnees.dateDepense !== undefined) corps.append('date_depense', donnees.dateDepense);
    if (donnees.typeDepense !== undefined) corps.append('type_depense', donnees.typeDepense);
    if (donnees.statutPaiement !== undefined) corps.append('statut_paiement', donnees.statutPaiement);
    if (donnees.fichierFacture) corps.append('fichier_facture', donnees.fichierFacture);

    const reponse = await clientHttp.post(`${BASE_URL}/${id}?_method=PUT`, corps, {
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

  async obtenirParId(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}`);
    return reponse.data;
  },

  async telechargerFacture(id) {
    const reponse = await clientHttp.get(`${BASE_URL}/${id}/telecharger-facture`, {
      responseType: 'blob',
    });

    return reponse;
  },
};
