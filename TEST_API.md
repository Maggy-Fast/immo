# ✅ Base de données configurée avec SQLite

## Ce qui a été fait

1. ✅ Changement de PostgreSQL vers SQLite dans `.env`
2. ✅ Création du fichier `database/database.sqlite`
3. ✅ Migrations exécutées avec succès
4. ✅ Utilisateur de test créé

## Prochaines étapes

### 1. Redémarrer les serveurs

**IMPORTANT**: Arrête les serveurs actuels (Ctrl+C dans chaque terminal) puis:

```bash
.\start-simple.ps1
```

Ou manuellement:
- Terminal 1: `cd backend && php artisan serve`
- Terminal 2: `cd frontend && npm run dev`

### 2. Tester l'application

Ouvre http://localhost:5173 dans ton navigateur.

### 3. Se connecter

Utilise ces identifiants:
- **Email**: `admin@demo.com`
- **Mot de passe**: `password`

## Vérification rapide

Les erreurs 500 devraient avoir disparu. Tu devrais maintenant voir:
- Page de connexion fonctionnelle
- Après connexion: tableau de bord avec les différentes sections

## Si tu veux revenir à PostgreSQL plus tard

1. Suis les instructions dans `ACTIVER_POSTGRESQL_MAINTENANT.md`
2. Active les extensions dans `C:\xampp\php\php.ini`
3. Crée la base `maggyfast_immo` dans pgAdmin
4. Change `DB_CONNECTION=sqlite` en `DB_CONNECTION=pgsql` dans `.env`
5. Relance les migrations

## Test des endpoints API

Une fois connecté, tu peux tester les endpoints:

```bash
# Obtenir le token après connexion (regarde dans les DevTools > Application > Local Storage)
# Puis teste:

curl http://127.0.0.1:8000/api/biens -H "Authorization: Bearer TON_TOKEN"
curl http://127.0.0.1:8000/api/proprietaires -H "Authorization: Bearer TON_TOKEN"
curl http://127.0.0.1:8000/api/locataires -H "Authorization: Bearer TON_TOKEN"
```

## Problèmes courants

### Les erreurs 500 persistent
- Vérifie que tu as bien redémarré les serveurs
- Vide le cache du navigateur (Ctrl+Shift+Delete)
- Vérifie les logs: `backend/storage/logs/laravel.log`

### Erreur "Unauthenticated"
- C'est normal si tu n'es pas connecté
- Connecte-toi d'abord avec admin@demo.com / password

### CORS errors
- Normalement résolues avec le middleware personnalisé
- Si elles persistent, vérifie que le backend écoute bien sur 127.0.0.1:8000
