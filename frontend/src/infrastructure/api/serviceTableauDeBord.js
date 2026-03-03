import clientHttp from './clientHttp';

/**
 * Service Tableau de Bord — Appels API statistiques
 */
export const serviceTableauDeBord = {
    async obtenirStatistiques() {
        const reponse = await clientHttp.get('/tableau-de-bord');
        return reponse.data;
    },
};
