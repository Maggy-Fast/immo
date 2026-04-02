/**
 * Composant — Carte d'affichage d'un promoteur
 */

import { Phone, Mail, MapPin, Building2, Briefcase } from 'lucide-react';
import Avatar from '../communs/Avatar';
import './CartePromoteur.css';

export default function CartePromoteur({ promoteur, onModifier, onSupprimer }) {
  return (
    <div className="carte-promoteur" onClick={() => onModifier?.(promoteur)}>
      <div className="carte-promoteur__entete">
        <Avatar
          src={promoteur.logo}
          nom={promoteur.nom}
          taille="grand"
          forme="cercle"
        />
        <div className="carte-promoteur__info-principale">
          <h3 className="carte-promoteur__nom">{promoteur.nom}</h3>
          <div className="carte-promoteur__badge">
            <Briefcase size={14} />
            <span>Partenaire</span>
          </div>
        </div>
      </div>

      <div className="carte-promoteur__corps">
        <div className="carte-promoteur__contact">
          <div className="carte-promoteur__ligne">
            <Phone size={16} />
            <span>{promoteur.telephone}</span>
          </div>
          
          <div className="carte-promoteur__ligne">
            <Mail size={16} />
            <span>{promoteur.email}</span>
          </div>

          <div className="carte-promoteur__ligne">
            <MapPin size={16} />
            <span>{promoteur.adresse || 'Adresse non renseignée'}</span>
          </div>

          {promoteur.nif && (
            <div className="carte-promoteur__ligne">
              <Building2 size={16} />
              <span>NIF: {promoteur.nif}</span>
            </div>
          )}
        </div>
      </div>

      <div className="carte-promoteur__actions">
        <button
          className="bouton bouton--secondaire bouton--petit"
          onClick={(e) => {
            e.stopPropagation();
            onModifier(promoteur);
          }}
        >
          Modifier
        </button>
        <button
          className="bouton bouton--danger bouton--petit"
          onClick={(e) => {
            e.stopPropagation();
            onSupprimer(promoteur);
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
