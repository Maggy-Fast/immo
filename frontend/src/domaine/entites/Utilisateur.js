/**
 * Entité Utilisateur — Domaine pur
 */
export class Utilisateur {
    constructor({ id, nom, email, role, telephone, idTenant }) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.role = role;
        this.telephone = telephone;
        this.idTenant = idTenant;
    }

    estAdmin() {
        return this.role === 'admin';
    }

    estProprietaire() {
        return this.role === 'proprietaire';
    }

    estLocataire() {
        return this.role === 'locataire';
    }

    estAgent() {
        return this.role === 'agent';
    }

    estPromoteur() {
        return this.role === 'promoteur';
    }
}
