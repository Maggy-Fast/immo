/**
 * Entité Bien — Domaine
 * Représentation pure d'un bien immobilier
 */

export class Bien {
  constructor({
    id = null,
    type,
    adresse,
    superficie,
    prix,
    statut = 'disponible',
    latitude = null,
    longitude = null,
    description = '',
    idProprietaire,
    proprietaire = null,
    idTenant = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.type = type;
    this.adresse = adresse;
    this.superficie = superficie;
    this.prix = prix;
    this.statut = statut;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.idProprietaire = idProprietaire;
    this.proprietaire = proprietaire;
    this.idTenant = idTenant;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  estDisponible() {
    return this.statut === 'disponible';
  }

  estLoue() {
    return this.statut === 'loue';
  }

  estVendu() {
    return this.statut === 'vendu';
  }

  aCoordonnees() {
    return this.latitude !== null && this.longitude !== null;
  }
}
