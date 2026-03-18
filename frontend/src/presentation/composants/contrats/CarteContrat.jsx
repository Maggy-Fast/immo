/**
 * Composant — Carte d'affichage d'un contrat
 */

import { Home, User, Calendar, DollarSign, Shield } from 'lucide-react';
import { LABELS_STATUTS_CONTRAT, COULEURS_STATUTS_CONTRAT } from '../../../domaine/valeursObjets/statutContrat';
import { formaterMontant } from '../../../application/utils/formatters';
import './CarteContrat.css';

export default function CarteContrat({ contrat, surClic, surModifier, surSupprimer }) {

  const formaterDate = (date) => {
    if (!date) return 'Non définie';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Date invalide';
      
      return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getLoyerMensuel = () => {
    if (contrat.loyerMensuel === null || contrat.loyerMensuel === undefined || contrat.loyerMensuel === '') return 0;
    if (typeof contrat.loyerMensuel === 'string') {
      const parsed = parseFloat(contrat.loyerMensuel.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof contrat.loyerMensuel === 'number' ? contrat.loyerMensuel : 0;
  };

  const getCaution = () => {
    if (contrat.caution === null || contrat.caution === undefined || contrat.caution === '') return 0;
    if (typeof contrat.caution === 'string') {
      const parsed = parseFloat(contrat.caution.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof contrat.caution === 'number' ? contrat.caution : 0;
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
              <span className="carte-contrat__valeur">{formaterMontant(getLoyerMensuel())}</span>
            </div>
          </div>
          <div className="carte-contrat__montant">
            <Shield size={16} />
            <div>
              <span className="carte-contrat__label">Caution</span>
              <span className="carte-contrat__valeur">{formaterMontant(getCaution())}</span>
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
