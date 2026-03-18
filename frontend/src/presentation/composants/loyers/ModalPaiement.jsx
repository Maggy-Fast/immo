/**
 * Composant — Modal d'enregistrement de paiement
 * Migré vers les composants centralisés
 */

import { useState } from 'react';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';
import { OPTIONS_MODES_PAIEMENT } from '../../../domaine/valeursObjets/modePaiement';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';
import { formaterMontant } from '../../../application/utils/formatters';
import './ModalPaiement.css';

export default function ModalPaiement({ loyer, surSoumettre, surAnnuler, enCours = false }) {
  const [formulaire, setFormulaire] = useState({
    montant: loyer.montantRestant?.() || loyer.montant,
    modePaiement: 'especes',
    datePaiement: new Date().toISOString().split('T')[0],
  });

  const [erreurs, setErreurs] = useState({});

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

  const gererSoumission = async () => {
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
    <Modale
      titre="Enregistrer un paiement"
      surFermer={surAnnuler}
      taille="moyen"
      enCours={enCours}
    >
      {/* Informations loyer */}
      <div className="modal-paiement__info">
        <div className="modal-paiement__ligne">
          <span className="modal-paiement__label">Période:</span>
          <span className="modal-paiement__valeur">{formaterMois(loyer.mois)}</span>
        </div>
        <div className="modal-paiement__ligne">
          <span className="modal-paiement__label">Montant dû:</span>
          <span className="modal-paiement__valeur modal-paiement__valeur--montant">
            {formaterMontant(loyer.montant)}
          </span>
        </div>
        {loyer.montantPaye > 0 && (
          <div className="modal-paiement__ligne">
            <span className="modal-paiement__label">Déjà payé:</span>
            <span className="modal-paiement__valeur">{formaterMontant(loyer.montantPaye)}</span>
          </div>
        )}
      </div>

      <Formulaire surSoumettre={gererSoumission} colonnes={1} espacementVertical="compact">
        <ChampFormulaire
          id="montant"
          label="Montant à payer (FCFA)"
          type="number"
          step="1"
          valeur={formulaire.montant}
          onChange={(val) => gererChangement('montant', val)}
          erreur={erreurs.montant}
          required
          icone={DollarSign}
          disabled={enCours}
        />

        <ChampFormulaire
          id="modePaiement"
          label="Mode de paiement"
          type="select"
          valeur={formulaire.modePaiement}
          onChange={(val) => gererChangement('modePaiement', val)}
          erreur={erreurs.modePaiement}
          required
          options={OPTIONS_MODES_PAIEMENT}
          icone={CreditCard}
          disabled={enCours}
        />

        <ChampFormulaire
          id="datePaiement"
          label="Date de paiement"
          type="date"
          valeur={formulaire.datePaiement}
          onChange={(val) => gererChangement('datePaiement', val)}
          erreur={erreurs.datePaiement}
          required
          icone={Calendar}
          disabled={enCours}
        />

        <ActionsFormulaire
          surAnnuler={surAnnuler}
          texteBoutonPrincipal="Enregistrer le paiement"
          enCours={enCours}
          iconePrincipal={DollarSign}
        />
      </Formulaire>
    </Modale>
  );
}
