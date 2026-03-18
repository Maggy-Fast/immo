/**
 * Hook personnalisé — Adhérents
 * Gère l'état et les opérations CRUD pour les adhérents
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAdherent } from '../../infrastructure/api/serviceAdherent';

export function utiliserAdherents(filtres = {}) {
  const queryClient = useQueryClient();

  // Requête pour lister les adhérents
  const { data, isLoading, error } = useQuery({
    queryKey: ['adherents', filtres],
    queryFn: () => serviceAdherent.lister(filtres),
  });

  // Mutation pour créer un adhérent
  const mutationCreer = useMutation({
    mutationFn: serviceAdherent.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  // Mutation pour modifier un adhérent
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceAdherent.modifier(id, donnees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  // Mutation pour supprimer un adhérent
  const mutationSupprimer = useMutation({
    mutationFn: serviceAdherent.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  return {
    adherents: data?.donnees || [],
    meta: data?.meta || {},
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

export function utiliserAdherent(id) {
  return useQuery({
    queryKey: ['adherent', id],
    queryFn: () => serviceAdherent.obtenirParId(id),
    enabled: !!id,
  });
}

export function utiliserEligibiliteAdherent(id) {
  return useQuery({
    queryKey: ['adherent-eligibilite', id],
    queryFn: () => serviceAdherent.verifierEligibilite(id),
    enabled: !!id,
  });
}
