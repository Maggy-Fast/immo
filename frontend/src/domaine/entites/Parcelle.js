/**
 * Entité Parcelle — Domaine
 * Représentation pure d'une parcelle
 */

export class Parcelle {
  constructor({
    id = null,
    idLotissement,
    numero,
    superficie,
    prix,
    statut = 'disponible',
    lotissement = null,
    idTenant = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.idLotissement = idLotissement;
    this.numero = numero;
    this.superficie = superficie;
    this.prix = prix;
    this.statut = statut;
    this.lotissement = lotissement;
    this.idTenant = idTenant;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  estDisponible() {
    return this.statut === 'disponible';
  }

  estReserve() {
    return this.statut === 'reserve';
  }

  estVendu() {
    return this.statut === 'vendu';
  }

  prixParM2() {
    if (this.superficie === 0) return 0;
    return Math.round(this.prix / this.superficie);
  }
}
