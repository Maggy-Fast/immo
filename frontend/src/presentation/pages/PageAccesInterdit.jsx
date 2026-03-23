import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import { usePermissions } from '../../application/hooks/usePermissions';
import './PageAccesInterdit.css';

/**
 * Page 403 — Accès interdit
 */
export default function PageAccesInterdit() {
    const naviguer = useNavigate();
    const localisation = useLocation();
    const { roleLibelle } = usePermissions();
    const chemin = localisation.state?.from || '';

    return (
        <div className="acces-interdit">
            <div className="acces-interdit__carte">
                <div className="acces-interdit__icone">
                    <ShieldOff size={48} />
                </div>
                <h1 className="acces-interdit__titre">Accès refusé</h1>
                <p className="acces-interdit__message">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette section.
                </p>
                {chemin && (
                    <p className="acces-interdit__chemin">
                        Route demandée : <code>{chemin}</code>
                    </p>
                )}
                {roleLibelle && (
                    <p className="acces-interdit__role">
                        Votre rôle actuel : <strong>{roleLibelle}</strong>
                    </p>
                )}
                <div className="acces-interdit__actions">
                    <button 
                        className="acces-interdit__btn acces-interdit__btn--retour"
                        onClick={() => naviguer(-1)}
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <button 
                        className="acces-interdit__btn acces-interdit__btn--accueil"
                        onClick={() => naviguer('/')}
                    >
                        <Home size={18} />
                        Tableau de bord
                    </button>
                </div>
            </div>
        </div>
    );
}
