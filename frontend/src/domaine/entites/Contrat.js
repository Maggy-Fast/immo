/**
 * Entité Contrat — Domaine
 * Représentation pure d'un contrat de bail
 */

export class Contrat {
  constructor({
    id = null,
    idBien,
    idLocataire,
    dateDebut,
    dateFin,
    loyerMensuel,
    caution,
    statut = 'actif',
    bien = null,
    locataire = null,
    idTenant = null,
    creeLe = null,
    modifieLe = null,
  }) {
    this.id = id;
    this.idBien = idBien;
    this.idLocataire = idLocataire;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.loyerMensuel = loyerMensuel;
    this.caution = caution;
    this.statut = statut;
    this.bien = bien;
    this.locataire = locataire;
    this.idTenant = idTenant;
    this.creeLe = creeLe;
    this.modifieLe = modifieLe;
  }

  estActif() {
    return this.statut === 'actif';
  }

  estExpire() {
    return this.statut === 'expire';
  }

  estResilie() {
    return this.statut === 'resilie';
  }

  dureeEnMois() {
    if (!this.dateDebut || !this.dateFin) return 0;
    const debut = new Date(this.dateDebut);
    const fin = new Date(this.dateFin);
    return Math.round((fin - debut) / (1000 * 60 * 60 * 24 * 30));
  }
}
