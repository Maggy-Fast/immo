# Instructions pour Résoudre l'Erreur de Connexion

## Problème
Le frontend ne se connecte pas au backend car il utilise l'ancienne configuration.

## Solution - Redémarrer le Frontend

### Étape 1: Arrêter le serveur frontend
Dans le terminal où tourne le frontend (celui qui affiche "Frontend React"), appuyez sur:
```
Ctrl + C
```

### Étape 2: Redémarrer le frontend
Dans le même terminal, tapez:
```powershell
cd frontend
npm run dev
```

### Étape 3: Attendre le démarrage
Attendez que vous voyiez:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Étape 4: Vérifier la configuration
Le frontend devrait maintenant utiliser:
- **API Backend**: https://eb85-2001-4278-1c-b947-1d3c-5977-d7ad-afe1.ngrok-free.app/api

### Étape 5: Tester
1. Demandez à votre testeur de rafraîchir la page (F5)
2. Il devrait maintenant pouvoir se connecter avec:
   - Email: `admin@demo.com`
   - Password: `password`

## URLs à Partager
- **URL Frontend (pour le testeur)**: https://421a-2001-4278-1c-b947-1d3c-5977-d7ad-afe1.ngrok-free.app
- **URL Backend (configurée automatiquement)**: https://eb85-2001-4278-1c-b947-1d3c-5977-d7ad-afe1.ngrok-free.app/api

## Vérification
Pour vérifier que tout fonctionne, ouvrez la console du navigateur (F12) et vérifiez qu'il n'y a plus d'erreurs "ERR_CONNECTION_REFUSED".

## Note Importante
Chaque fois que vous modifiez le fichier `frontend/.env`, vous DEVEZ redémarrer le serveur frontend avec `Ctrl+C` puis `npm run dev`.
