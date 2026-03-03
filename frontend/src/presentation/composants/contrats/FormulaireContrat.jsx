/**
 * Composant — Formulaire de création/modification d'un contrat
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { validerContrat } from '../../../domaine/validations/validationContrat';
import { OPTIONS_STATUTS_CONTRAT } from '../../../domaine/valeursObjets/statutContrat';
import './FormulaireContrat.css';

export default function FormulaireContrat({
  contrat = null,
  biens = [],
  locataires = [],
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    idBien: '',
    idLocataire: '',
    dateDebut: '',
    dateFin: '',
    loyerMensuel: '',
    caution: '',
    statut: 'actif',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (contrat) {
      setFormulaire({
        idBien: contrat.idBien || contrat.id_bien || '',
        idLocataire: contrat.idLocataire || contrat.id_locataire || '',
        dateDebut: contrat.dateDebut || contrat.date_debut || '',
        dateFin: contrat.dateFin || contrat.date_fin || '',
        loyerMensuel: contrat.loyerMensuel || contrat.loyer_mensuel || '',
        caution: contrat.caution || '',
        statut: contrat.statut || 'actif',
      });
    }
  }, [contrat]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();

    const erreursValidation = validerContrat(formulaire);
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

  // Filtrer les biens disponibles (non loués)
  const biensDisponibles = biens.filter(b => 
    b.statut === 'disponible' || b.id === formulaire.idBien
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__entete">
          <h2>{contrat ? 'Modifier le contrat' : 'Nouveau contrat'}</h2>
          <button className="modal__fermer" onClick={surAnnuler} disabled={enCours}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-contrat">
          <div className="formulaire-contrat__grille">
            {/* Bien */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="idBien" className="champ-formulaire__label">
                Bien immobilier <span className="requis">*</span>
              </label>
              <select
                id="idBien"
                value={formulaire.idBien}
                onChange={(e) => gererChangement('idBien', e.target.value)}
                className={`champ-formulaire__select ${erreurs.idBien ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un bien</option>
                {biensDisponibles.map((bien) => (
                  <option key={bien.id} value={bien.id}>
                    {bien.adresse}
                  </option>
                ))}
              </select>
              {erreurs.idBien && <span className="champ-formulaire__erreur">{erreurs.idBien}</span>}
            </div>

            {/* Locataire */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="idLocataire" className="champ-formulaire__label">
                Locataire <span className="requis">*</span>
              </label>
              <select
                id="idLocataire"
                value={formulaire.idLocataire}
                onChange={(e) => gererChangement('idLocataire', e.target.value)}
                className={`champ-formulaire__select ${erreurs.idLocataire ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un locataire</option>
                {locataires.map((locataire) => (
                  <option key={locataire.id} value={locataire.id}>
                    {locataire.nom}
                  </option>
                ))}
              </select>
              {erreurs.idLocataire && (
                <span className="champ-formulaire__erreur">{erreurs.idLocataire}</span>
              )}
            </div>

            {/* Date début */}
            <div className="champ-formulaire">
              <label htmlFor="dateDebut" className="champ-formulaire__label">
                Date de début <span className="requis">*</span>
              </label>
              <input
                id="dateDebut"
                type="date"
                value={formulaire.dateDebut}
                onChange={(e) => gererChangement('dateDebut', e.target.value)}
                className={`champ-formulaire__input ${erreurs.dateDebut ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.dateDebut && <span className="champ-formulaire__erreur">{erreurs.dateDebut}</span>}
            </div>

            {/* Date fin */}
            <div className="champ-formulaire">
              <label htmlFor="dateFin" className="champ-formulaire__label">
                Date de fin <span className="requis">*</span>
              </label>
              <input
                id="dateFin"
                type="date"
                value={formulaire.dateFin}
                onChange={(e) => gererChangement('dateFin', e.target.value)}
                className={`champ-formulaire__input ${erreurs.dateFin ? 'champ-formulaire__input--erreur' : ''}`}
                disabled={enCours}
              />
              {erreurs.dateFin && <span className="champ-formulaire__erreur">{erreurs.dateFin}</span>}
            </div>

            {/* Loyer mensuel */}
            <div className="champ-formulaire">
              <label htmlFor="loyerMensuel" className="champ-formulaire__label">
                Loyer mensuel (FCFA) <span className="requis">*</span>
              </label>
              <input
                id="loyerMensuel"
                type="number"
                step="1"
                value={formulaire.loyerMensuel}
                onChange={(e) => gererChangement('loyerMensuel', e.target.value)}
                className={`champ-formulaire__input ${erreurs.loyerMensuel ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="150000"
                disabled={enCours}
              />
              {erreurs.loyerMensuel && (
                <span className="champ-formulaire__erreur">{erreurs.loyerMensuel}</span>
              )}
            </div>

            {/* Caution */}
            <div className="champ-formulaire">
              <label htmlFor="caution" className="champ-formulaire__label">
                Caution (FCFA) <span className="requis">*</span>
              </label>
              <input
                id="caution"
                type="number"
                step="1"
                value={formulaire.caution}
                onChange={(e) => gererChangement('caution', e.target.value)}
                className={`champ-formulaire__input ${erreurs.caution ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="300000"
                disabled={enCours}
              />
              {erreurs.caution && <span className="champ-formulaire__erreur">{erreurs.caution}</span>}
            </div>

            {/* Statut */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
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
                {OPTIONS_STATUTS_CONTRAT.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formulaire-contrat__actions">
            <button
              type="button"
              className="bouton bouton--secondaire"
              onClick={surAnnuler}
              disabled={enCours}
            >
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : contrat ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
