/**
 * Hook métier — Gestion des biens
 * Orchestre les opérations CRUD sur les biens
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceBien } from '../../infrastructure/api/serviceBien';

const CLE_REQUETE = 'biens';

export function utiliserBiens(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les biens
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceBien.lister(filtres),
  });

  // Créer un bien
  const mutationCreer = useMutation({
    mutationFn: serviceBien.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Modifier un bien
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceBien.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Supprimer un bien
  const mutationSupprimer = useMutation({
    mutationFn: serviceBien.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  return {
    biens: donnees?.donnees || [],
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

export function utiliserBien(id) {
  const {
    data: bien,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceBien.obtenirParId(id),
    enabled: !!id,
  });

  return { bien, chargement, erreur };
}
