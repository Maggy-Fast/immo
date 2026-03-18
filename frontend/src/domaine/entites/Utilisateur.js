/**
 * Entité Utilisateur — Domaine pur
 */
export class Utilisateur {
    constructor({ id, nom, email, role, telephone, idTenant, role_info, id_role }) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.role = role;
        this.telephone = telephone;
        this.idTenant = idTenant;
        this.role_info = role_info;
        this.id_role = id_role;
    }

    estAdmin() {
        return this.role === 'admin' || this.role_info?.nom === 'admin';
    }

    estSuperAdmin() {
        return this.role_info?.nom === 'super_admin';
    }

    estProprietaire() {
        return this.role === 'proprietaire';
    }

    estLocataire() {
        return this.role === 'locataire';
    }

    estAgent() {
        return this.role === 'agent' || this.role_info?.nom === 'agent';
    }

    estPromoteur() {
        return this.role === 'promoteur';
    }

    estGestionnaire() {
        return this.role_info?.nom === 'gestionnaire';
    }
}
