/**
 * Composant — Formulaire de création/modification d'un locataire
 * Migré vers les composants centralisés
 */

import { useState, useEffect } from 'react';
import { User, Phone, Mail, CreditCard, Briefcase, Camera } from 'lucide-react';
import { validerLocataire } from '../../../domaine/validations/validationLocataire';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire, UploadImage } from '../communs';

export default function FormulaireLocataire({
  locataire = null,
  surSoumettre,
  surAnnuler,
  enCours = false,
}) {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    telephone: '',
    email: '',
    cin: '',
    profession: '',
    photo: null,
  });

  const [apercuPhoto, setApercuPhoto] = useState(null);
  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (locataire) {
      setFormulaire({
        nom: locataire.nom || '',
        telephone: locataire.telephone || '',
        email: locataire.email || '',
        cin: locataire.cin || '',
        profession: locataire.profession || '',
        photo: locataire.photo || null,
      });
      setApercuPhoto(locataire.photo || null);
    }
  }, [locataire]);

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
    const erreursValidation = validerLocataire(formulaire);
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
      titre={locataire ? 'Modifier le locataire' : 'Nouveau locataire'}
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
            texteAide="Photo du locataire"
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
          placeholder="Ex: Fatou Diop"
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
          id="profession"
          label="Profession"
          type="text"
          valeur={formulaire.profession}
          onChange={(val) => gererChangement('profession', val)}
          erreur={erreurs.profession}
          placeholder="Ex: Ingénieur"
          icone={<Briefcase size={18} />}
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={locataire ? 'Modifier' : 'Créer'}
            enCours={enCours}
            iconePrincipal={<User size={18} />}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
