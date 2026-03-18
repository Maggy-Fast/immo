import clientHttp from './clientHttp';

/**
 * Service Tableau de Bord — Appels API statistiques
 */
export const serviceTableauDeBord = {
    async obtenirStatistiques() {
        const reponse = await clientHttp.get('/tableau-bord');
        return reponse.data;
    },
};
