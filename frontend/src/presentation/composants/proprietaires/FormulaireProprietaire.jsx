/**
 * Composant — Formulaire de création/modification d'un propriétaire
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, User, CreditCard, Camera } from 'lucide-react';
import { validerProprietaire } from '../../../domaine/validations/validationProprietaire';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire, UploadImage } from '../communs';

export default function FormulaireProprietaire({
  proprietaire = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    cin: '',
    photo: null,
  });

  const [apercuPhoto, setApercuPhoto] = useState(null);
  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (proprietaire) {
      setFormulaire({
        nom: proprietaire.nom || '',
        telephone: proprietaire.telephone || '',
        email: proprietaire.email || '',
        adresse: proprietaire.adresse || '',
        cin: proprietaire.cin || '',
        photo: proprietaire.photo || null,
      });
      setApercuPhoto(proprietaire.photo || null);
    }
  }, [proprietaire]);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererChangementPhoto = (fichier, apercu) => {
    setFormulaire(prev => ({ ...prev, photo: fichier }));
    setApercuPhoto(apercu);
  };

  const gererSoumission = async () => {
    const erreursValidation = validerProprietaire(formulaire);
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
      titre={proprietaire ? 'Modifier le propriétaire' : 'Nouveau propriétaire'}
      surFermer={surAnnuler}
      taille="moyen"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <UploadImage
            imageActuelle={apercuPhoto}
            surChangement={gererChangementPhoto}
            forme="cercle"
            largeur={120}
            hauteur={120}
            texteAide="Photo du propriétaire"
            disabled={enCours}
          />
        </div>

        <ChampFormulaire
          id="nom"
          label="Nom complet"
          type="text"
          valeur={formulaire.nom}
          onChange={(val) => gererChangement('nom', val)}
          erreur={erreurs.nom}
          obligatoire
          placeholder="Ex: Ibrahima Sow"
          icone={<User size={18} />}
          largeurComplete
          disabled={enCours}
        />

        <ChampFormulaire
          id="telephone"
          label="Téléphone"
          type="tel"
          valeur={formulaire.telephone}
          onChange={(val) => gererChangement('telephone', val)}
          erreur={erreurs.telephone}
          obligatoire
          placeholder="+221 77 123 45 67"
          icone={<Phone size={18} />}
          disabled={enCours}
        />

        <ChampFormulaire
          id="email"
          label="Email"
          type="email"
          valeur={formulaire.email}
          onChange={(val) => gererChangement('email', val)}
          erreur={erreurs.email}
          obligatoire
          placeholder="exemple@email.com"
          icone={<Mail size={18} />}
          disabled={enCours}
        />

        <ChampFormulaire
          id="cin"
          label="CIN / Pièce d'identité"
          type="text"
          valeur={formulaire.cin}
          onChange={(val) => gererChangement('cin', val)}
          erreur={erreurs.cin}
          placeholder="1234567890123"
          icone={<CreditCard size={18} />}
          disabled={enCours}
        />

        <ChampFormulaire
          id="adresse"
          label="Adresse"
          type="text"
          valeur={formulaire.adresse}
          onChange={(val) => gererChangement('adresse', val)}
          erreur={erreurs.adresse}
          placeholder="Ex: Médina, Dakar"
          icone={<MapPin size={18} />}
          largeurComplete
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={proprietaire ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={<User size={18} />}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
