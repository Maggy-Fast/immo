/**
 * Composant — Formulaire de création/modification d'un partenariat
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerPartenariat } from '../../../domaine/validations/validationPartenariat';
import './FormulairePartenariat.css';

export default function FormulairePartenariat({
  partenariat = null,
  proprietaires = [],
  lotissements = [],
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    idPromoteur: '',
    idProprietaire: '',
    idLotissement: '',
    ticketEntree: '',
    pourcentagePromoteur: '60',
    pourcentagePropriétaire: '40',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (partenariat) {
      setFormulaire({
        idPromoteur: partenariat.idPromoteur || partenariat.id_promoteur || '',
        idProprietaire: partenariat.idProprietaire || partenariat.id_proprietaire || '',
        idLotissement: partenariat.idLotissement || partenariat.id_lotissement || '',
        ticketEntree: partenariat.ticketEntree || partenariat.ticket_entree || '',
        pourcentagePromoteur: partenariat.pourcentagePromoteur || partenariat.pourcentage_promoteur || '60',
        pourcentagePropriétaire: partenariat.pourcentagePropriétaire || partenariat.pourcentage_proprietaire || '40',
      });
    }
  }, [partenariat]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    
    // Auto-ajuster l'autre pourcentage
    if (champ === 'pourcentagePromoteur' && valeur !== '') {
      const pct = parseFloat(valeur);
      if (!isNaN(pct) && pct >= 0 && pct <= 100) {
        setFormulaire((prev) => ({ 
          ...prev, 
          [champ]: valeur,
          pourcentagePropriétaire: (100 - pct).toString() 
        }));
      }
    } else if (champ === 'pourcentagePropriétaire' && valeur !== '') {
      const pct = parseFloat(valeur);
      if (!isNaN(pct) && pct >= 0 && pct <= 100) {
        setFormulaire((prev) => ({ 
          ...prev, 
          [champ]: valeur,
          pourcentagePromoteur: (100 - pct).toString() 
        }));
      }
    }
    
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerPartenariat(formulaire);
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
          <h2>{partenariat ? 'Modifier le partenariat' : 'Nouveau partenariat'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-partenariat">
          <div className="formulaire-partenariat__grille">
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
                disabled={enCours}
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

            {/* Promoteur */}
            <div className="champ-formulaire">
              <label htmlFor="idPromoteur" className="champ-formulaire__label">
                Promoteur <span className="requis">*</span>
              </label>
              <select
                id="idPromoteur"
                value={formulaire.idPromoteur}
                onChange={(e) => gererChangement('idPromoteur', e.target.value)}
                className={`champ-formulaire__select ${erreurs.idPromoteur ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un promoteur</option>
                {proprietaires.map((proprio) => (
                  <option key={proprio.id} value={proprio.id}>
                    {proprio.nom}
                  </option>
                ))}
              </select>
              {erreurs.idPromoteur && (
                <span className="champ-formulaire__erreur">{erreurs.idPromoteur}</span>
              )}
            </div>

            {/* Propriétaire */}
            <div className="champ-formulaire">
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

            {/* Ticket d'entrée */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="ticketEntree" className="champ-formulaire__label">
                Ticket d'entrée (FCFA) <span className="requis">*</span>
              </label>
              <input
                id="ticketEntree"
                type="number"
                step="1"
                value={formulaire.ticketEntree}
                onChange={(e) => gererChangement('ticketEntree', e.target.value)}
                className={`champ-formulaire__input ${erreurs.ticketEntree ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="10000000"
                disabled={enCours}
              />
              {erreurs.ticketEntree && (
                <span className="champ-formulaire__erreur">{erreurs.ticketEntree}</span>
              )}
            </div>

            {/* Pourcentage promoteur */}
            <div className="champ-formulaire">
              <label htmlFor="pourcentagePromoteur" className="champ-formulaire__label">
                Pourcentage promoteur (%) <span className="requis">*</span>
              </label>
              <input
                id="pourcentagePromoteur"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formulaire.pourcentagePromoteur}
                onChange={(e) => gererChangement('pourcentagePromoteur', e.target.value)}
                className={`champ-formulaire__input ${erreurs.pourcentagePromoteur ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.pourcentagePromoteur && (
                <span className="champ-formulaire__erreur">{erreurs.pourcentagePromoteur}</span>
              )}
            </div>

            {/* Pourcentage propriétaire */}
            <div className="champ-formulaire">
              <label htmlFor="pourcentagePropriétaire" className="champ-formulaire__label">
                Pourcentage propriétaire (%) <span className="requis">*</span>
              </label>
              <input
                id="pourcentagePropriétaire"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formulaire.pourcentagePropriétaire}
                onChange={(e) => gererChangement('pourcentagePropriétaire', e.target.value)}
                className={`champ-formulaire__input ${erreurs.pourcentagePropriétaire ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.pourcentagePropriétaire && (
                <span className="champ-formulaire__erreur">{erreurs.pourcentagePropriétaire}</span>
              )}
            </div>
          </div>

          <div className="formulaire-partenariat__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : partenariat ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
