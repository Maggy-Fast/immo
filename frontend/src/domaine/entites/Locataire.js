/**
 * Entité Locataire — Domaine
 * Représentation pure d'un locataire
 */

export class Locataire {
  constructor({
    id = null,
    nom,
    telephone,
    email,
    cin = '',
    profession = '',
    idUtilisateur = null,
    idTenant = null,
    contratActif = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.nom = nom;
    this.telephone = telephone;
    this.email = email;
    this.cin = cin;
    this.profession = profession;
    this.idUtilisateur = idUtilisateur;
    this.idTenant = idTenant;
    this.contratActif = contratActif;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  aContratActif() {
    return this.contratActif !== null;
  }
}
