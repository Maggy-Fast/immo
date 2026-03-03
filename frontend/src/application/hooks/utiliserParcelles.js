/**
 * Hook métier — Gestion des parcelles
 * Orchestre les opérations CRUD sur les parcelles
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceParcelle } from '../../infrastructure/api/serviceParcelle';

const CLE_REQUETE = 'parcelles';

export function utiliserParcelles(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les parcelles
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceParcelle.lister(filtres),
  });

  // Créer une parcelle
  const mutationCreer = useMutation({
    mutationFn: serviceParcelle.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      clientRequete.invalidateQueries({ queryKey: ['lotissements'] });
    },
  });

  // Modifier une parcelle
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceParcelle.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      clientRequete.invalidateQueries({ queryKey: ['lotissements'] });
    },
  });

  // Supprimer une parcelle
  const mutationSupprimer = useMutation({
    mutationFn: serviceParcelle.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      clientRequete.invalidateQueries({ queryKey: ['lotissements'] });
    },
  });

  return {
    parcelles: donnees?.donnees || [],
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

export function utiliserParcelle(id) {
  const {
    data: parcelle,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceParcelle.obtenirParId(id),
    enabled: !!id,
  });

  return { parcelle, chargement, erreur };
}
