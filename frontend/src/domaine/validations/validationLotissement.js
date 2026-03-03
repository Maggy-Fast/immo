/**
 * Règles de validation métier pour les lotissements
 */

export function validerLotissement(lotissement) {
  const erreurs = {};

  // Nom obligatoire
  if (!lotissement.nom || lotissement.nom.trim() === '') {
    erreurs.nom = 'Le nom est obligatoire';
  }

  // Localisation obligatoire
  if (!lotissement.localisation || lotissement.localisation.trim() === '') {
    erreurs.localisation = 'La localisation est obligatoire';
  }

  // Superficie totale positive
  if (lotissement.superficieTotale !== undefined && lotissement.superficieTotale !== null) {
    const superficie = parseFloat(lotissement.superficieTotale);
    if (isNaN(superficie) || superficie <= 0) {
      erreurs.superficieTotale = 'La superficie doit être un nombre positif';
    }
  }

  // Nombre de parcelles positif
  if (lotissement.nombreParcelles !== undefined && lotissement.nombreParcelles !== null) {
    const nombre = parseInt(lotissement.nombreParcelles);
    if (isNaN(nombre) || nombre <= 0) {
      erreurs.nombreParcelles = 'Le nombre de parcelles doit être un nombre positif';
    }
  }

  // Coordonnées GPS (optionnelles mais cohérentes)
  if (lotissement.latitude !== undefined && lotissement.latitude !== null && lotissement.latitude !== '') {
    const lat = parseFloat(lotissement.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      erreurs.latitude = 'Latitude invalide (entre -90 et 90)';
    }
  }

  if (lotissement.longitude !== undefined && lotissement.longitude !== null && lotissement.longitude !== '') {
    const lng = parseFloat(lotissement.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      erreurs.longitude = 'Longitude invalide (entre -180 et 180)';
    }
  }

  return erreurs;
}
