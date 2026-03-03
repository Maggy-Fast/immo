/**
 * Règles de validation métier pour les biens
 */

import { TYPES_BIEN } from '../valeursObjets/typeBien';
import { STATUTS_BIEN } from '../valeursObjets/statutBien';

export function validerBien(bien) {
  const erreurs = {};

  // Type obligatoire
  if (!bien.type) {
    erreurs.type = 'Le type de bien est obligatoire';
  } else if (!Object.values(TYPES_BIEN).includes(bien.type)) {
    erreurs.type = 'Type de bien invalide';
  }

  // Adresse obligatoire
  if (!bien.adresse || bien.adresse.trim() === '') {
    erreurs.adresse = "L'adresse est obligatoire";
  }

  // Superficie positive
  if (bien.superficie !== undefined && bien.superficie !== null) {
    const superficie = parseFloat(bien.superficie);
    if (isNaN(superficie) || superficie <= 0) {
      erreurs.superficie = 'La superficie doit être un nombre positif';
    }
  }

  // Prix positif
  if (bien.prix !== undefined && bien.prix !== null) {
    const prix = parseFloat(bien.prix);
    if (isNaN(prix) || prix <= 0) {
      erreurs.prix = 'Le prix doit être un nombre positif';
    }
  }

  // Statut valide
  if (bien.statut && !Object.values(STATUTS_BIEN).includes(bien.statut)) {
    erreurs.statut = 'Statut invalide';
  }

  // Propriétaire obligatoire
  if (!bien.idProprietaire) {
    erreurs.idProprietaire = 'Le propriétaire est obligatoire';
  }

  // Coordonnées GPS (optionnelles mais cohérentes)
  if (bien.latitude !== undefined && bien.latitude !== null) {
    const lat = parseFloat(bien.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      erreurs.latitude = 'Latitude invalide (entre -90 et 90)';
    }
  }

  if (bien.longitude !== undefined && bien.longitude !== null) {
    const lng = parseFloat(bien.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      erreurs.longitude = 'Longitude invalide (entre -180 et 180)';
    }
  }

  return erreurs;
}
