/**
 * Formate un montant en FCFA avec gestion des cas non numériques (NaN, null, undefined)
 * @param {number|string} montant - Le montant à formater
 * @returns {string} Le montant formaté ou "0 FCFA"
 */
export const formaterMontant = (montant) => {
  const valeur = parseFloat(montant);
  if (isNaN(valeur)) {
    return '0 FCFA';
  }
  return new Intl.NumberFormat('fr-FR').format(valeur) + ' FCFA';
};

/**
 * Formate un montant de manière abrégée (K, M)
 * @param {number|string} montant - Le montant à formater
 * @returns {string|number} Le montant abrégé
 */
export const formaterMontantCourt = (montant) => {
  const valeur = parseFloat(montant);
  if (isNaN(valeur)) {
    return '0';
  }
  
  if (valeur >= 1000000) {
    return (valeur / 1000000).toFixed(1) + 'M';
  }
  if (valeur >= 1000) {
    return (valeur / 1000).toFixed(0) + 'K';
  }
  return valeur.toString();
};
