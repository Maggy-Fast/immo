/**
 * Value Object — Statuts de parcelles
 */

export const STATUTS_PARCELLE = {
  DISPONIBLE: 'disponible',
  RESERVE: 'reserve',
  VENDU: 'vendu',
};

export const LABELS_STATUTS_PARCELLE = {
  [STATUTS_PARCELLE.DISPONIBLE]: 'Disponible',
  [STATUTS_PARCELLE.RESERVE]: 'Réservé',
  [STATUTS_PARCELLE.VENDU]: 'Vendu',
};

export const COULEURS_STATUTS_PARCELLE = {
  [STATUTS_PARCELLE.DISPONIBLE]: 'success',
  [STATUTS_PARCELLE.RESERVE]: 'warning',
  [STATUTS_PARCELLE.VENDU]: 'secondary',
};

export const OPTIONS_STATUTS_PARCELLE = Object.entries(LABELS_STATUTS_PARCELLE).map(([valeur, label]) => ({
  valeur,
  label,
}));
