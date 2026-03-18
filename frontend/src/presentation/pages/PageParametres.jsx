import { useState, useEffect } from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Save,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';
import { utiliserAuth } from '../../application/contexte/ContexteAuth';
import { usePermissions } from '../../application/hooks/usePermissions';
import { serviceUtilisateur, serviceSysteme } from '../../infrastructure/api/serviceUtilisateur';
import ModaleLogs from '../composants/communs/ModaleLogs';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import { useToast } from '../composants/communs/ToastContext';
import './PageParametres.css';

/**
 * Page Paramètres — Gestion du profil et préférences
 */
export default function PageParametres() {
    const { utilisateur } = utiliserAuth();
    const { roleLibelle, isSuperAdmin } = usePermissions();
    const [ongletActif, setOngletActif] = useState('profil');
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
    const [sauvegarde, setSauvegarde] = useState(false);
    const [chargement, setChargement] = useState(false);
    const [informationsSysteme, setInformationsSysteme] = useState(null);
    const [afficherLogs, setAfficherLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const [chargementLogs, setChargementLogs] = useState(false);

    // États pour les modales de confirmation
    const [modalConfirmationOuverte, setModalConfirmationOuverte] = useState(false);
    const [actionConfirmation, setActionConfirmation] = useState(null);
    const { notifier } = useToast();

    // État du formulaire profil
    const [profil, setProfil] = useState({
        nom: utilisateur?.nom || '',
        email: utilisateur?.email || '',
        telephone: utilisateur?.telephone || '',
        motDePasseActuel: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
    });

    // État des préférences
    const [preferences, setPreferences] = useState({
        notifications: true,
        notifications_email: true,
        notifications_sms: false,
        langue: 'fr',
        theme: 'clair',
        format_date: 'DD/MM/YYYY',
        devise: 'FCFA'
    });

    // Charger les préférences au montage
    useEffect(() => {
        if (ongletActif === 'notifications' || ongletActif === 'apparence') {
            chargerPreferences();
        }
    }, [ongletActif]);

    // Charger les informations système
    useEffect(() => {
        if (ongletActif === 'systeme' && isSuperAdmin()) {
            chargerInformationsSysteme();
        }
    }, [ongletActif]);

    const chargerPreferences = async () => {
        try {
            const data = await serviceUtilisateur.obtenirPreferences();
            setPreferences(data);
        } catch (erreur) {
            console.error('Erreur lors du chargement des préférences:', erreur);
        }
    };

    const chargerInformationsSysteme = async () => {
        try {
            setChargement(true);
            const data = await serviceSysteme.obtenirInformations();
            setInformationsSysteme(data);
        } catch (erreur) {
            console.error('Erreur lors du chargement des informations système:', erreur);
            afficherErreur('Impossible de charger les informations système');
        } finally {
            setChargement(false);
        }
    };

    const onglets = [
        { id: 'profil', libelle: 'Mon Profil', icone: User },
        { id: 'notifications', libelle: 'Notifications', icone: Bell },
        { id: 'apparence', libelle: 'Apparence', icone: Palette },
        { id: 'securite', libelle: 'Sécurité', icone: Shield },
    ];

    // Ajouter l'onglet système pour les super admins
    if (isSuperAdmin()) {
        onglets.push({ id: 'systeme', libelle: 'Système', icone: Globe });
    }

    const handleSauvegarderProfil = async () => {
        try {
            setSauvegarde(true);
            await serviceUtilisateur.mettreAJourProfil({
                nom: profil.nom,
                email: profil.email,
                telephone: profil.telephone,
            });
            afficherSucces('Profil mis à jour avec succès');
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur(erreur.response?.data?.message || 'Erreur lors de la sauvegarde');
        } finally {
            setSauvegarde(false);
        }
    };

    const handleChangerMotDePasse = async () => {
        if (!profil.motDePasseActuel || !profil.nouveauMotDePasse || !profil.confirmationMotDePasse) {
            afficherErreur('Veuillez remplir tous les champs');
            return;
        }

        if (profil.nouveauMotDePasse !== profil.confirmationMotDePasse) {
            afficherErreur('Les mots de passe ne correspondent pas');
            return;
        }

        if (profil.nouveauMotDePasse.length < 8) {
            afficherErreur('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        try {
            setSauvegarde(true);
            await serviceUtilisateur.changerMotDePasse({
                motDePasseActuel: profil.motDePasseActuel,
                nouveauMotDePasse: profil.nouveauMotDePasse,
                confirmationMotDePasse: profil.confirmationMotDePasse,
            });
            afficherSucces('Mot de passe changé avec succès');
            setProfil({
                ...profil,
                motDePasseActuel: '',
                nouveauMotDePasse: '',
                confirmationMotDePasse: ''
            });
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur(erreur.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setSauvegarde(false);
        }
    };

    const handleSauvegarderPreferences = async () => {
        try {
            setSauvegarde(true);
            await serviceUtilisateur.mettreAJourPreferences(preferences);
            afficherSucces('Préférences mises à jour avec succès');
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur('Erreur lors de la sauvegarde');
        } finally {
            setSauvegarde(false);
        }
    };

    const handleViderCache = () => {
        setActionConfirmation(() => async () => {
            try {
                setSauvegarde(true);
                await serviceSysteme.viderCache();
                notifier('Cache vidé avec succès');
            } catch (erreur) {
                notifier('Erreur lors du vidage du cache', 'error');
            } finally {
                setSauvegarde(false);
                setModalConfirmationOuverte(false);
            }
        });
        setModalConfirmationOuverte(true);
    };

    const handleExporterDonnees = async () => {
        try {
            setSauvegarde(true);
            await serviceSysteme.exporterDonnees();
            afficherSucces('Données exportées avec succès');
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur('Erreur lors de l\'export des données');
        } finally {
            setSauvegarde(false);
        }
    };

    const handleAfficherLogs = async () => {
        setAfficherLogs(true);
        await chargerLogs();
    };

    const chargerLogs = async () => {
        try {
            setChargementLogs(true);
            const data = await serviceSysteme.obtenirLogs();
            setLogs(data.logs || []);
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur('Erreur lors du chargement des logs');
        } finally {
            setChargementLogs(false);
        }
    };

    const handleSauvegarderBase = () => {
        setActionConfirmation(() => async () => {
            try {
                setSauvegarde(true);
                await serviceSysteme.sauvegarderBase();
                notifier('Base de données sauvegardée avec succès');
            } catch (erreur) {
                notifier('Erreur lors de la sauvegarde de la base', 'error');
            } finally {
                setSauvegarde(false);
                setModalConfirmationOuverte(false);
            }
        });
        setModalConfirmationOuverte(true);
    };

    const afficherSucces = (message) => {
        notifier(message);
    };

    const afficherErreur = (message) => {
        notifier(message, 'error');
    };

    const renderContenuOnglet = () => {
        switch (ongletActif) {
            case 'profil':
                return (
                    <div className="parametres__section">
                        <h2 className="parametres__section-titre">Informations personnelles</h2>

                        <div className="parametres__avatar-section">
                            <div className="parametres__avatar">
                                {utilisateur?.nom?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3>{utilisateur?.nom}</h3>
                                <p className="parametres__role">{roleLibelle}</p>
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Nom complet</label>
                            <input
                                type="text"
                                className="champ__input"
                                value={profil.nom}
                                onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                                placeholder="Votre nom complet"
                            />
                        </div>

                        <div className="champ">
                            <label className="champ__label">Email</label>
                            <input
                                type="email"
                                className="champ__input"
                                value={profil.email}
                                onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="champ">
                            <label className="champ__label">Téléphone</label>
                            <input
                                type="tel"
                                className="champ__input"
                                value={profil.telephone}
                                onChange={(e) => setProfil({ ...profil, telephone: e.target.value })}
                                placeholder="+221 77 123 45 67"
                            />
                        </div>

                        <div className="parametres__actions">
                            <button
                                className="bouton bouton--primaire"
                                onClick={handleSauvegarderProfil}
                                disabled={sauvegarde}
                            >
                                <Save size={18} />
                                {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="parametres__section">
                        <h2 className="parametres__section-titre">Préférences de notification</h2>

                        <div className="parametres__option">
                            <div className="parametres__option-info">
                                <h3>Notifications activées</h3>
                                <p>Recevoir des notifications dans l'application</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications}
                                    onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                                />
                                <span className="toggle__slider"></span>
                            </label>
                        </div>

                        <div className="parametres__option">
                            <div className="parametres__option-info">
                                <h3>Notifications par email</h3>
                                <p>Recevoir des notifications par email</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications_email}
                                    onChange={(e) => setPreferences({ ...preferences, notifications_email: e.target.checked })}
                                />
                                <span className="toggle__slider"></span>
                            </label>
                        </div>

                        <div className="parametres__option">
                            <div className="parametres__option-info">
                                <h3>Notifications par SMS</h3>
                                <p>Recevoir des notifications par SMS</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications_sms}
                                    onChange={(e) => setPreferences({ ...preferences, notifications_sms: e.target.checked })}
                                />
                                <span className="toggle__slider"></span>
                            </label>
                        </div>

                        <div className="parametres__actions">
                            <button
                                className="bouton bouton--primaire"
                                onClick={handleSauvegarderPreferences}
                                disabled={sauvegarde}
                            >
                                <Save size={18} />
                                {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                );

            case 'apparence':
                return (
                    <div className="parametres__section">
                        <h2 className="parametres__section-titre">Apparence et affichage</h2>

                        <div className="champ">
                            <label className="champ__label">Thème</label>
                            <select
                                className="champ__input"
                                value={preferences.theme}
                                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                            >
                                <option value="clair">Clair</option>
                                <option value="sombre">Sombre</option>
                                <option value="auto">Automatique</option>
                            </select>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Langue</label>
                            <select
                                className="champ__input"
                                value={preferences.langue}
                                onChange={(e) => setPreferences({ ...preferences, langue: e.target.value })}
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Format de date</label>
                            <select
                                className="champ__input"
                                value={preferences.format_date}
                                onChange={(e) => setPreferences({ ...preferences, format_date: e.target.value })}
                            >
                                <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                                <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                                <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                            </select>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Devise</label>
                            <select
                                className="champ__input"
                                value={preferences.devise}
                                onChange={(e) => setPreferences({ ...preferences, devise: e.target.value })}
                            >
                                <option value="FCFA">FCFA (XOF)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="USD">Dollar (USD)</option>
                            </select>
                        </div>

                        <div className="parametres__actions">
                            <button
                                className="bouton bouton--primaire"
                                onClick={handleSauvegarderPreferences}
                                disabled={sauvegarde}
                            >
                                <Save size={18} />
                                {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                );

            case 'securite':
                return (
                    <div className="parametres__section">
                        <h2 className="parametres__section-titre">Sécurité et mot de passe</h2>

                        <div className="alerte alerte--info" style={{ marginBottom: 'var(--espace-6)' }}>
                            <Shield size={20} />
                            <div>
                                <strong>Changement de mot de passe</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: 'var(--taille-sm)' }}>
                                    Utilisez un mot de passe fort avec au moins 8 caractères, incluant majuscules, minuscules et chiffres.
                                </p>
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Mot de passe actuel</label>
                            <div className="champ-mot-de-passe">
                                <input
                                    type={afficherMotDePasse ? 'text' : 'password'}
                                    className="champ__input"
                                    value={profil.motDePasseActuel}
                                    onChange={(e) => setProfil({ ...profil, motDePasseActuel: e.target.value })}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="champ-mot-de-passe__toggle"
                                    onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                                >
                                    {afficherMotDePasse ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label">Nouveau mot de passe</label>
                            <input
                                type={afficherMotDePasse ? 'text' : 'password'}
                                className="champ__input"
                                value={profil.nouveauMotDePasse}
                                onChange={(e) => setProfil({ ...profil, nouveauMotDePasse: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="champ">
                            <label className="champ__label">Confirmer le mot de passe</label>
                            <input
                                type={afficherMotDePasse ? 'text' : 'password'}
                                className="champ__input"
                                value={profil.confirmationMotDePasse}
                                onChange={(e) => setProfil({ ...profil, confirmationMotDePasse: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="parametres__actions">
                            <button
                                className="bouton bouton--primaire"
                                onClick={handleChangerMotDePasse}
                                disabled={sauvegarde}
                            >
                                <Save size={18} />
                                {sauvegarde ? 'Enregistrement...' : 'Changer le mot de passe'}
                            </button>
                        </div>
                    </div>
                );

            case 'systeme':
                if (chargement) {
                    return (
                        <div style={{ textAlign: 'center', padding: 'var(--espace-8)' }}>
                            <Loader2 size={24} className="chargement__spinner" style={{ margin: '0 auto' }} />
                            <p style={{ marginTop: 'var(--espace-4)', color: 'var(--couleur-gris)' }}>
                                Chargement des informations système...
                            </p>
                        </div>
                    );
                }

                if (!informationsSysteme) {
                    return null;
                }

                const pourcentageStockage = informationsSysteme.stockage?.pourcentage || 0;

                return (
                    <div className="parametres__section">
                        <h2 className="parametres__section-titre">Paramètres système</h2>

                        <div className="parametres__info-card">
                            <div className="parametres__card-header">
                                <Globe size={20} />
                                <h3>Informations système</h3>
                            </div>
                            <div className="parametres__info-grid">
                                <div className="parametres__info-item">
                                    <span className="parametres__info-label">Version</span>
                                    <span className="parametres__info-value">{informationsSysteme.version}</span>
                                </div>
                                <div className="parametres__info-item">
                                    <span className="parametres__info-label">Environnement</span>
                                    <span className="parametres__info-value">
                                        <span className={`badge ${informationsSysteme.environnement === 'production' ? 'badge--succes' : 'badge--avertissement'}`}>
                                            {informationsSysteme.environnement}
                                        </span>
                                    </span>
                                </div>
                                <div className="parametres__info-item">
                                    <span className="parametres__info-label">Base de données</span>
                                    <span className="parametres__info-value">
                                        {informationsSysteme.base_donnees?.driver?.toUpperCase()} {informationsSysteme.base_donnees?.version}
                                    </span>
                                </div>
                                <div className="parametres__info-item">
                                    <span className="parametres__info-label">Stockage utilisé</span>
                                    <span className="parametres__info-value">
                                        {informationsSysteme.base_donnees?.taille_formatee} / 10 GB
                                        <div className="parametres__progress">
                                            <div
                                                className="parametres__progress-bar"
                                                style={{ width: `${Math.min(pourcentageStockage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="parametres__info-card">
                            <div className="parametres__card-header">
                                <Settings size={20} />
                                <h3>Actions système</h3>
                            </div>
                            <div className="parametres__actions-grid">
                                <button
                                    className="bouton bouton--contour"
                                    onClick={handleViderCache}
                                    disabled={sauvegarde}
                                >
                                    <span>🗑️</span>
                                    {sauvegarde ? 'En cours...' : 'Vider le cache'}
                                </button>
                                <button
                                    className="bouton bouton--contour"
                                    onClick={handleExporterDonnees}
                                    disabled={sauvegarde}
                                >
                                    <span>📥</span>
                                    Exporter les données
                                </button>
                                <button
                                    className="bouton bouton--contour"
                                    onClick={handleAfficherLogs}
                                >
                                    <span>📋</span>
                                    Logs système
                                </button>
                                <button
                                    className="bouton bouton--contour"
                                    onClick={handleSauvegarderBase}
                                    disabled={sauvegarde}
                                >
                                    <span>💾</span>
                                    Sauvegarder la base
                                </button>
                            </div>
                        </div>

                        {informationsSysteme.statistiques && (
                            <div className="parametres__info-card">
                                <div className="parametres__card-header">
                                    <User size={20} />
                                    <h3>Statistiques</h3>
                                </div>
                                <div className="parametres__info-grid">
                                    <div className="parametres__info-item">
                                        <span className="parametres__info-label">Utilisateurs</span>
                                        <span className="parametres__info-value">{informationsSysteme.statistiques.utilisateurs}</span>
                                    </div>
                                    <div className="parametres__info-item">
                                        <span className="parametres__info-label">Rôles</span>
                                        <span className="parametres__info-value">{informationsSysteme.statistiques.roles}</span>
                                    </div>
                                    <div className="parametres__info-item">
                                        <span className="parametres__info-label">Tenants</span>
                                        <span className="parametres__info-value">{informationsSysteme.statistiques.tenants}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="alerte alerte--avertissement">
                            <Shield size={20} />
                            <div>
                                <strong>Attention</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: 'var(--taille-sm)' }}>
                                    Ces actions système peuvent affecter le fonctionnement de l'application. Utilisez-les avec précaution.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="page-parametres">
            {/* En-tête */}
            <div className="page-parametres__entete">
                <div className="page-parametres__entete-info">
                    <div className="page-parametres__icone">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h1 className="page-parametres__titre">Paramètres</h1>
                        <p className="page-parametres__description">
                            Gérez votre profil et vos préférences
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="page-parametres__contenu">
                {/* Navigation par onglets */}
                <div className="page-parametres__onglets">
                    {onglets.map(onglet => {
                        const Icone = onglet.icone;
                        return (
                            <button
                                key={onglet.id}
                                className={`parametres__onglet ${ongletActif === onglet.id ? 'parametres__onglet--actif' : ''}`}
                                onClick={() => setOngletActif(onglet.id)}
                            >
                                <Icone size={20} />
                                <span>{onglet.libelle}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Contenu de l'onglet */}
                <div className="page-parametres__panneau">
                    <div className="carte">
                        <div className="carte__corps">
                            {renderContenuOnglet()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modale des logs */}
            {afficherLogs && (
                <ModaleLogs
                    logs={logs}
                    onClose={() => setAfficherLogs(false)}
                    onRefresh={chargerLogs}
                    chargement={chargementLogs}
                />
            )}

            {/* Modale de Confirmation */}
            <ModaleConfirmation
                ouverte={modalConfirmationOuverte}
                titre="Confirmer l'action"
                message="Êtes-vous sûr de vouloir effectuer cette action système ?"
                surConfirmer={actionConfirmation}
                surAnnuler={() => {
                    setModalConfirmationOuverte(false);
                    setActionConfirmation(null);
                }}
            />
        </div>
    );
}
