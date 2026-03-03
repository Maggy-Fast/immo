/**
 * Entité Propriétaire — Domaine
 * Représentation pure d'un propriétaire
 */

export class Proprietaire {
  constructor({
    id = null,
    nom,
    telephone,
    email,
    adresse = '',
    cin = '',
    idUtilisateur = null,
    idTenant = null,
    nombreBiens = 0,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.nom = nom;
    this.telephone = telephone;
    this.email = email;
    this.adresse = adresse;
    this.cin = cin;
    this.idUtilisateur = idUtilisateur;
    this.idTenant = idTenant;
    this.nombreBiens = nombreBiens;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  aPlusieursBiens() {
    return this.nombreBiens > 1;
  }

  estActif() {
    return this.nombreBiens > 0;
  }
}
