/**
 * Composant — Modale d'affichage des détails d'une parcelle coopérative
 */

import { MapPin, Maximize, DollarSign, User, Calendar, Tag, Users, FileText } from 'lucide-react';
import { Modale } from '../communs';
import { formaterMontant } from '../../../application/utils/formatters';
import './ModaleDetailsParcelleCooperative.css';

export default function ModaleDetailsParcelleCooperative({ parcelle, surFermer, surModifier }) {
  if (!parcelle) return null;

  const formaterDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const obtenirBadgeStatut = (statut) => {
    switch (statut) {
      case 'disponible':
        return { texte: 'Disponible', classe: 'badge--disponible' };
      case 'attribuee':
        return { texte: 'Attribuée', classe: 'badge--attribuee' };
      case 'vendue':
        return { texte: 'Vendue', classe: 'badge--vendue' };
      default:
        return { texte: statut || 'Inconnu', classe: 'badge--inconnu' };
    }
  };

  const badge = obtenirBadgeStatut(parcelle.statut);

  return (
    <Modale
      titre={`Détails de la parcelle — ${parcelle.numero}`}
      surFermer={surFermer}
      taille="grand"
    >
      <div className="details-parcelle">
        {/* Photo de la parcelle */}
        {parcelle.photo ? (
          <div className="details-parcelle__photo">
            <img 
              src={parcelle.photo} 
              alt={`Photo de la parcelle ${parcelle.numero}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #6c757d; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;"><div style="text-align: center;"><MapPin size={48} /><p style="margin-top: 1rem;">Photo non disponible</p></div></div>';
              }}
              onLoad={(e) => {
                e.target.style.display = 'block';
              }}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="details-parcelle__photo details-parcelle__photo--placeholder">
            <MapPin size={48} color="#6c757d" />
            <span>Aucune photo disponible</span>
          </div>
        )}

        {/* Informations principales */}
        <div className="details-parcelle__grille">
          <div className="details-parcelle__section">
            <h3 className="details-parcelle__section-titre">Informations Générales</h3>
            <div className="details-parcelle__items">
              <div className="details-parcelle__item">
                <MapPin size={20} />
                <div>
                  <span className="details-parcelle__label">Numéro</span>
                  <span className="details-parcelle__valeur">{parcelle.numero}</span>
                </div>
              </div>
              
              <div className="details-parcelle__item">
                <Maximize size={20} />
                <div>
                  <span className="details-parcelle__label">Surface</span>
                  <span className="details-parcelle__valeur">{parcelle.surface} m²</span>
                </div>
              </div>
              
              <div className="details-parcelle__item">
                <DollarSign size={20} />
                <div>
                  <span className="details-parcelle__label">Prix</span>
                  <span className="details-parcelle__valeur">{formaterMontant(parcelle.prix)}</span>
                </div>
              </div>
              
              <div className="details-parcelle__item">
                <Tag size={20} />
                <div>
                  <span className="details-parcelle__label">Statut</span>
                  <span className={`badge ${badge.classe}`}>{badge.texte}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-parcelle__section">
            <h3 className="details-parcelle__section-titre">Description</h3>
            {parcelle.description ? (
              <p className="details-parcelle__description">{parcelle.description}</p>
            ) : (
              <p className="details-parcelle__vide">Aucune description disponible</p>
            )}
          </div>

          {/* Adhérents associés */}
          <div className="details-parcelle__section">
            <h3 className="details-parcelle__section-titre">
              <Users size={20} />
              Adhérents associés
            </h3>
            {parcelle.adherents && parcelle.adherents.length > 0 ? (
              <div className="details-parcelle__adherents">
                {parcelle.adherents.map((adherent, idx) => (
                  <div key={`adherent-${adherent.id}-${idx}`} className="details-parcelle__adherent">
                    <User size={16} />
                    <div className="details-parcelle__adherent-info">
                      <span className="details-parcelle__adherent-nom">
                        {adherent.prenom} {adherent.nom}
                      </span>
                      {adherent.pivot?.pourcentage_possession && (
                        <span className="details-parcelle__adherent-pourcentage">
                          {Math.round(adherent.pivot.pourcentage_possession)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : parcelle.adherent ? (
              <div className="details-parcelle__adherents">
                <div className="details-parcelle__adherent">
                  <User size={16} />
                  <div className="details-parcelle__adherent-info">
                    <span className="details-parcelle__adherent-nom">
                      {parcelle.adherent.prenom} {parcelle.adherent.nom}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="details-parcelle__vide">Aucun adhérent associé</p>
            )}
          </div>

          {/* Informations système */}
          <div className="details-parcelle__section">
            <h3 className="details-parcelle__section-titre">
              <Calendar size={20} />
              Informations système
            </h3>
            <div className="details-parcelle__items">
              <div className="details-parcelle__item">
                <Calendar size={20} />
                <div>
                  <span className="details-parcelle__label">Créée le</span>
                  <span className="details-parcelle__valeur">{formaterDate(parcelle.created_at)}</span>
                </div>
              </div>
              
              <div className="details-parcelle__item">
                <Calendar size={20} />
                <div>
                  <span className="details-parcelle__label">Dernière modification</span>
                  <span className="details-parcelle__valeur">{formaterDate(parcelle.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="details-parcelle__actions">
          <button 
            className="bouton bouton--secondaire" 
            onClick={surFermer}
          >
            Fermer
          </button>
          {surModifier && (
            <button 
              className="bouton bouton--primaire" 
              onClick={() => surModifier(parcelle)}
            >
              Modifier
            </button>
          )}
        </div>
      </div>
    </Modale>
  );
}
