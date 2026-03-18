/**
 * Hook métier — Gestion des propriétaires
 * Orchestre les opérations CRUD sur les propriétaires
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceProprietaire } from '../../infrastructure/api/serviceProprietaire';
import { useToast } from '../../presentation/composants/communs';

const CLE_REQUETE = 'proprietaires';

export function utiliserProprietaires(filtres = {}) {
  const clientRequete = useQueryClient();

  const { notifier } = useToast();

  // Lister les propriétaires
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceProprietaire.lister(filtres),
  });

  // Créer un propriétaire
  const mutationCreer = useMutation({
    mutationFn: serviceProprietaire.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Propriétaire créé avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la création du propriétaire', 'error');
    },
  });

  // Modifier un propriétaire
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceProprietaire.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Propriétaire modifié avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la modification du propriétaire', 'error');
    },
  });

  // Supprimer un propriétaire
  const mutationSupprimer = useMutation({
    mutationFn: serviceProprietaire.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Propriétaire supprimé avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression du propriétaire', 'error');
    },
  });

  return {
    proprietaires: donnees?.donnees || [],
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

export function utiliserProprietaire(id) {
  const {
    data: proprietaire,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceProprietaire.obtenirParId(id),
    enabled: !!id,
  });

  return { proprietaire, chargement, erreur };
}
