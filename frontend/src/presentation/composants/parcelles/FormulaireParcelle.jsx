/**
 * Composant — Formulaire de création/modification d'une parcelle
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerParcelle } from '../../../domaine/validations/validationParcelle';
import { OPTIONS_STATUTS_PARCELLE } from '../../../domaine/valeursObjets/statutParcelle';
import './FormulaireParcelle.css';

export default function FormulaireParcelle({
  parcelle = null,
  lotissements = [],
  lotissementParDefaut = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    idLotissement: lotissementParDefaut?.id || '',
    numero: '',
    superficie: '',
    prix: '',
    statut: 'disponible',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (parcelle) {
      setFormulaire({
        idLotissement: parcelle.idLotissement || parcelle.id_lotissement || '',
        numero: parcelle.numero || '',
        superficie: parcelle.superficie || '',
        prix: parcelle.prix || '',
        statut: parcelle.statut || 'disponible',
      });
    }
  }, [parcelle]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerParcelle(formulaire);
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
          <h2>{parcelle ? 'Modifier la parcelle' : 'Nouvelle parcelle'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-parcelle">
          <div className="formulaire-parcelle__grille">
            {/* Lotissement */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="idLotissement" className="champ-formulaire__label">
                Lotissement <span className="requis">*</span>
              </label>
              <select
                id="idLotissement"
                value={formulaire.idLotissement}
                onChange={(e) => gererChangement('idLotissement', e.target.value)}
                className={`champ-formulaire__select ${erreurs.idLotissement ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours || !!lotissementParDefaut}
              >
                <option value="">Sélectionner un lotissement</option>
                {lotissements.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.nom}
                  </option>
                ))}
              </select>
              {erreurs.idLotissement && (
                <span className="champ-formulaire__erreur">{erreurs.idLotissement}</span>
              )}
            </div>

            {/* Numéro */}
            <div className="champ-formulaire">
              <label htmlFor="numero" className="champ-formulaire__label">
                Numéro de parcelle <span className="requis">*</span>
              </label>
              <input
                id="numero"
                type="text"
                value={formulaire.numero}
                onChange={(e) => gererChangement('numero', e.target.value)}
                className={`champ-formulaire__input ${erreurs.numero ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: A-015"
                disabled={enCours}
              />
              {erreurs.numero && <span className="champ-formulaire__erreur">{erreurs.numero}</span>}
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
                {OPTIONS_STATUTS_PARCELLE.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Superficie */}
            <div className="champ-formulaire">
              <label htmlFor="superficie" className="champ-formulaire__label">
                Superficie (m²) <span className="requis">*</span>
              </label>
              <input
                id="superficie"
                type="number"
                step="0.01"
                value={formulaire.superficie}
                onChange={(e) => gererChangement('superficie', e.target.value)}
                className={`champ-formulaire__input ${erreurs.superficie ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="300"
                disabled={enCours}
              />
              {erreurs.superficie && <span className="champ-formulaire__erreur">{erreurs.superficie}</span>}
            </div>

            {/* Prix */}
            <div className="champ-formulaire">
              <label htmlFor="prix" className="champ-formulaire__label">
                Prix (FCFA) <span className="requis">*</span>
              </label>
              <input
                id="prix"
                type="number"
                step="1"
                value={formulaire.prix}
                onChange={(e) => gererChangement('prix', e.target.value)}
                className={`champ-formulaire__input ${erreurs.prix ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="5000000"
                disabled={enCours}
              />
              {erreurs.prix && <span className="champ-formulaire__erreur">{erreurs.prix}</span>}
            </div>
          </div>

          <div className="formulaire-parcelle__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : parcelle ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
