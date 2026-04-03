import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import utiliserPromoteurs from '../../../application/hooks/utiliserPromoteurs';
import { Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

const FormulairePromoteur = ({ promoteur, surAnnuler, surSoumission }) => {
  const [donnees, setDonnees] = useState({
    nom: promoteur?.nom || '',
    telephone: promoteur?.telephone || '',
    email: promoteur?.email || '',
    adresse: promoteur?.adresse || '',
    cin: promoteur?.cin || '',
    licence: promoteur?.licence || '',
    registre_commerce: promoteur?.registre_commerce || '',
    statut_juridique: promoteur?.statut_juridique || '',
    photo: null,
    licence_file: null,
    registre_commerce_file: null,
  });

  const [erreurs, setErreurs] = useState({});

  const { creer, modifier } = utiliserPromoteurs();

  const mutation = useMutation({
    mutationFn: (variables) => {
      if (promoteur) {
        return modifier({ id: promoteur.id, donnees: variables });
      }
      return creer(variables);
    },
    onSuccess: () => {
      surSoumission();
    },
    onError: (error) => {
      setErreurs(error.response?.data?.erreurs || {});
    },
  });

  const gererChangement = (champ, valeur) => {
    setDonnees(prev => ({
      ...prev,
      [champ]: valeur,
    }));
    
    // Effacer l'erreur du champ
    if (erreurs[champ]) {
      setErreurs(prev => ({
        ...prev,
        [champ]: null,
      }));
    }
  };

  const gererFichier = (champ, fichier) => {
    setDonnees(prev => ({
      ...prev,
      [champ]: fichier,
    }));
  };

  const valider = () => {
    const nouveauxErreurs = {};
    
    if (!donnees.nom.trim()) {
      nouveauxErreurs.nom = 'Le nom est requis';
    }
    
    if (!donnees.telephone.trim()) {
      nouveauxErreurs.telephone = 'Le téléphone est requis';
    }
    
    setErreurs(nouveauxErreurs);
    return Object.keys(nouveauxErreurs).length === 0;
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    
    if (!valider()) {
      return;
    }

    // On prépare les données pour le service
    // Le service s'attend à ce que 'licence' et 'registre_commerce' soient les champs contenant les fichiers ou numéros
    const donneesSoumission = {
      ...donnees,
      // Si un fichier est présent dans licence_file, on l'utilise pour 'licence'
      licence: donnees.licence_file instanceof File ? donnees.licence_file : donnees.licence,
      registre_commerce: donnees.registre_commerce_file instanceof File ? donnees.registre_commerce_file : donnees.registre_commerce,
    };

    mutation.mutate(donneesSoumission);
  };

  return (
    <div className="formulaire-promoteur">
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        {/* Informations de base */}
        <ChampFormulaire
          id="nom"
          label="Nom"
          type="text"
          valeur={donnees.nom}
          onChange={(valeur) => gererChangement('nom', valeur)}
          erreur={erreurs.nom}
          obligatoire
        />
        
        <ChampFormulaire
          id="telephone"
          label="Téléphone"
          type="tel"
          valeur={donnees.telephone}
          onChange={(valeur) => gererChangement('telephone', valeur)}
          erreur={erreurs.telephone}
          obligatoire
        />
        
        <ChampFormulaire
          id="email"
          label="Email"
          type="email"
          valeur={donnees.email}
          onChange={(valeur) => gererChangement('email', valeur)}
          erreur={erreurs.email}
        />
        
        <ChampFormulaire
          id="cin"
          label="CIN"
          type="text"
          valeur={donnees.cin}
          onChange={(valeur) => gererChangement('cin', valeur)}
          erreur={erreurs.cin}
        />
        
        <ChampFormulaire
          id="adresse"
          label="Adresse"
          type="textarea"
          valeur={donnees.adresse}
          onChange={(valeur) => gererChangement('adresse', valeur)}
          erreur={erreurs.adresse}
          rows={3}
          largeurComplete
        />
        
        {/* Informations juridiques */}
        <ChampFormulaire
          id="statut_juridique"
          label="Statut juridique"
          type="select"
          valeur={donnees.statut_juridique}
          onChange={(valeur) => gererChangement('statut_juridique', valeur)}
          erreur={erreurs.statut_juridique}
          options={[
            { valeur: '', label: 'Sélectionner...' },
            { valeur: 'SARL', label: 'SARL' },
            { valeur: 'SA', label: 'SA' },
            { valeur: 'EURL', label: 'EURL' },
            { valeur: 'SAS', label: 'SAS' },
            { valeur: 'SNC', label: 'SNC' },
            { valeur: 'Auto-entrepreneur', label: 'Auto-entrepreneur' },
          ]}
        />
        
        <ChampFormulaire
          id="licence"
          label="Numéro de licence"
          type="text"
          valeur={donnees.licence}
          onChange={(valeur) => gererChangement('licence', valeur)}
          erreur={erreurs.licence}
        />
        
        {/* Fichiers */}
        <ChampFormulaire
          id="photo"
          label="Photo"
          type="file"
          onChange={(fichier) => gererFichier('photo', fichier)}
          erreur={erreurs.photo}
          accept="image/*"
        />
        
        <ChampFormulaire
          id="licence_file"
          label="Document licence (PDF/Image)"
          type="file"
          onChange={(fichier) => gererFichier('licence_file', fichier)}
          erreur={erreurs.licence_file}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        
        <ChampFormulaire
          id="registre_commerce_file"
          label="Registre de commerce (PDF/Image)"
          type="file"
          onChange={(fichier) => gererFichier('registre_commerce_file', fichier)}
          erreur={erreurs.registre_commerce_file}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        
        <ActionsFormulaire
          surAnnuler={surAnnuler}
          texteBoutonPrincipal={promoteur ? 'Modifier' : 'Créer'}
          enCours={mutation.isPending}
          alignement="droite"
        />
      </Formulaire>
    </div>
  );
};

export default FormulairePromoteur;
