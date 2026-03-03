/**
 * Hook métier — Gestion des lotissements
 * Orchestre les opérations CRUD sur les lotissements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceLotissement } from '../../infrastructure/api/serviceLotissement';

const CLE_REQUETE = 'lotissements';

export function utiliserLotissements(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les lotissements
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceLotissement.lister(filtres),
  });

  // Créer un lotissement
  const mutationCreer = useMutation({
    mutationFn: serviceLotissement.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Modifier un lotissement
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceLotissement.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Supprimer un lotissement
  const mutationSupprimer = useMutation({
    mutationFn: serviceLotissement.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  return {
    lotissements: donnees?.donnees || [],
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

export function utiliserLotissement(id) {
  const {
    data: lotissement,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceLotissement.obtenirParId(id),
    enabled: !!id,
  });

  return { lotissement, chargement, erreur };
}
