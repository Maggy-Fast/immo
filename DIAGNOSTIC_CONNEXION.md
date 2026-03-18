# Diagnostic Rapide - Erreur de Connexion

## ✅ Checklist de Vérification

### 1. Backend Laravel
- [ ] Le serveur tourne sur le port 8000
- [ ] La commande `php artisan serve` est active
- [ ] Pas d'erreurs dans le terminal backend
- [ ] Le fichier `.env` contient les bonnes URLs ngrok

### 2. Frontend Vite
- [ ] Le serveur tourne sur le port 5173
- [ ] La commande `npm run dev` est active
- [ ] Le fichier `.env` contient la bonne URL API ngrok

### 3. Ngrok
- [ ] Ngrok est lancé avec `ngrok start --all`
- [ ] Deux tunnels sont actifs (frontend + backend)
- [ ] Les URLs ngrok n'ont pas changé depuis le dernier lancement

### 4. Configuration Backend (.env)
```env
APP_URL=https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,8593-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app,cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app
SESSION_DOMAIN=.ngrok-free.app
```

### 5. Configuration Frontend (.env)
```env
VITE_API_URL=https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api
```

## 🔍 Tests de Diagnostic

### Test 1: Vérifier que le Backend Répond
```bash
curl https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api/auth/connexion
```
**Résultat attendu**: Erreur 422 (validation) ou 405 (méthode non autorisée)
**Problème si**: Timeout, 404, ou erreur de connexion

### Test 2: Tester la Connexion avec curl
```bash
curl -X POST https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api/auth/connexion \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@maggyfast.com","password":"password"}'
```
**Résultat attendu**: JSON avec token et utilisateur
**Problème si**: Erreur CORS, 401, ou 500

### Test 3: Vérifier CORS
Ouvrir la console du navigateur (F12) et exécuter:
```javascript
fetch('https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api/auth/connexion', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@maggyfast.com',
    password: 'password'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 🐛 Erreurs Courantes

### Erreur: "Network Error" ou "Failed to fetch"
**Cause**: Le backend n'est pas accessible
**Solution**: 
1. Vérifier que `php artisan serve` tourne
2. Vérifier que ngrok est lancé
3. Tester l'URL backend directement dans le navigateur

### Erreur: "CORS policy"
**Cause**: Configuration CORS incorrecte
**Solution**:
1. Vérifier `backend/config/cors.php`
2. Vérifier `SANCTUM_STATEFUL_DOMAINS` dans `.env`
3. Redémarrer le backend: `php artisan config:clear`

### Erreur: "401 Unauthorized"
**Cause**: Identifiants incorrects ou token invalide
**Solution**:
1. Vérifier les identifiants
2. Vider le localStorage du navigateur
3. Vérifier que l'utilisateur existe dans la base de données

### Erreur: "419 CSRF Token Mismatch"
**Cause**: Configuration Sanctum incorrecte
**Solution**:
1. Vérifier `SESSION_DOMAIN` dans `.env`
2. Vérifier `SANCTUM_STATEFUL_DOMAINS`
3. Redémarrer le backend

### Erreur: "500 Internal Server Error"
**Cause**: Erreur PHP côté serveur
**Solution**:
1. Vérifier les logs Laravel: `backend/storage/logs/laravel.log`
2. Vérifier la connexion à la base de données
3. Vérifier les permissions des fichiers

## 🔧 Commandes de Réparation Rapide

```powershell
# 1. Nettoyer les caches Laravel
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 2. Vérifier la configuration
php artisan config:show sanctum
php artisan config:show cors

# 3. Redémarrer le backend
# Ctrl+C pour arrêter, puis:
php artisan serve

# 4. Si les URLs ngrok ont changé
# Mettre à jour backend/.env et frontend/.env
# Puis relancer: .\restart-backend.ps1
```

## 📞 Informations à Fournir en Cas de Problème

1. **Message d'erreur exact** affiché dans l'interface
2. **Console du navigateur** (F12 > Console) - capture d'écran
3. **Onglet Network** (F12 > Network) - détails de la requête en échec
4. **Logs Laravel** (`backend/storage/logs/laravel.log` - dernières lignes)
5. **URLs ngrok actuelles** (depuis le terminal ngrok)

## 🎯 Solution Rapide pour le Testeur

Si rien ne fonctionne, utiliser le **bouton "Accès Démo"** sur la page de connexion qui permet d'accéder à l'application sans authentification backend.
