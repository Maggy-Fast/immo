/**
 * Hook métier — Gestion des contrats
 * Orchestre les opérations CRUD sur les contrats de bail
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceContrat } from '../../infrastructure/api/serviceContrat';

const CLE_REQUETE = 'contrats';

export function utiliserContrats(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les contrats
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceContrat.lister(filtres),
  });

  // Créer un contrat
  const mutationCreer = useMutation({
    mutationFn: serviceContrat.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      clientRequete.invalidateQueries({ queryKey: ['biens'] });
      clientRequete.invalidateQueries({ queryKey: ['locataires'] });
    },
  });

  // Modifier un contrat
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceContrat.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Supprimer un contrat
  const mutationSupprimer = useMutation({
    mutationFn: serviceContrat.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      clientRequete.invalidateQueries({ queryKey: ['biens'] });
      clientRequete.invalidateQueries({ queryKey: ['locataires'] });
    },
  });

  return {
    contrats: donnees?.donnees || [],
    meta: donnees?.meta || null,
    chargement,
    erreur,
    recharger,
    creer: mutationCreer.mutateAsync,
    modifier: mutationModifier.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursModification: mutationModifier.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
  };
}

export function utiliserContrat(id) {
  const {
    data: contrat,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceContrat.obtenirParId(id),
    enabled: !!id,
  });

  return { contrat, chargement, erreur };
}
