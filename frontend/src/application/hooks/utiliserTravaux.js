import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceTravaux } from '../../infrastructure/api/serviceTravaux';
import { useToast } from '../../presentation/composants/communs';

const CLE_REQUETE = 'travaux';

export function utiliserTravaux(filtres = {}) {
  const clientRequete = useQueryClient();
  const { notifier } = useToast();

  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceTravaux.lister(filtres),
  });

  const mutationCreer = useMutation({
    mutationFn: serviceTravaux.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Travail ajouté avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || "Erreur lors de l'ajout du travail", 'error');
    },
  });

  const mutationMettreAJour = useMutation({
    mutationFn: ({ id, donnees }) => serviceTravaux.mettreAJour(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Travail mis à jour avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la mise à jour du travail', 'error');
    },
  });

  const mutationSupprimer = useMutation({
    mutationFn: serviceTravaux.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Travail supprimé avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression du travail', 'error');
    },
  });

  return {
    travaux: donnees?.donnees || [],
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

export function utiliserTravail(id) {
  const {
    data: travail,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceTravaux.obtenirParId(id),
    enabled: !!id,
  });

  return { travail, chargement, erreur };
}
