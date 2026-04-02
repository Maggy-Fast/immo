/**
 * Hook personnalisé — Promoteurs
 * Gère l'état et les opérations CRUD pour les promoteurs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicePromoteur } from '../../infrastructure/api/servicePromoteur';

export function utiliserPromoteurs(filtres = {}) {
  const queryClient = useQueryClient();

  // Requête pour lister les promoteurs
  const { data, isLoading, error } = useQuery({
    queryKey: ['promoteurs', filtres],
    queryFn: () => servicePromoteur.lister(filtres),
  });

  // Mutation pour créer un promoteur
  const mutationCreer = useMutation({
    mutationFn: servicePromoteur.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoteurs'] });
    },
  });

  // Mutation pour modifier un promoteur
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => servicePromoteur.modifier(id, donnees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoteurs'] });
    },
  });

  // Mutation pour supprimer un promoteur
  const mutationSupprimer = useMutation({
    mutationFn: servicePromoteur.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoteurs'] });
    },
  });

  return {
    promoteurs: data?.donnees || [],
    chargement: isLoading,
    erreur: error,
    creer: mutationCreer.mutateAsync,
    modifier: mutationModifier.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursModification: mutationModifier.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
  };
}

export default utiliserPromoteurs;
