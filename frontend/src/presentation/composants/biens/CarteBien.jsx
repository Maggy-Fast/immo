/**
 * Composant — Carte d'affichage d'un bien
 */

import { MapPin, Home, DollarSign, Maximize } from 'lucide-react';
import { LABELS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import { LABELS_STATUTS_BIEN, COULEURS_STATUTS_BIEN } from '../../../domaine/valeursObjets/statutBien';
import './CarteBien.css';

export default function CarteBien({ bien, surClic, surModifier, surSupprimer }) {
  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(prix);
  };

  return (
    <div className="carte-bien" onClick={() => surClic?.(bien)}>
      <div className="carte-bien__entete">
        <div className="carte-bien__type">
          <Home size={16} />
          <span>{LABELS_TYPES_BIEN[bien.type]}</span>
        </div>
        <span className={`badge badge--${COULEURS_STATUTS_BIEN[bien.statut]}`}>
          {LABELS_STATUTS_BIEN[bien.statut]}
        </span>
      </div>

      <div className="carte-bien__corps">
        <h3 className="carte-bien__adresse">{bien.adresse}</h3>
        
        {bien.description && (
          <p className="carte-bien__description">{bien.description}</p>
        )}

        <div className="carte-bien__details">
          {bien.superficie && (
            <div className="carte-bien__detail">
              <Maximize size={16} />
              <span>{bien.superficie} m²</span>
            </div>
          )}
          
          {bien.prix && (
            <div className="carte-bien__detail">
              <DollarSign size={16} />
              <span>{formaterPrix(bien.prix)}</span>
            </div>
          )}
        </div>

        {bien.proprietaire && (
          <div className="carte-bien__proprietaire">
            <span className="carte-bien__label">Propriétaire:</span>
            <span>{bien.proprietaire.nom}</span>
          </div>
        )}

        {bien.latitude && bien.longitude && (
          <div className="carte-bien__localisation">
            <MapPin size={14} />
            <span>Géolocalisé</span>
          </div>
        )}
      </div>

      {(surModifier || surSupprimer) && (
        <div className="carte-bien__actions">
          {surModifier && (
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surModifier(bien);
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
                surSupprimer(bien);
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
