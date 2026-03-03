/**
 * Hook métier — Gestion des locataires
 * Orchestre les opérations CRUD sur les locataires
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceLocataire } from '../../infrastructure/api/serviceLocataire';

const CLE_REQUETE = 'locataires';

export function utiliserLocataires(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les locataires
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceLocataire.lister(filtres),
  });

  // Créer un locataire
  const mutationCreer = useMutation({
    mutationFn: serviceLocataire.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Modifier un locataire
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceLocataire.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Supprimer un locataire
  const mutationSupprimer = useMutation({
    mutationFn: serviceLocataire.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  return {
    locataires: donnees?.donnees || [],
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

export function utiliserLocataire(id) {
  const {
    data: locataire,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceLocataire.obtenirParId(id),
    enabled: !!id,
  });

  return { locataire, chargement, erreur };
}
