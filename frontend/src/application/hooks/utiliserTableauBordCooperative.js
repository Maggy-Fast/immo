/**
 * Hook personnalisé — Tableau de bord Coopérative
 * Gère l'état des statistiques du tableau de bord
 */

import { useQuery } from '@tanstack/react-query';
import { serviceCooperative } from '../../infrastructure/api/serviceCooperative';

export function utiliserTableauBordCooperative(idGroupe = null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cooperative-stats', idGroupe || null],
    queryFn: () => serviceCooperative.obtenirTableauDeBord(idGroupe || null),
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  return {
    statistiques: data || null,
    chargement: isLoading,
    erreur: error,
  };
}
