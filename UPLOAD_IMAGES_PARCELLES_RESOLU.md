# Upload d'images dans Parcelles Coopérative - RÉSOLU

## Problème
L'upload d'images dans la section Parcelles Coopérative ne fonctionnait plus correctement.

## Causes identifiées
1. **Backend**: Utilisation de `move()` au lieu de `storeAs()` de Laravel
2. **Frontend**: Envoi des données en JSON au lieu de FormData pour les uploads
3. **API**: Content-Type non configuré pour multipart/form-data

## Corrections apportées

### Backend - ServiceParcelleCooperative.php
- **Avant**: Utilisation de `$donnees['photo']->move()` avec chemin absolu
- **Après**: Utilisation de `$donnees['photo']->storeAs()` avec système de fichiers Laravel
- Ajout de logs détaillés pour le debugging
- Gestion correcte des chemins avec `/storage/` prefix

```php
// Ancien code
$donnees['photo']->move($destinationPath, $nomFichier);
$donnees['photo'] = '/storage/uploads/parcelle-cooperative/' . $nomFichier;

// Nouveau code
$chemin = $donnees['photo']->storeAs('uploads/parcelle-cooperative', $nomFichier, 'public');
$donnees['photo'] = '/storage/' . $chemin;
```

### Frontend - FormulaireParcelleCooperative.jsx
- **Avant**: Envoi d'objet JSON avec `surSoumettre({ ...donnees })`
- **Après**: Création de FormData pour gérer les fichiers
- Ajout de tous les champs dans FormData
- Gestion conditionnelle de l'upload de photo

```javascript
// Nouveau code
const formData = new FormData();
formData.append('numero', donnees.numero);
formData.append('surface', donnees.surface);
formData.append('prix', donnees.prix);
formData.append('description', donnees.description || '');
if (donnees.photo && typeof donnees.photo === 'object') {
  formData.append('photo', donnees.photo);
}
surSoumission(formData);
```

### Frontend - serviceParcelleCooperative.js
- **Avant**: `clientHttp.post()` avec JSON
- **Après**: `clientHttp.post()` avec FormData et headers multipart
- Modification pour utiliser POST avec `_method=PUT` pour les updates (compatibilité FormData)

```javascript
// Création
async creer(formData) {
  const reponse = await clientHttp.post(BASE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return reponse.data;
}

// Modification
async modifier(id, formData) {
  const reponse = await clientHttp.post(`${BASE_URL}/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return reponse.data;
}
```

### Frontend - utiliserParcellesCooperative.js
- Adaptation des mutations pour accepter FormData
- `mutationModifier` utilise maintenant `{ id, formData }`

## Vérification
- Backend Laravel: ✅ http://127.0.0.1:8000
- Frontend Vite: ✅ http://localhost:5173
- Lien symbolique storage: ✅ Vérifié avec `php artisan storage:link`
- Dossiers d'upload: ✅ `storage/app/public/uploads/parcelle-cooperative/` accessible

## Test
1. Accéder à la page Parcelles Coopérative
2. Cliquer sur "Nouvelle parcelle"
3. Remplir le formulaire
4. Sélectionner une image (JPEG/PNG, max 2MB)
5. Soumettre le formulaire
6. Vérifier que l'image s'affiche correctement dans la carte de la parcelle

## Résultat
✅ L'upload d'images fonctionne maintenant correctement dans la section Parcelles Coopérative.
