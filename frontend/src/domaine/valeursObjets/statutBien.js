/**
 * Value Object — Statuts de biens
 */

export const STATUTS_BIEN = {
  DISPONIBLE: 'disponible',
  LOUE: 'loue',
  VENDU: 'vendu',
  EN_TRAVAUX: 'en_travaux',
};

export const LABELS_STATUTS_BIEN = {
  [STATUTS_BIEN.DISPONIBLE]: 'Disponible',
  [STATUTS_BIEN.LOUE]: 'Loué',
  [STATUTS_BIEN.VENDU]: 'Vendu',
  [STATUTS_BIEN.EN_TRAVAUX]: 'En travaux',
};

export const COULEURS_STATUTS_BIEN = {
  [STATUTS_BIEN.DISPONIBLE]: 'success',
  [STATUTS_BIEN.LOUE]: 'info',
  [STATUTS_BIEN.VENDU]: 'warning',
  [STATUTS_BIEN.EN_TRAVAUX]: 'secondary',
};

export const OPTIONS_STATUTS_BIEN = Object.entries(LABELS_STATUTS_BIEN).map(([valeur, label]) => ({
  valeur,
  label,
}));
