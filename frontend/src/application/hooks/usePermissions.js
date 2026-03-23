import { utiliserAuth } from '../contexte/ContexteAuth';
import { roleAutorise } from '../../domaine/valeursObjets/roleUtilisateur';

export const usePermissions = () => {
    const { utilisateur } = utiliserAuth();

    const hasPermission = (permission) => {
        if (!utilisateur?.role_info) return false;
        
        // Super admin a tous les droits
        if (utilisateur.role_info.nom === 'super_admin') return true;
        
        return utilisateur.role_info.permissions?.includes(permission) || false;
    };

    const hasAnyPermission = (permissions) => {
        if (!Array.isArray(permissions)) return false;
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions) => {
        if (!Array.isArray(permissions)) return false;
        return permissions.every(permission => hasPermission(permission));
    };

    const isSuperAdmin = () => {
        return utilisateur?.role_info?.nom === 'super_admin';
    };

    const isAdmin = () => {
        return utilisateur?.role_info?.nom === 'admin' || isSuperAdmin();
    };

    const isGestionnaire = () => {
        return utilisateur?.role_info?.nom === 'gestionnaire';
    };

    const isAgent = () => {
        return utilisateur?.role_info?.nom === 'agent';
    };

    /**
     * Vérifie si l'utilisateur courant peut accéder à une route
     */
    const canAccessRoute = (chemin) => {
        const roleNom = utilisateur?.role_info?.nom;
        if (!roleNom) return false;
        return roleAutorise(roleNom, chemin);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isSuperAdmin,
        isAdmin,
        isGestionnaire,
        isAgent,
        canAccessRoute,
        permissions: utilisateur?.role_info?.permissions || [],
        role: utilisateur?.role_info?.nom || null,
        roleLibelle: utilisateur?.role_info?.libelle || null,
    };
};
