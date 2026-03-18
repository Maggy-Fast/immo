/**
 * Composant — Carte d'affichage d'une parcelle
 */

import { Maximize, DollarSign, Hash } from 'lucide-react';
import { LABELS_STATUTS_PARCELLE, COULEURS_STATUTS_PARCELLE } from '../../../domaine/valeursObjets/statutParcelle';
import { formaterMontant } from '../../../application/utils/formatters';
import './CarteParcelle.css';

export default function CarteParcelle({ parcelle, surClic, surModifier, surSupprimer }) {

  const prixParM2 = parcelle.superficie > 0 ? Math.round(parcelle.prix / parcelle.superficie) : 0;

  return (
    <div className="carte-parcelle" onClick={() => surClic?.(parcelle)}>
      <div className="carte-parcelle__entete">
        <div className="carte-parcelle__numero">
          <Hash size={16} />
          <span>{parcelle.numero}</span>
        </div>
        <span className={`badge badge--${COULEURS_STATUTS_PARCELLE[parcelle.statut]}`}>
          {LABELS_STATUTS_PARCELLE[parcelle.statut]}
        </span>
      </div>

      <div className="carte-parcelle__corps">
        {parcelle.lotissement && (
          <div className="carte-parcelle__lotissement">
            {parcelle.lotissement.nom}
          </div>
        )}

        <div className="carte-parcelle__details">
          <div className="carte-parcelle__detail">
            <Maximize size={16} />
            <div>
              <span className="carte-parcelle__label">Superficie</span>
              <span className="carte-parcelle__valeur">{parcelle.superficie} m²</span>
            </div>
          </div>

          <div className="carte-parcelle__detail">
            <DollarSign size={16} />
            <div>
              <span className="carte-parcelle__label">Prix total</span>
              <span className="carte-parcelle__valeur">{formaterMontant(parcelle.prix)}</span>
            </div>
          </div>
        </div>

        <div className="carte-parcelle__prix-m2">
          <span className="carte-parcelle__label">Prix au m²:</span>
          <span className="carte-parcelle__valeur-m2">{formaterMontant(prixParM2)}</span>
        </div>
      </div>

      {(surModifier || surSupprimer) && (
        <div className="carte-parcelle__actions">
          {surModifier && (
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surModifier(parcelle);
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
                surSupprimer(parcelle);
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
