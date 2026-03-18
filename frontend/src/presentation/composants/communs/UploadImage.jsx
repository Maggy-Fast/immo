/**
 * Composant UploadImage — Upload d'images avec prévisualisation
 */

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import './UploadImage.css';

export default function UploadImage({
  imageActuelle = null,
  surChangement,
  tailleMax = 5, // MB
  largeur = 200,
  hauteur = 200,
  forme = 'rectangle', // 'rectangle' ou 'cercle'
  texteAide = 'Cliquez ou glissez une image',
  disabled = false,
}) {
  const [apercu, setApercu] = useState(imageActuelle);
  const [erreur, setErreur] = useState('');
  const [enGlissement, setEnGlissement] = useState(false);
  const inputRef = useRef(null);

  const validerFichier = (fichier) => {
    // Vérifier le type
    if (!fichier.type.startsWith('image/')) {
      setErreur('Le fichier doit être une image');
      return false;
    }

    // Vérifier la taille
    const tailleMB = fichier.size / (1024 * 1024);
    if (tailleMB > tailleMax) {
      setErreur(`L'image ne doit pas dépasser ${tailleMax}MB`);
      return false;
    }

    setErreur('');
    return true;
  };

  const gererChangementFichier = (e) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    if (validerFichier(fichier)) {
      // Créer l'aperçu
      const lecteur = new FileReader();
      lecteur.onloadend = () => {
        setApercu(lecteur.result);
        surChangement(fichier, lecteur.result);
      };
      lecteur.readAsDataURL(fichier);
    }
  };

  const gererGlissement = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const gererEntreeGlissement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setEnGlissement(true);
    }
  };

  const gererSortieGlissement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEnGlissement(false);
  };

  const gererDepotFichier = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEnGlissement(false);

    if (disabled) return;

    const fichier = e.dataTransfer.files?.[0];
    if (!fichier) return;

    if (validerFichier(fichier)) {
      const lecteur = new FileReader();
      lecteur.onloadend = () => {
        setApercu(lecteur.result);
        surChangement(fichier, lecteur.result);
      };
      lecteur.readAsDataURL(fichier);
    }
  };

  const supprimerImage = () => {
    setApercu(null);
    setErreur('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    surChangement(null, null);
  };

  const ouvrirSelecteur = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const classesConteneur = [
    'upload-image',
    `upload-image--${forme}`,
    enGlissement && 'upload-image--glissement',
    disabled && 'upload-image--disabled',
    erreur && 'upload-image--erreur',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="upload-image-wrapper">
      <div
        className={classesConteneur}
        style={{ width: largeur, height: hauteur }}
        onClick={ouvrirSelecteur}
        onDragOver={gererGlissement}
        onDragEnter={gererEntreeGlissement}
        onDragLeave={gererSortieGlissement}
        onDrop={gererDepotFichier}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={gererChangementFichier}
          className="upload-image__input"
          disabled={disabled}
        />

        {apercu ? (
          <div className="upload-image__apercu">
            <img src={apercu} alt="Aperçu" className="upload-image__image" />
            {!disabled && (
              <button
                type="button"
                className="upload-image__supprimer"
                onClick={(e) => {
                  e.stopPropagation();
                  supprimerImage();
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="upload-image__placeholder">
            {enGlissement ? (
              <Upload size={32} className="upload-image__icone upload-image__icone--anime" />
            ) : (
              <ImageIcon size={32} className="upload-image__icone" />
            )}
            <span className="upload-image__texte">{texteAide}</span>
            <span className="upload-image__info">Max {tailleMax}MB</span>
          </div>
        )}
      </div>

      {erreur && <span className="upload-image__erreur">{erreur}</span>}
    </div>
  );
}
