/**
 * Règles de validation métier pour les locataires
 */

export function validerLocataire(locataire) {
  const erreurs = {};

  // Nom obligatoire
  if (!locataire.nom || locataire.nom.trim() === '') {
    erreurs.nom = 'Le nom est obligatoire';
  } else if (locataire.nom.trim().length < 2) {
    erreurs.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  // Téléphone obligatoire et format
  if (!locataire.telephone || locataire.telephone.trim() === '') {
    erreurs.telephone = 'Le téléphone est obligatoire';
  } else {
    const telephoneNettoye = locataire.telephone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(telephoneNettoye)) {
      erreurs.telephone = 'Format de téléphone invalide';
    }
  }

  // Email obligatoire et format
  if (!locataire.email || locataire.email.trim() === '') {
    erreurs.email = "L'email est obligatoire";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(locataire.email)) {
      erreurs.email = 'Format email invalide';
    }
  }

  // CIN optionnel mais format si présent
  if (locataire.cin && locataire.cin.trim() !== '') {
    if (locataire.cin.trim().length < 5) {
      erreurs.cin = 'Le CIN doit contenir au moins 5 caractères';
    }
  }

  return erreurs;
}
