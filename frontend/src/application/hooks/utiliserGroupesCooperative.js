/**
 * Hook personnalisé — Groupes Coopérative
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceGroupeCooperative } from '../../infrastructure/api/serviceGroupeCooperative';

export function utiliserGroupesCooperative() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cooperative-groupes'],
    queryFn: serviceGroupeCooperative.lister,
  });

  const mutationCreer = useMutation({
    mutationFn: serviceGroupeCooperative.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperative-groupes'] });
    },
  });

  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceGroupeCooperative.modifier(id, donnees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperative-groupes'] });
    },
  });

  const mutationSupprimer = useMutation({
    mutationFn: serviceGroupeCooperative.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperative-groupes'] });
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
      queryClient.invalidateQueries({ queryKey: ['parcelles-cooperative'] });
      queryClient.invalidateQueries({ queryKey: ['echeances'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  return {
    groupes: data?.donnees || [],
    chargement: isLoading,
    erreur: error,
    creer: mutationCreer.mutateAsync,
    modifier: mutationModifier.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursModification: mutationModifier.isPending,
    enCoursSuppression: mutationSupprimer.isPending,

    // Fonction pour charger les détails (utilisable via useQuery dans le composant ou ici)
    obtenirDetails: (id) => serviceGroupeCooperative.obtenirParId(id),
  };
}
