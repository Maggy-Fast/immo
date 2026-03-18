/**
 * Composant — Formulaire Paiement - Design Moderne
 */

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, FileText, User, Calendar } from 'lucide-react';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import { formaterMontant } from '../../../application/utils/formatters';
import './FormulairePaiement.css';

export default function FormulairePaiement({ echeance, surSoumettre, surAnnuler, enCours }) {
  const [donnees, setDonnees] = useState({
    montantPaye: '',
    modePaiement: 'especes',
    referencePaiement: '',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (echeance) {
      setDonnees((prev) => ({
        ...prev,
        montantPaye: echeance.montant || '',
      }));
    }
  }, [echeance]);

  const gererChangement = (champ, valeur) => {
    setDonnees((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: null }));
    }
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!donnees.montantPaye || parseFloat(donnees.montantPaye) <= 0) {
      nouvellesErreurs.montantPaye = 'Le montant doit être supérieur à 0';
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    
    if (!valider()) {
      return;
    }

    surSoumettre(donnees);
  };

  const optionsModePaiement = [
    { valeur: 'especes', label: 'Espèces' },
    { valeur: 'virement', label: 'Virement bancaire' },
    { valeur: 'mobile_money', label: 'Mobile Money' },
    { valeur: 'cheque', label: 'Chèque' },
  ];

  return (
    <Modal
      titre="Enregistrer un paiement"
      surFermer={surAnnuler}
      taille="moyen"
    >
      <form onSubmit={gererSoumission} className="formulaire-paiement">
        {/* Informations échéance */}
        <div className="formulaire-paiement__info-echeance">
          <h3 className="formulaire-paiement__sous-titre">
            <Calendar size={18} />
            Informations de l'échéance
          </h3>
          <div className="formulaire-paiement__details">
            <div className="detail-item">
              <span className="detail-item__label">Adhérent</span>
              <span className="detail-item__valeur">
                <User size={14} />
                {echeance?.adherent?.prenom} {echeance?.adherent?.nom}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Date d'échéance</span>
              <span className="detail-item__valeur">
                <Calendar size={14} />
                {echeance?.date_echeance && new Date(echeance.date_echeance).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Montant dû</span>
              <span className="detail-item__valeur detail-item__valeur--montant">
                <DollarSign size={14} />
                {echeance?.montant && formaterMontant(echeance.montant)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="formulaire-paiement__grille">
          <ChampFormulaire
            label="Montant payé"
            type="number"
            valeur={donnees.montantPaye}
            onChange={(valeur) => gererChangement('montantPaye', valeur)}
            placeholder="0"
            required
            icone={DollarSign}
            aide="Montant en FCFA"
            erreur={erreurs.montantPaye}
            min="0"
            step="1"
            className="formulaire-paiement__champ--plein"
          />

          <ChampFormulaire
            label="Mode de paiement"
            type="select"
            valeur={donnees.modePaiement}
            onChange={(valeur) => gererChangement('modePaiement', valeur)}
            options={optionsModePaiement}
            required
            icone={CreditCard}
            className="formulaire-paiement__champ--plein"
          />

          <ChampFormulaire
            label="Référence de paiement"
            type="text"
            valeur={donnees.referencePaiement}
            onChange={(valeur) => gererChangement('referencePaiement', valeur)}
            placeholder="Ex: WAVE-123456, VIR-20260303-001"
            icone={FileText}
            aide="Numéro de transaction, référence de virement, etc."
            className="formulaire-paiement__champ--plein"
          />
        </div>

        <div className="formulaire-paiement__actions">
          <button
            type="button"
            className="bouton bouton--secondaire"
            onClick={surAnnuler}
            disabled={enCours}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bouton bouton--primaire"
            disabled={enCours}
          >
            {enCours ? 'Enregistrement...' : 'Enregistrer le paiement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
