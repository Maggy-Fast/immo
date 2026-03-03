# Maggyfast Immo — Plan d'Implémentation

Plateforme SaaS de gestion immobilière — **Monorepo** · **TDD** · **Clean Architecture**

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 11 (PHP 8.3) |
| Frontend | React 18 + Vite |
| Base de données | PostgreSQL 16 |
| PDF | DomPDF |
| IA Documents | Claude API |
| Carte | Leaflet + OpenStreetMap |
| Paiements | Wave / Orange Money (stubs) |
| Auth | Laravel Sanctum |

## Charte Graphique

| Token | Valeur |
|---|---|
| `--couleur-primaire` | `#E4403D` |
| `--couleur-primaire-sombre` | `#C0352F` |
| `--couleur-primaire-claire` | `#F06B68` |
| `--couleur-noir` | `#1A1A1A` |
| `--couleur-gris-sombre` | `#2D2D2D` |
| `--couleur-gris` | `#6B7280` |
| `--couleur-fond` | `#F9FAFB` |
| `--couleur-blanc` | `#FFFFFF` |
| Typographie | Inter (Google Fonts) |

---

## Architecture Monorepo

```
e:\MaggyFast\imo\
├── backend/                    # Laravel 11
│   ├── app/
│   │   ├── Domaine/            # Entités métier, Value Objects, Interfaces
│   │   ├── Application/        # Use Cases (Services applicatifs)
│   │   ├── Infrastructure/     # Repositories Eloquent, Services externes
│   │   └── Presentation/       # Controllers API, Resources, Requests
│   ├── database/migrations/
│   ├── routes/api.php
│   └── tests/
│       ├── Unit/               # Tests domaine & application
│       └── Feature/            # Tests endpoints API
├── frontend/                   # React 18 + Vite
│   ├── src/
│   │   ├── domaine/            # Entités, interfaces, règles métier
│   │   ├── application/        # Hooks métier, cas d'utilisation
│   │   ├── infrastructure/     # Services API (axios), stockage
│   │   └── presentation/       # Composants UI, pages, layouts
│   └── tests/                  # Tests unitaires React
└── docs/                       # Documentation technique
```

---

## Proposed Changes

### Phase 1 — Initialisation Monorepo

#### [NEW] `backend/` — Projet Laravel

- `composer create-project laravel/laravel backend`
- Dépendances : `sanctum`, `spatie/laravel-permission`, `barryvdh/laravel-dompdf`
- Configuration PostgreSQL dans `.env`
- Architecture : `Domaine/`, `Application/`, `Infrastructure/`, `Presentation/`

#### [NEW] `frontend/` — Projet React Vite

- `npx -y create-vite@latest ./ -- --template react`
- Dépendances : `react-router-dom`, `axios`, `leaflet`, `react-leaflet`, `recharts`, `lucide-react`, `@tanstack/react-query`
- Architecture Clean : `domaine/`, `application/`, `infrastructure/`, `presentation/`

---

### Phase 2 — Schéma PostgreSQL (17 tables)

Tables avec isolation `id_tenant` :

`tenants`, `utilisateurs`, `biens`, `proprietaires`, `locataires`, `contrats`, `loyers`, `quittances`, `lotissements`, `parcelles`, `partenariats`, `depenses_partenariat`, `documents_fonciers`, `travaux`, `commissions`, `abonnements`, `journaux_audit`

> Détails complets dans [architecture_technique.md](file:///C:/Users/MAHDI%20HIGH%20TECH/.gemini/antigravity/brain/48080974-952f-4e42-b9c8-794c247a36d0/architecture_technique.md)

---

### Phase 3 — Backend API (TDD)

Cycle strict pour chaque module : **Red → Green → Refactor**

| Module | Endpoints |
|---|---|
| Authentification | POST connexion, inscription, deconnexion |
| Biens | CRUD /api/biens |
| Propriétaires | CRUD /api/proprietaires |
| Locataires | CRUD /api/locataires |
| Contrats | CRUD /api/contrats |
| Loyers | CRUD /api/loyers + paiement |
| Quittances | GET /api/quittances/{id}/pdf |
| Lotissements | CRUD /api/lotissements |
| Parcelles | CRUD /api/parcelles |
| Partenariats | CRUD + calcul répartition |
| Documents fonciers | Upload/download chiffré |
| Travaux | CRUD /api/travaux |
| Commissions | CRUD /api/commissions |
| Tableau de bord | GET /api/tableau-de-bord |
| IA Documents | POST /api/ia/generer-document |
| Carte | GET /api/carte/biens |
| Admin SaaS | CRUD tenants + abonnements |

---

### Phase 4 — Frontend React (Clean Architecture)

Chaque page suit la séparation stricte :
- `presentation/` → Composants UI purs (affichage uniquement)
- `application/` → Hooks, état, orchestration
- `domaine/` → Entités, règles de validation
- `infrastructure/` → Appels API axios

> Détails complets dans [directives_developpement.md](file:///C:/Users/MAHDI%20HIGH%20TECH/.gemini/antigravity/brain/48080974-952f-4e42-b9c8-794c247a36d0/directives_developpement.md)

---

## Verification Plan

### Tests Automatisés (TDD)

```bash
# Backend — tests unitaires et feature
cd e:\MaggyFast\imo\backend && php artisan test

# Frontend — build sans erreurs
cd e:\MaggyFast\imo\frontend && npm run build
```

### Vérification Manuelle

- Navigation complète via browser
- Test des endpoints API
- Carte Leaflet avec marqueurs
