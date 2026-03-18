import React from 'react';
import { usePermissions } from '../../../application/hooks/usePermissions';

/**
 * Composant pour protéger l'affichage basé sur les permissions
 * 
 * @param {string|string[]} permission - Permission(s) requise(s)
 * @param {boolean} requireAll - Si true, toutes les permissions sont requises (AND), sinon au moins une (OR)
 * @param {React.ReactNode} children - Contenu à afficher si autorisé
 * @param {React.ReactNode} fallback - Contenu à afficher si non autorisé
 */
const ProtectionPermission = ({ 
    permission, 
    requireAll = false, 
    children, 
    fallback = null 
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    let isAuthorized = false;

    if (Array.isArray(permission)) {
        isAuthorized = requireAll 
            ? hasAllPermissions(permission)
            : hasAnyPermission(permission);
    } else {
        isAuthorized = hasPermission(permission);
    }

    return isAuthorized ? <>{children}</> : <>{fallback}</>;
};

export default ProtectionPermission;
