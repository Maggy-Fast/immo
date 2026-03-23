/**
 * Rôles utilisateur — Value Object
 */
export const ROLE_UTILISATEUR = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',          // = Tenant Admin
    GESTIONNAIRE: 'gestionnaire',
    AGENT: 'agent',
    PROPRIETAIRE: 'proprietaire',
    LOCATAIRE: 'locataire',
    PROMOTEUR: 'promoteur',
};

export const LIBELLES_ROLE = {
    [ROLE_UTILISATEUR.SUPER_ADMIN]: 'Super Administrateur',
    [ROLE_UTILISATEUR.ADMIN]: 'Tenant',
    [ROLE_UTILISATEUR.GESTIONNAIRE]: 'Gestionnaire',
    [ROLE_UTILISATEUR.AGENT]: 'Agent',
    [ROLE_UTILISATEUR.PROPRIETAIRE]: 'Propriétaire',
    [ROLE_UTILISATEUR.LOCATAIRE]: 'Locataire',
    [ROLE_UTILISATEUR.PROMOTEUR]: 'Promoteur',
};

/**
 * Routes réservées au super_admin uniquement
 */
export const ROUTES_SUPER_ADMIN = [
    '/admin/tenants',
    '/admin/utilisateurs',
    '/admin/audit',
    '/roles',
];

/**
 * Routes accessibles à tous les utilisateurs connectés (tenant)
 */
export const ROUTES_TENANT = [
    '/',
    '/biens',
    '/proprietaires',
    '/locataires',
    '/contrats',
    '/loyers',
    '/lotissements',
    '/partenariats',
    '/documents',
    '/travaux',
    '/carte',
    '/ia',
    '/whatsapp',
    '/cooperative',
    '/cooperative/groupes',
    '/cooperative/adherents',
    '/cooperative/cotisations',
    '/cooperative/parcelles',
    '/parametres',
];

/**
 * Vérifie si un rôle a accès à une route donnée
 */
export function roleAutorise(roleNom, chemin) {
    // Super admin a accès à tout
    if (roleNom === ROLE_UTILISATEUR.SUPER_ADMIN) return true;

    // Les routes admin sont réservées au super_admin
    if (ROUTES_SUPER_ADMIN.some(r => chemin.startsWith(r))) return false;

    // Toutes les autres routes sont accessibles aux rôles tenant
    return true;
}
