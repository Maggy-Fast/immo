/**
 * Composant — Carte d'affichage d'un lotissement
 */

import { MapPin, Maximize, Grid, TrendingUp } from 'lucide-react';
import './CarteLotissement.css';

export default function CarteLotissement({ lotissement, surClic, surModifier, surSupprimer, surVoirParcelles }) {
  const formaterSuperficie = (superficie) => {
    return new Intl.NumberFormat('fr-FR').format(superficie) + ' m²';
  };

  return (
    <div className="carte-lotissement" onClick={() => surClic?.(lotissement)}>
      <div className="carte-lotissement__entete">
        <h3 className="carte-lotissement__nom">{lotissement.nom}</h3>
        {lotissement.latitude && lotissement.longitude && (
          <div className="carte-lotissement__geo">
            <MapPin size={14} />
          </div>
        )}
      </div>

      <div className="carte-lotissement__corps">
        <div className="carte-lotissement__localisation">
          <MapPin size={16} />
          <span>{lotissement.localisation}</span>
        </div>

        <div className="carte-lotissement__details">
          <div className="carte-lotissement__detail">
            <Maximize size={16} />
            <div>
              <span className="carte-lotissement__label">Superficie totale</span>
              <span className="carte-lotissement__valeur">
                {formaterSuperficie(lotissement.superficieTotale || lotissement.superficie_totale)}
              </span>
            </div>
          </div>

          <div className="carte-lotissement__detail">
            <Grid size={16} />
            <div>
              <span className="carte-lotissement__label">Parcelles</span>
              <span className="carte-lotissement__valeur">
                {lotissement.nombreParcelles || lotissement.nombre_parcelles}
              </span>
            </div>
          </div>
        </div>

        {lotissement.parcelles && lotissement.parcelles.length > 0 && (
          <div className="carte-lotissement__stats">
            <div className="carte-lotissement__stat">
              <TrendingUp size={14} />
              <span>
                {lotissement.parcelles.filter(p => p.statut === 'disponible').length} disponibles
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="carte-lotissement__actions">
        {surVoirParcelles && (
          <button
            className="bouton bouton--primaire bouton--petit"
            onClick={(e) => {
              e.stopPropagation();
              surVoirParcelles(lotissement);
            }}
          >
            Voir parcelles
          </button>
        )}
        {surModifier && (
          <button
            className="bouton bouton--secondaire bouton--petit"
            onClick={(e) => {
              e.stopPropagation();
              surModifier(lotissement);
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
              surSupprimer(lotissement);
            }}
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}
