/**
 * Composant — Formulaire de création/modification d'un partenariat
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { Handshake, Map, User, DollarSign, Percent } from 'lucide-react';
import { validerPartenariat } from '../../../domaine/validations/validationPartenariat';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

export default function FormulairePartenariat({
  partenariat = null,
  promoteurs = [], // NOUVEAU: Liste des promoteurs
  proprietaires = [], // NOUVEAU: Liste des propriétaires
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
    pourcentagePromoteur: '40',
    pourcentageProprietaire: '60',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (partenariat) {
      setFormulaire({
        idPromoteur: partenariat.idPromoteur || partenariat.id_promoteur || '',
        idProprietaire: partenariat.idProprietaire || partenariat.id_proprietaire || '',
        idLotissement: partenariat.idLotissement || partenariat.id_lotissement || '',
        ticketEntree: partenariat.ticketEntree || partenariat.ticket_entree || '',
        pourcentagePromoteur:
          partenariat.pourcentagePromoteur || partenariat.pourcentage_promoteur || '40',
        pourcentageProprietaire:
          partenariat.pourcentageProprietaire || partenariat.pourcentage_proprietaire || '60',
      });
    }
  }, [partenariat]);

  const gererChangement = (champ, valeur) => {
    // Auto-ajuster l'autre pourcentage
    if (champ === 'pourcentagePromoteur' && valeur !== '') {
      const pct = parseFloat(valeur);
      if (!isNaN(pct) && pct >= 0 && pct <= 100) {
        setFormulaire((prev) => ({
          ...prev,
          [champ]: valeur,
          pourcentageProprietaire: (100 - pct).toString(),
        }));
      }
    } else if (champ === 'pourcentageProprietaire' && valeur !== '') {
      const pct = parseFloat(valeur);
      if (!isNaN(pct) && pct >= 0 && pct <= 100) {
        setFormulaire((prev) => ({
          ...prev,
          [champ]: valeur,
          pourcentagePromoteur: (100 - pct).toString(),
        }));
      }
    } else {
      setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    }

    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async () => {
    const erreursValidation = validerPartenariat(formulaire);
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation);
      return;
    }

    // Vérifier que le promoteur et le propriétaire sont différents
    if (formulaire.idPromoteur === formulaire.idProprietaire) {
      setErreurs({
        idPromoteur: 'Le promoteur et le propriétaire doivent être différents',
        idProprietaire: 'Le promoteur et le propriétaire doivent être différents',
      });
      return;
    }

    try {
      await surSoumettre(formulaire);
    } catch (error) {
      console.error('Erreur soumission:', error);
    }
  };

  const optionsLotissements = [
    { valeur: '', label: 'Sélectionner un lotissement' },
    ...lotissements.map((l) => ({ valeur: l.id, label: l.nom })),
  ];

  const optionsPromoteurs = [
    { valeur: '', label: 'Sélectionner un promoteur' },
    ...promoteurs.map((p) => ({ valeur: p.id, label: `${p.nom} ${p.telephone ? `(${p.telephone})` : ''}` })),
  ];

  const optionsProprietaires = [
    { valeur: '', label: 'Sélectionner un propriétaire' },
    ...proprietaires.map((p) => ({ valeur: p.id, label: `${p.nom} ${p.telephone ? `(${p.telephone})` : ''}` })),
  ];

  return (
    <Modale
      titre={partenariat ? 'Modifier le partenariat' : 'Nouveau partenariat'}
      surFermer={surAnnuler}
      taille="grand"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <ChampFormulaire
          id="idLotissement"
          label="Lotissement"
          type="select"
          valeur={formulaire.idLotissement}
          onChange={(val) => gererChangement('idLotissement', val)}
          erreur={erreurs.idLotissement}
          required
          options={optionsLotissements}
          icone={Map}
          disabled={enCours}
          className="largeur-complete"
        />

        <ChampFormulaire
          id="idPromoteur"
          label="Promoteur *"
          type="select"
          valeur={formulaire.idPromoteur}
          onChange={(val) => gererChangement('idPromoteur', val)}
          erreur={erreurs.idPromoteur}
          required
          options={optionsPromoteurs}
          icone={User}
          disabled={enCours}
        />

        <ChampFormulaire
          id="idProprietaire"
          label="Propriétaire *"
          type="select"
          valeur={formulaire.idProprietaire}
          onChange={(val) => gererChangement('idProprietaire', val)}
          erreur={erreurs.idProprietaire}
          required
          options={optionsProprietaires}
          icone={User}
          disabled={enCours}
        />

        <ChampFormulaire
          id="ticketEntree"
          label="Ticket d'entrée (FCFA)"
          type="number"
          step="1"
          valeur={formulaire.ticketEntree}
          onChange={(val) => gererChangement('ticketEntree', val)}
          erreur={erreurs.ticketEntree}
          required
          placeholder="10000000"
          icone={DollarSign}
          disabled={enCours}
          className="largeur-complete"
        />

        <ChampFormulaire
          id="pourcentagePromoteur"
          label="Pourcentage promoteur (%)"
          type="number"
          step="0.01"
          min="0"
          max="100"
          valeur={formulaire.pourcentagePromoteur}
          onChange={(val) => gererChangement('pourcentagePromoteur', val)}
          erreur={erreurs.pourcentagePromoteur}
          required
          icone={Percent}
          aide="Ajusté automatiquement avec le propriétaire"
          disabled={enCours}
        />

        <ChampFormulaire
          id="pourcentageProprietaire"
          label="Pourcentage propriétaire (%)"
          type="number"
          step="0.01"
          min="0"
          max="100"
          valeur={formulaire.pourcentageProprietaire}
          onChange={(val) => gererChangement('pourcentageProprietaire', val)}
          erreur={erreurs.pourcentageProprietaire}
          required
          icone={Percent}
          aide="Ajusté automatiquement avec le promoteur"
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={partenariat ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={Handshake}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
