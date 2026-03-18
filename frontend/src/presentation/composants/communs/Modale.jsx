/**
 * Composant Modale — Composant centralisé pour toutes les modales
 * Design épuré, structuré et professionnel
 */

import { X } from 'lucide-react';
import './Modale.css';

export default function Modale({
  titre,
  children,
  surFermer,
  taille = 'moyen', // 'petit', 'moyen', 'grand', 'tres-grand'
  afficherBoutonFermer = true,
  actionsPersonnalisees = null,
  enCours = false,
}) {
  const gererClicFond = (e) => {
    if (e.target === e.currentTarget && !enCours) {
      surFermer();
    }
  };

  return (
    <div className="modale-fond" onClick={gererClicFond}>
      <div className={`modale modale--${taille}`} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="modale__entete">
          <h2 className="modale__titre">{titre}</h2>
          {afficherBoutonFermer && (
            <button
              className="modale__bouton-fermer"
              onClick={surFermer}
              disabled={enCours}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Corps */}
        <div className="modale__corps">{children}</div>

        {/* Actions personnalisées (optionnel) */}
        {actionsPersonnalisees && (
          <div className="modale__actions">{actionsPersonnalisees}</div>
        )}
      </div>
    </div>
  );
}
