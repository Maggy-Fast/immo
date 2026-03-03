/**
 * Composant — Modal d'enregistrement de paiement
 */

import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { OPTIONS_MODES_PAIEMENT } from '../../../domaine/valeursObjets/modePaiement';
import './ModalPaiement.css';

export default function ModalPaiement({ loyer, surSoumettre, surAnnuler, enCours = false }) {
  const [formulaire, setFormulaire] = useState({
    montant: loyer.montantRestant?.() || loyer.montant,
    modePaiement: 'especes',
    datePaiement: new Date().toISOString().split('T')[0],
  });

  const [erreurs, setErreurs] = useState({});

  const formaterPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(prix);
  };

  const formaterMois = (mois) => {
    const [annee, moisNum] = mois.split('-');
    const date = new Date(annee, parseInt(moisNum) - 1);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = {};

    if (!formulaire.montant || parseFloat(formulaire.montant) <= 0) {
      erreursValidation.montant = 'Le montant doit être positif';
    }

    if (!formulaire.modePaiement) {
      erreursValidation.modePaiement = 'Le mode de paiement est obligatoire';
    }

    if (!formulaire.datePaiement) {
      erreursValidation.datePaiement = 'La date de paiement est obligatoire';
    }

    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation);
      return;
    }

    try {
      await surSoumettre(formulaire);
    } catch (error) {
      console.error('Erreur paiement:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal--petit">
        <div className="modal__entete">
          <h2>Enregistrer un paiement</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="modal-paiement">
          {/* Informations loyer */}
          <div className="modal-paiement__info">
            <div className="modal-paiement__ligne">
              <span className="modal-paiement__label">Période:</span>
              <span className="modal-paiement__valeur">{formaterMois(loyer.mois)}</span>
            </div>
            <div className="modal-paiement__ligne">
              <span className="modal-paiement__label">Montant dû:</span>
              <span className="modal-paiement__valeur modal-paiement__valeur--montant">
                {formaterPrix(loyer.montant)}
              </span>
            </div>
            {loyer.montantPaye > 0 && (
              <div className="modal-paiement__ligne">
                <span className="modal-paiement__label">Déjà payé:</span>
                <span className="modal-paiement__valeur">{formaterPrix(loyer.montantPaye)}</span>
              </div>
            )}
          </div>

          <div className="modal-paiement__formulaire">
            {/* Montant */}
            <div className="champ-formulaire">
              <label htmlFor="montant" className="champ-formulaire__label">
                Montant à payer (FCFA) <span className="requis">*</span>
              </label>
              <input
                id="montant"
                type="number"
                step="1"
                value={formulaire.montant}
                onChange={(e) => gererChangement('montant', e.target.value)}
                className={`champ-formulaire__input ${erreurs.montant ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.montant && <span className="champ-formulaire__erreur">{erreurs.montant}</span>}
            </div>

            {/* Mode de paiement */}
            <div className="champ-formulaire">
              <label htmlFor="modePaiement" className="champ-formulaire__label">
                Mode de paiement <span className="requis">*</span>
              </label>
              <select
                id="modePaiement"
                value={formulaire.modePaiement}
                onChange={(e) => gererChangement('modePaiement', e.target.value)}
                className={`champ-formulaire__select ${erreurs.modePaiement ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                {OPTIONS_MODES_PAIEMENT.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
              {erreurs.modePaiement && (
                <span className="champ-formulaire__erreur">{erreurs.modePaiement}</span>
              )}
            </div>

            {/* Date de paiement */}
            <div className="champ-formulaire">
              <label htmlFor="datePaiement" className="champ-formulaire__label">
                Date de paiement <span className="requis">*</span>
              </label>
              <input
                id="datePaiement"
                type="date"
                value={formulaire.datePaiement}
                onChange={(e) => gererChangement('datePaiement', e.target.value)}
                className={`champ-formulaire__input ${erreurs.datePaiement ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.datePaiement && (
                <span className="champ-formulaire__erreur">{erreurs.datePaiement}</span>
              )}
            </div>
          </div>

          <div className="modal-paiement__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              <DollarSign size={18} />
              {enCours ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
