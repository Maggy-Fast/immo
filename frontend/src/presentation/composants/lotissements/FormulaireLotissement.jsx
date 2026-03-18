/**
 * Composant — Formulaire de création/modification d'un lotissement
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { MapPin, Map, Maximize } from 'lucide-react';
import { validerLotissement } from '../../../domaine/validations/validationLotissement';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

export default function FormulaireLotissement({
  lotissement = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    localisation: '',
    superficieTotale: '',
    nombreParcelles: '',
    latitude: '',
    longitude: '',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (lotissement) {
      setFormulaire({
        nom: lotissement.nom || '',
        localisation: lotissement.localisation || '',
        superficieTotale: lotissement.superficieTotale || lotissement.superficie_totale || '',
        nombreParcelles: lotissement.nombreParcelles || lotissement.nombre_parcelles || '',
        latitude: lotissement.latitude || '',
        longitude: lotissement.longitude || '',
      });
    }
  }, [lotissement]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async () => {
    const erreursValidation = validerLotissement(formulaire);
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
    <Modale
      titre={lotissement ? 'Modifier le lotissement' : 'Nouveau lotissement'}
      surFermer={surAnnuler}
      taille="moyen"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <ChampFormulaire
          id="nom"
          label="Nom du lotissement"
          type="text"
          valeur={formulaire.nom}
          onChange={(val) => gererChangement('nom', val)}
          erreur={erreurs.nom}
          obligatoire
          placeholder="Ex: Lotissement Diamalaye"
          icone={<Map size={18} />}
          largeurComplete
          disabled={enCours}
        />

        <ChampFormulaire
          id="localisation"
          label="Localisation"
          type="text"
          valeur={formulaire.localisation}
          onChange={(val) => gererChangement('localisation', val)}
          erreur={erreurs.localisation}
          obligatoire
          placeholder="Ex: Diamniadio, Dakar"
          icone={<MapPin size={18} />}
          largeurComplete
          disabled={enCours}
        />

        <ChampFormulaire
          id="superficieTotale"
          label="Superficie totale (m²)"
          type="number"
          step="0.01"
          valeur={formulaire.superficieTotale}
          onChange={(val) => gererChangement('superficieTotale', val)}
          erreur={erreurs.superficieTotale}
          placeholder="50000"
          icone={<Maximize size={18} />}
          disabled={enCours}
        />

        <ChampFormulaire
          id="nombreParcelles"
          label="Nombre de parcelles"
          type="number"
          step="1"
          valeur={formulaire.nombreParcelles}
          onChange={(val) => gererChangement('nombreParcelles', val)}
          erreur={erreurs.nombreParcelles}
          placeholder="120"
          disabled={enCours}
        />

        <ChampFormulaire
          id="latitude"
          label="Latitude"
          type="number"
          step="0.000001"
          valeur={formulaire.latitude}
          onChange={(val) => gererChangement('latitude', val)}
          erreur={erreurs.latitude}
          placeholder="14.7167"
          aide="Coordonnées GPS (optionnel)"
          disabled={enCours}
        />

        <ChampFormulaire
          id="longitude"
          label="Longitude"
          type="number"
          step="0.000001"
          valeur={formulaire.longitude}
          onChange={(val) => gererChangement('longitude', val)}
          erreur={erreurs.longitude}
          placeholder="-17.1833"
          aide="Coordonnées GPS (optionnel)"
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={lotissement ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={<Map size={18} />}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
