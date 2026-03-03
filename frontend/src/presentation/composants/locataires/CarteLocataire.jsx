/**
 * Composant — Carte d'affichage d'un locataire
 */

import { User, Phone, Mail, CreditCard, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import './CarteLocataire.css';

export default function CarteLocataire({ locataire, surClic, surModifier, surSupprimer }) {
  return (
    <div className="carte-locataire" onClick={() => surClic?.(locataire)}>
      <div className="carte-locataire__entete">
        <div className="carte-locataire__avatar">
          <User size={24} />
        </div>
        <div className="carte-locataire__info-principale">
          <h3 className="carte-locataire__nom">{locataire.nom}</h3>
          {locataire.contratActif !== undefined && (
            <div className={`carte-locataire__badge ${locataire.contratActif ? 'carte-locataire__badge--actif' : 'carte-locataire__badge--inactif'}`}>
              {locataire.contratActif ? (
                <>
                  <CheckCircle size={14} />
                  <span>Contrat actif</span>
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  <span>Sans contrat</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="carte-locataire__corps">
        <div className="carte-locataire__contact">
          <div className="carte-locataire__ligne">
            <Phone size={16} />
            <span>{locataire.telephone}</span>
          </div>
          
          <div className="carte-locataire__ligne">
            <Mail size={16} />
            <span>{locataire.email}</span>
          </div>

          {locataire.profession && (
            <div className="carte-locataire__ligne">
              <Briefcase size={16} />
              <span>{locataire.profession}</span>
            </div>
          )}

          {locataire.cin && (
            <div className="carte-locataire__ligne">
              <CreditCard size={16} />
              <span>CIN: {locataire.cin}</span>
            </div>
          )}
        </div>
      </div>

      {(surModifier || surSupprimer) && (
        <div className="carte-locataire__actions">
          {surModifier && (
            <button
              className="bouton bouton--secondaire bouton--petit"
              onClick={(e) => {
                e.stopPropagation();
                surModifier(locataire);
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
                surSupprimer(locataire);
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
