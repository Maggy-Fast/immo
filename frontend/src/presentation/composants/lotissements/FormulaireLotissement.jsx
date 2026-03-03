/**
 * Composant — Formulaire de création/modification d'un lotissement
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerLotissement } from '../../../domaine/validations/validationLotissement';
import './FormulaireLotissement.css';

export default function FormulaireLotissement({
  lotissement = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    localisation: '',
    superficieTotale: '',
    nombreParcelles: '',
    latitude: '',
    longitude: '',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (lotissement) {
      setFormulaire({
        nom: lotissement.nom || '',
        localisation: lotissement.localisation || '',
        superficieTotale: lotissement.superficieTotale || lotissement.superficie_totale || '',
        nombreParcelles: lotissement.nombreParcelles || lotissement.nombre_parcelles || '',
        latitude: lotissement.latitude || '',
        longitude: lotissement.longitude || '',
      });
    }
  }, [lotissement]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerLotissement(formulaire);
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation);
      return;
    }

    try {
      await surSoumettre(formulaire);
    } catch (error) {
      console.error('Erreur soumission:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__entete">
          <h2>{lotissement ? 'Modifier le lotissement' : 'Nouveau lotissement'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-lotissement">
          <div className="formulaire-lotissement__grille">
            {/* Nom */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="nom" className="champ-formulaire__label">
                Nom du lotissement <span className="requis">*</span>
              </label>
              <input
                id="nom"
                type="text"
                value={formulaire.nom}
                onChange={(e) => gererChangement('nom', e.target.value)}
                className={`champ-formulaire__input ${erreurs.nom ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: Lotissement Diamalaye"
                disabled={enCours}
              />
              {erreurs.nom && <span className="champ-formulaire__erreur">{erreurs.nom}</span>}
            </div>

            {/* Localisation */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="localisation" className="champ-formulaire__label">
                Localisation <span className="requis">*</span>
              </label>
              <input
                id="localisation"
                type="text"
                value={formulaire.localisation}
                onChange={(e) => gererChangement('localisation', e.target.value)}
                className={`champ-formulaire__input ${erreurs.localisation ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: Diamniadio, Dakar"
                disabled={enCours}
              />
              {erreurs.localisation && <span className="champ-formulaire__erreur">{erreurs.localisation}</span>}
            </div>

            {/* Superficie totale */}
            <div className="champ-formulaire">
              <label htmlFor="superficieTotale" className="champ-formulaire__label">
                Superficie totale (m²)
              </label>
              <input
                id="superficieTotale"
                type="number"
                step="0.01"
                value={formulaire.superficieTotale}
                onChange={(e) => gererChangement('superficieTotale', e.target.value)}
                className={`champ-formulaire__input ${erreurs.superficieTotale ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="50000"
                disabled={enCours}
              />
              {erreurs.superficieTotale && <span className="champ-formulaire__erreur">{erreurs.superficieTotale}</span>}
            </div>

            {/* Nombre de parcelles */}
            <div className="champ-formulaire">
              <label htmlFor="nombreParcelles" className="champ-formulaire__label">
                Nombre de parcelles
              </label>
              <input
                id="nombreParcelles"
                type="number"
                step="1"
                value={formulaire.nombreParcelles}
                onChange={(e) => gererChangement('nombreParcelles', e.target.value)}
                className={`champ-formulaire__input ${erreurs.nombreParcelles ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="120"
                disabled={enCours}
              />
              {erreurs.nombreParcelles && <span className="champ-formulaire__erreur">{erreurs.nombreParcelles}</span>}
            </div>

            {/* Latitude */}
            <div className="champ-formulaire">
              <label htmlFor="latitude" className="champ-formulaire__label">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="0.000001"
                value={formulaire.latitude}
                onChange={(e) => gererChangement('latitude', e.target.value)}
                className={`champ-formulaire__input ${erreurs.latitude ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="14.7167"
                disabled={enCours}
              />
              {erreurs.latitude && <span className="champ-formulaire__erreur">{erreurs.latitude}</span>}
            </div>

            {/* Longitude */}
            <div className="champ-formulaire">
              <label htmlFor="longitude" className="champ-formulaire__label">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="0.000001"
                value={formulaire.longitude}
                onChange={(e) => gererChangement('longitude', e.target.value)}
                className={`champ-formulaire__input ${erreurs.longitude ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="-17.1833"
                disabled={enCours}
              />
              {erreurs.longitude && <span className="champ-formulaire__erreur">{erreurs.longitude}</span>}
            </div>
          </div>

          <div className="formulaire-lotissement__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : lotissement ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
