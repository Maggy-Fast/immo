import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { utiliserAuth } from '../../../application/contexte/ContexteAuth';
import { usePermissions } from '../../../application/hooks/usePermissions';
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
    Shield,
    Home,
    MessageSquare,
    Globe,
    UserCog,
    Activity,
    ScrollText
} from 'lucide-react';
import './BarreLaterale.css';

/**
 * Navigation Immobilier — accessible à tous les rôles
 */
const LIENS_IMMOBILIER = [
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
];

/**
 * Outils — accessible à tous les rôles
 */
const LIENS_OUTILS = [
    { chemin: '/ia', icone: Brain, libelle: 'IA Documents' },
    { chemin: '/whatsapp', icone: MessageSquare, libelle: 'Notifications WhatsApp' },
];

/**
 * Navigation Coopérative — accessible à tous les rôles
 */
const LIENS_COOPERATIVE = [
    { chemin: '/cooperative', icone: Home, libelle: 'Tableau de bord' },
    { chemin: '/cooperative/groupes', icone: Grid3X3, libelle: 'Groupes' },
    { chemin: '/cooperative/adherents', icone: Users, libelle: 'Adhérents' },
    { chemin: '/cooperative/cotisations', icone: DollarSign, libelle: 'Cotisations' },
    { chemin: '/cooperative/parcelles', icone: Grid3X3, libelle: 'Parcelles' },
];

/**
 * Administration Globale — super_admin UNIQUEMENT
 */
const LIENS_ADMIN_GLOBALE = [
    { chemin: '/admin/tenants', icone: Globe, libelle: 'Tenants' },
    { chemin: '/admin/utilisateurs', icone: UserCog, libelle: 'Utilisateurs' },
    { chemin: '/admin/audit', icone: ScrollText, libelle: 'Audit' },
    { chemin: '/roles', icone: Shield, libelle: 'Rôles & Permissions' },
];

/**
 * Composant pour rendre une section de navigation
 */
function SectionNavigation({ liens, reduite, labelSection }) {
    return (
        <>
            {labelSection && !reduite && (
                <div className="sidebar__separateur">{labelSection}</div>
            )}
            {liens.map(({ chemin, icone: Icone, libelle }) => (
                <NavLink
                    key={chemin}
                    to={chemin}
                    className={({ isActive }) =>
                        `sidebar__lien ${isActive ? 'sidebar__lien--actif' : ''}`
                    }
                    title={reduite ? libelle : undefined}
                    end={chemin === '/' || chemin === '/cooperative'}
                >
                    <Icone size={20} />
                    {!reduite && <span>{libelle}</span>}
                </NavLink>
            ))}
        </>
    );
}

/**
 * Barre Latérale — Navigation principale avec dispatching par rôle
 */
export default function BarreLaterale() {
    const [reduite, definirReduite] = useState(false);
    const { utilisateur, deconnecter } = utiliserAuth();
    const { isSuperAdmin, roleLibelle } = usePermissions();

    return (
        <aside className={`sidebar ${reduite ? 'sidebar--reduite' : ''}`}>
            {/* Logo */}
            <div className="sidebar__logo">
                {!reduite ? (
                    <img 
                        src="/immo1.png" 
                        alt="MaggyFast Immo" 
                        className="sidebar__logo-image"
                    />
                ) : (
                    <img 
                        src="/immo1.png" 
                        alt="MaggyFast Immo" 
                        className="sidebar__logo-image-reduite"
                    />
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
                {/* Section Immobilier — tous les rôles */}
                <SectionNavigation 
                    liens={LIENS_IMMOBILIER} 
                    reduite={reduite} 
                    labelSection="Immobilier"
                />

                {/* Section Outils — tous les rôles */}
                <SectionNavigation 
                    liens={LIENS_OUTILS} 
                    reduite={reduite} 
                    labelSection="Outils"
                />

                {/* Section Coopérative — tous les rôles */}
                <SectionNavigation 
                    liens={LIENS_COOPERATIVE} 
                    reduite={reduite} 
                    labelSection="Coopérative"
                />

                {/* Section Administration Globale — super_admin SEULEMENT */}
                {isSuperAdmin() && (
                    <SectionNavigation 
                        liens={LIENS_ADMIN_GLOBALE} 
                        reduite={reduite} 
                        labelSection="Administration"
                    />
                )}
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
                            <span className="sidebar__utilisateur-role">{roleLibelle || utilisateur.role}</span>
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
