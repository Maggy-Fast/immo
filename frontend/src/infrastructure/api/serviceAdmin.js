import clientHttp from './clientHttp';

/**
 * Service API — Administration Globale (Super Admin)
 */
export const serviceAdmin = {
    /**
     * Gestion des Plans
     */
    async listerPlans() {
        const reponse = await clientHttp.get('/admin/plans');
        return reponse.data.data;
    },

    async obtenirPlan(id) {
        const reponse = await clientHttp.get(`/admin/plans/${id}`);
        return reponse.data.data;
    },

    async creerPlan(donnees) {
        const reponse = await clientHttp.post('/admin/plans', donnees);
        return reponse.data;
    },

    async modifierPlan(id, donnees) {
        const reponse = await clientHttp.put(`/admin/plans/${id}`, donnees);
        return reponse.data;
    },

    async supprimerPlan(id) {
        const reponse = await clientHttp.delete(`/admin/plans/${id}`);
        return reponse.data;
    },

    /**
     * Gestion des Tenants
     */
    async listerTenants() {
        const reponse = await clientHttp.get('/admin/tenants');
        return reponse.data.data;
    },

    async obtenirTenant(id) {
        const reponse = await clientHttp.get(`/admin/tenants/${id}`);
        return reponse.data.data;
    },

    async creerTenant(donnees) {
        const reponse = await clientHttp.post('/admin/tenants', donnees);
        return reponse.data;
    },

    async modifierTenant(id, donnees) {
        const reponse = await clientHttp.put(`/admin/tenants/${id}`, donnees);
        return reponse.data;
    },

    async supprimerTenant(id) {
        const reponse = await clientHttp.delete(`/admin/tenants/${id}`);
        return reponse.data;
    },

    /**
     * Gestion Globale des Utilisateurs
     */
    async listerUtilisateursGlobaux(params = {}) {
        const reponse = await clientHttp.get('/admin/utilisateurs', { params });
        return reponse.data.data;
    },

    async reinitialiserMotDePasse(id, nouveau_mot_de_passe) {
        const reponse = await clientHttp.post(`/admin/utilisateurs/${id}/reinitialiser-password`, {
            nouveau_mot_de_passe
        });
        return reponse.data;
    },

    /**
     * Audit Logs
     */
    async listerAuditLogs(params = {}) {
        const reponse = await clientHttp.get('/admin/audit', { params });
        return reponse.data.data;
    },

    async obtenirAuditLog(id) {
        const reponse = await clientHttp.get(`/admin/audit/${id}`);
        return reponse.data.data;
    }
};
