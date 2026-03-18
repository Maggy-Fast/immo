/**
 * Hook personnalisé — Cotisations
 * Gère l'état et les opérations pour les cotisations et échéances
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceCotisation } from '../../infrastructure/api/serviceCotisation';

export function utiliserCotisations(filtres = {}) {
  const queryClient = useQueryClient();

  // Requête pour lister les échéances
  const { data: dataEcheances, isLoading: chargementEcheances, error: erreurEcheances } = useQuery({
    queryKey: ['echeances', filtres],
    queryFn: () => serviceCotisation.listerEcheances(filtres),
  });

  // Requête pour le paramètre actif
  const { data: parametreActif } = useQuery({
    queryKey: ['parametre-cotisation-actif', filtres?.id_groupe || null],
    queryFn: () => serviceCotisation.obtenirParametreActif(filtres?.id_groupe || null),
    retry: false,
  });

  // Requête pour les statistiques
  const { data: statistiques } = useQuery({
    queryKey: ['cotisations-statistiques', filtres?.id_groupe || null],
    queryFn: () => serviceCotisation.obtenirStatistiques(filtres?.id_groupe || null),
  });

  // Mutation pour payer une échéance
  const mutationPayer = useMutation({
    mutationFn: ({ id, donnees }) => serviceCotisation.payerEcheance(id, donnees),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echeances'] });
      queryClient.invalidateQueries({ queryKey: ['cotisations-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
    },
  });

  // Mutation pour créer un paramètre
  const mutationCreerParametre = useMutation({
    mutationFn: serviceCotisation.creerParametre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parametre-cotisation-actif'] });
    },
  });

  // Mutation pour générer des échéances
  const mutationGenererEcheances = useMutation({
    mutationFn: serviceCotisation.genererEcheances,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echeances'] });
    },
  });

  // Mutation pour vérifier les retards
  const mutationVerifierRetards = useMutation({
    mutationFn: serviceCotisation.verifierRetards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echeances'] });
      queryClient.invalidateQueries({ queryKey: ['adherents'] });
      queryClient.invalidateQueries({ queryKey: ['cotisations-statistiques'] });
      queryClient.invalidateQueries({ queryKey: ['cooperative-stats'] });
    },
  });

  return {
    echeances: dataEcheances?.donnees || [],
    meta: dataEcheances?.meta || {},
    parametreActif: parametreActif,
    statistiques: statistiques,
    chargement: chargementEcheances,
    erreur: erreurEcheances,
    payerEcheance: mutationPayer.mutateAsync,
    creerParametre: mutationCreerParametre.mutateAsync,
    genererEcheances: mutationGenererEcheances.mutateAsync,
    verifierRetards: mutationVerifierRetards.mutateAsync,
    enCoursPaiement: mutationPayer.isPending,
    enCoursCreationParametre: mutationCreerParametre.isPending,
    enCoursGeneration: mutationGenererEcheances.isPending,
    enCoursVerification: mutationVerifierRetards.isPending,
  };
}
