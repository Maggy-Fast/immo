/**
 * Composant — Modale d'affichage des détails d'un locataire et de ses biens loués
 */

import React from 'react';
import { Mail, Phone, MapPin, CreditCard, Home, ExternalLink, Loader2, Briefcase } from 'lucide-react';
import { Modale } from '../communs';
import Avatar from '../communs/Avatar';
import { utiliserContrats } from '../../../application/hooks/utiliserContrats';
import { formaterMontant } from '../../../application/utils/formatters';
import { LABELS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import './ModaleDetailsLocataire.css';

export default function ModaleDetailsLocataire({ locataire, surFermer, surModifierLocataire, surVoirDetailsBien }) {
  const { contrats, chargement: chargementContrats } = utiliserContrats({ idLocataire: locataire?.id });

  if (!locataire) return null;

  return (
    <Modale
      titre={`Détails du locataire — ${locataire.nom}`}
      surFermer={surFermer}
      taille="grand"
    >
      <div className="details-locataire">
        <div className="details-locataire__grille">
          {/* Section Profil */}
          <div className="details-locataire__profil">
            <div className="details-locataire__avatar-wrapper">
              <Avatar
                src={locataire.photo}
                nom={locataire.nom}
                taille="tres-grand"
                forme="cercle"
              />
            </div>
            <div className="details-locataire__infos">
              <h3 className="details-locataire__nom">{locataire.nom}</h3>
              <div className="details-locataire__contact-list">
                <div className="details-locataire__contact-item">
                  <Mail size={18} />
                  <span>{locataire.email}</span>
                </div>
                <div className="details-locataire__contact-item">
                  <Phone size={18} />
                  <span>{locataire.telephone}</span>
                </div>
                {locataire.adresse && (
                  <div className="details-locataire__contact-item">
                    <MapPin size={18} />
                    <span>{locataire.adresse}</span>
                  </div>
                )}
                {locataire.cin && (
                  <div className="details-locataire__contact-item">
                    <CreditCard size={18} />
                    <span>CIN: {locataire.cin}</span>
                  </div>
                )}
                {locataire.profession && (
                  <div className="details-locataire__contact-item">
                    <Briefcase size={18} />
                    <span>{locataire.profession}</span>
                  </div>
                )}
              </div>
              <button 
                className="bouton bouton--secondaire bouton--plein"
                onClick={() => surModifierLocataire(locataire)}
              >
                Modifier le profil
              </button>
            </div>
          </div>

          {/* Section Biens Loués */}
          <div className="details-locataire__biens">
            <div className="details-locataire__biens-entete">
              <h4 className="details-locataire__section-titre">
                <Home size={18} />
                Biens loués ({contrats?.length || 0})
              </h4>
            </div>

            <div className="details-locataire__liste-biens">
              {chargementContrats ? (
                <div className="details-locataire__etat-chargement">
                  <Loader2 className="chargement__spinner" size={24} />
                  <p>Récupération des contrats...</p>
                </div>
              ) : contrats && contrats.length > 0 ? (
                contrats.map(contrat => {
                  const bien = contrat.bien;
                  if (!bien) return null; // Sécurité si l'API ne retourne pas l'objet 'bien'

                  return (
                    <div key={contrat.id} className="item-bien-loue" onClick={() => surVoirDetailsBien?.(bien)}>
                      <div className="item-bien-loue__infos">
                        <span className="item-bien-loue__type">{LABELS_TYPES_BIEN[bien.type] || bien.type}</span>
                        <span className="item-bien-loue__adresse">{bien.adresse}</span>
                        <div className="item-bien-loue__details">
                          <span className="item-bien-loue__loyer">{formaterMontant(contrat.loyer_mensuel)}/mois</span>
                          <span className={`item-bien-loue__badge item-bien-loue__badge--${contrat.statut}`}>
                            {contrat.statut}
                          </span>
                        </div>
                      </div>
                      <div className="item-bien-loue__action">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="details-locataire__vide">
                  <Home size={32} />
                  <p>Ce locataire n'a aucun contrat de location actif.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modale>
  );
}
