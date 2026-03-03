/**
 * Composant — Formulaire de création/modification d'un bien
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerBien } from '../../../domaine/validations/validationBien';
import { OPTIONS_TYPES_BIEN } from '../../../domaine/valeursObjets/typeBien';
import { OPTIONS_STATUTS_BIEN } from '../../../domaine/valeursObjets/statutBien';
import './FormulaireBien.css';

export default function FormulaireBien({
  bien = null,
  proprietaires = [],
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    type: '',
    adresse: '',
    superficie: '',
    prix: '',
    statut: 'disponible',
    idProprietaire: '',
    latitude: '',
    longitude: '',
    description: '',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (bien) {
      setFormulaire({
        type: bien.type || '',
        adresse: bien.adresse || '',
        superficie: bien.superficie || '',
        prix: bien.prix || '',
        statut: bien.statut || 'disponible',
        idProprietaire: bien.idProprietaire || bien.id_proprietaire || '',
        latitude: bien.latitude || '',
        longitude: bien.longitude || '',
        description: bien.description || '',
      });
    }
  }, [bien]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerBien(formulaire);
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
          <h2>{bien ? 'Modifier le bien' : 'Nouveau bien'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-bien">
          <div className="formulaire-bien__grille">
            {/* Type */}
            <div className="champ-formulaire">
              <label htmlFor="type" className="champ-formulaire__label">
                Type de bien <span className="requis">*</span>
              </label>
              <select
                id="type"
                value={formulaire.type}
                onChange={(e) => gererChangement('type', e.target.value)}
                className={`champ-formulaire__select ${erreurs.type ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un type</option>
                {OPTIONS_TYPES_BIEN.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
              {erreurs.type && <span className="champ-formulaire__erreur">{erreurs.type}</span>}
            </div>

            {/* Statut */}
            <div className="champ-formulaire">
              <label htmlFor="statut" className="champ-formulaire__label">
                Statut
              </label>
              <select
                id="statut"
                value={formulaire.statut}
                onChange={(e) => gererChangement('statut', e.target.value)}
                className="champ-formulaire__select"
                disabled={enCours}
              >
                {OPTIONS_STATUTS_BIEN.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Adresse */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="adresse" className="champ-formulaire__label">
                Adresse <span className="requis">*</span>
              </label>
              <input
                id="adresse"
                type="text"
                value={formulaire.adresse}
                onChange={(e) => gererChangement('adresse', e.target.value)}
                className={`champ-formulaire__input ${erreurs.adresse ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: Rue 10, Médina, Dakar"
                disabled={enCours}
              />
              {erreurs.adresse && <span className="champ-formulaire__erreur">{erreurs.adresse}</span>}
            </div>

            {/* Superficie */}
            <div className="champ-formulaire">
              <label htmlFor="superficie" className="champ-formulaire__label">
                Superficie (m²)
              </label>
              <input
                id="superficie"
                type="number"
                step="0.01"
                value={formulaire.superficie}
                onChange={(e) => gererChangement('superficie', e.target.value)}
                className={`champ-formulaire__input ${erreurs.superficie ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="85.5"
                disabled={enCours}
              />
              {erreurs.superficie && <span className="champ-formulaire__erreur">{erreurs.superficie}</span>}
            </div>

            {/* Prix */}
            <div className="champ-formulaire">
              <label htmlFor="prix" className="champ-formulaire__label">
                Prix (FCFA)
              </label>
              <input
                id="prix"
                type="number"
                step="1"
                value={formulaire.prix}
                onChange={(e) => gererChangement('prix', e.target.value)}
                className={`champ-formulaire__input ${erreurs.prix ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="250000"
                disabled={enCours}
              />
              {erreurs.prix && <span className="champ-formulaire__erreur">{erreurs.prix}</span>}
            </div>

            {/* Propriétaire */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="idProprietaire" className="champ-formulaire__label">
                Propriétaire <span className="requis">*</span>
              </label>
              <select
                id="idProprietaire"
                value={formulaire.idProprietaire}
                onChange={(e) => gererChangement('idProprietaire', e.target.value)}
                className={`champ-formulaire__select ${erreurs.idProprietaire ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un propriétaire</option>
                {proprietaires.map((proprio) => (
                  <option key={proprio.id} value={proprio.id}>
                    {proprio.nom}
                  </option>
                ))}
              </select>
              {erreurs.idProprietaire && (
                <span className="champ-formulaire__erreur">{erreurs.idProprietaire}</span>
              )}
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
                placeholder="14.6937"
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
                placeholder="-17.4441"
                disabled={enCours}
              />
              {erreurs.longitude && <span className="champ-formulaire__erreur">{erreurs.longitude}</span>}
            </div>

            {/* Description */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="description" className="champ-formulaire__label">
                Description
              </label>
              <textarea
                id="description"
                value={formulaire.description}
                onChange={(e) => gererChangement('description', e.target.value)}
                className="champ-formulaire__textarea"
                placeholder="Appartement F3 meublé, 2 chambres..."
                rows="3"
                disabled={enCours}
              />
            </div>
          </div>

          <div className="formulaire-bien__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : bien ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
