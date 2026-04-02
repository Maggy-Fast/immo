import React from 'react';
import { User, Phone, Mail, MapPin, IdCard, FileCheck, Building2, Image as ImageIcon, FileText, Edit, Trash2 } from 'lucide-react';

const CartePromoteur = ({ promoteur, onModifier, onSupprimer }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="carte-promoteur">
      <div className="carte-promoteur__en-tete">
        {promoteur.photo ? (
          <img
            src={promoteur.photo}
            alt={promoteur.nom}
            className="carte-promoteur__photo"
          />
        ) : (
          <div className="carte-promoteur__photo-placeholder">
            <User size={32} />
          </div>
        )}
        
        <div className="carte-promoteur__info">
          <h3 className="carte-promoteur__nom">{promoteur.nom}</h3>
          <p className="carte-promoteur__telephone">
            <Phone size={14} />
            {promoteur.telephone}
          </p>
          {promoteur.email && (
            <p className="carte-promoteur__email">
              <Mail size={14} />
              {promoteur.email}
            </p>
          )}
        </div>
        
        <div className="carte-promoteur__statut">
          <span className="badge badge--primaire">
            {promoteur.statut_juridique || 'Non défini'}
          </span>
        </div>
      </div>

      <div className="carte-promoteur__details">
        {promoteur.adresse && (
          <div className="carte-promoteur__detail">
            <MapPin size={14} />
            <span>{promoteur.adresse}</span>
          </div>
        )}
        
        {promoteur.cin && (
          <div className="carte-promoteur__detail">
            <IdCard size={14} />
            <span>CIN: {promoteur.cin}</span>
          </div>
        )}
        
        {promoteur.licence && (
          <div className="carte-promoteur__detail">
            <FileCheck size={14} />
            <span>Licence: {promoteur.licence}</span>
          </div>
        )}
        
        {promoteur.registre_commerce && (
          <div className="carte-promoteur__detail">
            <Building2 size={14} />
            <span>RCC: {promoteur.registre_commerce}</span>
          </div>
        )}
      </div>

      <div className="carte-promoteur__documents">
        <h4>Documents</h4>
        <div className="carte-promoteur__documents-liste">
          {promoteur.photo && (
            <div className="document-item">
              <ImageIcon size={14} />
              <span>Photo</span>
            </div>
          )}
          {promoteur.licence && (
            <div className="document-item">
              <FileText size={14} />
              <span>Licence</span>
            </div>
          )}
          {promoteur.registre_commerce && (
            <div className="document-item">
              <FileText size={14} />
              <span>Registre de commerce</span>
            </div>
          )}
        </div>
      </div>

      <div className="carte-promoteur__actions">
        <button
          onClick={() => onModifier(promoteur)}
          className="bouton bouton--secondaire bouton--petit"
        >
          <Edit size={14} />
          Modifier
        </button>
        
        <button
          onClick={() => onSupprimer(promoteur)}
          className="bouton bouton--danger bouton--petit"
        >
          <Trash2 size={14} />
          Supprimer
        </button>
      </div>

      <div className="carte-promoteur__pied">
        <small>
          Créé le {formatDate(promoteur.created_at)}
          {promoteur.updated_at !== promoteur.created_at && (
            <> • Modifié le {formatDate(promoteur.updated_at)}</>
          )}
        </small>
      </div>
    </div>
  );
};

export default CartePromoteur;
