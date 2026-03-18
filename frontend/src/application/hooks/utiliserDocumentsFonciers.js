import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceDocumentsFonciers } from '../../infrastructure/api/serviceDocumentsFonciers';
import { useToast } from '../../presentation/composants/communs';

const CLE_REQUETE = 'documents-fonciers';

export function utiliserDocumentsFonciers(filtres = {}) {
  const clientRequete = useQueryClient();
  const { notifier } = useToast();

  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceDocumentsFonciers.lister(filtres),
  });

  const mutationCreer = useMutation({
    mutationFn: serviceDocumentsFonciers.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Document ajouté avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || "Erreur lors de l'ajout du document", 'error');
    },
  });

  const mutationSupprimer = useMutation({
    mutationFn: serviceDocumentsFonciers.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
      notifier('Document supprimé avec succès');
    },
    onError: (error) => {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression du document', 'error');
    },
  });

  return {
    documents: donnees?.donnees || [],
    meta: donnees?.meta || null,
    chargement,
    erreur,
    recharger,
    creer: mutationCreer.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
  };
}

export function utiliserDocumentFoncier(id) {
  const {
    data: document,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceDocumentsFonciers.obtenirParId(id),
    enabled: !!id,
  });

  return { document, chargement, erreur };
}
