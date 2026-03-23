import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../../application/hooks/usePermissions';

/**
 * Guard de route par rôle — Protège les routes selon le rôle de l'utilisateur
 * 
 * @param {string[]} rolesAutorises - Liste des noms de rôles autorisés (ex: ['super_admin'])
 * @param {React.ReactNode} children - Contenu à afficher si autorisé
 */
export default function RouteProtegeeParRole({ rolesAutorises = [], children }) {
    const { role } = usePermissions();
    const localisation = useLocation();

    // Si super_admin, toujours autorisé
    if (role === 'super_admin') {
        return children;
    }

    // Vérifier si le rôle courant est dans la liste des rôles autorisés
    if (rolesAutorises.length > 0 && !rolesAutorises.includes(role)) {
        return <Navigate to="/acces-interdit" state={{ from: localisation.pathname }} replace />;
    }

    return children;
}
