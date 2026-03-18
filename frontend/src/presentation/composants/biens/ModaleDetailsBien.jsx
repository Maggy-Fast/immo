/**
 * Composant — Modale d'affichage des détails d'un bien
 */

import { MapPin, Home, DollarSign, Maximize, User, Calendar, Tag } from 'lucide-react';
import { Modale } from '../communs';
import { LABELS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import { LABELS_STATUTS_BIEN, COULEURS_STATUTS_BIEN } from '../../../domaine/valeursObjets/statutBien';
import { formaterMontant } from '../../../application/utils/formatters';
import './ModaleDetailsBien.css';

export default function ModaleDetailsBien({ bien, surFermer, surModifier }) {
  if (!bien) return null;

  const formaterDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const transformerUrlImage = (imageUrl) => {
    // Laisser l'URL /storage/ telle quelle (le proxy Vite s'en occupe)
    return imageUrl;
  };

  const images = bien.photos || [];

  return (
    <Modale
      titre={`Détails du bien — ${bien.adresse}`}
      surFermer={surFermer}
      taille="grand"
    >
      <div className="details-bien">
        {/* Galerie d'images */}
        <div className="details-bien__galerie">
          {images.length > 0 ? (
            <div className="details-bien__images-conteneur">
              <div className="details-bien__image-principale">
                <img src={transformerUrlImage(images[0].url || images[0])} alt="Principale" />
              </div>
              {images.length > 1 && (
                <div className="details-bien__miniatures">
                  {images.slice(1, 5).map((img, index) => (
                    <div key={index} className="details-bien__miniature">
                      <img src={transformerUrlImage(img.url || img)} alt={`Miniature ${index + 1}`} />
                    </div>
                  ))}
                  {images.length > 5 && (
                    <div className="details-bien__miniature-plus">
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="details-bien__pas-d-image">
              <p>Aucune image disponible pour ce bien</p>
            </div>
          )}
        </div>

        {/* Informations principales */}
        <div className="details-bien__grille">
          <div className="details-bien__section">
            <h3 className="details-bien__section-titre">Informations Générales</h3>
            <div className="details-bien__items">
              <div className="details-bien__item">
                <Tag size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Type</span>
                  <span className="details-bien__item-valeur">{LABELS_TYPES_BIEN[bien.type]}</span>
                </div>
              </div>

              <div className="details-bien__item">
                <div className={`badge badge--${COULEURS_STATUTS_BIEN[bien.statut]}`}>
                  {LABELS_STATUTS_BIEN[bien.statut]}
                </div>
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Statut</span>
                  <span className="details-bien__item-valeur">Actuellement {LABELS_STATUTS_BIEN[bien.statut].toLowerCase()}</span>
                </div>
              </div>

              <div className="details-bien__item">
                <DollarSign size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Prix / Loyer</span>
                  <span className="details-bien__item-valeur texte-primaire">{formaterMontant(bien.prix)}</span>
                </div>
              </div>

              <div className="details-bien__item">
                <Maximize size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Superficie</span>
                  <span className="details-bien__item-valeur">{bien.superficie || 'Non spécifiée'} m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-bien__section">
            <h3 className="details-bien__section-titre">Localisation & Contact</h3>
            <div className="details-bien__items">
              <div className="details-bien__item">
                <MapPin size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Adresse</span>
                  <span className="details-bien__item-valeur">{bien.adresse}</span>
                </div>
              </div>

              <div className="details-bien__item">
                <User size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Propriétaire</span>
                  <span className="details-bien__item-valeur">{bien.proprietaire?.nom || 'Inconnu'}</span>
                </div>
              </div>

              <div className="details-bien__item">
                <Calendar size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Ajouté le</span>
                  <span className="details-bien__item-valeur">{formaterDate(bien.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Locataire (si loué) */}
        {bien.contrat_actif?.locataire && (
          <div className="details-bien__section details-bien__section--locataire">
            <h3 className="details-bien__section-titre">Information sur la Location</h3>
            <div className="details-bien__items">
              <div className="details-bien__item">
                <User size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Locataire Actuel</span>
                  <span className="details-bien__item-valeur">
                    {bien.contrat_actif.locataire.nom} {bien.contrat_actif.locataire.prenom}
                  </span>
                </div>
              </div>
              <div className="details-bien__item">
                <Calendar size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Début du bail</span>
                  <span className="details-bien__item-valeur">
                    {formaterDate(bien.contrat_actif.date_debut)}
                  </span>
                </div>
              </div>
              <div className="details-bien__item">
                <DollarSign size={18} />
                <div className="details-bien__item-info">
                  <span className="details-bien__item-label">Loyer Contractuel</span>
                  <span className="details-bien__item-valeur texte-primaire">
                    {formaterMontant(bien.contrat_actif.loyer_mensuel)}/mois
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="details-bien__section details-bien__section--pleine">
          <h3 className="details-bien__section-titre">Description</h3>
          <p className="details-bien__description">
            {bien.description || "Aucune description détaillée n'a été fournie pour ce bien."}
          </p>
        </div>

        {/* Actions */}
        <div className="details-bien__actions">
          <button className="bouton bouton--secondaire" onClick={() => surModifier(bien)}>
            Modifier le bien
          </button>
          <button className="bouton bouton--contour" onClick={surFermer}>
            Fermer
          </button>
        </div>
      </div>
    </Modale>
  );
}
