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
    ArrowRight
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import './PageLotissements.css'; // Reusing similar styles for consistency

export default function PageGestionTenants() {
    const [tenants, setTenants] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [modalOuverte, setModalOuverte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [tenantSelectionne, setTenantSelectionne] = useState(null);
    const { notifier } = useToast();

    const [formulaire, setFormulaire] = useState({
        nom: '',
        domaine: '',
        plan: 'gratuit',
        actif: true
    });

    useEffect(() => {
        chargerTenants();
    }, []);

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
            if (tenantSelectionne) {
                await serviceAdmin.modifierTenant(tenantSelectionne.id, formulaire);
                notifier('Tenant modifié avec succès');
            } else {
                await serviceAdmin.creerTenant(formulaire);
                notifier('Tenant créé avec succès');
            }
            setModalOuverte(false);
            chargerTenants();
        } catch (erreur) {
            notifier(erreur.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
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
                plan: tenant.plan,
                actif: tenant.actif
            });
        } else {
            setTenantSelectionne(null);
            setFormulaire({
                nom: '',
                domaine: '',
                plan: 'gratuit',
                actif: true
            });
        }
        setModalOuverte(true);
    };

    const tenantsFiltrés = tenants.filter(t => 
        t.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        (t.domaine && t.domaine.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
        <div className="tableau-de-bord fade-in">
            <div className="flex-entre" style={{ marginBottom: 'var(--espace-8)' }}>
                <div>
                    <h1 className="page-titre">Gestion des Tenants</h1>
                    <p className="texte-gris">Gérez les agences et coopératives utilisant la plateforme</p>
                </div>
                <button className="bouton bouton--primaire" onClick={() => ouvrirModal()}>
                    <Plus size={20} />
                    Nouveau Tenant
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="stats-grille">
                <div className="stat-carte">
                    <div className="stat-carte__contenu">
                        <div className="stat-carte__entete">
                            <span className="stat-carte__titre">Total Tenants</span>
                            <div className="stat-carte__icone"><Building2 size={18} /></div>
                        </div>
                        <span className="stat-carte__valeur">{tenants.length}</span>
                    </div>
                </div>
                <div className="stat-carte">
                    <div className="stat-carte__contenu">
                        <div className="stat-carte__entete">
                            <span className="stat-carte__titre">Tenants Actifs</span>
                            <div className="stat-carte__icone" style={{ color: 'var(--couleur-succes)' }}><CheckCircle size={18} /></div>
                        </div>
                        <span className="stat-carte__valeur">{tenants.filter(t => t.actif).length}</span>
                    </div>
                </div>
            </div>

            <div className="carte" style={{ marginBottom: 'var(--espace-6)' }}>
                <div className="carte__corps">
                    <div className="recherche" style={{ maxWidth: '400px' }}>
                        <Search className="recherche__icone" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom ou domaine..." 
                            className="recherche__input"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {chargement ? (
                <div className="chargement">
                    <div className="chargement__spinner"></div>
                </div>
            ) : (
                <div className="grille" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {tenantsFiltrés.map(tenant => (
                        <div key={tenant.id} className="carte fade-in">
                            <div className="carte__entete">
                                <h3 className="carte__titre">{tenant.nom}</h3>
                                <div className={`badge ${tenant.actif ? 'badge--succes' : 'badge--erreur'}`}>
                                    {tenant.actif ? 'Actif' : 'Inactif'}
                                </div>
                            </div>
                            <div className="carte__corps">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espace-3)' }}>
                                    <div className="flex-entre">
                                        <span className="texte-gris" style={{ fontSize: 'var(--taille-xs)' }}>Domaine:</span>
                                        <span className="texte-medium">{tenant.domaine || 'N/A'}</span>
                                    </div>
                                    <div className="flex-entre">
                                        <span className="texte-gris" style={{ fontSize: 'var(--taille-xs)' }}>Plan:</span>
                                        <span className="badge badge--primaire" style={{ textTransform: 'capitalize' }}>{tenant.plan}</span>
                                    </div>
                                    <div className="flex-entre">
                                        <span className="texte-gris" style={{ fontSize: 'var(--taille-xs)' }}>Utilisateurs:</span>
                                        <span className="texte-medium">{tenant.utilisateurs_count || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="carte__pied flex-centre" style={{ gap: 'var(--espace-3)' }}>
                                <button className="bouton bouton--contour bouton--petit" onClick={() => ouvrirModal(tenant)}>
                                    <Edit2 size={14} /> Modifier
                                </button>
                                <button className="bouton bouton--fantome bouton--petit" style={{ color: 'var(--couleur-erreur)' }} onClick={() => {
                                    setTenantSelectionne(tenant);
                                    setModalConfirmation(true);
                                }}>
                                    <Trash2 size={14} /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalOuverte && (
                <div className="modal-fond">
                    <div className="modal fade-in">
                        <div className="modal__entete">
                            <h2 className="modal__titre">{tenantSelectionne ? 'Modifier le Tenant' : 'Nouveau Tenant'}</h2>
                        </div>
                        <form onSubmit={handleSoumettre}>
                            <div className="modal__corps">
                                <div className="champ">
                                    <label className="champ__label">Nom de l'agence / coopérative</label>
                                    <input 
                                        type="text" 
                                        className="champ__input"
                                        value={formulaire.nom}
                                        onChange={(e) => setFormulaire({...formulaire, nom: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="champ">
                                    <label className="champ__label">Domaine (optionnel)</label>
                                    <input 
                                        type="text" 
                                        className="champ__input"
                                        value={formulaire.domaine}
                                        onChange={(e) => setFormulaire({...formulaire, domaine: e.target.value})}
                                        placeholder="exemple.maggyfast.com"
                                    />
                                </div>
                                <div className="champ">
                                    <label className="champ__label">Plan d'abonnement</label>
                                    <select 
                                        className="champ__input"
                                        value={formulaire.plan}
                                        onChange={(e) => setFormulaire({...formulaire, plan: e.target.value})}
                                    >
                                        <option value="gratuit">Gratuit</option>
                                        <option value="pro">Professionnel</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="flex" style={{ gap: 'var(--espace-2)', marginTop: 'var(--espace-4)' }}>
                                    <input 
                                        type="checkbox" 
                                        id="actif"
                                        checked={formulaire.actif}
                                        onChange={(e) => setFormulaire({...formulaire, actif: e.target.checked})}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--couleur-primaire)' }}
                                    />
                                    <label htmlFor="actif" className="texte-sm texte-gras">Compte actif</label>
                                </div>
                            </div>
                            <div className="modal__pied">
                                <button type="button" className="bouton bouton--fantome" onClick={() => setModalOuverte(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire">
                                    {tenantSelectionne ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModaleConfirmation 
                ouverte={modalConfirmation}
                titre="Supprimer le tenant"
                message={`Êtes-vous sûr de vouloir supprimer "${tenantSelectionne?.nom}" ? Toutes les données associées seront perdues.`}
                surConfirmer={handleSupprimer}
                surAnnuler={() => setModalConfirmation(false)}
            />
        </div>
    );
}
