/**
 * Règles de validation métier pour les parcelles
 */

import { STATUTS_PARCELLE } from '../valeursObjets/statutParcelle';

export function validerParcelle(parcelle) {
  const erreurs = {};

  // Lotissement obligatoire
  if (!parcelle.idLotissement) {
    erreurs.idLotissement = 'Le lotissement est obligatoire';
  }

  // Numéro obligatoire
  if (!parcelle.numero || parcelle.numero.trim() === '') {
    erreurs.numero = 'Le numéro de parcelle est obligatoire';
  }

  // Superficie positive
  if (!parcelle.superficie) {
    erreurs.superficie = 'La superficie est obligatoire';
  } else {
    const superficie = parseFloat(parcelle.superficie);
    if (isNaN(superficie) || superficie <= 0) {
      erreurs.superficie = 'La superficie doit être un nombre positif';
    }
  }

  // Prix positif
  if (!parcelle.prix) {
    erreurs.prix = 'Le prix est obligatoire';
  } else {
    const prix = parseFloat(parcelle.prix);
    if (isNaN(prix) || prix <= 0) {
      erreurs.prix = 'Le prix doit être un nombre positif';
    }
  }

  // Statut valide
  if (parcelle.statut && !Object.values(STATUTS_PARCELLE).includes(parcelle.statut)) {
    erreurs.statut = 'Statut invalide';
  }

  return erreurs;
}
