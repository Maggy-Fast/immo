import { utiliserAuth } from '../contexte/ContexteAuth';

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

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isSuperAdmin,
        isAdmin,
        permissions: utilisateur?.role_info?.permissions || [],
        role: utilisateur?.role_info?.nom || null,
        roleLibelle: utilisateur?.role_info?.libelle || null,
    };
};
