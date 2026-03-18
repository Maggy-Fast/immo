# Composants Centralisés - Guide d'Utilisation

## Vue d'ensemble

Ce système de composants centralisés fournit une base cohérente pour tous les formulaires et modales de l'application. Design épuré, structuré et professionnel.

## Composants Disponibles

### 1. Modale
Conteneur pour toutes les fenêtres modales.

**Props:**
- `titre` (string, requis) - Titre de la modale
- `children` (ReactNode, requis) - Contenu de la modale
- `surFermer` (function, requis) - Fonction appelée à la fermeture
- `taille` (string) - 'petit', 'moyen', 'grand', 'tres-grand' (défaut: 'moyen')
- `afficherBoutonFermer` (boolean) - Afficher le bouton X (défaut: true)
- `actionsPersonnalisees` (ReactNode) - Actions personnalisées en bas
- `enCours` (boolean) - Désactive la fermeture pendant le chargement

**Exemple:**
```jsx
<Modale
  titre="Nouveau bien"
  surFermer={handleClose}
  taille="grand"
  enCours={loading}
>
  {/* Contenu */}
</Modale>
```

### 2. Formulaire
Conteneur pour organiser les champs en grille.

**Props:**
- `children` (ReactNode, requis) - Champs du formulaire
- `surSoumettre` (function, requis) - Fonction appelée à la soumission
- `colonnes` (number) - 1, 2 ou 3 colonnes (défaut: 2)
- `espacementVertical` (string) - 'compact', 'normal', 'large' (défaut: 'normal')

**Exemple:**
```jsx
<Formulaire surSoumettre={handleSubmit} colonnes={2}>
  {/* Champs */}
</Formulaire>
```

### 3. ChampFormulaire
Champ de formulaire universel avec label, erreur et aide.

**Props:**
- `id` (string, requis) - ID unique du champ
- `label` (string) - Label du champ
- `type` (string) - 'text', 'email', 'tel', 'number', 'date', 'select', 'textarea', 'password'
- `valeur` (any, requis) - Valeur du champ
- `onChange` (function, requis) - Fonction appelée au changement
- `erreur` (string) - Message d'erreur
- `obligatoire` (boolean) - Affiche l'astérisque rouge
- `placeholder` (string) - Texte placeholder
- `disabled` (boolean) - Désactive le champ
- `options` (array) - Options pour select: `[{ valeur: 'x', label: 'X' }]`
- `rows` (number) - Nombre de lignes pour textarea (défaut: 3)
- `step` (number) - Pas pour number
- `min` (number) - Valeur min pour number
- `max` (number) - Valeur max pour number
- `largeurComplete` (boolean) - Prend toute la largeur de la grille
- `aide` (string) - Texte d'aide sous le champ
- `icone` (ReactNode) - Icône à gauche du champ

**Exemples:**
```jsx
// Input texte simple
<ChampFormulaire
  id="nom"
  label="Nom complet"
  type="text"
  valeur={form.nom}
  onChange={(val) => setForm({ ...form, nom: val })}
  obligatoire
  placeholder="Ex: Amadou Diallo"
/>

// Select
<ChampFormulaire
  id="type"
  label="Type de bien"
  type="select"
  valeur={form.type}
  onChange={(val) => setForm({ ...form, type: val })}
  options={[
    { valeur: '', label: 'Sélectionner' },
    { valeur: 'maison', label: 'Maison' },
    { valeur: 'appartement', label: 'Appartement' },
  ]}
  obligatoire
/>

// Textarea
<ChampFormulaire
  id="description"
  label="Description"
  type="textarea"
  valeur={form.description}
  onChange={(val) => setForm({ ...form, description: val })}
  rows={4}
  largeurComplete
  aide="Ajoutez des détails supplémentaires"
/>

// Avec icône
<ChampFormulaire
  id="email"
  label="Email"
  type="email"
  valeur={form.email}
  onChange={(val) => setForm({ ...form, email: val })}
  icone={<Mail size={18} />}
  obligatoire
/>
```

### 4. ActionsFormulaire
Boutons d'action standardisés pour les formulaires.

**Props:**
- `surAnnuler` (function, requis) - Fonction appelée au clic sur Annuler
- `texteBoutonPrincipal` (string) - Texte du bouton principal (défaut: 'Enregistrer')
- `texteBoutonSecondaire` (string) - Texte du bouton secondaire (défaut: 'Annuler')
- `enCours` (boolean) - État de chargement
- `texteChargement` (string) - Texte pendant le chargement (défaut: 'Enregistrement...')
- `iconePrincipal` (ReactNode) - Icône du bouton principal
- `iconeSecondaire` (ReactNode) - Icône du bouton secondaire
- `alignement` (string) - 'gauche', 'centre', 'droite', 'espace' (défaut: 'droite')
- `desactiverPrincipal` (boolean) - Désactive le bouton principal

**Exemple:**
```jsx
<ActionsFormulaire
  surAnnuler={handleCancel}
  texteBoutonPrincipal="Créer"
  enCours={loading}
  alignement="droite"
/>
```

## Structure Complète d'un Formulaire

```jsx
import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import Modale from './communs/Modale';
import Formulaire from './communs/Formulaire';
import ChampFormulaire from './communs/ChampFormulaire';
import ActionsFormulaire from './communs/ActionsFormulaire';

export default function FormulaireExemple({ item, surSoumettre, surAnnuler }) {
  const [formulaire, setFormulaire] = useState({
    nom: item?.nom || '',
    email: item?.email || '',
  });
  const [erreurs, setErreurs] = useState({});
  const [enCours, setEnCours] = useState(false);

  const gererChangement = (champ, valeur) => {
    setFormulaire(prev => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs(prev => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async () => {
    // Validation
    const nouvellesErreurs = {};
    if (!formulaire.nom) nouvellesErreurs.nom = 'Le nom est obligatoire';
    if (!formulaire.email) nouvellesErreurs.email = "L'email est obligatoire";

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
      titre={item ? 'Modifier' : 'Nouveau'}
      surFermer={surAnnuler}
      taille="moyen"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <ChampFormulaire
          id="nom"
          label="Nom"
          type="text"
          valeur={formulaire.nom}
          onChange={(val) => gererChangement('nom', val)}
          erreur={erreurs.nom}
          obligatoire
          icone={<User size={18} />}
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
          icone={<Mail size={18} />}
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={item ? 'Modifier' : 'Créer'}
            enCours={enCours}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
```

## Avantages

✅ Design cohérent dans toute l'application  
✅ Code réutilisable et maintenable  
✅ Gestion automatique des états (erreur, disabled, loading)  
✅ Responsive par défaut  
✅ Accessibilité intégrée  
✅ Animations fluides  
✅ Facile à personnaliser  

## Migration des Formulaires Existants

Pour migrer un formulaire existant:

1. Remplacer `<div className="modal-overlay">` par `<Modale>`
2. Remplacer la grille de formulaire par `<Formulaire>`
3. Remplacer chaque champ par `<ChampFormulaire>`
4. Remplacer les boutons par `<ActionsFormulaire>`
5. Supprimer les CSS spécifiques au formulaire

Voir `EXEMPLE_UTILISATION.jsx` pour un exemple complet.
