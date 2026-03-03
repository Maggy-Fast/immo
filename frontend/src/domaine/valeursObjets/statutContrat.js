/**
 * Value Object — Statuts de contrats
 */

export const STATUTS_CONTRAT = {
  ACTIF: 'actif',
  EXPIRE: 'expire',
  RESILIE: 'resilie',
  EN_ATTENTE: 'en_attente',
};

export const LABELS_STATUTS_CONTRAT = {
  [STATUTS_CONTRAT.ACTIF]: 'Actif',
  [STATUTS_CONTRAT.EXPIRE]: 'Expiré',
  [STATUTS_CONTRAT.RESILIE]: 'Résilié',
  [STATUTS_CONTRAT.EN_ATTENTE]: 'En attente',
};

export const COULEURS_STATUTS_CONTRAT = {
  [STATUTS_CONTRAT.ACTIF]: 'success',
  [STATUTS_CONTRAT.EXPIRE]: 'warning',
  [STATUTS_CONTRAT.RESILIE]: 'danger',
  [STATUTS_CONTRAT.EN_ATTENTE]: 'secondary',
};

export const OPTIONS_STATUTS_CONTRAT = Object.entries(LABELS_STATUTS_CONTRAT).map(([valeur, label]) => ({
  valeur,
  label,
}));
