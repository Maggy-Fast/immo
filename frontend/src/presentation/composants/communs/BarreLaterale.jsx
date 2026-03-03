import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { utiliserAuth } from '../../../application/contexte/ContexteAuth';
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCheck,
    FileText,
    DollarSign,
    Map,
    Brain,
    Grid3X3,
    Handshake,
    FolderLock,
    Hammer,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import './BarreLaterale.css';

const LIENS_NAVIGATION = [
    { chemin: '/', icone: LayoutDashboard, libelle: 'Tableau de bord' },
    { chemin: '/biens', icone: Building2, libelle: 'Biens' },
    { chemin: '/proprietaires', icone: Users, libelle: 'Propriétaires' },
    { chemin: '/locataires', icone: UserCheck, libelle: 'Locataires' },
    { chemin: '/contrats', icone: FileText, libelle: 'Contrats' },
    { chemin: '/loyers', icone: DollarSign, libelle: 'Loyers' },
    { chemin: '/lotissements', icone: Grid3X3, libelle: 'Lotissements' },
    { chemin: '/partenariats', icone: Handshake, libelle: 'Partenariats' },
    { chemin: '/documents', icone: FolderLock, libelle: 'Documents' },
    { chemin: '/travaux', icone: Hammer, libelle: 'Travaux' },
    { chemin: '/carte', icone: Map, libelle: 'Carte' },
    { chemin: '/ia', icone: Brain, libelle: 'IA Documents' },
];

/**
 * Barre Latérale — Navigation principale
 */
export default function BarreLaterale() {
    const [reduite, definirReduite] = useState(false);
    const { utilisateur, deconnecter } = utiliserAuth();
    const localisation = useLocation();

    return (
        <aside className={`sidebar ${reduite ? 'sidebar--reduite' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icone">
                    <Building2 size={22} />
                </div>
                {!reduite && (
                    <span className="sidebar__logo-texte">
                        Maggy<span>Fast</span>
                    </span>
                )}
            </div>

            {/* Toggle */}
            <button
                className="sidebar__toggle"
                onClick={() => definirReduite(!reduite)}
                title={reduite ? 'Agrandir' : 'Réduire'}
            >
                {reduite ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {LIENS_NAVIGATION.map(({ chemin, icone: Icone, libelle }) => (
                    <NavLink
                        key={chemin}
                        to={chemin}
                        className={({ isActive }) =>
                            `sidebar__lien ${isActive ? 'sidebar__lien--actif' : ''}`
                        }
                        title={reduite ? libelle : undefined}
                        end={chemin === '/'}
                    >
                        <Icone size={20} />
                        {!reduite && <span>{libelle}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Pied */}
            <div className="sidebar__pied">
                {!reduite && utilisateur && (
                    <div className="sidebar__utilisateur">
                        <div className="sidebar__avatar">
                            {utilisateur.nom?.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar__utilisateur-info">
                            <span className="sidebar__utilisateur-nom">{utilisateur.nom}</span>
                            <span className="sidebar__utilisateur-role">{utilisateur.role}</span>
                        </div>
                    </div>
                )}

                <NavLink to="/parametres" className="sidebar__lien" title="Paramètres">
                    <Settings size={20} />
                    {!reduite && <span>Paramètres</span>}
                </NavLink>

                <button className="sidebar__lien sidebar__deconnexion" onClick={deconnecter}>
                    <LogOut size={20} />
                    {!reduite && <span>Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
}
