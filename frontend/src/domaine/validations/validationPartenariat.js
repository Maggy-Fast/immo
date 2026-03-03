/**
 * Règles de validation métier pour les partenariats
 */

export function validerPartenariat(partenariat) {
  const erreurs = {};

  // Promoteur obligatoire
  if (!partenariat.idPromoteur) {
    erreurs.idPromoteur = 'Le promoteur est obligatoire';
  }

  // Propriétaire obligatoire
  if (!partenariat.idProprietaire) {
    erreurs.idProprietaire = 'Le propriétaire est obligatoire';
  }

  // Lotissement obligatoire
  if (!partenariat.idLotissement) {
    erreurs.idLotissement = 'Le lotissement est obligatoire';
  }

  // Ticket d'entrée positif
  if (!partenariat.ticketEntree) {
    erreurs.ticketEntree = "Le ticket d'entrée est obligatoire";
  } else {
    const ticket = parseFloat(partenariat.ticketEntree);
    if (isNaN(ticket) || ticket < 0) {
      erreurs.ticketEntree = "Le ticket d'entrée doit être un nombre positif ou zéro";
    }
  }

  // Pourcentage promoteur valide
  if (partenariat.pourcentagePromoteur === undefined || partenariat.pourcentagePromoteur === null || partenariat.pourcentagePromoteur === '') {
    erreurs.pourcentagePromoteur = 'Le pourcentage promoteur est obligatoire';
  } else {
    const pct = parseFloat(partenariat.pourcentagePromoteur);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      erreurs.pourcentagePromoteur = 'Le pourcentage doit être entre 0 et 100';
    }
  }

  // Pourcentage propriétaire valide
  if (partenariat.pourcentagePropriétaire === undefined || partenariat.pourcentagePropriétaire === null || partenariat.pourcentagePropriétaire === '') {
    erreurs.pourcentagePropriétaire = 'Le pourcentage propriétaire est obligatoire';
  } else {
    const pct = parseFloat(partenariat.pourcentagePropriétaire);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      erreurs.pourcentagePropriétaire = 'Le pourcentage doit être entre 0 et 100';
    }
  }

  // Vérifier que la somme des pourcentages = 100
  if (partenariat.pourcentagePromoteur && partenariat.pourcentagePropriétaire) {
    const somme = parseFloat(partenariat.pourcentagePromoteur) + parseFloat(partenariat.pourcentagePropriétaire);
    if (Math.abs(somme - 100) > 0.01) {
      erreurs.pourcentagePromoteur = 'La somme des pourcentages doit être égale à 100%';
      erreurs.pourcentagePropriétaire = 'La somme des pourcentages doit être égale à 100%';
    }
  }

  return erreurs;
}
