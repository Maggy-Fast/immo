# Module Gestion des Coopératives d'Habitat

## Vue d'ensemble

Module complet pour gérer les adhérents, cotisations, parcelles et notifications d'une coopérative d'habitat.

## Fonctionnalités implémentées

### 1. Gestion des Adhérents

**Endpoints:**
- `GET /api/adherents` - Liste avec filtres (statut, recherche)
- `POST /api/adherents` - Créer un adhérent (numéro auto: ADH001, ADH002...)
- `GET /api/adherents/{id}` - Détails avec historique paiements et parcelle
- `PUT /api/adherents/{id}` - Modifier
- `DELETE /api/adherents/{id}` - Supprimer (si pas de parcelle)
- `GET /api/adherents/{id}/eligibilite` - Vérifier éligibilité parcelle
- `GET /api/adherents/statistiques` - Stats globales

**Statuts:** actif, suspendu, radié

### 2. Gestion des Cotisations (Mode STRICT)

**Configuration:**
- `POST /api/cotisations/parametres` - Créer paramètre
- `GET /api/cotisations/parametres/actif` - Obtenir paramètre actif

**Échéances:**
- `POST /api/cotisations/generer-echeances` - Générer échéances pour un adhérent
- `GET /api/cotisations/echeances` - Liste avec filtres
- `PUT /api/cotisations/echeances/{id}/payer` - Enregistrer paiement
- `POST /api/cotisations/verifier-retards` - Vérifier et marquer retards
- `GET /api/cotisations/statistiques` - Stats financières

**Paramètres:**
```json
{
  "montant": 50000,
  "frequence": "mensuel",
  "jour_echeance": 5,
  "date_debut": "2026-03-01",
  "periode_grace_jours": 5,
  "max_echeances_retard": 3
}
```

**Statuts échéances:** a_payer, paye, en_retard

### 3. Suspension Automatique

Lorsqu'un adhérent dépasse `max_echeances_retard`, son statut passe automatiquement à "suspendu" et il devient non éligible pour une parcelle.

### 4. Gestion des Parcelles

**Endpoints:**
- `GET /api/parcelles-cooperative` - Liste avec filtres
- `POST /api/parcelles-cooperative` - Créer parcelle
- `GET /api/parcelles-cooperative/{id}` - Détails avec historique
- `PUT /api/parcelles-cooperative/{id}` - Modifier
- `PUT /api/parcelles-cooperative/{id}/attribuer` - Attribuer à un adhérent
- `PUT /api/parcelles-cooperative/{id}/retirer` - Retirer attribution
- `DELETE /api/parcelles-cooperative/{id}` - Supprimer (si disponible)
- `GET /api/parcelles-cooperative/statistiques` - Stats parcelles

**Statuts:** disponible, attribuee, vendue

**Attribution:**
- Vérifie automatiquement l'éligibilité (statut actif + 0 retard)
- Crée un historique d'attribution
- Bloque si adhérent non éligible

### 5. Historique et Audit

- Historique complet des attributions de parcelles
- Suivi des paiements par adhérent
- Compteur de retards automatique

## Structure de la base de données

### Tables créées:
- `adherents` - Membres de la coopérative
- `parametres_cotisation` - Configuration des cotisations
- `echeances` - Échéances de paiement
- `parcelles_cooperative` - Parcelles disponibles
- `historique_attributions` - Historique des attributions
- `notifications_whatsapp` - File de notifications (structure prête)
- `modeles_messages` - Templates de messages (structure prête)

## Installation

1. Exécuter la migration:
```bash
php artisan migrate
```

2. (Optionnel) Charger les données de test:
```bash
php artisan db:seed --class=CooperativeSeeder
```

## Workflow typique

### 1. Configuration initiale
```bash
POST /api/cotisations/parametres
{
  "montant": 50000,
  "frequence": "mensuel",
  "jour_echeance": 5,
  "date_debut": "2026-03-01",
  "periode_grace_jours": 5,
  "max_echeances_retard": 3
}
```

### 2. Ajouter un adhérent
```bash
POST /api/adherents
{
  "nom": "Diop",
  "prenom": "Amadou",
  "telephone": "771234567",
  "cin": "1234567890123",
  "email": "amadou.diop@example.com"
}
```

### 3. Générer ses échéances
```bash
POST /api/cotisations/generer-echeances
{
  "id_adherent": 1,
  "nombre_mois": 12
}
```

### 4. Enregistrer un paiement
```bash
PUT /api/cotisations/echeances/1/payer
{
  "montant_paye": 50000,
  "mode_paiement": "especes",
  "reference_paiement": "REF123"
}
```

### 5. Créer une parcelle
```bash
POST /api/parcelles-cooperative
{
  "numero": "PARC001",
  "surface": 300,
  "prix": 10000000,
  "description": "Zone A"
}
```

### 6. Attribuer une parcelle
```bash
PUT /api/parcelles-cooperative/1/attribuer
{
  "id_adherent": 1
}
```

## Tâche CRON recommandée

Exécuter quotidiennement pour vérifier les retards:
```bash
POST /api/cotisations/verifier-retards
```

## Fonctionnalités à implémenter (Phase 2)

- [ ] Notifications WhatsApp (structure prête)
- [ ] Génération de reçus PDF
- [ ] Paiement en ligne (Wave, Orange Money, Free Money)
- [ ] Tableau de bord avec graphiques
- [ ] Gestion des rôles et permissions
- [ ] Export Excel des données
- [ ] Frais de dossier
- [ ] Calcul automatique des pénalités

## Notes techniques

- Architecture DDD (Domain-Driven Design)
- Multi-tenancy activé
- Transactions DB pour opérations critiques
- Validation stricte des données
- Relations Eloquent optimisées
