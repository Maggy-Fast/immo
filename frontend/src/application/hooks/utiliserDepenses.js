import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceDepenses } from '../../infrastructure/api/serviceDepenses';
import { useToast } from '../../presentation/composants/communs';

const CLE_REQUETE = 'depenses';

export function utiliserDepenses(filtres = {}) {
  const clientRequete = useQueryClient();
  const { notifier } = useToast();

  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceDepenses.lister(filtres),
  });

  const mutationCreer = useMutation({
    mutationFn: serviceDepenses.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Dépense ajoutée avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || "Erreur lors de l'ajout de la dépense", 'error');
    },
  });

  const mutationMettreAJour = useMutation({
    mutationFn: ({ id, donnees }) => serviceDepenses.mettreAJour(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Dépense mise à jour avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la mise à jour de la dépense', 'error');
    },
  });

  const mutationSupprimer = useMutation({
    mutationFn: serviceDepenses.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Dépense supprimée avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression de la dépense', 'error');
    },
  });

  return {
    depenses: donnees?.donnees || [],
    meta: donnees?.meta || null,
    chargement,
    erreur,
    recharger,
    creer: mutationCreer.mutateAsync,
    mettreAJour: mutationMettreAJour.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursMiseAJour: mutationMettreAJour.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
  };
}

export function utiliserDepense(id) {
  const {
    data: depense,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceDepenses.obtenirParId(id),
    enabled: !!id,
  });

  return { depense, chargement, erreur };
}
