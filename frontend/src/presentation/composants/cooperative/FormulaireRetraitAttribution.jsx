/**
 * Composant — Formulaire de Retrait d'Attribution
 */

import { useState } from 'react';
import { AlertTriangle, User, MapPin, Maximize, FileText } from 'lucide-react';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import './FormulaireRetraitAttribution.css';

export default function FormulaireRetraitAttribution({ parcelle, surSoumettre, surAnnuler, enCours }) {
    const [motif, setMotif] = useState('');

    const gererSoumission = (e) => {
        e.preventDefault();
        surSoumettre({ motif });
    };

    if (!parcelle) return null;

    return (
        <Modal
            titre="Retirer l'attribution"
            surFermer={surAnnuler}
            taille="moyen"
            actionsPersonnalisees={
                <div className="formulaire-retrait__actions">
                    <button
                        type="button"
                        className="bouton bouton--secondaire"
                        onClick={surAnnuler}
                        disabled={enCours}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        form="form-retrait"
                        className="bouton bouton--avertissement"
                        disabled={enCours}
                    >
                        {enCours ? 'Retrait en cours...' : 'Confirmer le retrait'}
                    </button>
                </div>
            }
        >
            <div className="formulaire-retrait">
                <div className="formulaire-retrait__info">
                    <AlertTriangle className="formulaire-retrait__info-icone" size={24} />
                    <div className="formulaire-retrait__info-texte">
                        <strong>Attention :</strong> Cette action va retirer la parcelle des mains des bénéficiaires actuels et la remettre en statut <strong>"Disponible"</strong>. Tous les droits de possession liés à cette attribution seront annulés.
                    </div>
                </div>

                <div className="formulaire-retrait__parcelle">
                    <div className="formulaire-retrait__parcelle-titre">
                        <MapPin size={18} />
                        Parcelle {parcelle.numero}
                    </div>
                    <div className="formulaire-retrait__parcelle-details">
                        <span><Maximize size={14} style={{ marginRight: 4 }} />{parcelle.surface} m²</span>
                    </div>
                </div>

                <div className="formulaire-retrait__adherents">
                    <h4 className="formulaire-retrait__adherents-titre">
                        <User size={16} />
                        Bénéficiaires actuels
                    </h4>
                    <div className="formulaire-retrait__liste">
                        {(parcelle.adherents && parcelle.adherents.length > 0) ? (
                            parcelle.adherents.map((adh, idx) => (
                                <div key={idx} className="formulaire-retrait__adherent">
                                    <span className="formulaire-retrait__adherent-nom">
                                        <User size={14} />
                                        {adh.prenom} {adh.nom}
                                    </span>
                                    <span className="formulaire-retrait__adherent-part">
                                        {Math.round(adh.pivot?.pourcentage_possession || 0)}%
                                    </span>
                                </div>
                            ))
                        ) : parcelle.adherent ? (
                            <div className="formulaire-retrait__adherent">
                                <span className="formulaire-retrait__adherent-nom">
                                    <User size={14} />
                                    {parcelle.adherent.prenom} {parcelle.adherent.nom}
                                </span>
                                <span className="formulaire-retrait__adherent-part">100%</span>
                            </div>
                        ) : (
                            <div className="formulaire-retrait__vide">Aucun occupant listé</div>
                        )}
                    </div>
                </div>

                <form id="form-retrait" onSubmit={gererSoumission} className="formulaire-retrait__motif">
                    <ChampFormulaire
                        label="Motif du retrait"
                        type="textarea"
                        valeur={motif}
                        onChange={setMotif}
                        placeholder="Ex: Non-respect des engagements, désistement du membre..."
                        icone={FileText}
                        aide="Ce motif sera conservé dans l'historique d'attribution de la parcelle."
                        rows={3}
                    />
                </form>
            </div>
        </Modal>
    );
}
