import { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Key, 
    Shield, 
    Mail, 
    Phone, 
    Building2,
    Loader2,
    Filter,
    ChevronLeft,
    ChevronRight,
    Lock,
    X,
    UserCircle,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import './PageGestionUtilisateursGlobaux.css';

export default function PageGestionUtilisateursGlobaux() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [tenantFiltre, setTenantFiltre] = useState('');
    const [modalPassword, setModalPassword] = useState(false);
    const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
    const [nouveauPassword, setNouveauPassword] = useState('');
    const { notifier } = useToast();

    useEffect(() => {
        chargerUtilisateurs();
    }, [pagination.current_page]);

    const chargerUtilisateurs = async () => {
        try {
            setChargement(true);
            const data = await serviceAdmin.listerUtilisateursGlobaux({
                page: pagination.current_page,
                recherche,
                id_tenant: tenantFiltre
            });
            setUtilisateurs(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page
            });
        } catch (erreur) {
            notifier('Erreur lors du chargement des utilisateurs', 'error');
        } finally {
            setChargement(false);
        }
    };

    const handleRecherche = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, current_page: 1 });
        chargerUtilisateurs();
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (nouveauPassword.length < 8) {
            notifier('Le mot de passe doit faire au moins 8 caractères', 'warning');
            return;
        }
        try {
            await serviceAdmin.reinitialiserMotDePasse(utilisateurSelectionne.id, nouveauPassword);
            notifier('Mot de passe réinitialisé avec succès');
            setModalPassword(false);
            setNouveauPassword('');
        } catch (erreur) {
            notifier('Erreur lors de la réinitialisation', 'error');
        }
    };

    return (
        <div className="page-utilisateurs fade-in">
            {/* En-tête */}
            <header className="page-utilisateurs__entete">
                <div className="page-utilisateurs__titre-groupe">
                    <span className="page-utilisateurs__badge-section">Administration</span>
                    <h1 className="page-utilisateurs__titre">Utilisateurs Globaux</h1>
                    <p className="page-utilisateurs__soustitre">Gérez l'ensemble des accès à la plateforme MaggyFast</p>
                </div>
                <div className="flex" style={{gap: '1rem'}}>
                    <div className="carte-petite flex-centre" style={{padding: '0.75rem 1.25rem', background: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)'}}>
                        <Users size={18} className="texte-primaire" style={{marginRight: '0.75rem'}} />
                        <div>
                            <div className="texte-xs texte-gris">Total Utilisateurs</div>
                            <div className="texte-sm texte-gras">{utilisateurs.length > 0 ? 'Chargé' : '--'}</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filtres */}
            <div className="filters-container">
                <form onSubmit={handleRecherche} className="flex" style={{ width: '100%', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-wrapper">
                        <Search size={22} />
                        <input 
                            type="text" 
                            className="search-input"
                            placeholder="Rechercher par nom, email ou domaine..."
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bouton bouton--primaire" style={{height: '52px', borderRadius: '14px', padding: '0 2rem'}}>
                        <Filter size={18} /> Filtrer les résultats
                    </button>
                </form>
            </div>

            {/* Table */}
            {chargement ? (
                <div className="flex-centre" style={{padding: '5rem'}}>
                    <Loader2 className="chargement__spinner" size={48} />
                </div>
            ) : (
                <div className="table-container fade-in">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Contact</th>
                                <th>Tenant & Rôle</th>
                                <th>Statut</th>
                                <th style={{textAlign: 'right'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {utilisateurs.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.nom?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-info-text">
                                                <span className="user-name">{user.nom}</span>
                                                <span className="user-id">UID-{user.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-list">
                                            <div className="contact-item">
                                                <Mail size={14} /> <span>{user.email}</span>
                                            </div>
                                            <div className="contact-item">
                                                <Phone size={14} /> <span>{user.telephone || 'Nouveau utilisateur'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex-col" style={{gap: '0.4rem'}}>
                                            <div className="tenant-tag">
                                                <Building2 size={14} className="texte-primaire" />
                                                {user.tenant?.nom || 'Plateforme Système'}
                                            </div>
                                            <div className="flex" style={{gap: '6px', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', paddingLeft: '4px'}}>
                                                <ShieldCheck size={14} />
                                                {user.roleEntity?.libelle || user.role || 'Utilisateur'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status-badge">ACTIF</span>
                                    </td>
                                    <td style={{textAlign: 'right'}}>
                                        <button 
                                            className="bouton bouton--carre bouton--gris-clair" 
                                            title="Réinitialiser le mot de passe"
                                            onClick={() => {
                                                setUtilisateurSelectionne(user);
                                                setModalPassword(true);
                                            }}
                                        >
                                            <Key size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination" style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === 1}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                        >
                            <ChevronLeft size={16} /> Précédent
                        </button>
                        <div className="flex-centre" style={{gap: '0.5rem'}}>
                            <span className="texte-sm texte-gris">Page</span>
                            <span className="texte-sm texte-gras">{pagination.current_page}</span>
                            <span className="texte-sm texte-gris">sur</span>
                            <span className="texte-sm texte-gras">{pagination.last_page}</span>
                        </div>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page + 1})}
                        >
                            Suivant <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Password Reset */}
            {modalPassword && (
                <div className="modal-overlay" onClick={() => setModalPassword(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex-centre" style={{ marginBottom: '1.5rem', width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(196, 30, 58, 0.1)', color: '#C41E3A', margin: '0 auto 1.5rem' }}>
                            <Lock size={28} />
                        </div>
                        
                        <h2 className="texte-xl texte-gras texte-centre" style={{marginBottom: '1rem'}}>
                            Sécuriser le compte
                        </h2>
                        
                        <p className="texte-sm texte-gris texte-centre" style={{marginBottom: '2rem'}}>
                            Vous définissez un nouveau mot de passe pour <strong>{utilisateurSelectionne?.nom}</strong>.
                            L'utilisateur pourra se connecter immédiatement après la validation.
                        </p>

                        <form onSubmit={handleResetPassword}>
                            <div className="champ" style={{marginBottom: '2rem'}}>
                                <label className="champ__label" style={{fontWeight: '700', color: '#1e293b'}}>Nouveau mot de passe</label>
                                <div className="filter-input-wrapper">
                                    <Lock size={18} style={{position: 'absolute', left: '1rem', color: '#94a3b8'}} />
                                    <input 
                                        type="text"
                                        className="filter-input"
                                        style={{paddingLeft: '2.75rem'}}
                                        value={nouveauPassword}
                                        onChange={(e) => setNouveauPassword(e.target.value)}
                                        placeholder="Min. 8 caractères sécurisés"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="flex" style={{gap: '1rem'}}>
                                <button type="button" className="bouton bouton--fantome" style={{flex: 1}} onClick={() => setModalPassword(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire" style={{flex: 1.5}}>
                                    Mettre à jour le mot de passe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
