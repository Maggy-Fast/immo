# Activer PostgreSQL dans PHP (XAMPP)

## Étape 1: Éditer php.ini

Ouvre le fichier: `C:\xampp\php\php.ini`

Cherche ces lignes (utilise Ctrl+F):
```
;extension=pdo_pgsql
;extension=pgsql
```

Retire les points-virgules (`;`) pour les décommenter:
```
extension=pdo_pgsql
extension=pgsql
```

## Étape 2: Sauvegarder et redémarrer

1. Sauvegarde le fichier `php.ini`
2. Si tu as un serveur Apache en cours, redémarre-le depuis XAMPP Control Panel
3. Ferme et rouvre ton terminal PowerShell

## Étape 3: Vérifier l'activation

Dans le terminal, exécute:
```bash
php -m | findstr pgsql
```

Tu devrais voir:
```
pdo_pgsql
pgsql
```

## Étape 4: Créer la base de données PostgreSQL

1. Ouvre pgAdmin ou psql
2. Crée la base de données:
```sql
CREATE DATABASE maggyfast_immo;
```

## Étape 5: Configurer le mot de passe dans .env

Si ton utilisateur PostgreSQL a un mot de passe, ajoute-le dans `backend/.env`:
```env
DB_PASSWORD=ton_mot_de_passe
```

## Étape 6: Exécuter les migrations

```bash
cd backend
php artisan migrate
php artisan db:seed --class=TenantSeeder
```

## Alternative rapide: Utiliser PostgreSQL avec Docker

Si tu préfères ne pas modifier XAMPP, tu peux utiliser Docker:

```bash
docker run --name maggyfast-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=maggyfast_immo -p 5432:5432 -d postgres:15
```

Puis dans `.env`:
```env
DB_PASSWORD=password
```

## Dépannage

### Erreur "could not find driver"
- Vérifie que les extensions sont bien décommentées dans php.ini
- Redémarre ton terminal
- Vérifie avec `php -m | findstr pgsql`

### Erreur de connexion
- Vérifie que PostgreSQL est démarré
- Vérifie le port (5432 par défaut)
- Vérifie le nom d'utilisateur et mot de passe
- Vérifie que la base de données existe

### Extensions manquantes
Si les fichiers `php_pdo_pgsql.dll` et `php_pgsql.dll` n'existent pas dans `C:\xampp\php\ext\`, tu devras:
1. Télécharger une version de PHP qui les inclut
2. Ou utiliser Docker pour PostgreSQL
