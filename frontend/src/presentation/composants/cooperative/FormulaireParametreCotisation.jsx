/**
 * Composant — Formulaire Paramètre Cotisation - Design Moderne
 */

import { useState } from 'react';
import { DollarSign, Calendar, Clock, AlertTriangle, Settings, Percent } from 'lucide-react';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import './FormulaireParametreCotisation.css';

export default function FormulaireParametreCotisation({ surSoumettre, surAnnuler, enCours }) {
  const [donnees, setDonnees] = useState({
    montant: '',
    frequence: 'mensuel',
    jourEcheance: '5',
    dateDebut: new Date().toISOString().split('T')[0],
    periodeGraceJours: '5',
    maxEcheancesRetard: '3',
    modePenalite: 'pourcentage',
    pourcentagePenalite: '5',
    montantPenaliteFixe: '2000',
  });

  const [erreurs, setErreurs] = useState({});

  const gererChangement = (champ, valeur) => {
    setDonnees((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: null }));
    }
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!donnees.montant || parseFloat(donnees.montant) <= 0) {
      nouvellesErreurs.montant = 'Le montant doit être supérieur à 0';
    }

    const jour = parseInt(donnees.jourEcheance);
    if (jour < 1 || jour > 28) {
      nouvellesErreurs.jourEcheance = 'Le jour doit être entre 1 et 28';
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererSoumission = (e) => {
    e.preventDefault();

    if (!valider()) {
      return;
    }

    surSoumettre({
      ...donnees,
      montant: parseFloat(donnees.montant),
      jourEcheance: parseInt(donnees.jourEcheance),
      periodeGraceJours: parseInt(donnees.periodeGraceJours),
      maxEcheancesRetard: parseInt(donnees.maxEcheancesRetard),
      mode_penalite: donnees.modePenalite,
      pourcentage_penalite: parseFloat(donnees.pourcentagePenalite),
      montant_penalite_fixe: parseFloat(donnees.montantPenaliteFixe),
    });
  };

  const optionsFrequence = [
    { valeur: 'mensuel', label: 'Mensuel' },
    { valeur: 'trimestriel', label: 'Trimestriel' },
    { valeur: 'annuel', label: 'Annuel' },
  ];

  return (
    <Modal
      titre="Configurer les cotisations"
      surFermer={surAnnuler}
      taille="grand"
    >
      <form onSubmit={gererSoumission} className="formulaire-parametre">
        {/* Alerte d'information */}
        <div className="formulaire-parametre__alerte">
          <AlertTriangle size={20} />
          <div>
            <strong>Important</strong>
            <p>
              La création d'un nouveau paramètre désactivera automatiquement l'ancien paramètre.
              Les échéances existantes ne seront pas affectées.
            </p>
          </div>
        </div>

        {/* Section Montant et Fréquence */}
        <div className="formulaire-parametre__section">
          <h3 className="formulaire-parametre__sous-titre">
            <DollarSign size={18} />
            Montant et Fréquence
          </h3>
          <div className="formulaire-parametre__grille">
            <ChampFormulaire
              label="Montant de la cotisation"
              type="number"
              valeur={donnees.montant}
              onChange={(valeur) => gererChangement('montant', valeur)}
              placeholder="0"
              required
              icone={DollarSign}
              aide="Montant en FCFA"
              erreur={erreurs.montant}
              min="0"
              step="1"
              className="formulaire-parametre__champ--demi"
            />

            <ChampFormulaire
              label="Fréquence"
              type="select"
              valeur={donnees.frequence}
              onChange={(valeur) => gererChangement('frequence', valeur)}
              options={optionsFrequence}
              required
              icone={Calendar}
              aide="Périodicité des cotisations"
              className="formulaire-parametre__champ--demi"
            />
          </div>
        </div>

        {/* Section Échéances */}
        <div className="formulaire-parametre__section">
          <h3 className="formulaire-parametre__sous-titre">
            <Calendar size={18} />
            Échéances
          </h3>
          <div className="formulaire-parametre__grille">
            <ChampFormulaire
              label="Jour d'échéance"
              type="number"
              valeur={donnees.jourEcheance}
              onChange={(valeur) => gererChangement('jourEcheance', valeur)}
              placeholder="5"
              required
              icone={Calendar}
              aide="Jour du mois (1-28)"
              erreur={erreurs.jourEcheance}
              min="1"
              max="28"
              className="formulaire-parametre__champ--demi"
            />

            <ChampFormulaire
              label="Date de début"
              type="date"
              valeur={donnees.dateDebut}
              onChange={(valeur) => gererChangement('dateDebut', valeur)}
              required
              icone={Calendar}
              aide="Date de début d'application du paramètre"
              className="formulaire-parametre__champ--demi"
            />
          </div>
        </div>

        {/* Section Règles */}
        <div className="formulaire-parametre__section">
          <h3 className="formulaire-parametre__sous-titre">
            <Settings size={18} />
            Règles et Sanctions
          </h3>
          <div className="formulaire-parametre__grille">
            <ChampFormulaire
              label="Période de grâce"
              type="number"
              valeur={donnees.periodeGraceJours}
              onChange={(valeur) => gererChangement('periodeGraceJours', valeur)}
              placeholder="5"
              required
              icone={Clock}
              aide="Nombre de jours avant qu'une échéance soit marquée en retard"
              min="0"
              max="30"
              className="formulaire-parametre__champ--demi"
            />

            <ChampFormulaire
              label="Max retards avant suspension"
              type="number"
              valeur={donnees.maxEcheancesRetard}
              onChange={(valeur) => gererChangement('maxEcheancesRetard', valeur)}
              placeholder="3"
              required
              icone={AlertTriangle}
              aide="Nombre d'échéances en retard avant suspension automatique"
              min="1"
              max="12"
              className="formulaire-parametre__champ--demi"
            />
          </div>

          <div className="formulaire-parametre__divider" />

          <div className="formulaire-parametre__grille">
            <ChampFormulaire
              label="Mode de pénalité"
              type="select"
              valeur={donnees.modePenalite}
              onChange={(valeur) => gererChangement('modePenalite', valeur)}
              options={[
                { valeur: 'pourcentage', label: 'Pourcentage' },
                { valeur: 'fixe', label: 'Montant Fixe' },
                { valeur: 'aucun', label: 'Aucune pénalité' }
              ]}
              required
              icone={Settings}
              aide="Comment calculer les frais de retard"
              className="formulaire-parametre__champ--demi"
            />

            {donnees.modePenalite === 'pourcentage' && (
              <ChampFormulaire
                label="Pourcentage (%)"
                type="number"
                valeur={donnees.pourcentagePenalite}
                onChange={(valeur) => gererChangement('pourcentagePenalite', valeur)}
                placeholder="5"
                required
                icone={Percent}
                aide="Appliqué sur le montant de la cotisation"
                min="0"
                max="100"
                step="0.1"
                className="formulaire-parametre__champ--demi"
              />
            )}

            {donnees.modePenalite === 'fixe' && (
              <ChampFormulaire
                label="Montant fixe"
                type="number"
                valeur={donnees.montantPenaliteFixe}
                onChange={(valeur) => gererChangement('montantPenaliteFixe', valeur)}
                placeholder="2000"
                required
                icone={DollarSign}
                aide="Montant forfaitaire par retard"
                min="0"
                step="1"
                className="formulaire-parametre__champ--demi"
              />
            )}
          </div>
        </div>

        <div className="formulaire-parametre__actions">
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
            {enCours ? 'Enregistrement...' : 'Créer le paramètre'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
