/**
 * Entité Loyer — Domaine
 * Représentation pure d'un loyer
 */

export class Loyer {
  constructor({
    id = null,
    idContrat,
    mois,
    montant,
    montantPaye = 0,
    statut = 'impaye',
    modePaiement = null,
    datePaiement = null,
    contrat = null,
    quittanceDisponible = false,
    idTenant = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.idContrat = idContrat;
    this.mois = mois;
    this.montant = montant;
    this.montantPaye = montantPaye;
    this.statut = statut;
    this.modePaiement = modePaiement;
    this.datePaiement = datePaiement;
    this.contrat = contrat;
    this.quittanceDisponible = quittanceDisponible;
    this.idTenant = idTenant;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  estPaye() {
    return this.statut === 'paye';
  }

  estImpaye() {
    return this.statut === 'impaye';
  }

  estPartiel() {
    return this.statut === 'partiel';
  }

  estEnRetard() {
    return this.statut === 'en_retard';
  }

  montantRestant() {
    return this.montant - this.montantPaye;
  }

  pourcentagePaye() {
    if (this.montant === 0) return 0;
    return Math.round((this.montantPaye / this.montant) * 100);
  }
}
