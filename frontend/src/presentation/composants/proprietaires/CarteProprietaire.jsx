/**
 * Composant — Carte d'affichage d'un propriétaire
 */

import { Phone, Mail, MapPin, Home, CreditCard } from 'lucide-react';
import Avatar from '../communs/Avatar';
import './CarteProprietaire.css';

export default function CarteProprietaire({ proprietaire, surClic, surModifier, surSupprimer }) {
  return (
    <div className="carte-proprietaire" onClick={() => surClic?.(proprietaire)}>
      <div className="carte-proprietaire__entete">
        <Avatar
          src={proprietaire.photo}
          nom={proprietaire.nom}
          taille="grand"
          forme="cercle"
        />
        <div className="carte-proprietaire__info-principale">
          <h3 className="carte-proprietaire__nom">{proprietaire.nom}</h3>
          {proprietaire.nombreBiens !== undefined && (
            <div className="carte-proprietaire__badge">
              <Home size={14} />
              <span>{proprietaire.nombreBiens} bien{proprietaire.nombreBiens > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      <div className="carte-proprietaire__corps">
        <div className="carte-proprietaire__contact">
          <div className="carte-proprietaire__ligne">
            <Phone size={16} />
            <span>{proprietaire.telephone}</span>
          </div>
          
          <div className="carte-proprietaire__ligne">
            <Mail size={16} />
            <span>{proprietaire.email}</span>
          </div>

          {proprietaire.adresse && (
            <div className="carte-proprietaire__ligne">
              <MapPin size={16} />
              <span>{proprietaire.adresse}</span>
            </div>
          )}

          {proprietaire.cin && (
            <div className="carte-proprietaire__ligne">
              <CreditCard size={16} />
              <span>CIN: {proprietaire.cin}</span>
            </div>
          )}
        </div>
      </div>

      {(surModifier || surSupprimer) && (
        <div className="carte-proprietaire__actions">
          {surModifier && (
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surModifier(proprietaire);
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
                surSupprimer(proprietaire);
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
