/**
 * Règles de validation métier pour les contrats
 */

import { STATUTS_CONTRAT } from '../valeursObjets/statutContrat';

export function validerContrat(contrat) {
  const erreurs = {};

  // Bien obligatoire
  if (!contrat.idBien) {
    erreurs.idBien = 'Le bien est obligatoire';
  }

  // Locataire obligatoire
  if (!contrat.idLocataire) {
    erreurs.idLocataire = 'Le locataire est obligatoire';
  }

  // Date de début obligatoire
  if (!contrat.dateDebut) {
    erreurs.dateDebut = 'La date de début est obligatoire';
  }

  // Date de fin obligatoire
  if (!contrat.dateFin) {
    erreurs.dateFin = 'La date de fin est obligatoire';
  }

  // Vérifier que date fin > date début
  if (contrat.dateDebut && contrat.dateFin) {
    const debut = new Date(contrat.dateDebut);
    const fin = new Date(contrat.dateFin);
    if (fin <= debut) {
      erreurs.dateFin = 'La date de fin doit être après la date de début';
    }
  }

  // Loyer mensuel obligatoire et positif
  if (!contrat.loyerMensuel) {
    erreurs.loyerMensuel = 'Le loyer mensuel est obligatoire';
  } else {
    const loyer = parseFloat(contrat.loyerMensuel);
    if (isNaN(loyer) || loyer <= 0) {
      erreurs.loyerMensuel = 'Le loyer doit être un nombre positif';
    }
  }

  // Caution obligatoire et positive
  if (!contrat.caution) {
    erreurs.caution = 'La caution est obligatoire';
  } else {
    const caution = parseFloat(contrat.caution);
    if (isNaN(caution) || caution < 0) {
      erreurs.caution = 'La caution doit être un nombre positif ou zéro';
    }
  }

  // Statut valide
  if (contrat.statut && !Object.values(STATUTS_CONTRAT).includes(contrat.statut)) {
    erreurs.statut = 'Statut invalide';
  }

  return erreurs;
}
