/**
 * Hook métier — Gestion des loyers
 * Orchestre les opérations sur les loyers et paiements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceLoyer } from '../../infrastructure/api/serviceLoyer';

const CLE_REQUETE = 'loyers';

export function utiliserLoyers(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les loyers
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => serviceLoyer.lister(filtres),
  });

  // Créer un loyer
  const mutationCreer = useMutation({
    mutationFn: serviceLoyer.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Enregistrer un paiement
  const mutationPayer = useMutation({
    mutationFn: ({ id, donnees }) => serviceLoyer.enregistrerPaiement(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Télécharger quittance
  const mutationTelechargerQuittance = useMutation({
    mutationFn: serviceLoyer.telechargerQuittance,
  });

  // Supprimer un loyer
  const mutationSupprimer = useMutation({
    mutationFn: serviceLoyer.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  return {
    loyers: donnees?.donnees || [],
    meta: donnees?.meta || null,
    chargement,
    erreur,
    recharger,
    creer: mutationCreer.mutateAsync,
    enregistrerPaiement: mutationPayer.mutateAsync,
    telechargerQuittance: mutationTelechargerQuittance.mutateAsync,
    supprimer: mutationSupprimer.mutateAsync,
    enCoursCreation: mutationCreer.isPending,
    enCoursPaiement: mutationPayer.isPending,
    enCoursTelechargement: mutationTelechargerQuittance.isPending,
    enCoursSuppression: mutationSupprimer.isPending,
  };
}

export function utiliserLoyer(id) {
  const {
    data: loyer,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => serviceLoyer.obtenirParId(id),
    enabled: !!id,
  });

  return { loyer, chargement, erreur };
}
