# Guide de Test - Résolution Erreur de Connexion

## Problème Identifié
L'erreur "erreur de connexion" était causée par une mauvaise configuration CORS/Sanctum pour ngrok.

## Corrections Appliquées

### 1. Configuration Backend (.env)
- ✅ Ajout des domaines ngrok dans `SANCTUM_STATEFUL_DOMAINS`
- ✅ Mise à jour de `APP_URL` avec l'URL ngrok backend
- ✅ Configuration de `SESSION_DOMAIN` pour ngrok
- ✅ Cache de configuration vidé

### 2. URLs Actuelles
- **Frontend**: https://8593-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app
- **Backend API**: https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api

## Instructions pour le Testeur

### Étape 1: Vider le Cache du Navigateur
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Application" ou "Stockage"
3. Supprimer tout le localStorage
4. Fermer et rouvrir le navigateur

### Étape 2: Tester la Connexion

#### Option A: Via l'Application
1. Aller sur: https://8593-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app
2. Utiliser les identifiants de test:
   - Email: `superadmin@maggyfast.com` OU `admin@demo.com`
   - Mot de passe: `password`

#### Option B: Via la Page de Test
1. Ouvrir: `test-connexion.html` dans un navigateur
2. Cliquer sur "Tester Connexion"
3. Vérifier le résultat

### Étape 3: Vérifier les Erreurs
Si l'erreur persiste, ouvrir la console du navigateur (F12) et noter:
- Le message d'erreur exact
- Le code de statut HTTP (404, 500, etc.)
- Les détails de la requête réseau

## Comptes de Test Disponibles

### Super Administrateur
- Email: `superadmin@maggyfast.com`
- Mot de passe: `password`
- Rôle: Super Administrateur

### Admin Demo
- Email: `admin@demo.com`
- Mot de passe: `password`
- Rôle: Administrateur

## Accès Démo (Sans Connexion)
Si la connexion ne fonctionne toujours pas, utiliser le bouton "Accès Démo" sur la page de connexion.

## Problèmes Connus

### Erreur CORS
Si vous voyez "CORS policy" dans la console:
- Le backend doit être redémarré
- Vérifier que les URLs ngrok n'ont pas changé

### Erreur 401 Unauthorized
- Vérifier que les identifiants sont corrects
- Vider le cache du navigateur

### Erreur de Réseau
- Vérifier que ngrok est bien lancé
- Vérifier que le backend Laravel tourne sur le port 8000
- Vérifier que le frontend Vite tourne sur le port 5173

## Commandes de Redémarrage (Pour le Développeur)

```powershell
# Redémarrer tout avec ngrok
.\start-ngrok-complet.ps1

# Ou manuellement:
# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Ngrok
ngrok start --all --config ngrok.yml
```

## Support
En cas de problème persistant, fournir:
1. Capture d'écran de l'erreur
2. Console du navigateur (F12 > Console)
3. Onglet Réseau (F12 > Network) avec la requête en échec
