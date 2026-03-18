/**
 * Composant — Formulaire Adhérent - Design Moderne
 */

import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, CreditCard, Shield } from 'lucide-react';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import './FormulaireAdherent.css';

export default function FormulaireAdherent({ adherent, surSoumettre, surAnnuler, enCours }) {
  const [donnees, setDonnees] = useState({
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    email: '',
    adresse: '',
    statut: 'actif',
  });

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (adherent) {
      setDonnees({
        nom: adherent.nom || '',
        prenom: adherent.prenom || '',
        cin: adherent.cin || '',
        telephone: adherent.telephone || '',
        email: adherent.email || '',
        adresse: adherent.adresse || '',
        statut: adherent.statut || 'actif',
      });
    }
  }, [adherent]);

  const gererChangement = (champ, valeur) => {
    setDonnees((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: null }));
    }
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!donnees.nom.trim()) {
      nouvellesErreurs.nom = 'Le nom est requis';
    }

    if (!donnees.prenom.trim()) {
      nouvellesErreurs.prenom = 'Le prénom est requis';
    }

    if (!donnees.telephone.trim()) {
      nouvellesErreurs.telephone = 'Le téléphone est requis';
    }

    if (donnees.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donnees.email)) {
      nouvellesErreurs.email = 'Email invalide';
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    
    if (!valider()) {
      return;
    }

    surSoumettre(donnees);
  };

  const optionsStatut = [
    { valeur: 'actif', label: 'Actif' },
    { valeur: 'suspendu', label: 'Suspendu' },
    { valeur: 'radie', label: 'Radié' },
  ];

  return (
    <Modal
      titre={adherent ? 'Modifier l\'adhérent' : 'Nouvel adhérent'}
      surFermer={surAnnuler}
      taille="moyen"
    >
      <form onSubmit={gererSoumission} className="formulaire-adherent">
        <div className="formulaire-adherent__grille">
          <ChampFormulaire
            label="Nom"
            type="text"
            valeur={donnees.nom}
            onChange={(valeur) => gererChangement('nom', valeur)}
            placeholder="Diallo"
            required
            icone={User}
            erreur={erreurs.nom}
            className="formulaire-adherent__champ--demi"
          />

          <ChampFormulaire
            label="Prénom"
            type="text"
            valeur={donnees.prenom}
            onChange={(valeur) => gererChangement('prenom', valeur)}
            placeholder="Amadou"
            required
            icone={User}
            erreur={erreurs.prenom}
            className="formulaire-adherent__champ--demi"
          />

          <ChampFormulaire
            label="CIN / Pièce d'identité"
            type="text"
            valeur={donnees.cin}
            onChange={(valeur) => gererChangement('cin', valeur)}
            placeholder="1234567890123"
            icone={CreditCard}
            aide="Numéro de carte d'identité nationale"
            className="formulaire-adherent__champ--demi"
          />

          <ChampFormulaire
            label="Téléphone"
            type="tel"
            valeur={donnees.telephone}
            onChange={(valeur) => gererChangement('telephone', valeur)}
            placeholder="+221 77 123 45 67"
            required
            icone={Phone}
            erreur={erreurs.telephone}
            className="formulaire-adherent__champ--demi"
          />

          <ChampFormulaire
            label="Email"
            type="email"
            valeur={donnees.email}
            onChange={(valeur) => gererChangement('email', valeur)}
            placeholder="adherent@example.com"
            icone={Mail}
            erreur={erreurs.email}
            className="formulaire-adherent__champ--plein"
          />

          <ChampFormulaire
            label="Adresse"
            type="textarea"
            valeur={donnees.adresse}
            onChange={(valeur) => gererChangement('adresse', valeur)}
            placeholder="Adresse complète de l'adhérent"
            icone={MapPin}
            rows={3}
            className="formulaire-adherent__champ--plein"
          />

          {adherent && (
            <ChampFormulaire
              label="Statut"
              type="select"
              valeur={donnees.statut}
              onChange={(valeur) => gererChangement('statut', valeur)}
              options={optionsStatut}
              icone={Shield}
              aide="Modifier le statut de l'adhérent"
              className="formulaire-adherent__champ--demi"
            />
          )}
        </div>

        <div className="formulaire-adherent__actions">
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
            {enCours ? 'Enregistrement...' : adherent ? 'Modifier l\'adhérent' : 'Créer l\'adhérent'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
