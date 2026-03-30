/**
 * Composant — Formulaire Parcelle Coopérative - Design Moderne
 */

import { useState, useEffect, useMemo } from 'react';
import { MapPin, Maximize, DollarSign, FileText, Image, Users } from 'lucide-react';
import { utiliserGroupesCooperative } from '../../../application/hooks/utiliserGroupesCooperative';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import { SelecteurAdresseCarte } from '../communs';
import './FormulaireParcelleCooperative.css';

export default function FormulaireParcelleCooperative({ parcelle, initialIdGroupe, surSoumettre, surAnnuler, enCours }) {
  const [donnees, setDonnees] = useState({
    numero: '',
    surface: '',
    prix: '',
    description: '',
    photo: null,
    id_groupe: initialIdGroupe || '',
    adresse: '',
    latitude: '',
    longitude: '',
  });

  const { groupes } = utiliserGroupesCooperative();

  const optionsGroupes = useMemo(() => {
    return [
      { valeur: '', label: 'Sélectionner un groupe (Optionnel)' },
      ...groupes.map(g => ({ valeur: String(g.id), label: g.nom }))
    ];
  }, [groupes]);

  const [erreurs, setErreurs] = useState({});

  useEffect(() => {
    if (parcelle) {
      setDonnees({
        numero: parcelle.numero || '',
        surface: parcelle.surface || '',
        prix: parcelle.prix || '',
        description: parcelle.description || '',
        id_groupe: parcelle.id_groupe || '',
        photo: null,
        adresse: parcelle.adresse || '',
        latitude: parcelle.latitude || '',
        longitude: parcelle.longitude || '',
      });
    }
  }, [parcelle]);

  const gererChangement = (champ, valeur) => {
    setDonnees((prev) => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs((prev) => ({ ...prev, [champ]: null }));
    }
  };

  const gererChangementCoordonnees = ({ adresse, latitude, longitude }) => {
    setDonnees(prev => ({
      ...prev,
      adresse,
      latitude,
      longitude
    }));
  };

  const valider = () => {
    const nouvellesErreurs = {};

    if (!donnees.numero.trim()) {
      nouvellesErreurs.numero = 'Le numéro est requis';
    }

    if (!donnees.surface || parseFloat(donnees.surface) <= 0) {
      nouvellesErreurs.surface = 'La surface doit être supérieure à 0';
    }

    if (!donnees.prix || parseFloat(donnees.prix) <= 0) {
      nouvellesErreurs.prix = 'Le prix doit être supérieur à 0';
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    
    if (!valider()) {
      return;
    }

    // Créer FormData pour gérer l'upload de fichier
    const formData = new FormData();
    
    // Ajouter tous les champs
    formData.append('numero', donnees.numero);
    formData.append('surface', donnees.surface);
    formData.append('prix', donnees.prix);
    formData.append('description', donnees.description || '');
    
    // Ajouter la photo si elle existe
    if (donnees.photo && typeof donnees.photo === 'object') {
      formData.append('photo', donnees.photo);
    }
    
    // Ajouter l'ID du groupe si disponible
    if (donnees.id_groupe && donnees.id_groupe !== '') {
      formData.append('id_groupe', donnees.id_groupe);
    }

    // Ajouter les coordonnées si elles existent
    if (donnees.latitude) {
      formData.append('latitude', donnees.latitude);
    }
    if (donnees.longitude) {
      formData.append('longitude', donnees.longitude);
    }

    surSoumettre(formData);
  };

  return (
    <Modal
      titre={parcelle ? 'Modifier la parcelle' : 'Nouvelle parcelle'}
      surFermer={surAnnuler}
      taille="moyen"
    >
      <form onSubmit={gererSoumission} className="formulaire-parcelle">
        <div className="formulaire-parcelle__grille">
          <ChampFormulaire
            label="Groupe associé"
            type="select"
            valeur={donnees.id_groupe}
            onChange={(valeur) => gererChangement('id_groupe', valeur)}
            options={optionsGroupes}
            icone={Users}
            aide="Le groupe auquel appartient cette parcelle"
            className="formulaire-parcelle__champ--plein"
          />

          <ChampFormulaire
            label="Numéro de parcelle"
            type="text"
            valeur={donnees.numero}
            onChange={(valeur) => gererChangement('numero', valeur)}
            placeholder="Ex: PARC001"
            required
            icone={MapPin}
            aide="Identifiant unique de la parcelle"
            erreur={erreurs.numero}
            className="formulaire-parcelle__champ--demi"
          />

          <ChampFormulaire
            label="Surface"
            type="number"
            valeur={donnees.surface}
            onChange={(valeur) => gererChangement('surface', valeur)}
            placeholder="0.00"
            required
            icone={Maximize}
            aide="Surface en m²"
            erreur={erreurs.surface}
            min="0"
            step="0.01"
            className="formulaire-parcelle__champ--demi"
          />

          <ChampFormulaire
            label="Prix"
            type="number"
            valeur={donnees.prix}
            onChange={(valeur) => gererChangement('prix', valeur)}
            placeholder="0"
            required
            icone={DollarSign}
            aide="Prix en FCFA"
            erreur={erreurs.prix}
            min="0"
            step="1"
            className="formulaire-parcelle__champ--plein"
          />

          <ChampFormulaire
            label="Description"
            type="textarea"
            valeur={donnees.description}
            onChange={(valeur) => gererChangement('description', valeur)}
            placeholder="Ex: Parcelle située en zone A, proche des commodités..."
            icone={FileText}
            aide="Informations complémentaires sur la parcelle"
            rows={4}
            className="formulaire-parcelle__champ--plein"
          />

          <ChampFormulaire
            label="Photo de la parcelle"
            type="file"
            valeur={donnees.photo}
            onChange={(valeur) => gererChangement('photo', valeur)}
            accept="image/*"
            icone={Image}
            aide="Photo de la parcelle (JPEG, PNG, max 2MB)"
            className="formulaire-parcelle__champ--plein"
          />

          <div className="formulaire-parcelle__champ--plein">
            <SelecteurAdresseCarte 
              adresseInitial={donnees.adresse}
              latInitial={donnees.latitude}
              lngInitial={donnees.longitude}
              onChangement={gererChangementCoordonnees}
              label="Localisation de la parcelle"
            />
          </div>

          {donnees.photo && typeof donnees.photo === 'object' && (
            <div className="formulaire-parcelle__info-fichier">
              <small>Fichier sélectionné : {donnees.photo.name}</small>
            </div>
          )}
        </div>

        <div className="formulaire-parcelle__actions">
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
            {enCours ? 'Enregistrement...' : parcelle ? 'Modifier' : 'Créer la parcelle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
