/**
 * Hook métier — Gestion du tableau de bord
 * Gère la récupération des statistiques globales
 */

import { useQuery } from '@tanstack/react-query';
import { serviceTableauDeBord } from '../../infrastructure/api/serviceTableauDeBord';

const CLE_REQUETE = 'stats-tableau-bord';

export function utiliserTableauDeBord() {
    const {
        data: stats,
        isLoading: chargement,
        isError: erreur,
        refetch: recharger,
    } = useQuery({
        queryKey: [CLE_REQUETE],
        queryFn: serviceTableauDeBord.obtenirStatistiques,
    });

    return {
        stats,
        chargement,
        erreur,
        recharger,
    };
}
