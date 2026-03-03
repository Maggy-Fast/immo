# ✅ Connexion corrigée!

## Problème résolu

L'erreur 422 (Unprocessable Content) était causée par une incompatibilité entre le frontend et le backend:

### Avant:
- **Frontend envoyait**: `mot_de_passe`
- **Backend attendait**: `password`

### Après:
- ✅ Frontend corrigé pour envoyer `password`
- ✅ Route `/auth/moi` changée en `/auth/profil`
- ✅ Configuration Sanctum ajoutée pour localhost:5173

## Changements effectués

### 1. Frontend (`frontend/src/infrastructure/api/serviceAuth.js`)
```javascript
// Avant
{ email, mot_de_passe: motDePasse }

// Après
{ email, password: motDePasse }
```

### 2. Backend (`.env`)
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### 3. Cache vidé
```bash
php artisan config:clear
```

## 🚀 Pour tester maintenant

### 1. Redémarre le frontend

Dans le terminal frontend, appuie sur `Ctrl+C` puis:
```bash
npm run dev
```

Ou redémarre tout avec:
```bash
.\start-simple.ps1
```

### 2. Ouvre l'application

Va sur: http://localhost:5173

### 3. Connecte-toi

Utilise ces identifiants:
- **Email**: `admin@demo.com`
- **Mot de passe**: `password`

## ✅ Ce qui devrait fonctionner

- ✅ Formulaire de connexion
- ✅ Validation des champs
- ✅ Authentification réussie
- ✅ Redirection vers le tableau de bord
- ✅ Token stocké dans localStorage
- ✅ Accès aux pages protégées

## 🔍 Vérification dans le navigateur

Ouvre les DevTools (F12) et:

### Console
Tu ne devrais plus voir d'erreur 422.

### Network (Réseau)
- Requête POST `/api/auth/connexion` → Status 200
- Réponse contient `token` et `utilisateur`

### Application > Local Storage
Tu devrais voir:
- `auth_token`: Le token JWT
- `auth_user`: Les infos de l'utilisateur

## 🐛 Si ça ne fonctionne toujours pas

### 1. Vide le cache du navigateur
```
Ctrl+Shift+Delete → Vider le cache
```

### 2. Vérifie les logs Laravel
```bash
cd backend
tail -f storage/logs/laravel.log
```

### 3. Teste avec curl
```bash
curl -X POST http://127.0.0.1:8000/api/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password"}'
```

Tu devrais recevoir:
```json
{
  "token": "1|...",
  "utilisateur": {
    "id": 1,
    "nom": "Admin Demo",
    "email": "admin@demo.com",
    ...
  }
}
```

## 📝 Identifiants de test

- **Email**: admin@demo.com
- **Mot de passe**: password
- **Rôle**: admin
- **Tenant**: Demo Company

## 🎉 Prochaines étapes

Une fois connecté, tu pourras:
1. Voir le tableau de bord
2. Gérer les biens
3. Gérer les propriétaires et locataires
4. Créer des contrats
5. Gérer les loyers
6. Et toutes les autres fonctionnalités!

Bon test! 🚀
