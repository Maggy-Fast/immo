# Démarrage Rapide - Module Coopérative

## Installation

### 1. Exécuter les migrations
```bash
cd backend
php artisan migrate
```

### 2. (Optionnel) Charger les données de test
```bash
php artisan db:seed --class=CooperativeSeeder
```

## Premiers pas

### 1. Configurer les cotisations

**Endpoint:** `POST /api/cotisations/parametres`

**Exemple:**
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

**Réponse:**
```json
{
  "id": 1,
  "montant": "50000.00",
  "frequence": "mensuel",
  "jour_echeance": 5,
  "date_debut": "2026-03-01",
  "periode_grace_jours": 5,
  "max_echeances_retard": 3,
  "actif": true
}
```

### 2. Créer un adhérent

**Endpoint:** `POST /api/adherents`

**Exemple:**
```json
{
  "nom": "Diop",
  "prenom": "Amadou",
  "telephone": "771234567",
  "cin": "1234567890123",
  "email": "amadou.diop@example.com",
  "adresse": "Dakar, Sénégal"
}
```

**Réponse:**
```json
{
  "id": 1,
  "numero": "ADH001",
  "nom": "Diop",
  "prenom": "Amadou",
  "telephone": "771234567",
  "statut": "actif",
  "echeances_en_retard": 0,
  "date_adhesion": "2026-03-03"
}
```

### 3. Générer les échéances

**Endpoint:** `POST /api/cotisations/generer-echeances`

**Exemple:**
```json
{
  "id_adherent": 1,
  "nombre_mois": 12
}
```

**Réponse:**
```json
{
  "message": "12 échéance(s) générée(s)",
  "echeances": [
    {
      "id": 1,
      "date_echeance": "2026-03-05",
      "montant": "50000.00",
      "statut": "a_payer"
    }
  ]
}
```

### 4. Enregistrer un paiement

**Endpoint:** `PUT /api/cotisations/echeances/1/payer`

**Exemple:**
```json
{
  "montant_paye": 50000,
  "mode_paiement": "especes",
  "reference_paiement": "REF20260303001"
}
```

**Réponse:**
```json
{
  "message": "Paiement enregistré avec succès",
  "echeance": {
    "id": 1,
    "statut": "paye",
    "date_paiement": "2026-03-03",
    "montant_paye": "50000.00",
    "mode_paiement": "especes"
  }
}
```

### 5. Créer une parcelle

**Endpoint:** `POST /api/parcelles-cooperative`

**Exemple:**
```json
{
  "numero": "PARC001",
  "surface": 300,
  "prix": 10000000,
  "description": "Parcelle située en zone A"
}
```

### 6. Attribuer une parcelle

**Endpoint:** `PUT /api/parcelles-cooperative/1/attribuer`

**Exemple:**
```json
{
  "id_adherent": 1
}
```

**Réponse (succès):**
```json
{
  "message": "Parcelle attribuée avec succès",
  "parcelle": {
    "id": 1,
    "numero": "PARC001",
    "statut": "attribuee",
    "id_adherent": 1,
    "date_attribution": "2026-03-03"
  }
}
```

**Réponse (erreur - non éligible):**
```json
{
  "message": "Adhérent non éligible: 2 échéance(s) en retard"
}
```

## Endpoints de consultation

### Tableau de bord
```bash
GET /api/cooperative/tableau-bord
```

**Réponse:**
```json
{
  "adherents": {
    "total_adherents": 5,
    "actifs": 4,
    "suspendus": 1,
    "radies": 0,
    "avec_parcelle": 2
  },
  "cotisations": {
    "total_encaisse": 600000,
    "total_en_attente": 200000,
    "total_en_retard": 100000,
    "nb_echeances_payees": 12,
    "nb_echeances_retard": 2
  },
  "parcelles": {
    "total_parcelles": 10,
    "disponibles": 7,
    "attribuees": 2,
    "vendues": 1
  },
  "resume": {
    "taux_paiement": 85.71,
    "taux_attribution": 20.00
  }
}
```

### Liste des adhérents
```bash
GET /api/adherents?statut=actif&recherche=Diop
```

### Liste des échéances
```bash
GET /api/cotisations/echeances?statut=en_retard&id_adherent=1
```

### Vérifier éligibilité
```bash
GET /api/adherents/1/eligibilite
```

**Réponse:**
```json
{
  "eligible": true,
  "raisons": []
}
```

## Tâche automatique (CRON)

Ajouter dans le scheduler Laravel (`app/Console/Kernel.php`):

```php
protected function schedule(Schedule $schedule)
{
    // Vérifier les retards tous les jours à 6h
    $schedule->call(function () {
        app(ServiceCotisation::class)->verifierRetards();
    })->dailyAt('06:00');
}
```

Ou appeler manuellement:
```bash
POST /api/cotisations/verifier-retards
```

## Modes de paiement disponibles

- `especes` - Espèces
- `virement` - Virement bancaire
- `mobile_money` - Mobile Money (Wave, Orange Money, Free Money)
- `cheque` - Chèque

## Statuts

### Adhérents
- `actif` - Peut recevoir une parcelle
- `suspendu` - Trop de retards, bloqué
- `radie` - Exclu définitivement

### Échéances
- `a_payer` - En attente de paiement
- `paye` - Payée
- `en_retard` - Dépassé la période de grâce

### Parcelles
- `disponible` - Libre
- `attribuee` - Attribuée à un adhérent
- `vendue` - Vendue définitivement

## Prochaines étapes

1. Intégrer les notifications WhatsApp
2. Générer les reçus PDF
3. Ajouter le paiement en ligne
4. Créer l'interface frontend
5. Implémenter les rôles et permissions
