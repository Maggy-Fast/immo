import React from 'react';
import Modale from './Modale';
import { AlertTriangle } from 'lucide-react';
import './ModaleConfirmation.css';

export default function ModaleConfirmation({
    ouverte,
    titre,
    message,
    surConfirmer,
    surAnnuler,
    type = 'danger', // 'danger', 'info', 'success', 'avertissement'
    texteConfirmer = 'Confirmer',
    texteAnnuler = 'Annuler',
    enCours = false,
}) {
    if (!ouverte) return null;

    const actions = (
        <>
            <button
                className="bouton bouton--secondaire"
                onClick={surAnnuler}
                disabled={enCours}
            >
                {texteAnnuler}
            </button>
            <button
                className={`bouton bouton--${type}`}
                onClick={surConfirmer}
                disabled={enCours}
            >
                {enCours ? 'Traitement...' : texteConfirmer}
            </button>
        </>
    );

    return (
        <Modale
            titre={titre}
            surFermer={surAnnuler}
            taille="petit"
            actionsPersonnalisees={actions}
            enCours={enCours}
        >
            <div className="modale-confirmation">
                <div className={`modale-confirmation__icone modale-confirmation__icone--${type}`}>
                    <AlertTriangle size={32} />
                </div>
                <div className="modale-confirmation__message">
                    {message}
                </div>
            </div>
        </Modale>
    );
}
