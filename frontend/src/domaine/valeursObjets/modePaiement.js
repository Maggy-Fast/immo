/**
 * Value Object — Modes de paiement
 */

export const MODES_PAIEMENT = {
  ESPECES: 'especes',
  VIREMENT: 'virement',
  CHEQUE: 'cheque',
  WAVE: 'wave',
  ORANGE_MONEY: 'orange_money',
};

export const LABELS_MODES_PAIEMENT = {
  [MODES_PAIEMENT.ESPECES]: 'Espèces',
  [MODES_PAIEMENT.VIREMENT]: 'Virement bancaire',
  [MODES_PAIEMENT.CHEQUE]: 'Chèque',
  [MODES_PAIEMENT.WAVE]: 'Wave',
  [MODES_PAIEMENT.ORANGE_MONEY]: 'Orange Money',
};

export const OPTIONS_MODES_PAIEMENT = Object.entries(LABELS_MODES_PAIEMENT).map(([valeur, label]) => ({
  valeur,
  label,
}));
