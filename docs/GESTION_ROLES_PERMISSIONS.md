# Gestion des Rôles et Permissions

## Vue d'ensemble

Système complet de gestion des rôles et permissions manipulable depuis l'espace super admin. Le système permet de créer des rôles personnalisés et d'assigner des permissions granulaires.

## Rôles par défaut

### 1. Super Administrateur (super_admin)
- Accès complet au système
- Gestion des rôles et permissions
- Gestion des utilisateurs
- Tous les modules (coopérative, immobilier, etc.)
- **Non modifiable** (rôle système)

### 2. Administrateur (admin)
- Gestion opérationnelle complète
- Tous les modules sauf gestion des rôles
- Création et modification des utilisateurs
- **Non modifiable** (rôle système)

### 3. Gestionnaire (gestionnaire)
- Consultation et modification
- Pas de suppression
- Pas d'accès aux paramètres système
- **Non modifiable** (rôle système)

### 4. Agent (agent)
- Consultation uniquement
- Aucune modification
- Accès en lecture seule
- **Non modifiable** (rôle système)

## Modules et Permissions

### Module Coopérative

#### Adhérents
- `adherents.voir` - Voir les adhérents
- `adherents.creer` - Créer des adhérents
- `adherents.modifier` - Modifier des adhérents
- `adherents.supprimer` - Supprimer des adhérents

#### Cotisations
- `cotisations.voir` - Voir les cotisations
- `cotisations.creer` - Créer des cotisations
- `cotisations.modifier` - Modifier des cotisations
- `cotisations.supprimer` - Supprimer des cotisations
- `cotisations.parametres` - Gérer les paramètres de cotisation

#### Parcelles
- `parcelles.voir` - Voir les parcelles
- `parcelles.creer` - Créer des parcelles
- `parcelles.modifier` - Modifier des parcelles
- `parcelles.supprimer` - Supprimer des parcelles
- `parcelles.attribuer` - Attribuer des parcelles

### Module Immobilier

#### Biens
- `biens.voir` - Voir les biens
- `biens.creer` - Créer des biens
- `biens.modifier` - Modifier des biens
- `biens.supprimer` - Supprimer des biens

#### Contrats
- `contrats.voir` - Voir les contrats
- `contrats.creer` - Créer des contrats
- `contrats.modifier` - Modifier des contrats
- `contrats.supprimer` - Supprimer des contrats

#### Loyers
- `loyers.voir` - Voir les loyers
- `loyers.creer` - Créer des loyers
- `loyers.modifier` - Modifier des loyers

### Module Paramètres

#### Utilisateurs
- `utilisateurs.voir` - Voir les utilisateurs
- `utilisateurs.creer` - Créer des utilisateurs
- `utilisateurs.modifier` - Modifier des utilisateurs
- `utilisateurs.supprimer` - Supprimer des utilisateurs

#### Rôles et Permissions (Super Admin uniquement)
- `roles.voir` - Voir les rôles
- `roles.creer` - Créer des rôles
- `roles.modifier` - Modifier des rôles
- `roles.supprimer` - Supprimer des rôles
- `permissions.gerer` - Gérer les permissions

### Module Rapports

- `statistiques.voir` - Voir les statistiques
- `rapports.generer` - Générer des rapports

## API Endpoints

### Rôles

```bash
# Lister tous les rôles
GET /api/roles

# Obtenir un rôle spécifique
GET /api/roles/{id}

# Créer un nouveau rôle
POST /api/roles
{
  "nom": "gestionnaire_parcelles",
  "libelle": "Gestionnaire de Parcelles",
  "description": "Gestion des parcelles uniquement",
  "permissions": [1, 2, 3, 9, 10, 11, 12, 13]
}

# Modifier un rôle
PUT /api/roles/{id}
{
  "libelle": "Nouveau libellé",
  "description": "Nouvelle description",
  "permissions": [1, 2, 3]
}

# Supprimer un rôle
DELETE /api/roles/{id}

# Assigner des permissions à un rôle
POST /api/roles/{id}/permissions
{
  "permissions": [1, 2, 3, 4, 5]
}
```

### Permissions

```bash
# Lister toutes les permissions (groupées par module)
GET /api/roles/permissions

# Obtenir les permissions d'un rôle
GET /api/roles/{id}/permissions
```

## Utilisation Frontend

### Hook usePermissions

