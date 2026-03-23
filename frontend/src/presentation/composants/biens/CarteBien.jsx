/**
 * Composant — Carte d'affichage d'un bien
 */

import { MapPin, Home, DollarSign, Maximize, User } from 'lucide-react';
import { LABELS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import { LABELS_STATUTS_BIEN, COULEURS_STATUTS_BIEN } from '../../../domaine/valeursObjets/statutBien';
import { formaterMontant } from '../../../application/utils/formatters';
import { getImageUrl } from '../../../application/utils/imageUtils';
import './CarteBien.css';

export default function CarteBien({ bien, surClic, surModifier, surSupprimer }) {

  // Obtenir la première photo ou utiliser le placeholder
  const obtenirImagePrincipale = () => {
    const photos = bien.photos || [];
    if (photos.length > 0) {
      const photoUrl = photos[0].url || photos[0];
      return getImageUrl(photoUrl, '/images/placeholders/bien-placeholder.svg');
    }
    return '/images/placeholders/bien-placeholder.svg';
  };

  return (
    <div className="carte-bien" onClick={() => surClic?.(bien)}>
      {/* Image du bien */}
      <div className="carte-bien__image">
        <img src={obtenirImagePrincipale()} alt={bien.adresse} />
        <span className={`carte-bien__badge badge--${COULEURS_STATUTS_BIEN[bien.statut]}`}>
          {LABELS_STATUTS_BIEN[bien.statut]}
        </span>
      </div>

      <div className="carte-bien__contenu">
        <div className="carte-bien__entete">
          <div className="carte-bien__type">
            <Home size={16} />
            <span>{LABELS_TYPES_BIEN[bien.type]}</span>
          </div>
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
                <span>{formaterMontant(bien.prix)}</span>
              </div>
            )}
          </div>

          {bien.proprietaire && (
            <div className="carte-bien__proprietaire">
              <span className="carte-bien__label">Propriétaire:</span>
              <span>{bien.proprietaire.nom}</span>
            </div>
          )}

          {bien.contrat_actif?.locataire && (
            <div className="carte-bien__locataire">
              <User size={16} />
              <span className="carte-bien__label">Locataire:</span>
              <span>{bien.contrat_actif.locataire.nom} {bien.contrat_actif.locataire.prenom}</span>
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
    </div>
  );
}
