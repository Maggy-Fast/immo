/**
 * Hook personnalisé — Parcelles Coopérative
 * Gère l'état et les opérations CRUD pour les parcelles de la coopérative
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceParcelleCooperative } from '../../infrastructure/api/serviceParcelleCooperative';

export function utiliserParcellesCooperative(filtres = {}) {
  const queryClient = useQueryClient();

  // Requête pour lister les parcelles
  const { data, isLoading, error } = useQuery({
    queryKey: ['parcelles-cooperative', filtres],
    queryFn: () => serviceParcelleCooperative.lister(filtres),
  });

  // Requête pour les statistiques
  const { data: statistiques } = useQuery({
    queryKey: ['parcelles-cooperative-statistiques'],
    queryFn: serviceParcelleCooperative.obtenirStatistiques,
  });

  // Mutation pour créer une parcelle
  const mutationCreer = useMutation({
    mutationFn: serviceParcelleCooperative.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  // Mutation pour modifier une parcelle
  const mutationModifier = useMutation({
    mutationFn: ({ id, formData }) => serviceParcelleCooperative.modifier(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative-statistiques'] });
    },
  });

  // Mutation pour supprimer une parcelle
  const mutationSupprimer = useMutation({
    mutationFn: serviceParcelleCooperative.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  // Mutation pour attribuer une parcelle
  const mutationAttribuer = useMutation({
    mutationFn: ({ id, donnees }) => serviceParcelleCooperative.attribuer(id, donnees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
    },
  });

  // Mutation pour retirer une attribution
  const mutationRetirer = useMutation({
    mutationFn: ({ id, motif }) => serviceParcelleCooperative.retirer(id, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
    },
  });

  return {
    parcelles: data?.donnees || [],
    meta: data?.meta || {},
    statistiques: statistiques,
    chargement: isLoading,
    erreur: error,
    creer: mutationCreer.mutateAsync,
    modifier: mutationModifier.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    attribuer: mutationAttribuer.mutateAsync,
    retirer: mutationRetirer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursModification: mutationModifier.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
    enCoursAttribution: mutationAttribuer.isPending,
    enCoursRetrait: mutationRetirer.isPending,
  };
}

export function utiliserParcelleCooperative(id) {
  return useQuery({
    queryKey: ['parcelle-cooperative', id],
    queryFn: () => serviceParcelleCooperative.obtenirParId(id),
    enabled: !!id,
  });
}
