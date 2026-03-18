/**
 * Hook métier — Gestion des partenariats
 * Orchestre les opérations CRUD sur les partenariats
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicePartenariat } from '../../infrastructure/api/servicePartenariat';

const CLE_REQUETE = 'partenariats';

export function utiliserPartenariats(filtres = {}) {
  const clientRequete = useQueryClient();

  // Lister les partenariats
  const {
    data: donnees,
    isLoading: chargement,
    error: erreur,
    refetch: recharger,
  } = useQuery({
    queryKey: [CLE_REQUETE, filtres],
    queryFn: () => servicePartenariat.lister(filtres),
  });

  // Créer un partenariat
  const mutationCreer = useMutation({
    mutationFn: servicePartenariat.creer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Modifier un partenariat
  const mutationModifier = useMutation({
    mutationFn: ({ id, donnees }) => servicePartenariat.modifier(id, donnees),
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  // Supprimer un partenariat
  const mutationSupprimer = useMutation({
    mutationFn: servicePartenariat.supprimer,
    onSuccess: () => {
      clientRequete.invalidateQueries({ queryKey: [CLE_REQUETE] });
    },
  });

  return {
    partenariats: donnees?.donnees || [],
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
    calculerBeneficesParcellaires: (lotissement, partenariatsLotissement) => {
      // Calculer les bénéfices parcellaires pour un lotissement donné
      const benefices = {};
      
      partenariatsLotissement.forEach(partenariat => {
        const beneficePromoteur = (partenariat.ticket_entree * partenariat.pourcentage_promoteur) / 100;
        const beneficeProprietaire = (partenariat.ticket_entree * partenariat.pourcentage_proprietaire) / 100;
        
        benefices[partenariat.id] = {
          promoteur: beneficePromoteur,
          proprietaire: beneficeProprietaire,
          total: beneficePromoteur + beneficeProprietaire
        };
      });
      
      return benefices;
    },
  };
}

export function utiliserPartenariat(id) {
  const {
    data: partenariat,
    isLoading: chargement,
    error: erreur,
  } = useQuery({
    queryKey: [CLE_REQUETE, id],
    queryFn: () => servicePartenariat.obtenirParId(id),
    enabled: !!id,
  });

  return { partenariat, chargement, erreur };
}

export function utiliserCalculRepartition() {
  const clientRequete = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => servicePartenariat.calculerRepartition(id),
  });

  return {
    repartition: mutation.data,
    chargement: mutation.isPending,
    erreur: mutation.error,
    calculer: mutation.mutateAsync,
  };
}
