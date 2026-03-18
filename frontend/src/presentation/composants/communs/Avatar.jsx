/**
 * Composant Avatar — Affichage d'avatar avec fallback
 */

import './Avatar.css';

export default function Avatar({
  src,
  nom,
  taille = 'moyen', // 'petit', 'moyen', 'grand', 'tres-grand'
  forme = 'cercle', // 'cercle' ou 'carre'
  afficherNom = false,
}) {
  const obtenirInitiales = (nomComplet) => {
    if (!nomComplet) return '?';
    const mots = nomComplet.trim().split(' ');
    if (mots.length === 1) return mots[0].charAt(0).toUpperCase();
    return (mots[0].charAt(0) + mots[mots.length - 1].charAt(0)).toUpperCase();
  };

  const obtenirCouleurFond = (nomComplet) => {
    if (!nomComplet) return '#9CA3AF';
    const hash = nomComplet.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const couleurs = [
      '#3B82F6', // Bleu
      '#10B981', // Vert
      '#F59E0B', // Orange
      '#EF4444', // Rouge
      '#8B5CF6', // Violet
      '#EC4899', // Rose
      '#14B8A6', // Teal
      '#F97316', // Orange foncé
    ];
    return couleurs[Math.abs(hash) % couleurs.length];
  };

  const classesAvatar = [
    'avatar',
    `avatar--${taille}`,
    `avatar--${forme}`,
  ].join(' ');

  const getImageUrl = (src) => {
    if (!src) return null;
    // Si l'URL commence par /storage, la laisser telle quelle (le proxy Vite s'en occupe)
    if (src.startsWith('/storage/')) {
      return src; // Le proxy Vite va rediriger vers le backend
    }
    return src;
  };

  const handleImageError = (e) => {
    // Cacher l'image en erreur et laisser les initiales s'afficher
    e.target.style.display = 'none';
  };

  return (
    <div className="avatar-wrapper">
      <div className={classesAvatar}>
        {src ? (
          <>
            <img 
              src={getImageUrl(src)} 
              alt={nom || 'Avatar'} 
              className="avatar__image" 
              onError={handleImageError}
            />
            <div
              className="avatar__initiales"
              style={{ backgroundColor: obtenirCouleurFond(nom) }}
            >
              {obtenirInitiales(nom)}
            </div>
          </>
        ) : (
          <div
            className="avatar__initiales"
            style={{ backgroundColor: obtenirCouleurFond(nom) }}
          >
            {obtenirInitiales(nom)}
          </div>
        )}
      </div>
      {afficherNom && nom && <span className="avatar__nom">{nom}</span>}
    </div>
  );
}
