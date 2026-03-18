/**
 * Composant — Modale d'affichage des détails d'un groupe coopérative
 */

import { Users, MapPin, Loader2, Info, ChevronRight, UserPlus, Home } from 'lucide-react';
import Modal from '../communs/Modal';
import { useEffect, useState } from 'react';
import './ModaleDetailsGroupe.css';

export default function ModaleDetailsGroupe({ idGroupe, surFermer, obtenirDetails }) {
    const [groupe, setGroupe] = useState(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        if (idGroupe) {
            chargerDetails();
        }
    }, [idGroupe]);

    const chargerDetails = async () => {
        setChargement(true);
        try {
            const data = await obtenirDetails(idGroupe);
            setGroupe(data);
        } catch (error) {
            console.error('Erreur lors du chargement des détails du groupe:', error);
        } finally {
            setChargement(false);
        }
    };

    return (
        <Modal
            titre={chargement ? "Chargement du groupe..." : `Détails du Groupe — ${groupe?.nom}`}
            surFermer={surFermer}
            taille="grand"
        >
            {chargement ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem' }}>
                    <Loader2 size={48} className="chargement__spinner" color="var(--couleur-primaire)" />
                    <p style={{ color: 'var(--couleur-gris-sombre)' }}>Récupération des informations...</p>
                </div>
            ) : groupe ? (
                <div className="details-groupe">
                    {/* Statistiques du groupe */}
                    <div className="details-groupe__stats">
                        <div className="details-groupe__stat details-groupe__stat--bleu">
                            <div className="details-groupe__stat-icone">
                                <Users size={24} />
                            </div>
                            <div className="details-groupe__stat-infos">
                                <span className="details-groupe__stat-valeur">{groupe.adherents?.length || 0}</span>
                                <span className="details-groupe__stat-label">Adhérents</span>
                            </div>
                        </div>
                        <div className="details-groupe__stat details-groupe__stat--vert">
                            <div className="details-groupe__stat-icone">
                                <Home size={24} />
                            </div>
                            <div className="details-groupe__stat-infos">
                                <span className="details-groupe__stat-valeur">{groupe.parcelles?.length || 0}</span>
                                <span className="details-groupe__stat-label">Parcelles</span>
                            </div>
                        </div>
                        <div className="details-groupe__stat details-groupe__stat--orange">
                            <div className="details-groupe__stat-icone">
                                <Info size={24} />
                            </div>
                            <div className="details-groupe__stat-infos">
                                <span className="details-groupe__stat-valeur">Actif</span>
                                <span className="details-groupe__stat-label">Statut</span>
                            </div>
                        </div>
                    </div>

                    <div className="details-groupe__content">
                        {/* Section Adhérents */}
                        <div className="details-groupe__section">
                            <h3 className="details-groupe__section-titre">
                                <Users size={20} />
                                Membres du groupe
                            </h3>
                            <div className="details-groupe__liste">
                                {groupe.adherents?.length > 0 ? (
                                    groupe.adherents.map(adherent => (
                                        <div key={adherent.id} className="details-groupe__item">
                                            <div className="details-groupe__item-main">
                                                <div style={{ padding: 8, background: 'var(--couleur-fond)', borderRadius: '50%' }}>
                                                    <Users size={16} />
                                                </div>
                                                <div>
                                                    <span className="details-groupe__item-titre">{adherent.prenom} {adherent.nom}</span>
                                                    <span className="details-groupe__item-sous-titre">{adherent.telephone || 'Pas de numéro'}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} color="var(--couleur-gris-clair)" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="details-groupe__vide">Aucun adhérent dans ce groupe</div>
                                )}
                            </div>
                        </div>

                        {/* Section Parcelles */}
                        <div className="details-groupe__section">
                            <h3 className="details-groupe__section-titre">
                                <MapPin size={20} />
                                Parcelles attribuées
                            </h3>
                            <div className="details-groupe__liste">
                                {groupe.parcelles?.length > 0 ? (
                                    groupe.parcelles.map(parcelle => (
                                        <div key={parcelle.id} className="details-groupe__item">
                                            <div className="details-groupe__item-main">
                                                <div style={{ padding: 8, background: 'var(--couleur-fond)', borderRadius: '50%' }}>
                                                    <MapPin size={16} />
                                                </div>
                                                <div>
                                                    <span className="details-groupe__item-titre">Parcelle #{parcelle.numero}</span>
                                                    <span className="details-groupe__item-sous-titre">{parcelle.surface} m² — {parcelle.statut}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} color="var(--couleur-gris-clair)" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="details-groupe__vide">Aucune parcelle pour ce groupe</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="details-groupe__vide">Erreur lors de la récupération des données.</div>
            )}
        </Modal>
    );
}
