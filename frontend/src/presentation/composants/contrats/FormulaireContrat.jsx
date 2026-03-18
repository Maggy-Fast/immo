/**
 * Composant — Formulaire de création/modification d'un contrat
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { FileText, Home, User, Calendar, DollarSign } from 'lucide-react';
import { validerContrat } from '../../../domaine/validations/validationContrat';
import { OPTIONS_STATUTS_CONTRAT } from '../../../domaine/valeursObjets/statutContrat';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

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
        dateDebut: contrat.dateDebut || contrat.date_debut ? 
          new Date(contrat.dateDebut || contrat.date_debut).toISOString().split('T')[0] : '',
        dateFin: contrat.dateFin || contrat.date_fin ? 
          new Date(contrat.dateFin || contrat.date_fin).toISOString().split('T')[0] : '',
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

  const gererSoumission = async () => {
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

  // Filtrer les biens disponibles
  const biensDisponibles = biens.filter(
    (b) => b.statut === 'disponible' || b.id === formulaire.idBien
  );

  const optionsBiens = [
    { valeur: '', label: 'Sélectionner un bien' },
    ...biensDisponibles.map((b) => ({ valeur: b.id, label: b.adresse })),
  ];

  const optionsLocataires = [
    { valeur: '', label: 'Sélectionner un locataire' },
    ...locataires.map((l) => ({ valeur: l.id, label: l.nom })),
  ];

  return (
    <Modale
      titre={contrat ? 'Modifier le contrat' : 'Nouveau contrat'}
      surFermer={surAnnuler}
      taille="grand"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <ChampFormulaire
          id="idBien"
          label="Bien immobilier"
          type="select"
          valeur={formulaire.idBien}
          onChange={(val) => gererChangement('idBien', val)}
          erreur={erreurs.idBien}
          required
          options={optionsBiens}
          icone={Home}
          disabled={enCours}
          className="largeur-complete"
        />

        <ChampFormulaire
          id="idLocataire"
          label="Locataire"
          type="select"
          valeur={formulaire.idLocataire}
          onChange={(val) => gererChangement('idLocataire', val)}
          erreur={erreurs.idLocataire}
          required
          options={optionsLocataires}
          icone={User}
          disabled={enCours}
          className="largeur-complete"
        />

        <ChampFormulaire
          id="dateDebut"
          label="Date de début"
          type="date"
          valeur={formulaire.dateDebut}
          onChange={(val) => gererChangement('dateDebut', val)}
          erreur={erreurs.dateDebut}
          required
          icone={Calendar}
          disabled={enCours}
        />

        <ChampFormulaire
          id="dateFin"
          label="Date de fin"
          type="date"
          valeur={formulaire.dateFin}
          onChange={(val) => gererChangement('dateFin', val)}
          erreur={erreurs.dateFin}
          required
          icone={Calendar}
          disabled={enCours}
        />

        <ChampFormulaire
          id="loyerMensuel"
          label="Loyer mensuel (FCFA)"
          type="number"
          step="1"
          valeur={formulaire.loyerMensuel}
          onChange={(val) => gererChangement('loyerMensuel', val)}
          erreur={erreurs.loyerMensuel}
          required
          placeholder="150000"
          icone={DollarSign}
          disabled={enCours}
        />

        <ChampFormulaire
          id="caution"
          label="Caution (FCFA)"
          type="number"
          step="1"
          valeur={formulaire.caution}
          onChange={(val) => gererChangement('caution', val)}
          erreur={erreurs.caution}
          required
          placeholder="300000"
          icone={DollarSign}
          disabled={enCours}
        />

        <ChampFormulaire
          id="statut"
          label="Statut"
          type="select"
          valeur={formulaire.statut}
          onChange={(val) => gererChangement('statut', val)}
          erreur={erreurs.statut}
          options={OPTIONS_STATUTS_CONTRAT}
          disabled={enCours}
          className="largeur-complete"
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={contrat ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={FileText}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
