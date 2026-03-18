import clientHttp from './clientHttp';

/**
 * Service API — Gestion des Rôles et Permissions
 */
export const serviceRole = {
    /**
     * Lister tous les rôles
     */
    async listerRoles() {
        const reponse = await clientHttp.get('/roles');
        return reponse.data.data;
    },

    /**
     * Obtenir un rôle spécifique
     */
    async obtenirRole(id) {
        const reponse = await clientHttp.get(`/roles/${id}`);
        return reponse.data.data;
    },

    /**
     * Créer un nouveau rôle
     */
    async creerRole(donnees) {
        const reponse = await clientHttp.post('/roles', donnees);
        return reponse.data.data;
    },

    /**
     * Modifier un rôle
     */
    async modifierRole(id, donnees) {
        const reponse = await clientHttp.put(`/roles/${id}`, donnees);
        return reponse.data.data;
    },

    /**
     * Supprimer un rôle
     */
    async supprimerRole(id) {
        const reponse = await clientHttp.delete(`/roles/${id}`);
        return reponse.data;
    },

    /**
     * Lister toutes les permissions (groupées par module)
     */
    async listerPermissions() {
        const reponse = await clientHttp.get('/roles/permissions');
        return reponse.data.data;
    },

    /**
     * Obtenir les permissions d'un rôle
     */
    async obtenirPermissionsRole(id) {
        const reponse = await clientHttp.get(`/roles/${id}/permissions`);
        return reponse.data.data;
    },

    /**
     * Assigner des permissions à un rôle
     */
    async assignerPermissions(id, permissions) {
        const reponse = await clientHttp.post(`/roles/${id}/permissions`, { permissions });
        return reponse.data.data;
    },
};
