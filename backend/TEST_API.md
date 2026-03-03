# Tests API - Guide Rapide

## 1. Démarrer le serveur

```bash
cd backend
php artisan serve
```

## 2. Se connecter et obtenir un token

```bash
curl -X POST http://127.0.0.1:8000/api/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password"}'
```

**Copier le token de la réponse** et l'utiliser dans les requêtes suivantes.

## 3. Tests des endpoints

### Créer un propriétaire

```bash
curl -X POST http://127.0.0.1:8000/api/proprietaires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "Amadou Diallo",
    "telephone": "+221771234567",
    "email": "amadou@example.com",
    "adresse": "Dakar, Sénégal",
    "cin": "1234567890123"
  }'
```

### Créer un bien

```bash
curl -X POST http://127.0.0.1:8000/api/biens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "appartement",
    "adresse": "Rue 10, Médina, Dakar",
    "superficie": 85.5,
    "prix": 250000,
    "id_proprietaire": 1,
    "latitude": 14.6937,
    "longitude": -17.4441,
    "description": "Appartement F3 meublé"
  }'
```

### Lister les biens

```bash
curl -X GET http://127.0.0.1:8000/api/biens \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Créer un locataire

```bash
curl -X POST http://127.0.0.1:8000/api/locataires \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "Fatou Diop",
    "telephone": "+221779876543",
    "email": "fatou@example.com",
    "cin": "9876543210987",
    "profession": "Enseignante"
  }'
```

### Créer un contrat

```bash
curl -X POST http://127.0.0.1:8000/api/contrats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_bien": 1,
    "id_locataire": 1,
    "date_debut": "2026-03-01",
    "date_fin": "2027-02-28",
    "loyer_mensuel": 150000,
    "caution": 300000
  }'
```

### Créer un loyer

```bash
curl -X POST http://127.0.0.1:8000/api/loyers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_contrat": 1,
    "mois": "2026-03",
    "montant": 150000
  }'
```

### Enregistrer un paiement

```bash
curl -X PUT http://127.0.0.1:8000/api/loyers/1/payer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "mode_paiement": "wave",
    "date_paiement": "2026-03-05"
  }'
```

### Créer un lotissement

```bash
curl -X POST http://127.0.0.1:8000/api/lotissements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "Lotissement Diamalaye",
    "localisation": "Diamniadio, Dakar",
    "superficie_totale": 50000,
    "nombre_parcelles": 120,
    "latitude": 14.7167,
    "longitude": -17.1833
  }'
```

### Créer une parcelle

```bash
curl -X POST http://127.0.0.1:8000/api/parcelles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_lotissement": 1,
    "numero": "A-015",
    "superficie": 300,
    "prix": 5000000,
    "statut": "disponible"
  }'
```

### Créer un partenariat

```bash
curl -X POST http://127.0.0.1:8000/api/partenariats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_promoteur": 1,
    "id_proprietaire": 1,
    "id_lotissement": 1,
    "ticket_entree": 10000000,
    "pourcentage_promoteur": 60.0,
    "pourcentage_proprietaire": 40.0
  }'
```

### Calculer la répartition

```bash
curl -X GET http://127.0.0.1:8000/api/partenariats/1/calculer-repartition \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 4. Tester avec le frontend

1. S'assurer que le backend tourne sur `http://127.0.0.1:8000`
2. Démarrer le frontend React
3. Se connecter avec `admin@demo.com` / `password`
4. Naviguer vers les différentes pages et tester les fonctionnalités

## Codes de réponse attendus

- `200` - Succès (GET, PUT)
- `201` - Créé avec succès (POST)
- `204` - Supprimé avec succès (DELETE)
- `401` - Non authentifié (token manquant/invalide)
- `404` - Ressource non trouvée
- `422` - Erreur de validation

## Format d'erreur de validation (422)

```json
{
  "message": "Les données fournies sont invalides.",
  "erreurs": {
    "adresse": ["L'adresse est obligatoire."],
    "prix": ["Le prix doit être un nombre positif."]
  }
}
```
