/**
 * Composant Formulaire — Conteneur centralisé pour les formulaires
 * Design épuré, structuré et professionnel
 */

import './Formulaire.css';

export default function Formulaire({
  children,
  surSoumettre,
  colonnes = 2, // 1, 2, 3
  espacementVertical = 'normal', // 'compact', 'normal', 'large'
}) {
  const gererSoumission = (e) => {
    e.preventDefault();
    surSoumettre(e);
  };

  const classesFormulaire = [
    'formulaire',
    `formulaire--colonnes-${colonnes}`,
    `formulaire--espacement-${espacementVertical}`,
  ].join(' ');

  return (
    <form onSubmit={gererSoumission} className={classesFormulaire}>
      {children}
    </form>
  );
}
