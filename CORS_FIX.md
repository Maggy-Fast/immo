# Fix CORS - Solution Complète

## Problème résolu

Les erreurs CORS sont causées par le fait que le navigateur bloque les requêtes cross-origin du frontend (http://localhost:5173) vers le backend (http://127.0.0.1:8000).

## Solution appliquée

### 1. Middleware CORS personnalisé créé
Fichier: `backend/app/Http/Middleware/Cors.php`
- Gère les requêtes OPTIONS (preflight)
- Autorise les origines: `http://localhost:5173` et `http://127.0.0.1:5173`
- Supporte les credentials (cookies/tokens)
- Headers configurés correctement

### 2. Middleware activé dans `backend/bootstrap/app.php`
Le middleware personnalisé est appliqué à toutes les routes API.

### 3. Routes API corrigées
Ajout de `<?php` manquant dans `backend/routes/api.php`

## Pour appliquer les changements

### Étape 1: Vider le cache Laravel
```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Étape 2: Redémarrer les serveurs

#### Option A: Avec les scripts (recommandé)
```powershell
# Arrêter les serveurs
.\stop.ps1

# Redémarrer
.\start-simple.ps1
```

#### Option B: Manuellement
Si tu as démarré manuellement:
1. Terminal backend: `Ctrl+C` puis `php artisan serve`
2. Terminal frontend: `Ctrl+C` puis `npm run dev`

## Vérification

### Test 1: Vérifier que le backend répond
```bash
curl http://127.0.0.1:8000/api/biens
```
Tu devrais voir une erreur 401 (non authentifié) - c'est normal, ça veut dire que le backend fonctionne.

### Test 2: Tester depuis le frontend
1. Ouvre http://localhost:5173
2. Les erreurs CORS devraient disparaître
3. Tu devrais voir "Non authentifié" au lieu d'erreurs CORS

### Test 3: Se connecter
- Email: `admin@demo.com`
- Mot de passe: `password`

## Si le problème persiste

### Vérifier les logs Laravel
```bash
cd backend
tail -f storage/logs/laravel.log
```

### Vérifier dans le navigateur
1. Ouvre les DevTools (F12)
2. Onglet Network
3. Regarde les headers de la requête OPTIONS
4. Tu devrais voir `Access-Control-Allow-Origin` dans la réponse

### Tester avec curl
```bash
# Test preflight
curl -X OPTIONS http://127.0.0.1:8000/api/biens \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Tu devrais voir les headers CORS dans la réponse
```

## Pourquoi cette solution fonctionne

1. **Middleware personnalisé**: Plus de contrôle sur les headers CORS
2. **Gestion OPTIONS**: Les requêtes preflight sont traitées correctement
3. **Origin dynamique**: Le header Origin de la requête est respecté
4. **Credentials**: Support des cookies et tokens d'authentification
