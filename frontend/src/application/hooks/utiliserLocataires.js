/**
 * Hook métier — Gestion des locataires
 * Orchestre les opérations CRUD sur les locataires
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceLocataire } from '../../infrastructure/api/serviceLocataire';
import { useToast } from '../../presentation/composants/communs';

const CLE_REQUETE = 'locataires';

export function utiliserLocataires(filtres = {}) {
  const clientRequete = useQueryClient();

  const { notifier } = useToast();

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
      notifier('Locataire créé avec succès');
    },
    onError: (error) => {
      let message = error.response?.data?.message || 'Erreur lors de la création du locataire';
      if (error.response?.data?.erreurs) {
        const details = Object.values(error.response.data.erreurs).flat().join(' - ');
        message = `${message} : ${details}`;
      }
      notifier(message, 'error');
    },
  });

  // Modifier un locataire
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => serviceLocataire.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Locataire modifié avec succès');
    },
    onError: (error) => {
      let message = error.response?.data?.message || 'Erreur lors de la modification du locataire';
      if (error.response?.data?.erreurs) {
        const details = Object.values(error.response.data.erreurs).flat().join(' - ');
        message = `${message} : ${details}`;
      }
      notifier(message, 'error');
    },
  });

  // Supprimer un locataire
  const mutationSupprimer = useMutation({
    mutationFn: serviceLocataire.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Locataire supprimé avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression du locataire', 'error');
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
