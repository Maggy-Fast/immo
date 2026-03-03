/**
 * Composant — Formulaire de création/modification d'un locataire
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerLocataire } from '../../../domaine/validations/validationLocataire';
import './FormulaireLocataire.css';

export default function FormulaireLocataire({
  locataire = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    telephone: '',
    email: '',
    cin: '',
    profession: '',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (locataire) {
      setFormulaire({
        nom: locataire.nom || '',
        telephone: locataire.telephone || '',
        email: locataire.email || '',
        cin: locataire.cin || '',
        profession: locataire.profession || '',
      });
    }
  }, [locataire]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerLocataire(formulaire);
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
          <h2>{locataire ? 'Modifier le locataire' : 'Nouveau locataire'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-locataire">
          <div className="formulaire-locataire__grille">
            {/* Nom */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="nom" className="champ-formulaire__label">
                Nom complet <span className="requis">*</span>
              </label>
              <input
                id="nom"
                type="text"
                value={formulaire.nom}
                onChange={(e) => gererChangement('nom', e.target.value)}
                className={`champ-formulaire__input ${erreurs.nom ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: Fatou Diop"
                disabled={enCours}
              />
              {erreurs.nom && <span className="champ-formulaire__erreur">{erreurs.nom}</span>}
            </div>

            {/* Téléphone */}
            <div className="champ-formulaire">
              <label htmlFor="telephone" className="champ-formulaire__label">
                Téléphone <span className="requis">*</span>
              </label>
              <input
                id="telephone"
                type="tel"
                value={formulaire.telephone}
                onChange={(e) => gererChangement('telephone', e.target.value)}
                className={`champ-formulaire__input ${erreurs.telephone ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="+221771234567"
                disabled={enCours}
              />
              {erreurs.telephone && <span className="champ-formulaire__erreur">{erreurs.telephone}</span>}
            </div>

            {/* Email */}
            <div className="champ-formulaire">
              <label htmlFor="email" className="champ-formulaire__label">
                Email <span className="requis">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formulaire.email}
                onChange={(e) => gererChangement('email', e.target.value)}
                className={`champ-formulaire__input ${erreurs.email ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="exemple@email.com"
                disabled={enCours}
              />
              {erreurs.email && <span className="champ-formulaire__erreur">{erreurs.email}</span>}
            </div>

            {/* CIN */}
            <div className="champ-formulaire">
              <label htmlFor="cin" className="champ-formulaire__label">
                CIN / Pièce d'identité
              </label>
              <input
                id="cin"
                type="text"
                value={formulaire.cin}
                onChange={(e) => gererChangement('cin', e.target.value)}
                className={`champ-formulaire__input ${erreurs.cin ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="1234567890123"
                disabled={enCours}
              />
              {erreurs.cin && <span className="champ-formulaire__erreur">{erreurs.cin}</span>}
            </div>

            {/* Profession */}
            <div className="champ-formulaire">
              <label htmlFor="profession" className="champ-formulaire__label">
                Profession
              </label>
              <input
                id="profession"
                type="text"
                value={formulaire.profession}
                onChange={(e) => gererChangement('profession', e.target.value)}
                className="champ-formulaire__input"
                placeholder="Ex: Ingénieur"
                disabled={enCours}
              />
            </div>
          </div>

          <div className="formulaire-locataire__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : locataire ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
