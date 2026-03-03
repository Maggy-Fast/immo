# Système de Thème - MaggyFast Immo

## Vue d'ensemble

L'application supporte deux thèmes : **Clair** (par défaut) et **Sombre**.

## Utilisation

### Hook `utiliserTheme`

```javascript
import { utiliserTheme } from './application/hooks/utiliserTheme';

function MonComposant() {
    const { theme, estSombre, basculerTheme, definirTheme } = utiliserTheme();
    
    return (
        <button onClick={basculerTheme}>
            Mode: {theme}
        </button>
    );
}
```

### Composant `BoutonTheme`

Un bouton prêt à l'emploi pour basculer entre les thèmes :

```javascript
import BoutonTheme from './presentation/composants/communs/BoutonTheme';

<BoutonTheme />
```

## Variables CSS

Toutes les couleurs utilisent des variables CSS qui s'adaptent automatiquement au thème :

```css
.mon-element {
    background-color: var(--couleur-blanc);
    color: var(--couleur-noir);
    border: var(--bordure-fine);
}
```

## Thème Clair

- Fond : `#FAFAFA`
- Cartes : `#FFFFFF`
- Texte : `#0A0A0A`
- Primaire : `#C41E3A` (Rouge)

## Thème Sombre

- Fond : `#1A1A1A`
- Cartes : `#0F0F0F`
- Texte : `#FFFFFF`
- Primaire : `#E63946` (Rouge plus clair)

## Persistance

Le thème choisi est automatiquement sauvegardé dans `localStorage` et restauré au rechargement de la page.

## Préférence Système

Si aucun thème n'est sauvegardé, l'application détecte automatiquement la préférence système de l'utilisateur.

## Transitions

Tous les éléments ont des transitions fluides lors du changement de thème pour une expérience utilisateur agréable.
