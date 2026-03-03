/**
 * Entité Partenariat — Domaine
 * Représentation pure d'un partenariat promoteur/propriétaire
 */

export class Partenariat {
  constructor({
    id = null,
    idPromoteur,
    idProprietaire,
    idLotissement,
    ticketEntree,
    pourcentagePromoteur,
    pourcentagePropriétaire,
    promoteur = null,
    proprietaire = null,
    lotissement = null,
    depenses = [],
    idTenant = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.idPromoteur = idPromoteur;
    this.idProprietaire = idProprietaire;
    this.idLotissement = idLotissement;
    this.ticketEntree = ticketEntree;
    this.pourcentagePromoteur = pourcentagePromoteur;
    this.pourcentagePropriétaire = pourcentagePropriétaire;
    this.promoteur = promoteur;
    this.proprietaire = proprietaire;
    this.lotissement = lotissement;
    this.depenses = depenses;
    this.idTenant = idTenant;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  totalDepenses() {
    return this.depenses.reduce((total, depense) => total + parseFloat(depense.montant), 0);
  }

  pourcentagesValides() {
    return Math.abs((this.pourcentagePromoteur + this.pourcentagePropriétaire) - 100) < 0.01;
  }
}
