/**
 * Value Object — Statuts de loyers
 */

export const STATUTS_LOYER = {
  IMPAYE: 'impaye',
  PAYE: 'paye',
  PARTIEL: 'partiel',
  EN_RETARD: 'en_retard',
};

export const LABELS_STATUTS_LOYER = {
  [STATUTS_LOYER.IMPAYE]: 'Impayé',
  [STATUTS_LOYER.PAYE]: 'Payé',
  [STATUTS_LOYER.PARTIEL]: 'Partiel',
  [STATUTS_LOYER.EN_RETARD]: 'En retard',
};

export const COULEURS_STATUTS_LOYER = {
  [STATUTS_LOYER.IMPAYE]: 'secondary',
  [STATUTS_LOYER.PAYE]: 'success',
  [STATUTS_LOYER.PARTIEL]: 'warning',
  [STATUTS_LOYER.EN_RETARD]: 'danger',
};

export const OPTIONS_STATUTS_LOYER = Object.entries(LABELS_STATUTS_LOYER).map(([valeur, label]) => ({
  valeur,
  label,
}));
