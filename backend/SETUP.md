# Configuration Backend Laravel - Maggyfast Immo

## Prérequis

- PHP 8.2+
- Composer
- PostgreSQL ou SQLite (pour dev)
- Laravel 11

## Installation

### 1. Installer les dépendances

```bash
cd backend
composer install
```

### 2. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

Configurer la base de données dans `.env`:

```env
DB_CONNECTION=sqlite
# ou pour PostgreSQL:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=maggyfast_immo
# DB_USERNAME=postgres
# DB_PASSWORD=
```

### 3. Générer la clé d'application

```bash
php artisan key:generate
```

### 4. Exécuter les migrations

```bash
php artisan migrate
```

Si vous avez des erreurs avec la migration de mise à jour, vous pouvez:

```bash
php artisan migrate:fresh
```

### 5. Créer un tenant et utilisateur de test

```bash
php artisan db:seed --class=TenantSeeder
```

Cela créera:
- **Email**: `admin@demo.com`
- **Mot de passe**: `password`

### 6. Démarrer le serveur

```bash
php artisan serve
```

Le backend sera accessible sur `http://127.0.0.1:8000`

## Tester l'API

### 1. Connexion

```bash
curl -X POST http://127.0.0.1:8000/api/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password"}'
```

Réponse:
```json
{
  "token": "1|abc123...",
  "utilisateur": {
    "id": 1,
    "nom": "Admin Demo",
    "email": "admin@demo.com",
    "role": "admin"
  }
}
```

### 2. Utiliser le token pour les requêtes protégées

```bash
curl -X GET http://127.0.0.1:8000/api/biens \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Endpoints disponibles

### Authentification
- `POST /api/auth/connexion` - Se connecter
- `GET /api/auth/profil` - Obtenir le profil (🔒)
- `POST /api/auth/deconnexion` - Se déconnecter (🔒)

### Biens
- `GET /api/biens` - Lister les biens (🔒)
- `POST /api/biens` - Créer un bien (🔒)
- `GET /api/biens/{id}` - Détail d'un bien (🔒)
- `PUT /api/biens/{id}` - Modifier un bien (🔒)
- `DELETE /api/biens/{id}` - Supprimer un bien (🔒)

### Propriétaires
- `GET /api/proprietaires` - Lister les propriétaires (🔒)
- `POST /api/proprietaires` - Créer un propriétaire (🔒)
- `GET /api/proprietaires/{id}` - Détail d'un propriétaire (🔒)
- `PUT /api/proprietaires/{id}` - Modifier un propriétaire (🔒)
- `DELETE /api/proprietaires/{id}` - Supprimer un propriétaire (🔒)

### Locataires
- `GET /api/locataires` - Lister les locataires (🔒)
- `POST /api/locataires` - Créer un locataire (🔒)
- `GET /api/locataires/{id}` - Détail d'un locataire (🔒)
- `PUT /api/locataires/{id}` - Modifier un locataire (🔒)
- `DELETE /api/locataires/{id}` - Supprimer un locataire (🔒)

### Contrats
- `GET /api/contrats` - Lister les contrats (🔒)
- `POST /api/contrats` - Créer un contrat (🔒)
- `GET /api/contrats/{id}` - Détail d'un contrat (🔒)
- `PUT /api/contrats/{id}` - Modifier un contrat (🔒)
- `DELETE /api/contrats/{id}` - Supprimer un contrat (🔒)

### Loyers
- `GET /api/loyers` - Lister les loyers (🔒)
- `POST /api/loyers` - Créer un loyer (🔒)
- `GET /api/loyers/{id}` - Détail d'un loyer (🔒)
- `PUT /api/loyers/{id}` - Modifier un loyer (🔒)
- `PUT /api/loyers/{id}/payer` - Enregistrer un paiement (🔒)
- `DELETE /api/loyers/{id}` - Supprimer un loyer (🔒)

### Lotissements
- `GET /api/lotissements` - Lister les lotissements (🔒)
- `POST /api/lotissements` - Créer un lotissement (🔒)
- `GET /api/lotissements/{id}` - Détail d'un lotissement (🔒)
- `PUT /api/lotissements/{id}` - Modifier un lotissement (🔒)
- `DELETE /api/lotissements/{id}` - Supprimer un lotissement (🔒)

### Parcelles
- `GET /api/parcelles` - Lister les parcelles (🔒)
- `POST /api/parcelles` - Créer une parcelle (🔒)
- `GET /api/parcelles/{id}` - Détail d'une parcelle (🔒)
- `PUT /api/parcelles/{id}` - Modifier une parcelle (🔒)
- `DELETE /api/parcelles/{id}` - Supprimer une parcelle (🔒)

### Partenariats
- `GET /api/partenariats` - Lister les partenariats (🔒)
- `POST /api/partenariats` - Créer un partenariat (🔒)
- `GET /api/partenariats/{id}` - Détail d'un partenariat (🔒)
- `GET /api/partenariats/{id}/calculer-repartition` - Calculer la répartition (🔒)
- `PUT /api/partenariats/{id}` - Modifier un partenariat (🔒)
- `DELETE /api/partenariats/{id}` - Supprimer un partenariat (🔒)

🔒 = Authentification requise (Bearer Token)

## Architecture

Le backend suit la Clean Architecture:

```
app/
├── Domaine/           # Entités métier pures
│   └── Entities/
├── Application/       # Services et cas d'utilisation
│   └── Services/
├── Infrastructure/    # Implémentations techniques
│   └── Persistence/
└── Presentation/      # Contrôleurs API
    └── Controllers/
```

## Dépannage

### Erreur "Class not found"
```bash
composer dump-autoload
```

### Erreur de migration
```bash
php artisan migrate:fresh --seed
```

### Problème de permissions (Linux/Mac)
```bash
chmod -R 775 storage bootstrap/cache
```
