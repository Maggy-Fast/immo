# Scripts de démarrage - Maggyfast Immo

## Scripts disponibles

### 1. `start-simple.ps1` (Recommandé)
Ouvre 2 terminaux séparés pour le backend et le frontend.

**Utilisation:**
```powershell
.\start-simple.ps1
```

**Avantages:**
- Facile à utiliser
- Logs visibles dans chaque terminal
- Facile à arrêter (fermer les fenêtres ou Ctrl+C)

**Arrêt:**
- Fermez les fenêtres de terminal
- Ou appuyez sur Ctrl+C dans chaque terminal

---

### 2. `start.ps1` (Avancé)
Démarre les deux serveurs en arrière-plan avec logs combinés.

**Utilisation:**
```powershell
.\start.ps1
```

**Arrêt:**
```powershell
.\stop.ps1
```

**Avantages:**
- Un seul terminal
- Logs combinés avec couleurs
- Arrêt propre avec script dédié

---

## URLs des serveurs

- **Backend Laravel:** http://127.0.0.1:8000
- **Frontend React:** http://localhost:5173

## Identifiants de test

- **Email:** admin@demo.com
- **Mot de passe:** password

## Prérequis

Avant de démarrer, assurez-vous d'avoir:

1. **Backend:**
   - PHP installé
   - Composer installé
   - PostgreSQL configuré et démarré
   - Extensions PHP activées (pdo_pgsql, pgsql)
   - Migrations exécutées: `cd backend && php artisan migrate`
   - Seeder exécuté: `php artisan db:seed --class=TenantSeeder`

2. **Frontend:**
   - Node.js installé
   - Dépendances installées: `cd frontend && npm install`

## Dépannage

### Erreur "could not find driver" (Backend)
Activez les extensions PostgreSQL dans `C:\xampp\php\php.ini`:
```ini
extension=pdo_pgsql
extension=pgsql
```

### Port déjà utilisé
Si les ports 8000 ou 5173 sont déjà utilisés:

**Backend (port 8000):**
```powershell
cd backend
php artisan serve --port=8001
```

**Frontend (port 5173):**
Le serveur Vite choisira automatiquement un autre port.

### Arrêt forcé
Si les serveurs ne s'arrêtent pas correctement:
```powershell
# Arrêter tous les processus PHP
Get-Process php | Stop-Process -Force

# Arrêter tous les processus Node
Get-Process node | Stop-Process -Force
```

## Commandes manuelles

Si vous préférez démarrer manuellement:

**Terminal 1 - Backend:**
```powershell
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```
