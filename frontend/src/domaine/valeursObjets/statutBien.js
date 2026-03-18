/**
 * Value Object — Statuts de biens
 */

export const STATUTS_BIEN = {
  DISPONIBLE: 'disponible',
  EN_VENTE: 'en_vente',
  RESERVE: 'reserve',
  VENDU: 'vendu',
  LOUE: 'loue',
  EN_TRAVAUX: 'en_travaux',
};

export const LABELS_STATUTS_BIEN = {
  [STATUTS_BIEN.DISPONIBLE]: 'Disponible',
  [STATUTS_BIEN.EN_VENTE]: 'En vente',
  [STATUTS_BIEN.RESERVE]: 'Réservé',
  [STATUTS_BIEN.VENDU]: 'Vendu',
  [STATUTS_BIEN.LOUE]: 'Loué',
  [STATUTS_BIEN.EN_TRAVAUX]: 'En travaux',
};

export const COULEURS_STATUTS_BIEN = {
  [STATUTS_BIEN.DISPONIBLE]: 'success',
  [STATUTS_BIEN.EN_VENTE]: 'info',
  [STATUTS_BIEN.RESERVE]: 'warning',
  [STATUTS_BIEN.VENDU]: 'danger',
  [STATUTS_BIEN.LOUE]: 'primary',
  [STATUTS_BIEN.EN_TRAVAUX]: 'secondary',
};

export const OPTIONS_STATUTS_BIEN = Object.entries(LABELS_STATUTS_BIEN).map(([valeur, label]) => ({
  valeur,
  label,
}));
