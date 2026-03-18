/**
 * Composant Modal Réutilisable - Design Moderne
 */

import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ 
  titre, 
  children, 
  surFermer, 
  taille = 'moyen', // 'petit', 'moyen', 'grand'
  afficherBoutonFermer = true 
}) {
  return (
    <div className="modal-overlay" onClick={surFermer}>
      <div 
        className={`modal modal--${taille}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__entete">
          <h2 className="modal__titre">{titre}</h2>
          {afficherBoutonFermer && (
            <button 
              className="modal__bouton-fermer" 
              onClick={surFermer}
              type="button"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="modal__corps">
          {children}
        </div>
      </div>
    </div>
  );
}
