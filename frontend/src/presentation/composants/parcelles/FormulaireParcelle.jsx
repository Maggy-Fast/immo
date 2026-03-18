/**
 * Composant — Formulaire de création/modification d'une parcelle
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { Map, Hash, Maximize, DollarSign } from 'lucide-react';
import { validerParcelle } from '../../../domaine/validations/validationParcelle';
import { OPTIONS_STATUTS_PARCELLE } from '../../../domaine/valeursObjets/statutParcelle';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

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

  const gererSoumission = async () => {
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

  const optionsLotissements = [
    { valeur: '', label: 'Sélectionner un lotissement' },
    ...lotissements.map((l) => ({ valeur: l.id, label: l.nom })),
  ];

  return (
    <Modale
      titre={parcelle ? 'Modifier la parcelle' : 'Nouvelle parcelle'}
      surFermer={surAnnuler}
      taille="moyen"
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
          obligatoire
          options={optionsLotissements}
          icone={Map}
          disabled={enCours || !!lotissementParDefaut}
          className="largeur-complete"
        />

        <ChampFormulaire
          id="numero"
          label="Numéro de parcelle"
          type="text"
          valeur={formulaire.numero}
          onChange={(val) => gererChangement('numero', val)}
          erreur={erreurs.numero}
          required
          placeholder="Ex: A-015"
          icone={Hash}
          disabled={enCours}
        />

        <ChampFormulaire
          id="statut"
          label="Statut"
          type="select"
          valeur={formulaire.statut}
          onChange={(val) => gererChangement('statut', val)}
          erreur={erreurs.statut}
          options={OPTIONS_STATUTS_PARCELLE}
          disabled={enCours}
        />

        <ChampFormulaire
          id="superficie"
          label="Superficie (m²)"
          type="number"
          step="0.01"
          valeur={formulaire.superficie}
          onChange={(val) => gererChangement('superficie', val)}
          erreur={erreurs.superficie}
          required
          placeholder="300"
          icone={Maximize}
          disabled={enCours}
        />

        <ChampFormulaire
          id="prix"
          label="Prix (FCFA)"
          type="number"
          step="1"
          valeur={formulaire.prix}
          onChange={(val) => gererChangement('prix', val)}
          erreur={erreurs.prix}
          required
          placeholder="5000000"
          icone={DollarSign}
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={parcelle ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={Map}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