```javascript
import { usePermissions } from '../application/hooks/usePermissions';

function MonComposant() {
    const { 
        hasPermission, 
        hasAnyPermission, 
        hasAllPermissions,
        isSuperAdmin,
        isAdmin,
        permissions,
        role,
        roleLibelle
    } = usePermissions();

    // Vérifier une permission
    if (hasPermission('adherents.creer')) {
        // Afficher le bouton créer
    }

    // Vérifier plusieurs permissions (OR)
    if (hasAnyPermission(['adherents.creer', 'adherents.modifier'])) {
        // L'utilisateur a au moins une de ces permissions
    }

    // Vérifier plusieurs permissions (AND)
    if (hasAllPermissions(['adherents.voir', 'adherents.modifier'])) {
        // L'utilisateur a toutes ces permissions
    }

    // Vérifier si super admin
    if (isSuperAdmin()) {
        // Afficher menu admin
    }
}
```

### Composant ProtectionPermission

```javascript
import ProtectionPermission from '../composants/communs/ProtectionPermission';

function MaPage() {
    return (
        <div>
            {/* Afficher uniquement si l'utilisateur a la permission */}
            <ProtectionPermission permission="adherents.creer">
                <button>Créer un adhérent</button>
            </ProtectionPermission>

            {/* Avec plusieurs permissions (OR) */}
            <ProtectionPermission 
                permission={['adherents.creer', 'adherents.modifier']}
            >
                <button>Actions</button>
            </ProtectionPermission>

            {/* Avec plusieurs permissions (AND) */}
            <ProtectionPermission 
                permission={['adherents.voir', 'adherents.modifier']}
                requireAll={true}
            >
                <button>Modifier</button>
            </ProtectionPermission>

            {/* Avec fallback */}
            <ProtectionPermission 
                permission="adherents.supprimer"
                fallback={<p>Vous n'avez pas les droits</p>}
            >
                <button>Supprimer</button>
            </ProtectionPermission>
        </div>
    );
}
```

## Utilisation Backend

### Middleware CheckPermission

```php
// Dans routes/api.php
Route::middleware(['auth:sanctum', 'permission:adherents.creer'])->group(function () {
    Route::post('/adherents', [AdherentController::class, 'store']);
});

// Avec plusieurs permissions (OR)
Route::middleware(['auth:sanctum', 'permission:adherents.creer,adherents.modifier'])->group(function () {
    Route::post('/adherents', [AdherentController::class, 'store']);
});
```

### Dans les Controllers

```php
use Illuminate\Http\Request;

public function store(Request $request)
{
    // Vérifier une permission
    if (!$request->user()->hasPermission('adherents.creer')) {
        return response()->json([
            'success' => false,
            'message' => 'Permission refusée'
        ], 403);
    }

    // Vérifier si super admin
    if ($request->user()->isSuperAdmin()) {
        // Logique spéciale pour super admin
    }

    // Vérifier plusieurs permissions
    if ($request->user()->hasAnyPermission(['adherents.creer', 'adherents.modifier'])) {
        // Logique
    }
}
```

## Interface de Gestion

L'interface de gestion des rôles est accessible uniquement aux super admins via :

**URL:** `/roles`

**Fonctionnalités:**
- Liste de tous les rôles avec statistiques
- Création de nouveaux rôles personnalisés
- Modification des rôles (sauf rôles système)
- Suppression des rôles (sauf rôles système et rôles assignés)
- Gestion des permissions par module
- Sélection/désélection en masse par module

## Règles de Sécurité

1. **Rôles système** : Les 4 rôles par défaut ne peuvent pas être modifiés ou supprimés
2. **Super admin** : Toujours toutes les permissions, bypass tous les checks
3. **Suppression** : Un rôle ne peut être supprimé s'il est assigné à des utilisateurs
4. **Permissions** : Les permissions sont vérifiées côté backend ET frontend
5. **Token** : Les informations de rôle sont incluses dans le token JWT

## Migration des utilisateurs existants

Lors de la migration, tous les utilisateurs avec `role='admin'` sont automatiquement convertis en `super_admin` avec le nouveau système.

## Ajout de nouvelles permissions

Pour ajouter de nouvelles permissions, créer une migration :

```php
DB::table('permissions')->insert([
    'nom' => 'nouveau_module.action',
    'libelle' => 'Description de l\'action',
    'module' => 'nouveau_module',
    'created_at' => now(),
    'updated_at' => now(),
]);
```

## Notes techniques

- Architecture: RBAC (Role-Based Access Control)
- Relations: Many-to-Many entre Roles et Permissions
- Cascade: Suppression d'un rôle supprime ses relations
- Soft Delete: Non implémenté (suppression définitive)
- Cache: Non implémenté (à ajouter pour optimisation)

## Prochaines améliorations

- [ ] Cache des permissions pour optimiser les performances
- [ ] Historique des modifications de rôles
- [ ] Export/Import de configurations de rôles
- [ ] Permissions temporaires avec date d'expiration
- [ ] Permissions au niveau des données (row-level security)
- [ ] Interface de gestion des utilisateurs avec assignation de rôles
