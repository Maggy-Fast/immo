/**
 * Composant GalerieImages — Galerie d'images avec upload multiple
 */

import { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import './GalerieImages.css';

export default function GalerieImages({
  images = [],
  surChangement,
  max = 10,
  tailleMax = 5, // MB
  disabled = false,
}) {
  const [erreur, setErreur] = useState('');

  const validerFichier = (fichier) => {
    if (!fichier.type.startsWith('image/')) {
      setErreur('Le fichier doit être une image');
      return false;
    }

    const tailleMB = fichier.size / (1024 * 1024);
    if (tailleMB > tailleMax) {
      setErreur(`L'image ne doit pas dépasser ${tailleMax}MB`);
      return false;
    }

    setErreur('');
    return true;
  };

  const ajouterImages = (e) => {
    const fichiers = Array.from(e.target.files || []);
    
    if (images.length + fichiers.length > max) {
      setErreur(`Maximum ${max} images autorisées`);
      return;
    }

    const nouvellesImages = [];
    let compteur = 0;

    fichiers.forEach((fichier) => {
      if (validerFichier(fichier)) {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          nouvellesImages.push({
            id: Date.now() + compteur,
            fichier,
            apercu: lecteur.result,
          });
          compteur++;

          if (nouvellesImages.length === fichiers.length) {
            surChangement([...images, ...nouvellesImages]);
          }
        };
        lecteur.readAsDataURL(fichier);
      }
    });
  };

  const supprimerImage = (id) => {
    surChangement(images.filter((img) => img.id !== id));
  };

  const definirPrincipale = (id) => {
    const nouvellesImages = [...images];
    const index = nouvellesImages.findIndex((img) => img.id === id);
    if (index > 0) {
      const [image] = nouvellesImages.splice(index, 1);
      nouvellesImages.unshift(image);
      surChangement(nouvellesImages);
    }
  };

  return (
    <div className="galerie-images">
      <div className="galerie-images__grille">
        {images.map((image, index) => (
          <div key={image.id} className="galerie-images__item">
            <img
              src={image.apercu || image.url}
              alt={`Image ${index + 1}`}
              className="galerie-images__image"
              onClick={() => !disabled && definirPrincipale(image.id)}
            />
            {index === 0 && (
              <span className="galerie-images__badge">Principale</span>
            )}
            {!disabled && (
              <button
                type="button"
                className="galerie-images__supprimer"
                onClick={() => supprimerImage(image.id)}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        {images.length < max && !disabled && (
          <label className="galerie-images__ajouter">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={ajouterImages}
              className="galerie-images__input"
              disabled={disabled}
            />
            <Plus size={32} />
            <span>Ajouter</span>
          </label>
        )}
      </div>

      {erreur && <span className="galerie-images__erreur">{erreur}</span>}

      {images.length > 0 && (
        <p className="galerie-images__info">
          {images.length} / {max} images • Cliquez sur une image pour la définir comme principale
        </p>
      )}
    </div>
  );
}
