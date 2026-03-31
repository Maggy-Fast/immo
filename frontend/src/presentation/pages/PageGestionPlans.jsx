import { useState, useEffect } from 'react';
import { 
    ScrollText, 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    CheckCircle, 
    XCircle,
    Loader2,
    DollarSign,
    Calendar,
    Info,
    LayoutGrid,
    Check,
    Hash,
    Terminal,
    ArrowRight,
    CircleCheck,
    Users
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import './PageGestionPlans.css';

export default function PageGestionPlans() {
    const [plans, setPlans] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [modalOuverte, setModalOuverte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [planSelectionne, setPlanSelectionne] = useState(null);
    const { notifier } = useToast();

    const [formulaire, setFormulaire] = useState({
        nom: '',
        slug: '',
        prix: 0,
        duree_mois: 12,
        description: '',
        actif: true
    });

    useEffect(() => {
        chargerPlans();
    }, []);

    const chargerPlans = async () => {
        try {
            setChargement(true);
            const data = await serviceAdmin.listerPlans();
            setPlans(data);
        } catch (erreur) {
            notifier('Erreur lors du chargement des plans', 'error');
        } finally {
            setChargement(false);
        }
    };

    const handleSoumettre = async (e) => {
        e.preventDefault();
        try {
            if (planSelectionne) {
                await serviceAdmin.modifierPlan(planSelectionne.id, formulaire);
                notifier('Plan modifié avec succès');
            } else {
                await serviceAdmin.creerPlan(formulaire);
                notifier('Plan créé avec succès');
            }
            setModalOuverte(false);
            chargerPlans();
        } catch (erreur) {
            notifier(erreur.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleSupprimer = async () => {
        try {
            await serviceAdmin.supprimerPlan(planSelectionne.id);
            notifier('Plan supprimé avec succès');
            setModalConfirmation(false);
            chargerPlans();
        } catch (erreur) {
            notifier(erreur.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const ouvrirModal = (plan = null) => {
        if (plan) {
            setPlanSelectionne(plan);
            setFormulaire({
                nom: plan.nom,
                slug: plan.slug,
                prix: plan.prix,
                duree_mois: plan.duree_mois,
                description: plan.description || '',
                actif: plan.actif
            });
        } else {
            setPlanSelectionne(null);
            setFormulaire({
                nom: '',
                slug: '',
                prix: 0,
                duree_mois: 12,
                description: '',
                actif: true
            });
        }
        setModalOuverte(true);
    };

    const formaterPrix = (prix) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(prix);
    };

    const plansFiltrés = plans.filter(p => 
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.slug.toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="page-plans fade-in">
            {/* En-tête */}
            <header className="page-plans__entete">
                <div className="page-plans__titre-groupe">
                    <span className="page-plans__badge-section">Administration</span>
                    <h1 className="page-plans__titre">Gestion des Plans</h1>
                    <p className="page-plans__soustitre">Configurez les offres de licence pour vos tenants</p>
                </div>
                <button className="bouton bouton--primaire bouton--large" style={{borderRadius: '16px', height: '52px'}} onClick={() => ouvrirModal()}>
                    <Plus size={20} />
                    Créer une Nouvelle Offre
                </button>
            </header>

            {/* Statistiques rapides */}
            <div className="plans-stats">
                <div className="stat-item">
                    <div className="stat-icon stat-icon--primary">
                        <ScrollText size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total des Plans</span>
                        <span className="stat-value">{plans.length}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon stat-icon--success">
                        <CircleCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Offres Actives</span>
                        <span className="stat-value">{plans.filter(p => p.actif).length}</span>
                    </div>
                </div>
            </div>

            {/* Barre de Recherche */}
            <div className="filters-container">
                <div className="search-wrapper">
                    <Search size={22} />
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Rechercher par nom d'offre (Pro, Premium...)"
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
                <div className="plans-grid">
                    {plansFiltrés.map(plan => (
                        <div key={plan.id} className="plan-card fade-in">
                            <div className="plan-card__header">
                                <div className="flex-col">
                                    <h3 className="plan-card__title">{plan.nom}</h3>
                                    <span className="texte-xs texte-gris" style={{fontFamily: 'monospace'}}>Slug: {plan.slug}</span>
                                </div>
                                <span className={`badge-status ${plan.actif ? 'badge-status--active' : 'badge-status--inactive'}`}>
                                    {plan.actif ? 'Actif' : 'Désactivé'}
                                </span>
                            </div>

                            <div className="plan-price-box">
                                <span className="plan-price">{formaterPrix(plan.prix)}</span>
                                <span className="plan-duration">pour {plan.duree_mois} mois</span>
                            </div>

                            <div className="plan-details">
                                <div className="plan-info-item">
                                    <Users size={16} />
                                    <span><strong>{plan.tenants_count || 0}</strong> Agences utilisent ce plan</span>
                                </div>
                                <div className="plan-info-item">
                                    <ArrowRight size={16} />
                                    <span>Accès complet aux modules immo</span>
                                </div>
                                
                                {plan.description && (
                                    <p className="plan-description">
                                        {plan.description}
                                    </p>
                                )}
                            </div>

                            <div className="plan-actions">
                                <button className="bouton bouton--gris-clair" onClick={() => ouvrirModal(plan)}>
                                    <Edit2 size={16} /> Modifier
                                </button>
                                <button 
                                    className="bouton bouton--erreur-clair" 
                                    onClick={() => {
                                        setPlanSelectionne(plan);
                                        setModalConfirmation(true);
                                    }}
                                    disabled={plan.tenants_count > 0}
                                    title={plan.tenants_count > 0 ? "Impossible de supprimer un plan utilisé" : "Supprimer ce plan"}
                                >
                                    <Trash2 size={16} /> {plan.tenants_count > 0 ? 'Utilisé' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {plansFiltrés.length === 0 && (
                        <div className="flex-centre card-vide" style={{gridColumn: '1 / -1', padding: '5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '2px dashed #e2e8f0'}}>
                            <div className="flex-col flex-centre">
                                <Search size={48} className="texte-gris" style={{marginBottom: '1rem'}} />
                                <p className="texte-gris">Aucun plan ne correspond à votre recherche.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Création / Edition */}
            {modalOuverte && (
                <div className="modal-overlay" onClick={() => setModalOuverte(false)}>
                    <div className="modal-glass" onClick={e => e.stopPropagation()}>
                        <div className="flex-entre" style={{marginBottom: '2rem'}}>
                            <h2 className="texte-2xl texte-gras">{planSelectionne ? "Modifier l'Offre" : "Nouvelle Offre"}</h2>
                            <button className="bouton bouton--carre bouton--gris-clair" onClick={() => setModalOuverte(false)}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSoumettre}>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                <div className="champ">
                                    <label className="champ__label">Nom de l'offre</label>
                                    <input 
                                        type="text" 
                                        className="search-input"
                                        style={{paddingLeft: '1.25rem'}}
                                        value={formulaire.nom}
                                        onChange={(e) => setFormulaire({...formulaire, nom: e.target.value})}
                                        required
                                        placeholder="ex: Licence Pro Annuelle"
                                    />
                                </div>

                                <div className="grille" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                                    <div className="champ">
                                        <label className="champ__label">Prix (FCFA)</label>
                                        <div style={{position: 'relative'}}>
                                            <input 
                                                type="number" 
                                                className="search-input"
                                                style={{paddingLeft: '1.25rem'}}
                                                value={formulaire.prix}
                                                onChange={(e) => setFormulaire({...formulaire, prix: e.target.value})}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="champ">
                                        <label className="champ__label">Durée (Mois)</label>
                                        <input 
                                            type="number" 
                                            className="search-input"
                                            style={{paddingLeft: '1.25rem'}}
                                            value={formulaire.duree_mois}
                                            onChange={(e) => setFormulaire({...formulaire, duree_mois: e.target.value})}
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="champ">
                                    <label className="champ__label">Description de l'offre</label>
                                    <textarea 
                                        className="search-input"
                                        style={{paddingLeft: '1.25rem', height: '100px', resize: 'none'}}
                                        value={formulaire.description}
                                        onChange={(e) => setFormulaire({...formulaire, description: e.target.value})}
                                        placeholder="Décrivez les avantages de ce plan..."
                                    ></textarea>
                                </div>

                                <div className="flex" style={{gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '14px'}}>
                                    <input 
                                        type="checkbox" 
                                        id="plan_actif"
                                        checked={formulaire.actif}
                                        onChange={(e) => setFormulaire({...formulaire, actif: e.target.checked})}
                                        style={{width: '20px', height: '20px', cursor: 'pointer'}}
                                    />
                                    <label htmlFor="plan_actif" style={{cursor: 'pointer', fontWeight: '600', color: '#1e293b'}}>Activer cette offre immédiatement</label>
                                </div>
                            </div>

                            <div className="flex" style={{marginTop: '2.5rem', gap: '1rem'}}>
                                <button type="button" className="bouton bouton--fantome" style={{flex: 1}} onClick={() => setModalOuverte(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire" style={{flex: 2}}>
                                    {planSelectionne ? 'Sauvegarder les modifications' : 'Créer le plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModaleConfirmation 
                ouverte={modalConfirmation}
                titre="Supprimer l'offre"
                message={`Êtes-vous sûr de vouloir supprimer le plan "${planSelectionne?.nom}" ? Cette action est irréversible.`}
                surConfirmer={handleSupprimer}
                surAnnuler={() => setModalConfirmation(false)}
            />
        </div>
    );
}
