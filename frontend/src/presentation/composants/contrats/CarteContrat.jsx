/**
 * Composant — Carte d'affichage d'un contrat
 */

import { Home, User, Calendar, DollarSign, Shield } from 'lucide-react';
import { LABELS_STATUTS_CONTRAT, COULEURS_STATUTS_CONTRAT } from '../../../domaine/valeursObjets/statutContrat';
import './CarteContrat.css';

export default function CarteContrat({ contrat, surClic, surModifier, surSupprimer }) {
  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(prix);
  };

  const formaterDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="carte-contrat" onClick={() => surClic?.(contrat)}>
      <div className="carte-contrat__entete">
        <span className={`badge badge--${COULEURS_STATUTS_CONTRAT[contrat.statut]}`}>
          {LABELS_STATUTS_CONTRAT[contrat.statut]}
        </span>
      </div>

      <div className="carte-contrat__corps">
        {/* Bien */}
        {contrat.bien && (
          <div className="carte-contrat__section">
            <div className="carte-contrat__icone-titre">
              <Home size={18} />
              <h3 className="carte-contrat__titre">Bien</h3>
            </div>
            <p className="carte-contrat__texte">{contrat.bien.adresse}</p>
          </div>
        )}

        {/* Locataire */}
        {contrat.locataire && (
          <div className="carte-contrat__section">
            <div className="carte-contrat__icone-titre">
              <User size={18} />
              <h3 className="carte-contrat__titre">Locataire</h3>
            </div>
            <p className="carte-contrat__texte">{contrat.locataire.nom}</p>
          </div>
        )}

        {/* Période */}
        <div className="carte-contrat__section">
          <div className="carte-contrat__icone-titre">
            <Calendar size={18} />
            <h3 className="carte-contrat__titre">Période</h3>
          </div>
          <p className="carte-contrat__texte">
            {formaterDate(contrat.dateDebut)} → {formaterDate(contrat.dateFin)}
          </p>
        </div>

        {/* Montants */}
        <div className="carte-contrat__montants">
          <div className="carte-contrat__montant">
            <DollarSign size={16} />
            <div>
              <span className="carte-contrat__label">Loyer mensuel</span>
              <span className="carte-contrat__valeur">{formaterPrix(contrat.loyerMensuel)}</span>
            </div>
          </div>
          <div className="carte-contrat__montant">
            <Shield size={16} />
            <div>
              <span className="carte-contrat__label">Caution</span>
              <span className="carte-contrat__valeur">{formaterPrix(contrat.caution)}</span>
            </div>
          </div>
        </div>
      </div>

      {(surModifier || surSupprimer) && (
        <div className="carte-contrat__actions">
          {surModifier && (
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surModifier(contrat);
              }}
            >
              Modifier
            </button>
          )}
          {surSupprimer && (
            <button
              className="bouton bouton--danger bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surSupprimer(contrat);
              }}
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
