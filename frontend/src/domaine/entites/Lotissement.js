/**
 * Entité Lotissement — Domaine
 * Représentation pure d'un lotissement
 */

export class Lotissement {
  constructor({
    id = null,
    nom,
    localisation,
    superficieTotale,
    nombreParcelles,
    latitude = null,
    longitude = null,
    idTenant = null,
    parcelles = [],
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.nom = nom;
    this.localisation = localisation;
    this.superficieTotale = superficieTotale;
    this.nombreParcelles = nombreParcelles;
    this.latitude = latitude;
    this.longitude = longitude;
    this.idTenant = idTenant;
    this.parcelles = parcelles;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  aCoordonnees() {
    return this.latitude !== null && this.longitude !== null;
  }

  parcellesDisponibles() {
    return this.parcelles.filter(p => p.statut === 'disponible').length;
  }

  parcellesVendues() {
    return this.parcelles.filter(p => p.statut === 'vendu').length;
  }

  tauxOccupation() {
    if (this.nombreParcelles === 0) return 0;
    return Math.round((this.parcellesVendues() / this.nombreParcelles) * 100);
  }
}
