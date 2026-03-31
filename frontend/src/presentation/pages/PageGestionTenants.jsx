import { useState, useEffect } from 'react';
import { 
    Building2, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    CheckCircle, 
    XCircle,
    Loader2,
    Filter,
    ArrowRight,
    CircleCheck,
    Globe,
    CreditCard,
    Users,
    Mail,
    User,
    Lock,
    Zap,
    ShieldCheck,
    LayoutGrid
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import './PageGestionTenants.css';

export default function PageGestionTenants() {
    const [tenants, setTenants] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [modalOuverte, setModalOuverte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [tenantSelectionne, setTenantSelectionne] = useState(null);
    const [listePlans, setListePlans] = useState([]);
    const { notifier } = useToast();

    const [formulaire, setFormulaire] = useState({
        nom: '',
        domaine: '',
        id_plan: '',
        actif: true,
        admin_nom: '',
        email: '',
        admin_password: ''
    });

    useEffect(() => {
        chargerTenants();
        chargerPlans();
    }, []);

    const chargerPlans = async () => {
        try {
            const data = await serviceAdmin.listerPlans();
            setListePlans(data);
        } catch (erreur) {
            console.error('Erreur chargement plans', erreur);
        }
    };

    const chargerTenants = async () => {
        try {
            setChargement(true);
            const data = await serviceAdmin.listerTenants();
            setTenants(data);
        } catch (erreur) {
            notifier('Erreur lors du chargement des tenants', 'error');
        } finally {
            setChargement(false);
        }
    };

    const handleSoumettre = async (e) => {
        e.preventDefault();
        try {
            // Nettoyage des données
            const donneesAEnvoyer = {
                ...formulaire,
                nom: formulaire.nom.trim(),
                domaine: formulaire.domaine ? formulaire.domaine.trim() : null,
                id_plan: formulaire.id_plan === '' ? null : formulaire.id_plan
            };

            if (tenantSelectionne) {
                await serviceAdmin.modifierTenant(tenantSelectionne.id, donneesAEnvoyer);
                notifier('Tenant modifié avec succès');
            } else {
                await serviceAdmin.creerTenant(donneesAEnvoyer);
                notifier('Tenant créé avec succès');
            }
            setModalOuverte(false);
            chargerTenants();
        } catch (erreur) {
            console.error('Erreur lors de l\'enregistrement:', erreur);
            
            // Extraction du message d'erreur le plus pertinent
            let messageErreur = 'Erreur lors de l\'enregistrement';
            if (erreur.response?.status === 422 && erreur.response.data.errors) {
                const premierErreur = Object.values(erreur.response.data.errors)[0];
                messageErreur = Array.isArray(premierErreur) ? premierErreur[0] : premierErreur;
            } else if (erreur.response?.data?.message) {
                messageErreur = erreur.response.data.message;
            }
            
            notifier(messageErreur, 'error');
        }
    };

    const handleSupprimer = async () => {
        try {
            await serviceAdmin.supprimerTenant(tenantSelectionne.id);
            notifier('Tenant supprimé avec succès');
            setModalConfirmation(false);
            chargerTenants();
        } catch (erreur) {
            notifier('Erreur lors de la suppression', 'error');
        }
    };

    const ouvrirModal = (tenant = null) => {
        if (tenant) {
            setTenantSelectionne(tenant);
            setFormulaire({
                nom: tenant.nom,
                domaine: tenant.domaine || '',
                id_plan: tenant.id_plan || '',
                actif: tenant.actif
            });
        } else {
            setTenantSelectionne(null);
            setFormulaire({
                nom: '',
                domaine: '',
                id_plan: listePlans.length > 0 ? listePlans[0].id : '',
                actif: true,
                admin_nom: '',
                email: '',
                admin_password: ''
            });
        }
        setModalOuverte(true);
    };

    const tenantsFiltrés = tenants.filter(t => 
        t.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (t.domaine && t.domaine.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
        <div className="page-tenants fade-in">
            {/* En-tête */}
            <header className="page-tenants__entete">
                <div className="page-tenants__titre-groupe">
                    <span className="page-tenants__badge-section">Administration</span>
                    <h1 className="page-tenants__titre">Gestion des Tenants</h1>
                    <p className="page-tenants__soustitre">Gérez les agences et coopératives de votre réseau</p>
                </div>
                <button className="bouton bouton--primaire bouton--large" style={{borderRadius: '16px', height: '52px'}} onClick={() => ouvrirModal()}>
                    <Plus size={20} />
                    Nouveau Tenant
                </button>
            </header>

            {/* Statistiques rapides */}
            <div className="tenants-stats">
                <div className="stat-item" style={{background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.4)'}}>
                    <div className="stat-icon stat-icon--primary" style={{width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(196, 30, 58, 0.1)', color: '#C41E3A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Building2 size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label" style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '500'}}>Total Tenants</span>
                        <span className="stat-value" style={{fontSize: '1.5rem', fontWeight: '700', color: '#1e293b'}}>{tenants.length}</span>
                    </div>
                </div>
                <div className="stat-item" style={{background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.4)'}}>
                    <div className="stat-icon stat-icon--success" style={{width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <CircleCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label" style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '500'}}>Agences Actives</span>
                        <span className="stat-value" style={{fontSize: '1.5rem', fontWeight: '700', color: '#1e293b'}}>{tenants.filter(t => t.actif).length}</span>
                    </div>
                </div>
            </div>

            {/* Barre de Recherche */}
            <div className="filters-container" style={{background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.25rem', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'}}>
                <div className="search-wrapper" style={{position: 'relative', maxWidth: '500px'}}>
                    <Search size={20} style={{position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                    <input 
                        type="text" 
                        className="search-input"
                        style={{width: '100%', padding: '0.85rem 1.25rem 0.85rem 3.5rem', border: '1px solid #e2e8f0', borderRadius: '14px', outline: 'none', transition: 'all 0.2s'}}
                        placeholder="Rechercher par nom ou domaine..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />
                </div>
            </div>

            {chargement ? (
                <div className="flex-centre" style={{padding: '5rem'}}>
                    <Loader2 className="chargement__spinner" size={48} />
                </div>
            ) : (
                <div className="tenants-grid">
                    {tenantsFiltrés.map(tenant => (
                        <div key={tenant.id} className="tenant-card fade-in">
                            <div className="tenant-card__header">
                                <div className="tenant-avatar">
                                    <Building2 size={24} />
                                </div>
                                <div className="tenant-title">{tenant.nom}</div>
                                <span className={`badge-status ${tenant.actif ? 'badge-status--active' : 'badge-status--inactive'}`} style={{fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: tenant.actif ? '#dcfce7' : '#fee2e2', color: tenant.actif ? '#166534' : '#991b1b', fontWeight: '800'}}>
                                    {tenant.actif ? 'ACTIF' : 'INACTIF'}
                                </span>
                            </div>

                            <div className="tenant-details">
                                <div className="tenant-info-row">
                                    <span className="tenant-label">Domaine</span>
                                    <span className="tenant-domain">{tenant.domaine || 'N/A'}</span>
                                </div>
                                <div className="tenant-info-row">
                                    <span className="tenant-label">Plan Actuel</span>
                                    <span className="plan-badge">{tenant.plan?.nom || 'N/A'}</span>
                                </div>
                                <div className="tenant-info-row" style={{border: 'none'}}>
                                    <span className="tenant-label">Utilisateurs</span>
                                    <div className="flex" style={{gap: '6px', alignItems: 'center'}}>
                                        <Users size={14} className="texte-gris" />
                                        <span className="tenant-value">{tenant.utilisateurs_count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="plan-actions" style={{display: 'flex', gap: '0.75rem', marginTop: '1.5rem'}}>
                                <button className="bouton bouton--gris-clair" style={{flex: 1}} onClick={() => ouvrirModal(tenant)}>
                                    <Edit2 size={16} /> Modifier
                                </button>
                                <button className="bouton bouton--erreur-clair" style={{width: 'max-content'}} onClick={() => {
                                    setTenantSelectionne(tenant);
                                    setModalConfirmation(true);
                                }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tenantsFiltrés.length === 0 && (
                        <div className="flex-centre card-vide" style={{gridColumn: '1 / -1', padding: '5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '2px dashed #e2e8f0'}}>
                            <div className="flex-col flex-centre text-center text-gray-400">
                                <Building2 size={48} className="mb-4" />
                                <p>Aucun tenant ne correspond à votre recherche.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {modalOuverte && (
                <div className="modal-overlay" onClick={() => setModalOuverte(false)}>
                    <div className="modal-tenant" onClick={e => e.stopPropagation()}>
                        <div className="flex-entre" style={{marginBottom: '1rem'}}>
                            <h2 className="texte-2xl texte-gras">{tenantSelectionne ? 'Modifier le Tenant' : 'Nouveau Tenant'}</h2>
                            <button className="bouton bouton--carre bouton--gris-clair" onClick={() => setModalOuverte(false)}>
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        <p className="texte-sm texte-gris" style={{marginBottom: '2rem'}}>
                            {tenantSelectionne 
                                ? "Modifiez ici les paramètres de l'agence ou de la coopérative." 
                                : "Enregistrez ici une nouvelle structure. Cela créera son domaine et son compte administrateur par défaut."}
                        </p>

                        <form onSubmit={handleSoumettre}>
                            <div className="form-section-title">
                                <LayoutGrid size={16} /> Informations Agence
                            </div>
                            
                            <div className="grille" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1rem'}}>
                                <div className="champ">
                                    <label className="champ__label">Nom de la structure</label>
                                    <input 
                                        type="text" 
                                        className="search-input"
                                        style={{paddingLeft: '1.25rem', height: '48px'}}
                                        value={formulaire.nom}
                                        onChange={(e) => setFormulaire({...formulaire, nom: e.target.value})}
                                        required
                                        placeholder="ex: Immo Solutions"
                                    />
                                </div>
                                <div className="champ">
                                    <label className="champ__label">Sous-domaine</label>
                                    <div style={{position: 'relative'}}>
                                        <Globe size={16} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                                        <input 
                                            type="text" 
                                            className="search-input"
                                            style={{paddingLeft: '2.75rem', height: '48px'}}
                                            value={formulaire.domaine}
                                            onChange={(e) => setFormulaire({...formulaire, domaine: e.target.value})}
                                            placeholder="nom-agence"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="champ">
                                <label className="champ__label">Plan d'Abonnement</label>
                                <div style={{position: 'relative'}}>
                                    <Zap size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#C41E3A'}} />
                                    <select 
                                        className="search-input"
                                        style={{paddingLeft: '2.75rem', height: '48px', appearance: 'none'}}
                                        value={formulaire.id_plan}
                                        onChange={(e) => setFormulaire({...formulaire, id_plan: e.target.value})}
                                        required
                                    >
                                        <option value="">Sélectionner une licence</option>
                                        {listePlans.map(p => (
                                            <option key={p.id} value={p.id}>{p.nom} - {p.prix} FCFA ({p.duree_mois} mois)</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {!tenantSelectionne && (
                                <div className="fade-in">
                                    <div className="form-section-title">
                                        <ShieldCheck size={16} /> Accès Administrateur
                                    </div>
                                    <div className="grille" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem'}}>
                                        <div className="champ">
                                            <label className="champ__label">Nom complet Admin</label>
                                            <div style={{position: 'relative'}}>
                                                <User size={16} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                                                <input 
                                                    type="text" 
                                                    className="search-input"
                                                    style={{paddingLeft: '2.75rem'}}
                                                    value={formulaire.admin_nom}
                                                    onChange={(e) => setFormulaire({...formulaire, admin_nom: e.target.value})}
                                                    required={!tenantSelectionne}
                                                    placeholder="Prénom Nom"
                                                />
                                            </div>
                                        </div>
                                        <div className="champ">
                                            <label className="champ__label">Email Admin</label>
                                            <div style={{position: 'relative'}}>
                                                <Mail size={16} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                                                <input 
                                                    type="email" 
                                                    className="search-input"
                                                    style={{paddingLeft: '2.75rem'}}
                                                    value={formulaire.email}
                                                    onChange={(e) => setFormulaire({...formulaire, email: e.target.value})}
                                                    required={!tenantSelectionne}
                                                    placeholder="admin@domaine.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="champ" style={{marginTop: '1.25rem'}}>
                                        <label className="champ__label">Mot de passe temporaire</label>
                                        <div style={{position: 'relative'}}>
                                            <Lock size={16} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                                            <input 
                                                type="text" 
                                                className="search-input"
                                                style={{paddingLeft: '2.75rem'}}
                                                value={formulaire.admin_password}
                                                onChange={(e) => setFormulaire({...formulaire, admin_password: e.target.value})}
                                                required={!tenantSelectionne}
                                                placeholder="Min. 8 caractères"
                                                minLength={8}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex" style={{gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end'}}>
                                        <button 
                                            type="button" 
                                            className="bouton bouton--contour bouton--petit"
                                            onClick={() => {
                                                if (formulaire.nom) {
                                                    const slug = formulaire.nom.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
                                                    setFormulaire({...formulaire, email: `contact@${slug}.com`, admin_nom: formulaire.nom, domaine: slug});
                                                }
                                            }}
                                        >
                                            Générer auto. à partir du nom
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex" style={{gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '16px', marginTop: '2rem'}}>
                                <input 
                                    type="checkbox" 
                                    id="actif_tenant"
                                    checked={formulaire.actif}
                                    onChange={(e) => setFormulaire({...formulaire, actif: e.target.checked})}
                                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                />
                                <label htmlFor="actif_tenant" style={{cursor: 'pointer', fontWeight: '600', color: '#1e293b'}}>Le compte agence est actif et prêt à l'emploi</label>
                            </div>

                            <div className="flex" style={{marginTop: '2.5rem', gap: '1rem'}}>
                                <button type="button" className="bouton bouton--fantome" style={{flex: 1}} onClick={() => setModalOuverte(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire" style={{flex: 2}}>
                                    {tenantSelectionne ? "Sauvegarder les modifications" : "Créer l'agence maintenant"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModaleConfirmation 
                ouverte={modalConfirmation}
                titre="Supprimer le tenant"
                message={`Êtes-vous sûr de vouloir supprimer "${tenantSelectionne?.nom}" ? Toutes les données associées seront définitivement perdues.`}
                surConfirmer={handleSupprimer}
                surAnnuler={() => setModalConfirmation(false)}
            />
        </div>
    );
}
