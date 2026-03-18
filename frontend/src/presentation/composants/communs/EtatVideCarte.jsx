import React from 'react';
import './EtatVide.css';

const EtatVide = ({ titre, description, actionLabel, onAction }) => {
  return (
    <div className="etat-vide">
      <div className="etat-vide__icone">
        📍
      </div>
      <h3 className="etat-vide__titre">{titre}</h3>
      <p className="etat-vide__description">{description}</p>
      {actionLabel && onAction && (
        <button 
          className="etat-vide__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EtatVide;
