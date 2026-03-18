# Exemples d'API - Module Coopérative

## Configuration de base

**Base URL:** `http://localhost:8000/api`

**Headers requis:**
```
Authorization: Bearer {votre_token}
Content-Type: application/json
Accept: application/json
```

## 1. Configuration des cotisations

### Créer un paramètre de cotisation
```http
POST /cotisations/parametres
```
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

### Obtenir le paramètre actif
```http
GET /cotisations/parametres/actif
```

## 2. Gestion des adhérents

### Créer un adhérent
```http
POST /adherents
```
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

### Lister les adhérents
```http
GET /adherents
GET /adherents?statut=actif
GET /adherents?recherche=Diop
GET /adherents?statut=suspendu&page=2
```

### Obtenir un adhérent
```http
GET /adherents/1
```

### Modifier un adhérent
```http
PUT /adherents/1
```
```json
{
  "telephone": "779876543",
  "email": "nouveau.email@example.com"
}
```

### Vérifier éligibilité parcelle
```http
GET /adherents/1/eligibilite
```

### Statistiques adhérents
```http
GET /adherents/statistiques
```

### Supprimer un adhérent
```http
DELETE /adherents/1
```

## 3. Gestion des cotisations

### Générer les échéances
```http
POST /cotisations/generer-echeances
```
```json
{
  "id_adherent": 1,
  "nombre_mois": 12
}
```

### Lister les échéances
```http
GET /cotisations/echeances
GET /cotisations/echeances?statut=en_retard
GET /cotisations/echeances?id_adherent=1
GET /cotisations/echeances?mois=3
GET /cotisations/echeances?statut=a_payer&id_adherent=1
```

### Enregistrer un paiement
```http
PUT /cotisations/echeances/1/payer
```
```json
{
  "montant_paye": 50000,
  "mode_paiement": "especes",
  "reference_paiement": "REF20260303001"
}
```

**Avec Mobile Money:**
```json
{
  "montant_paye": 50000,
  "mode_paiement": "mobile_money",
  "reference_paiement": "WAVE-123456789"
}
```

**Avec virement:**
```json
{
  "montant_paye": 50000,
  "mode_paiement": "virement",
  "reference_paiement": "VIR-20260303-001"
}
```

### Vérifier les retards
```http
POST /cotisations/verifier-retards
```

### Statistiques cotisations
```http
GET /cotisations/statistiques
```

## 4. Gestion des parcelles

### Créer une parcelle
```http
POST /parcelles-cooperative
```
```json
{
  "numero": "PARC001",
  "surface": 300,
  "prix": 10000000,
  "description": "Parcelle située en zone A, proche des commodités"
}
```

### Lister les parcelles
```http
GET /parcelles-cooperative
GET /parcelles-cooperative?statut=disponible
GET /parcelles-cooperative?statut=attribuee
```

### Obtenir une parcelle
```http
GET /parcelles-cooperative/1
```

### Modifier une parcelle
```http
PUT /parcelles-cooperative/1
```
```json
{
  "prix": 12000000,
  "description": "Prix mis à jour"
}
```

### Attribuer une parcelle
```http
PUT /parcelles-cooperative/1/attribuer
```
```json
{
  "id_adherent": 1
}
```

### Retirer une attribution
```http
PUT /parcelles-cooperative/1/retirer
```
```json
{
  "motif": "Demande de l'adhérent"
}
```

### Statistiques parcelles
```http
GET /parcelles-cooperative/statistiques
```

### Supprimer une parcelle
```http
DELETE /parcelles-cooperative/1
```

## 5. Tableau de bord

### Obtenir toutes les statistiques
```http
GET /cooperative/tableau-bord
```

**Réponse complète:**
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
    "total_encaisse": 600000.00,
    "total_en_attente": 200000.00,
    "total_en_retard": 100000.00,
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

## Scénarios complets

### Scénario 1: Nouvel adhérent avec paiement

```bash
# 1. Créer l'adhérent
POST /adherents
{
  "nom": "Ndiaye",
  "prenom": "Fatou",
  "telephone": "772345678",
  "cin": "2345678901234"
}
# Réponse: { "id": 2, "numero": "ADH002", ... }

# 2. Générer ses échéances
POST /cotisations/generer-echeances
{
  "id_adherent": 2,
  "nombre_mois": 12
}

# 3. Payer la première échéance
PUT /cotisations/echeances/13/payer
{
  "montant_paye": 50000,
  "mode_paiement": "mobile_money",
  "reference_paiement": "WAVE-987654321"
}

# 4. Vérifier son éligibilité
GET /adherents/2/eligibilite
```

### Scénario 2: Attribution de parcelle

```bash
# 1. Créer la parcelle
POST /parcelles-cooperative
{
  "numero": "PARC015",
  "surface": 400,
  "prix": 15000000
}
# Réponse: { "id": 15, ... }

# 2. Vérifier éligibilité de l'adhérent
GET /adherents/2/eligibilite
# Réponse: { "eligible": true, "raisons": [] }

# 3. Attribuer la parcelle
PUT /parcelles-cooperative/15/attribuer
{
  "id_adherent": 2
}

# 4. Consulter l'historique
GET /parcelles-cooperative/15
```

### Scénario 3: Gestion des retards

```bash
# 1. Vérifier les retards (à exécuter quotidiennement)
POST /cotisations/verifier-retards

# 2. Lister les adhérents suspendus
GET /adherents?statut=suspendu

# 3. Voir les échéances en retard
GET /cotisations/echeances?statut=en_retard

# 4. Consulter un adhérent suspendu
GET /adherents/3
# Réponse: { "statut": "suspendu", "echeances_en_retard": 4, ... }
```

## Codes d'erreur

- `200` - Succès
- `201` - Créé avec succès
- `204` - Supprimé avec succès
- `400` - Erreur métier (ex: adhérent non éligible)
- `404` - Ressource non trouvée
- `422` - Validation échouée

## Pagination

Toutes les listes supportent la pagination:

```http
GET /adherents?page=2
```

**Réponse:**
```json
{
  "donnees": [...],
  "meta": {
    "page_courante": 2,
    "total_pages": 5,
    "total": 73
  }
}
```
