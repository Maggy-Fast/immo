import { Shield, Users, Lock } from 'lucide-react';
import './CarteRole.css';

/**
 * Composant CarteRole — Affiche un rôle dans la liste
 */
export default function CarteRole({ role, actif, onClick }) {
    return (
        <div 
            className={`carte-role ${actif ? 'carte-role--active' : ''}`}
            onClick={onClick}
        >
            <div className="carte-role__entete">
                <div className="carte-role__icone">
                    <Shield size={20} />
                </div>
                <div className="carte-role__info">
                    <h3 className="carte-role__titre">{role.libelle}</h3>
                    <p className="carte-role__nom">{role.nom}</p>
                </div>
            </div>

            <div className="carte-role__stats">
                <div className="carte-role__stat">
                    <Lock size={14} />
                    <span>{role.permissions?.length || 0} permissions</span>
                </div>
                <div className="carte-role__stat">
                    <Users size={14} />
                    <span>{role.utilisateurs?.length || 0} utilisateurs</span>
                </div>
            </div>

            {role.systeme && (
                <div className="carte-role__badge">
                    <span className="badge badge--info">Système</span>
                </div>
            )}
        </div>
    );
}
