/**
 * Composant EtatVide — Affichage pour les listes vides
 */

import './EtatVide.css';

export default function EtatVide({
  image = '/images/illustrations/empty-state.svg',
  titre = 'Aucune donnée',
  description = 'Commencez par ajouter un élément',
  action = null,
  texteAction = 'Ajouter',
}) {
  return (
    <div className="etat-vide">
      <img src={image} alt={titre} className="etat-vide__image" />
      <h3 className="etat-vide__titre">{titre}</h3>
      <p className="etat-vide__description">{description}</p>
      {action && (
        <button onClick={action} className="bouton bouton--primaire">
          {texteAction}
        </button>
      )}
    </div>
  );
}
