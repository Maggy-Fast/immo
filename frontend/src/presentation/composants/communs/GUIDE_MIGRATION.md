# Guide de Migration vers les Composants Centralisés

## Avant / Après

### AVANT (Ancien style)

```jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import './FormulaireBien.css';

export default function FormulaireBien({ bien, surSoumettre, surAnnuler, enCours }) {
  const [formulaire, setFormulaire] = useState({
    type: bien?.type || '',
    adresse: bien?.adresse || '',
  });
  const [erreurs, setErreurs] = useState({});

  const gererChangement = (champ, valeur) => {
    setFormulaire(prev => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs(prev => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    // Validation...
    await surSoumettre(formulaire);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__entete">
          <h2>{bien ? 'Modifier le bien' : 'Nouveau bien'}</h2>
          <button className="modal__fermer" onClick={surAnnuler}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={gererSoumission} className="formulaire-bien">
          <div className="formulaire-bien__grille">
            {/* Type */}
            <div className="champ-formulaire">
              <label htmlFor="type" className="champ-formulaire__label">
                Type de bien <span className="requis">*</span>
              </label>
              <select
                id="type"
                value={formulaire.type}
                onChange={(e) => gererChangement('type', e.target.value)}
                className={`champ-formulaire__select ${erreurs.type ? 'champ-formulaire__select--erreur' : ''}`}
                disabled={enCours}
              >
                <option value="">Sélectionner un type</option>
                <option value="maison">Maison</option>
                <option value="appartement">Appartement</option>
              </select>
              {erreurs.type && <span className="champ-formulaire__erreur">{erreurs.type}</span>}
            </div>

            {/* Adresse */}
            <div className="champ-formulaire champ-formulaire--pleine-largeur">
              <label htmlFor="adresse" className="champ-formulaire__label">
                Adresse <span className="requis">*</span>
              </label>
              <input
                id="adresse"
                type="text"
                value={formulaire.adresse}
                onChange={(e) => gererChangement('adresse', e.target.value)}
                className={`champ-formulaire__input ${erreurs.adresse ? 'champ-formulaire__input--erreur' : ''}`}
                placeholder="Ex: Rue 10, Médina"
                disabled={enCours}
              />
              {erreurs.adresse && <span className="champ-formulaire__erreur">{erreurs.adresse}</span>}
            </div>
          </div>

          <div className="formulaire-bien__actions">
            <button type="button" className="bouton bouton--secondaire" onClick={surAnnuler}>
              Annuler
            </button>
            <button type="submit" className="bouton bouton--primaire" disabled={enCours}>
              {enCours ? 'Enregistrement...' : bien ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### APRÈS (Nouveau style avec composants centralisés)

```jsx
import { useState } from 'react';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';

export default function FormulaireBien({ bien, surSoumettre, surAnnuler, enCours }) {
  const [formulaire, setFormulaire] = useState({
    type: bien?.type || '',
    adresse: bien?.adresse || '',
  });
  const [erreurs, setErreurs] = useState({});

  const gererChangement = (champ, valeur) => {
    setFormulaire(prev => ({ ...prev, [champ]: valeur }));
    if (erreurs[champ]) {
      setErreurs(prev => ({ ...prev, [champ]: undefined }));
    }
  };

  const gererSoumission = async () => {
    // Validation...
    await surSoumettre(formulaire);
  };

  return (
    <Modale
      titre={bien ? 'Modifier le bien' : 'Nouveau bien'}
      surFermer={surAnnuler}
      taille="grand"
      enCours={enCours}
    >
      <Formulaire surSoumettre={gererSoumission} colonnes={2}>
        <ChampFormulaire
          id="type"
          label="Type de bien"
          type="select"
          valeur={formulaire.type}
          onChange={(val) => gererChangement('type', val)}
          erreur={erreurs.type}
          obligatoire
          options={[
            { valeur: '', label: 'Sélectionner un type' },
            { valeur: 'maison', label: 'Maison' },
            { valeur: 'appartement', label: 'Appartement' },
          ]}
          disabled={enCours}
        />

        <ChampFormulaire
          id="adresse"
          label="Adresse"
          type="text"
          valeur={formulaire.adresse}
          onChange={(val) => gererChangement('adresse', val)}
          erreur={erreurs.adresse}
          obligatoire
          placeholder="Ex: Rue 10, Médina"
          largeurComplete
          disabled={enCours}
        />

        <div style={{ gridColumn: '1 / -1' }}>
          <ActionsFormulaire
            surAnnuler={surAnnuler}
            texteBoutonPrincipal={bien ? 'Modifier' : 'Créer'}
            enCours={enCours}
          />
        </div>
      </Formulaire>
    </Modale>
  );
}
```

## Avantages de la Migration

### Réduction du Code
- **Avant:** ~150 lignes de JSX + CSS
- **Après:** ~50 lignes de JSX, 0 CSS spécifique

### Cohérence
- Design uniforme dans toute l'application
- Comportements standardisés
- Animations identiques

### Maintenabilité
- Changements centralisés
- Moins de duplication
- Plus facile à tester

### Accessibilité
- Labels correctement associés
- États focus gérés
- Navigation clavier

## Étapes de Migration

### 1. Identifier les Formulaires à Migrer
```bash
# Trouver tous les formulaires
find frontend/src -name "Formulaire*.jsx"
```

### 2. Importer les Composants
```jsx
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire } from '../communs';
```

### 3. Remplacer la Structure
- `<div className="modal-overlay">` → `<Modale>`
- `<form>` avec grille → `<Formulaire>`
- Chaque champ → `<ChampFormulaire>`
- Boutons d'action → `<ActionsFormulaire>`

### 4. Adapter la Logique
- Changer `onChange={(e) => ...e.target.value}` en `onChange={(val) => ...val}`
- Supprimer la gestion manuelle de `e.preventDefault()`

### 5. Supprimer le CSS Spécifique
- Garder uniquement les styles métier
- Supprimer les styles de formulaire génériques

### 6. Tester
- Vérifier la validation
- Tester le responsive
- Vérifier l'accessibilité

## Checklist de Migration

- [ ] Imports mis à jour
- [ ] Structure Modale convertie
- [ ] Formulaire converti en grille
- [ ] Tous les champs convertis
- [ ] Actions converties
- [ ] CSS spécifique supprimé
- [ ] Tests fonctionnels OK
- [ ] Responsive vérifié
- [ ] Accessibilité vérifiée

## Ordre de Migration Recommandé

1. Commencer par les formulaires simples (1-3 champs)
2. Puis les formulaires moyens (4-8 champs)
3. Enfin les formulaires complexes (9+ champs)

## Support

Pour toute question, voir:
- `README_COMPOSANTS.md` - Documentation complète
- `EXEMPLE_UTILISATION.jsx` - Exemple complet
- Composants existants dans `communs/`
