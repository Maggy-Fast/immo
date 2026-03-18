/**
 * Composant ActionsFormulaire — Boutons d'action pour les formulaires
 * Design épuré, structuré et professionnel
 */

import React from 'react';
import './ActionsFormulaire.css';

/**
 * Rendu d'une icône — supporte à la fois :
 *   - une référence de composant : Home
 *   - un élément JSX          : <Home size={18} />
 */
function renderIcone(icone) {
  if (!icone) return null;
  // React.isValidElement détecte fiablement les éléments JSX (<Home size={18} />)
  if (React.isValidElement(icone)) return icone;
  // Sinon c'est une référence de composant (fonction, classe ou forwardRef)
  const Icone = icone;
  return <Icone size={16} />;
}

export default function ActionsFormulaire({
  surAnnuler,
  texteBoutonPrincipal = 'Enregistrer',
  texteBoutonSecondaire = 'Annuler',
  enCours = false,
  texteChargement = 'Enregistrement...',
  iconePrincipal = null,
  iconeSecondaire = null,
  alignement = 'droite', // 'gauche', 'centre', 'droite', 'espace'
  desactiverPrincipal = false,
}) {
  const classesConteneur = [
    'actions-formulaire',
    `actions-formulaire--${alignement}`,
  ].join(' ');

  return (
    <div className={classesConteneur}>
      <button
        type="button"
        className="bouton bouton--secondaire"
        onClick={surAnnuler}
        disabled={enCours}
      >
        {renderIcone(iconeSecondaire)}
        {texteBoutonSecondaire}
      </button>
      <button
        type="submit"
        className="bouton bouton--primaire"
        disabled={enCours || desactiverPrincipal}
      >
        {!enCours && renderIcone(iconePrincipal)}
        {enCours ? texteChargement : texteBoutonPrincipal}
      </button>
    </div>
  );
}

