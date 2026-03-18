/**
 * Composant — Carte d'affichage d'un partenariat
 */

import { Users, MapPin, DollarSign, PieChart, Calculator } from 'lucide-react';
import { formaterMontant } from '../../../application/utils/formatters';
import './CartePartenariat.css';

export default function CartePartenariat({ 
  partenariat, 
  surClic, 
  surModifier, 
  surSupprimer,
  surCalculer 
}) {

  return (
    <div className="carte-partenariat" onClick={() => surClic?.(partenariat)}>
      <div className="carte-partenariat__entete">
        <div className="carte-partenariat__icone">
          <Users size={20} />
        </div>
        <h3 className="carte-partenariat__titre">Partenariat</h3>
      </div>

      <div className="carte-partenariat__corps">
        {/* Lotissement */}
        {partenariat.lotissement && (
          <div className="carte-partenariat__section">
            <MapPin size={16} />
            <div>
              <span className="carte-partenariat__label">Lotissement</span>
              <span className="carte-partenariat__valeur">{partenariat.lotissement.nom}</span>
            </div>
          </div>
        )}

        {/* Promoteur */}
        {partenariat.promoteur && (
          <div className="carte-partenariat__section">
            <Users size={16} />
            <div>
              <span className="carte-partenariat__label">Promoteur</span>
              <span className="carte-partenariat__valeur">{partenariat.promoteur.nom}</span>
            </div>
          </div>
        )}

        {/* Propriétaire */}
        {partenariat.proprietaire && (
          <div className="carte-partenariat__section">
            <Users size={16} />
            <div>
              <span className="carte-partenariat__label">Propriétaire</span>
              <span className="carte-partenariat__valeur">{partenariat.proprietaire.nom}</span>
            </div>
          </div>
        )}

        {/* Ticket d'entrée */}
        <div className="carte-partenariat__ticket">
          <DollarSign size={16} />
          <div>
            <span className="carte-partenariat__label">Ticket d'entrée</span>
            <span className="carte-partenariat__valeur-montant">
              {formaterMontant(partenariat.ticketEntree || partenariat.ticket_entree)}
            </span>
          </div>
        </div>

        {/* Répartition */}
        <div className="carte-partenariat__repartition">
          <PieChart size={16} />
          <div className="carte-partenariat__pourcentages">
            <div className="carte-partenariat__pourcentage">
              <span className="carte-partenariat__label">Promoteur</span>
              <span className="carte-partenariat__pct">
                {partenariat.pourcentagePromoteur || partenariat.pourcentage_promoteur}%
              </span>
            </div>
            <div className="carte-partenariat__separateur">|</div>
            <div className="carte-partenariat__pourcentage">
              <span className="carte-partenariat__label">Propriétaire</span>
              <span className="carte-partenariat__pct">
                {partenariat.pourcentagePropriétaire || partenariat.pourcentage_proprietaire}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="carte-partenariat__actions">
        {surCalculer && (
          <button
            className="bouton bouton--primaire bouton--petit"
            onClick={(e) => {
              e.stopPropagation();
              surCalculer(partenariat);
            }}
          >
            <Calculator size={16} />
            Calculer
          </button>
        )}
        {surModifier && (
          <button
            className="bouton bouton--secondaire bouton--petit"
            onClick={(e) => {
              e.stopPropagation();
              surModifier(partenariat);
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
              surSupprimer(partenariat);
            }}
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
