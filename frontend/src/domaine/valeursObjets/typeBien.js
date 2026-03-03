/**
 * Value Object — Types de biens
 */

export const TYPES_BIEN = {
  APPARTEMENT: 'appartement',
  MAISON: 'maison',
  TERRAIN: 'terrain',
  COMMERCE: 'commerce',
};

export const LABELS_TYPES_BIEN = {
  [TYPES_BIEN.APPARTEMENT]: 'Appartement',
  [TYPES_BIEN.MAISON]: 'Maison',
  [TYPES_BIEN.TERRAIN]: 'Terrain',
  [TYPES_BIEN.COMMERCE]: 'Commerce',
};

export const OPTIONS_TYPES_BIEN = Object.entries(LABELS_TYPES_BIEN).map(([valeur, label]) => ({
  valeur,
  label,
}));
