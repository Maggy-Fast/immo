/**
 * Composant — Modale d'affichage des détails d'un propriétaire et de ses biens
 */

import React from 'react';
import { Mail, Phone, MapPin, CreditCard, Home, ExternalLink, Loader2 } from 'lucide-react';
import { Modale } from '../communs';
import Avatar from '../communs/Avatar';
import { utiliserBiens } from '../../../application/hooks/utiliserBiens';
import { formaterMontant } from '../../../application/utils/formatters';
import { LABELS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import './ModaleDetailsProprietaire.css';

export default function ModaleDetailsProprietaire({ proprietaire, surFermer, surModifierProprietaire, surVoirDetailsBien }) {
  const { biens, chargement: chargementBiens } = utiliserBiens({ idProprietaire: proprietaire?.id });

  if (!proprietaire) return null;

  return (
    <Modale
      titre={`Détails du propriétaire — ${proprietaire.nom}`}
      surFermer={surFermer}
      taille="grand"
    >
      <div className="details-proprietaire">
        <div className="details-proprietaire__grille">
          {/* Section Profil */}
          <div className="details-proprietaire__profil">
            <div className="details-proprietaire__avatar-wrapper">
              <Avatar
                src={proprietaire.photo}
                nom={proprietaire.nom}
                taille="tres-grand"
                forme="cercle"
              />
            </div>
            <div className="details-proprietaire__infos">
              <h3 className="details-proprietaire__nom">{proprietaire.nom}</h3>
              <div className="details-proprietaire__contact-list">
                <div className="details-proprietaire__contact-item">
                  <Mail size={18} />
                  <span>{proprietaire.email}</span>
                </div>
                <div className="details-proprietaire__contact-item">
                  <Phone size={18} />
                  <span>{proprietaire.telephone}</span>
                </div>
                {proprietaire.adresse && (
                  <div className="details-proprietaire__contact-item">
                    <MapPin size={18} />
                    <span>{proprietaire.adresse}</span>
                  </div>
                )}
                {proprietaire.cin && (
                  <div className="details-proprietaire__contact-item">
                    <CreditCard size={18} />
                    <span>CIN: {proprietaire.cin}</span>
                  </div>
                )}
              </div>
              <button 
                className="bouton bouton--secondaire bouton--plein"
                onClick={() => surModifierProprietaire(proprietaire)}
              >
                Modifier le profil
              </button>
            </div>
          </div>

          {/* Section Biens */}
          <div className="details-proprietaire__biens">
            <div className="details-proprietaire__biens-entete">
              <h4 className="details-proprietaire__section-titre">
                <Home size={18} />
                Biens Immobiliers ({biens.length})
              </h4>
            </div>

            <div className="details-proprietaire__liste-biens">
              {chargementBiens ? (
                <div className="details-proprietaire__etat-chargement">
                  <Loader2 className="chargement__spinner" size={24} />
                  <p>Récupération des biens...</p>
                </div>
              ) : biens.length > 0 ? (
                biens.map(bien => (
                  <div key={bien.id} className="item-bien-lie" onClick={() => surVoirDetailsBien?.(bien)}>
                    <div className="item-bien-lie__infos">
                      <span className="item-bien-lie__type">{LABELS_TYPES_BIEN[bien.type]}</span>
                      <span className="item-bien-lie__adresse">{bien.adresse}</span>
                      <span className="item-bien-lie__prix">{formaterMontant(bien.prix || bien.loyer)}</span>
                    </div>
                    <div className="item-bien-lie__action">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="details-proprietaire__vide">
                  <Home size={32} />
                  <p>Ce propriétaire ne possède aucun bien pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modale>
  );
}
