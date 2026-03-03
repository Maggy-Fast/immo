/**
 * Règles de validation métier pour les propriétaires
 */

export function validerProprietaire(proprietaire) {
  const erreurs = {};

  // Nom obligatoire
  if (!proprietaire.nom || proprietaire.nom.trim() === '') {
    erreurs.nom = 'Le nom est obligatoire';
  } else if (proprietaire.nom.trim().length < 2) {
    erreurs.nom = 'Le nom doit contenir au moins 2 caractères';
  }

  // Téléphone obligatoire et format
  if (!proprietaire.telephone || proprietaire.telephone.trim() === '') {
    erreurs.telephone = 'Le téléphone est obligatoire';
  } else {
    const telephoneNettoye = proprietaire.telephone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{8,15}$/.test(telephoneNettoye)) {
      erreurs.telephone = 'Format de téléphone invalide';
    }
  }

  // Email obligatoire et format
  if (!proprietaire.email || proprietaire.email.trim() === '') {
    erreurs.email = "L'email est obligatoire";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(proprietaire.email)) {
      erreurs.email = 'Format email invalide';
    }
  }

  // CIN optionnel mais format si présent
  if (proprietaire.cin && proprietaire.cin.trim() !== '') {
    if (proprietaire.cin.trim().length < 5) {
      erreurs.cin = 'Le CIN doit contenir au moins 5 caractères';
    }
  }

  return erreurs;
}
