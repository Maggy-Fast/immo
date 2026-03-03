/**
 * Rôles utilisateur — Value Object
 */
export const ROLE_UTILISATEUR = {
    ADMIN: 'admin',
    PROPRIETAIRE: 'proprietaire',
    LOCATAIRE: 'locataire',
    AGENT: 'agent',
    PROMOTEUR: 'promoteur',
};

export const LIBELLES_ROLE = {
    [ROLE_UTILISATEUR.ADMIN]: 'Administrateur',
    [ROLE_UTILISATEUR.PROPRIETAIRE]: 'Propriétaire',
    [ROLE_UTILISATEUR.LOCATAIRE]: 'Locataire',
    [ROLE_UTILISATEUR.AGENT]: 'Agent',
    [ROLE_UTILISATEUR.PROMOTEUR]: 'Promoteur',
};
