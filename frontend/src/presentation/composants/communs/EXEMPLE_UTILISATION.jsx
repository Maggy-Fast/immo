/**
 * EXEMPLE D'UTILISATION DES COMPOSANTS CENTRALISÉS
 * 
 * Ce fichier montre comment utiliser les composants Modale, Formulaire, 
 * ChampFormulaire et ActionsFormulaire pour créer des formulaires cohérents
 */

import { useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import Modale from './Modale';
import Formulaire from './Formulaire';
import ChampFormulaire from './ChampFormulaire';
import ActionsFormulaire from './ActionsFormulaire';

export default function ExempleFormulaireUtilisateur({ utilisateur = null, surSoumettre, surAnnuler }) {
  const [formulaire, setFormulaire] = useState({
    nom: utilisateur?.nom || '',
    email: utilisateur?.email || '',
    telephone: utilisateur?.telephone || '',
    adresse: utilisateur?.adresse || '',
    role: utilisateur?.role || '',
    description: utilisateur?.description || '',
  });

  const [erreurs, setErreurs] = useState({});
  const [enCours, setEnCours] = useState(false);

  const gererChangement = (champ, valeur) => {
    setFormulaire((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async () => {
    // Validation
    const nouvellesErreurs = {};
    if (!formulaire.nom) nouvellesErreurs.nom = 'Le nom est obligatoire';
    if (!formulaire.email) nouvellesErreurs.email = "L'email est obligatoire";
    if (!formulaire.role) nouvellesErreurs.role = 'Le rôle est obligatoire';

    if (Object.keys(nouvellesErreurs).length > 0) {
      setErreurs(nouvellesErreurs);
      return;
    }

    // Soumission
    setEnCours(true);
    try {
      await surSoumettre(formulaire);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Modale
      titre={utilisateur ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
      surFermer={surAnnuler}
      taille="grand"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        {/* Nom */}
        <ChampFormulaire
          id="nom"
          label="Nom complet"
          type="text"
          valeur={formulaire.nom}
          onChange={(valeur) => gererChangement('nom', valeur)}
          erreur={erreurs.nom}
          obligatoire
          placeholder="Ex: Amadou Diallo"
          icone={<User size={18} />}
          disabled={enCours}
        />

        {/* Email */}
        <ChampFormulaire
          id="email"
          label="Adresse email"
          type="email"
          valeur={formulaire.email}
          onChange={(valeur) => gererChangement('email', valeur)}
          erreur={erreurs.email}
          obligatoire
          placeholder="exemple@email.com"
          icone={<Mail size={18} />}
          disabled={enCours}
        />

        {/* Téléphone */}
        <ChampFormulaire
          id="telephone"
          label="Téléphone"
          type="tel"
          valeur={formulaire.telephone}
          onChange={(valeur) => gererChangement('telephone', valeur)}
          erreur={erreurs.telephone}
          placeholder="+221 77 123 45 67"
          icone={<Phone size={18} />}
          disabled={enCours}
        />

        {/* Rôle */}
        <ChampFormulaire
          id="role"
          label="Rôle"
          type="select"
          valeur={formulaire.role}
          onChange={(valeur) => gererChangement('role', valeur)}
          erreur={erreurs.role}
          obligatoire
          options={[
            { valeur: '', label: 'Sélectionner un rôle' },
            { valeur: 'admin', label: 'Administrateur' },
            { valeur: 'gestionnaire', label: 'Gestionnaire' },
            { valeur: 'agent', label: 'Agent' },
          ]}
          disabled={enCours}
        />

        {/* Adresse */}
        <ChampFormulaire
          id="adresse"
          label="Adresse"
          type="text"
          valeur={formulaire.adresse}
          onChange={(valeur) => gererChangement('adresse', valeur)}
          erreur={erreurs.adresse}
          placeholder="Ex: Médina, Dakar"
          icone={<MapPin size={18} />}
          largeurComplete
          disabled={enCours}
        />

        {/* Description */}
        <ChampFormulaire
          id="description"
          label="Description"
          type="textarea"
          valeur={formulaire.description}
          onChange={(valeur) => gererChangement('description', valeur)}
          erreur={erreurs.description}
          placeholder="Informations complémentaires..."
          rows={4}
          largeurComplete
          aide="Ajoutez des informations supplémentaires si nécessaire"
          disabled={enCours}
        />

        {/* Actions */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={utilisateur ? 'Modifier' : 'Créer'}
            enCours={enCours}
            alignement="droite"
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
