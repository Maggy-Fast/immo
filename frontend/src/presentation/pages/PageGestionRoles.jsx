import { useState, useEffect } from 'react';
import { Plus, Save, X, Trash2, Shield, Users, Loader2 } from 'lucide-react';
import { serviceRole } from '../../infrastructure/api/serviceRole';
import ModulePermissions from '../composants/roles/ModulePermissions';
import CarteRole from '../composants/roles/CarteRole.jsx';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import { useToast } from '../composants/communs/ToastContext';
import './PageGestionRoles.css';

/**
 * Page Gestion des Rôles et Permissions
 */
export default function PageGestionRoles() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState({});
    const [roleSelectionne, setRoleSelectionne] = useState(null);
    const [modeEdition, setModeEdition] = useState(false);
    const [chargement, setChargement] = useState(true);
    const [sauvegarde, setSauvegarde] = useState(false);
    const [formulaire, setFormulaire] = useState({
        nom: '',
        libelle: '',
        description: '',
        permissions: []
    });
    const [modalSuppressionOuverte, setModalSuppressionOuverte] = useState(false);
    const { notifier } = useToast();

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
        try {
            setChargement(true);
            const [rolesData, permissionsData] = await Promise.all([
                serviceRole.listerRoles(),
                serviceRole.listerPermissions()
            ]);

            setRoles(rolesData || []);
            setPermissions(permissionsData || {});
        } catch (erreur) {
            console.error('Erreur lors du chargement:', erreur);
            afficherErreur('Impossible de charger les données');
        } finally {
            setChargement(false);
        }
    };

    const handleSelectionRole = async (role) => {
        if (modeEdition) return;

        setRoleSelectionne(role);

        try {
            const permissionsRole = await serviceRole.obtenirPermissionsRole(role.id);
            setFormulaire({
                nom: role.nom,
                libelle: role.libelle,
                description: role.description || '',
                permissions: permissionsRole.map(p => p.id)
            });
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur('Impossible de charger les permissions du rôle');
        }
    };

    const handleNouveauRole = () => {
        setRoleSelectionne(null);
        setModeEdition(true);
        setFormulaire({
            nom: '',
            libelle: '',
            description: '',
            permissions: []
        });
    };

    const handleModifier = () => {
        setModeEdition(true);
    };

    const handleAnnuler = () => {
        if (roleSelectionne) {
            handleSelectionRole(roleSelectionne);
        } else {
            setModeEdition(false);
            setFormulaire({
                nom: '',
                libelle: '',
                description: '',
                permissions: []
            });
        }
    };

    const handleEnregistrer = async () => {
        if (!formulaire.nom || !formulaire.libelle) {
            afficherErreur('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setSauvegarde(true);

            if (roleSelectionne) {
                await serviceRole.modifierRole(roleSelectionne.id, formulaire);
                afficherSucces('Rôle modifié avec succès');
            } else {
                await serviceRole.creerRole(formulaire);
                afficherSucces('Rôle créé avec succès');
            }

            await chargerDonnees();
            setModeEdition(false);
            setRoleSelectionne(null);
        } catch (erreur) {
            console.error('Erreur:', erreur);
            afficherErreur(erreur.response?.data?.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setSauvegarde(false);
        }
    };

    const handleSupprimer = () => {
        if (!roleSelectionne) return;

        // Vérifier si le rôle est système
        if (roleSelectionne.systeme) {
            notifier('Les rôles système ne peuvent pas être supprimés', 'error');
            return;
        }

        // Vérifier si le rôle est assigné à des utilisateurs
        if (roleSelectionne.utilisateurs && roleSelectionne.utilisateurs.length > 0) {
            notifier(
                `Ce rôle est assigné à ${roleSelectionne.utilisateurs.length} utilisateur(s) et ne peut pas être supprimé.`,
                'error'
            );
            return;
        }

        setModalSuppressionOuverte(true);
    };

    const confirmerSuppression = async () => {
        try {
            await serviceRole.supprimerRole(roleSelectionne.id);
            notifier('Rôle supprimé avec succès');
            await chargerDonnees();
            setRoleSelectionne(null);
            setModalSuppressionOuverte(false);
        } catch (erreur) {
            notifier(erreur.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const handleTogglePermission = (permissionId) => {
        setFormulaire(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter(id => id !== permissionId)
                : [...prev.permissions, permissionId]
        }));
    };

    const handleToggleModule = (modulePermissions) => {
        const moduleIds = modulePermissions.map(p => p.id);
        const toutesSelectionnees = moduleIds.every(id => formulaire.permissions.includes(id));

        setFormulaire(prev => ({
            ...prev,
            permissions: toutesSelectionnees
                ? prev.permissions.filter(id => !moduleIds.includes(id))
                : [...new Set([...prev.permissions, ...moduleIds])]
        }));
    };

    const afficherSucces = (message) => {
        notifier(message);
    };

    const afficherErreur = (message) => {
        notifier(message, 'error');
    };

    if (chargement) {
        return (
            <div className="page-roles__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des rôles...</p>
            </div>
        );
    }

    return (
        <div className="page-roles">
            {/* En-tête */}
            <div className="page-roles__entete">
                <div className="page-roles__entete-info">
                    <div className="page-roles__icone">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="page-roles__titre">Gestion des Rôles</h1>
                        <p className="page-roles__description">
                            Gérez les rôles et permissions de votre organisation
                        </p>
                    </div>
                </div>
                <button
                    className="bouton bouton--primaire"
                    onClick={handleNouveauRole}
                    disabled={modeEdition}
                >
                    <Plus size={18} />
                    Nouveau Rôle
                </button>
            </div>

            {/* Contenu principal */}
            <div className="page-roles__contenu">
                {/* Liste des rôles */}
                <div className="page-roles__liste">
                    <div className="page-roles__liste-entete">
                        <h2>Rôles ({roles.length})</h2>
                    </div>
                    <div className="page-roles__liste-corps">
                        {roles.map(role => (
                            <CarteRole
                                key={role.id}
                                role={role}
                                actif={roleSelectionne?.id === role.id}
                                onClick={() => handleSelectionRole(role)}
                            />
                        ))}
                    </div>
                </div>

                {/* Détails du rôle */}
                <div className="page-roles__details">
                    {(roleSelectionne || modeEdition) ? (
                        <div className="carte">
                            {/* En-tête de la carte */}
                            <div className="carte__entete">
                                <h2 className="carte__titre">
                                    {roleSelectionne ? 'Détails du rôle' : 'Nouveau rôle'}
                                </h2>
                                <div className="page-roles__actions">
                                    {!modeEdition && roleSelectionne?.nom !== 'super_admin' && (
                                        <>
                                            <button
                                                className="bouton bouton--secondaire bouton--petit"
                                                onClick={handleModifier}
                                            >
                                                Modifier
                                            </button>
                                            {!roleSelectionne?.systeme && (
                                                <button
                                                    className="bouton bouton--fantome bouton--petit"
                                                    onClick={handleSupprimer}
                                                    style={{ color: 'var(--couleur-erreur)' }}
                                                >
                                                    <Trash2 size={16} />
                                                    Supprimer
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {modeEdition && (
                                        <>
                                            <button
                                                className="bouton bouton--fantome bouton--petit"
                                                onClick={handleAnnuler}
                                                disabled={sauvegarde}
                                            >
                                                <X size={16} />
                                                Annuler
                                            </button>
                                            <button
                                                className="bouton bouton--primaire bouton--petit"
                                                onClick={handleEnregistrer}
                                                disabled={sauvegarde}
                                            >
                                                <Save size={16} />
                                                {sauvegarde ? 'Enregistrement...' : 'Enregistrer'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Corps de la carte */}
                            <div className="carte__corps">
                                {/* Alerte pour super_admin uniquement */}
                                {roleSelectionne?.nom === 'super_admin' && (
                                    <div className="alerte alerte--info" style={{ marginBottom: 'var(--espace-6)' }}>
                                        <Shield size={20} />
                                        <div>
                                            <strong>Rôle Super Admin protégé</strong>
                                            <p style={{ margin: '4px 0 0 0', fontSize: 'var(--taille-sm)' }}>
                                                Ce rôle est essentiel au fonctionnement du système et ne peut pas être modifié ou supprimé.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Alerte pour autres rôles système */}
                                {roleSelectionne?.systeme && roleSelectionne?.nom !== 'super_admin' && (
                                    <div className="alerte alerte--info" style={{ marginBottom: 'var(--espace-6)' }}>
                                        <Shield size={20} />
                                        <div>
                                            <strong>Rôle système</strong>
                                            <p style={{ margin: '4px 0 0 0', fontSize: 'var(--taille-sm)' }}>
                                                Ce rôle système peut être modifié mais ne peut pas être supprimé.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Alerte pour rôles avec utilisateurs */}
                                {roleSelectionne && !roleSelectionne.systeme && roleSelectionne.utilisateurs?.length > 0 && (
                                    <div className="alerte alerte--avertissement" style={{ marginBottom: 'var(--espace-6)' }}>
                                        <Users size={20} />
                                        <div>
                                            <strong>{roleSelectionne.utilisateurs.length} utilisateur(s) assigné(s)</strong>
                                            <p style={{ margin: '4px 0 0 0', fontSize: 'var(--taille-sm)' }}>
                                                Ce rôle ne peut pas être supprimé tant que des utilisateurs y sont assignés.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Informations générales */}
                                <div className="page-roles__section">
                                    <h3 className="page-roles__section-titre">Informations générales</h3>

                                    <div className="champ">
                                        <label className="champ__label">
                                            Nom technique <span className="requis">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="champ__input"
                                            value={formulaire.nom}
                                            onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                                            disabled={!modeEdition || roleSelectionne?.nom === 'super_admin'}
                                            placeholder="ex: gestionnaire_parcelles"
                                        />
                                        <span className="champ__aide">
                                            Identifiant unique du rôle (sans espaces)
                                        </span>
                                    </div>

                                    <div className="champ">
                                        <label className="champ__label">
                                            Libellé <span className="requis">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="champ__input"
                                            value={formulaire.libelle}
                                            onChange={(e) => setFormulaire({ ...formulaire, libelle: e.target.value })}
                                            disabled={!modeEdition || roleSelectionne?.nom === 'super_admin'}
                                            placeholder="ex: Gestionnaire de Parcelles"
                                        />
                                    </div>

                                    <div className="champ">
                                        <label className="champ__label">Description</label>
                                        <textarea
                                            className="champ__input"
                                            value={formulaire.description}
                                            onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
                                            disabled={!modeEdition || roleSelectionne?.nom === 'super_admin'}
                                            placeholder="Description du rôle..."
                                            rows="3"
                                            style={{ resize: 'vertical', height: 'auto', padding: 'var(--espace-3)' }}
                                        />
                                    </div>
                                </div>

                                {/* Permissions */}
                                <div className="page-roles__section">
                                    <h3 className="page-roles__section-titre">
                                        Permissions ({formulaire.permissions.length})
                                    </h3>

                                    <div className="page-roles__permissions">
                                        {Object.entries(permissions).map(([module, perms]) => (
                                            <ModulePermissions
                                                key={module}
                                                module={module}
                                                permissions={perms}
                                                permissionsSelectionnees={formulaire.permissions}
                                                onTogglePermission={handleTogglePermission}
                                                onToggleModule={handleToggleModule}
                                                disabled={!modeEdition || roleSelectionne?.nom === 'super_admin'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="page-roles__vide">
                            <Shield size={48} />
                            <h3>Aucun rôle sélectionné</h3>
                            <p>Sélectionnez un rôle dans la liste pour voir ses détails</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modale Confirmation Suppression */}
            <ModaleConfirmation
                ouverte={modalSuppressionOuverte}
                titre="Supprimer le rôle"
                message={`Voulez-vous vraiment supprimer le rôle "${roleSelectionne?.libelle}" ? Cette action est irréversible.`}
                surConfirmer={confirmerSuppression}
                surAnnuler={() => setModalSuppressionOuverte(false)}
            />
        </div>
    );
}
