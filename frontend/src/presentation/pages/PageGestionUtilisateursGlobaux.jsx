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
    Lock
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import './PageAdherents.css'; // Reusing similar list layout styles

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
        <div className="tableau-de-bord fade-in">
            <div className="flex-entre" style={{ marginBottom: 'var(--espace-8)' }}>
                <div>
                    <h1 className="page-titre">Utilisateurs Globaux</h1>
                    <p className="texte-gris">Gestion de tous les utilisateurs de la plateforme</p>
                </div>
            </div>

            <div className="carte" style={{ marginBottom: 'var(--espace-6)' }}>
                <div className="carte__corps">
                    <form onSubmit={handleRecherche} className="flex" style={{ gap: 'var(--espace-4)', alignItems: 'center' }}>
                        <div className="recherche" style={{ flex: 1, maxWidth: '500px' }}>
                            <Search className="recherche__icone" size={20} />
                            <input 
                                type="text" 
                                placeholder="Rechercher par nom, email..." 
                                className="recherche__input"
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bouton bouton--primaire">
                            <Filter size={18} /> Filtrer
                        </button>
                    </form>
                </div>
            </div>

            {chargement ? (
                <div className="chargement">
                    <div className="chargement__spinner"></div>
                </div>
            ) : (
                <div className="carte fade-in">
                    <div className="tableau-conteneur">
                        <table className="tableau">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Contact</th>
                                    <th>Tenant / Rôle</th>
                                    <th>Statut</th>
                                    <th style={{textAlign: 'right'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {utilisateurs.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{display: 'flex', alignItems: 'center', gap: 'var(--espace-3)'}}>
                                                <div className="avatar-sm" style={{ 
                                                    background: 'var(--couleur-primaire-tres-claire)', 
                                                    color: 'var(--couleur-primaire)',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 'var(--taille-sm)'
                                                }}>
                                                    {user.nom?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="texte-gras">{user.nom}</div>
                                                    <div className="texte-gris" style={{fontSize: 'var(--taille-xs)'}}>ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--espace-1)'}}>
                                                <div className="flex" style={{alignItems: 'center', gap: '6px', fontSize: 'var(--taille-sm)'}}>
                                                    <Mail size={14} className="texte-gris" /> {user.email}
                                                </div>
                                                <div className="flex" style={{alignItems: 'center', gap: '6px', fontSize: 'var(--taille-sm)'}}>
                                                    <Phone size={14} className="texte-gris" /> {user.telephone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--espace-1)'}}>
                                                <div className="flex" style={{alignItems: 'center', gap: '6px', fontSize: 'var(--taille-sm)', fontWeight: '500'}}>
                                                    <Building2 size={14} className="texte-primaire" /> {user.tenant?.nom || 'Système'}
                                                </div>
                                                <div className="flex" style={{alignItems: 'center', gap: '6px', fontSize: 'var(--taille-xs)', color: 'var(--couleur-gris)'}}>
                                                    <Shield size={14} /> {user.roleEntity?.libelle || user.role}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--succes">Actif</span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="bouton bouton--fantome bouton--petit" title="Réinitialiser MDP" onClick={() => {
                                                setUtilisateurSelectionne(user);
                                                setModalPassword(true);
                                            }}>
                                                <Lock size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: 'var(--espace-4)', borderTop: 'var(--bordure-fine)' }}>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === 1}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                        >
                            <ChevronLeft size={16} /> Précédent
                        </button>
                        <span className="texte-gris texte-sm">
                            Page {pagination.current_page} / {pagination.last_page}
                        </span>
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

            {modalPassword && (
                <div className="modal-fond">
                    <div className="modal fade-in" style={{ maxWidth: '450px' }}>
                        <div className="modal__entete">
                            <h2 className="modal__titre">Réinitialiser le mot de passe</h2>
                        </div>
                        <form onSubmit={handleResetPassword}>
                            <div className="modal__corps">
                                <p className="texte-gris" style={{ marginBottom: 'var(--espace-5)', fontSize: 'var(--taille-sm)' }}>
                                    Vous allez définir un nouveau mot de passe pour <strong>{utilisateurSelectionne?.nom}</strong>.
                                </p>
                                <div className="champ">
                                    <label className="champ__label">Nouveau mot de passe</label>
                                    <div className="champ-avec-icone">
                                        <Lock size={16} className="champ-icone" />
                                        <input 
                                            type="text"
                                            className="champ__input champ__input--avec-icone"
                                            value={nouveauPassword}
                                            onChange={(e) => setNouveauPassword(e.target.value)}
                                            placeholder="Minimum 8 caractères"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal__pied">
                                <button type="button" className="bouton bouton--fantome" onClick={() => setModalPassword(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire">
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
