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
    Info
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import './PageLotissements.css'; // Reusing similar styles for consistency

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

    const plansFiltrés = plans.filter(p => 
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.slug.toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="tableau-de-bord fade-in">
            <div className="flex-entre" style={{ marginBottom: 'var(--espace-8)' }}>
                <div>
                    <h1 className="page-titre">Gestion des Plans</h1>
                    <p className="texte-gris">Configurez les offres de licence pour vos tenants</p>
                </div>
                <button className="bouton bouton--primaire" onClick={() => ouvrirModal()}>
                    <Plus size={20} />
                    Nouveau Plan
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="stats-grille">
                <div className="stat-carte">
                    <div className="stat-carte__contenu">
                        <div className="stat-carte__entete">
                            <span className="stat-carte__titre">Total Plans</span>
                            <div className="stat-carte__icone"><ScrollText size={18} /></div>
                        </div>
                        <span className="stat-carte__valeur">{plans.length}</span>
                    </div>
                </div>
                <div className="stat-carte">
                    <div className="stat-carte__contenu">
                        <div className="stat-carte__entete">
                            <span className="stat-carte__titre">Plans Actifs</span>
                            <div className="stat-carte__icone" style={{ color: 'var(--couleur-succes)' }}><CheckCircle size={18} /></div>
                        </div>
                        <span className="stat-carte__valeur">{plans.filter(p => p.actif).length}</span>
                    </div>
                </div>
            </div>

            <div className="carte" style={{ marginBottom: 'var(--espace-6)' }}>
                <div className="carte__corps">
                    <div className="recherche" style={{ maxWidth: '400px' }}>
                        <Search className="recherche__icone" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un plan..." 
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
                <div className="grille" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {plansFiltrés.map(plan => (
                        <div key={plan.id} className="carte fade-in">
                            <div className="carte__entete">
                                <h3 className="carte__titre">{plan.nom}</h3>
                                <div className={`badge ${plan.actif ? 'badge--succes' : 'badge--erreur'}`}>
                                    {plan.actif ? 'Actif' : 'Inactif'}
                                </div>
                            </div>
                            <div className="carte__corps">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--espace-3)' }}>
                                    <div className="flex-entre">
                                        <div className="flex-centre" style={{ gap: 'var(--espace-2)' }}>
                                            <Calendar size={16} className="texte-gris" />
                                            <span className="texte-gris">Durée:</span>
                                        </div>
                                        <span className="texte-medium">{plan.duree_mois} mois</span>
                                    </div>
                                    <div className="flex-entre">
                                        <div className="flex-centre" style={{ gap: 'var(--espace-2)' }}>
                                            <DollarSign size={16} className="texte-gris" />
                                            <span className="texte-gris">Prix:</span>
                                        </div>
                                        <span className="texte-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(plan.prix)}</span>
                                    </div>
                                    <div className="flex-entre">
                                        <div className="flex-centre" style={{ gap: 'var(--espace-2)' }}>
                                            <Info size={16} className="texte-gris" />
                                            <span className="texte-gris">Tenants:</span>
                                        </div>
                                        <span className="badge badge--primaire">{plan.tenants_count || 0} agences</span>
                                    </div>
                                    {plan.description && (
                                        <p className="texte-xs texte-gris" style={{ marginTop: 'var(--espace-2)', borderTop: '1px solid var(--couleur-bordure)', paddingTop: 'var(--espace-2)' }}>
                                            {plan.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="carte__pied flex-centre" style={{ gap: 'var(--espace-3)' }}>
                                <button className="bouton bouton--contour bouton--petit" onClick={() => ouvrirModal(plan)}>
                                    <Edit2 size={14} /> Modifier
                                </button>
                                <button 
                                    className="bouton bouton--fantome bouton--petit" 
                                    style={{ color: 'var(--couleur-erreur)' }} 
                                    onClick={() => {
                                        setPlanSelectionne(plan);
                                        setModalConfirmation(true);
                                    }}
                                    disabled={plan.tenants_count > 0}
                                    title={plan.tenants_count > 0 ? "Impossible de supprimer un plan utilisé" : ""}
                                >
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
                            <h2 className="modal__titre">{planSelectionne ? 'Modifier le Plan' : 'Nouveau Plan'}</h2>
                        </div>
                        <form onSubmit={handleSoumettre}>
                            <div className="modal__corps">
                                <div className="champ">
                                    <label className="champ__label">Nom du plan</label>
                                    <input 
                                        type="text" 
                                        className="champ__input"
                                        value={formulaire.nom}
                                        onChange={(e) => setFormulaire({...formulaire, nom: e.target.value})}
                                        required
                                        placeholder="ex: Licence Annuelle"
                                    />
                                </div>
                                <div className="champ">
                                    <label className="champ__label">Identifiant unique (Slug)</label>
                                    <input 
                                        type="text" 
                                        className="champ__input"
                                        value={formulaire.slug}
                                        onChange={(e) => setFormulaire({...formulaire, slug: e.target.value})}
                                        placeholder="laissé vide pour générer auto"
                                    />
                                </div>
                                <div className="grille" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--espace-4)' }}>
                                    <div className="champ">
                                        <label className="champ__label">Prix (FCFA)</label>
                                        <input 
                                            type="number" 
                                            className="champ__input"
                                            value={formulaire.prix}
                                            onChange={(e) => setFormulaire({...formulaire, prix: e.target.value})}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="champ">
                                        <label className="champ__label">Durée (mois)</label>
                                        <input 
                                            type="number" 
                                            className="champ__input"
                                            value={formulaire.duree_mois}
                                            onChange={(e) => setFormulaire({...formulaire, duree_mois: e.target.value})}
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="champ">
                                    <label className="champ__label">Description</label>
                                    <textarea 
                                        className="champ__input"
                                        value={formulaire.description}
                                        onChange={(e) => setFormulaire({...formulaire, description: e.target.value})}
                                        rows="3"
                                        placeholder="Détails du plan..."
                                    ></textarea>
                                </div>
                                <div className="flex" style={{ gap: 'var(--espace-2)', marginTop: 'var(--espace-2)' }}>
                                    <input 
                                        type="checkbox" 
                                        id="plan_actif"
                                        checked={formulaire.actif}
                                        onChange={(e) => setFormulaire({...formulaire, actif: e.target.checked})}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--couleur-primaire)' }}
                                    />
                                    <label htmlFor="plan_actif" className="texte-sm texte-gras">Plan actif</label>
                                </div>
                            </div>
                            <div className="modal__pied">
                                <button type="button" className="bouton bouton--fantome" onClick={() => setModalOuverte(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="bouton bouton--primaire">
                                    {planSelectionne ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ModaleConfirmation 
                ouverte={modalConfirmation}
                titre="Supprimer le plan"
                message={`Êtes-vous sûr de vouloir supprimer le plan "${planSelectionne?.nom}" ?`}
                surConfirmer={handleSupprimer}
                surAnnuler={() => setModalConfirmation(false)}
            />
        </div>
    );
}
