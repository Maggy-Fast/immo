# Spécification API — Maggyfast Immo

**Base URL** : `http://localhost:8000/api`  
**Auth** : Bearer Token (Laravel Sanctum)  
**Format** : JSON  
**IDs** : `BIGINT` auto-increment  
**Préfixe tenant** : automatique via middleware `AssureTenant`

---

## Authentification

### `POST /auth/connexion`

Authentifier un utilisateur et retourner un token.

**Corps requête** :
```json
{
  "email": "agent@maggyfast.com",
  "mot_de_passe": "••••••••"
}
```

**Réponse 200** :
```json
{
  "utilisateur": {
    "id": 1,
    "nom": "Amadou Diallo",
    "email": "agent@maggyfast.com",
    "role": "admin"
  },
  "token": "1|abc123..."
}
```

### `POST /auth/inscription`

**Corps requête** :
```json
{
  "nom": "Amadou Diallo",
  "email": "agent@maggyfast.com",
  "mot_de_passe": "••••••••",
  "mot_de_passe_confirmation": "••••••••",
  "telephone": "+221771234567"
}
```

### `POST /auth/deconnexion`
🔒 Auth requise. Révoque le token courant.

### `GET /auth/moi`
🔒 Auth requise. Retourne l'utilisateur connecté.

---

## Biens Immobiliers

### `GET /biens`
🔒 Auth requise.

**Paramètres query** :
| Param | Type | Description |
|---|---|---|
| `type` | string | Filtrer par type (appartement, maison, terrain, commerce) |
| `statut` | string | Filtrer par statut (disponible, loué, vendu) |
| `id_proprietaire` | int | Filtrer par propriétaire |
| `page` | int | Pagination |

**Réponse 200** :
```json
{
  "donnees": [
    {
      "id": 1,
      "type": "appartement",
      "adresse": "Rue 10, Médina, Dakar",
      "superficie": 85.5,
      "prix": 250000,
      "statut": "disponible",
      "latitude": 14.6937,
      "longitude": -17.4441,
      "proprietaire": {
        "id": 3,
        "nom": "Ibrahima Sow"
      }
    }
  ],
  "meta": {
    "page_courante": 1,
    "total_pages": 5,
    "total": 48
  }
}
```

### `POST /biens`
🔒 Auth requise (admin, agent).

**Corps requête** :
```json
{
  "type": "appartement",
  "adresse": "Rue 10, Médina, Dakar",
  "superficie": 85.5,
  "prix": 250000,
  "id_proprietaire": 3,
  "latitude": 14.6937,
  "longitude": -17.4441,
  "description": "Appartement F3 meublé, 2 chambres"
}
```

### `GET /biens/{id}`
🔒 Détail d'un bien avec propriétaire, contrats actifs, documents.

### `PUT /biens/{id}`
🔒 Modifier un bien.

### `DELETE /biens/{id}`
🔒 Supprimer un bien (soft delete).

---

## Contrats de Bail

### `POST /contrats`
🔒 Auth requise.

```json
{
  "id_bien": 1,
  "id_locataire": 5,
  "date_debut": "2026-03-01",
  "date_fin": "2027-02-28",
  "loyer_mensuel": 150000,
  "caution": 300000
}
```

---

## Loyers & Paiements

### `POST /loyers`
🔒 Générer les loyers mensuels pour un contrat.

### `PUT /loyers/{id}/payer`
🔒 Enregistrer un paiement.

```json
{
  "montant": 150000,
  "mode_paiement": "wave",
  "date_paiement": "2026-03-05"
}
```

**Réponse 200** :
```json
{
  "id": 12,
  "statut": "paye",
  "quittance_disponible": true
}
```

### `GET /quittances/{id}/pdf`
🔒 Télécharger la quittance PDF d'un loyer payé.

**Réponse** : `Content-Type: application/pdf`

---

## Lotissements & Parcelles

### `POST /lotissements`
```json
{
  "nom": "Lotissement Diamalaye",
  "localisation": "Diamniadio, Dakar",
  "superficie_totale": 50000,
  "nombre_parcelles": 120,
  "latitude": 14.7167,
  "longitude": -17.1833
}
```

### `POST /parcelles`
```json
{
  "id_lotissement": 2,
  "numero": "A-015",
  "superficie": 300,
  "prix": 5000000,
  "statut": "disponible"
}
```

---

## Partenariats & Répartition

### `POST /partenariats`
```json
{
  "id_promoteur": 4,
  "id_proprietaire": 3,
  "id_lotissement": 2,
  "ticket_entree": 10000000,
  "pourcentage_promoteur": 60.0,
  "pourcentage_proprietaire": 40.0
}
```

### `GET /partenariats/{id}/calculer-repartition`

**Réponse 200** :
```json
{
  "total_ventes": 85000000,
  "total_depenses": 15000000,
  "benefice_net": 70000000,
  "part_promoteur": {
    "pourcentage": 60,
    "montant": 42000000
  },
  "part_proprietaire": {
    "pourcentage": 40,
    "montant": 28000000
  },
  "ticket_entree_rembourse": true
}
```

---

## Documents Fonciers

### `POST /documents-fonciers`
🔒 Upload multipart/form-data.

```
fichier: [binary]
id_bien: 1
type: "titre_foncier"
```

### `GET /documents-fonciers/{id}`
🔒 Télécharger le fichier (déchiffré automatiquement).

---

## Assistante IA

### `POST /ia/generer-document`
🔒 Auth requise.

```json
{
  "type_document": "contrat_bail",
  "parametres": {
    "nom_proprietaire": "Ibrahima Sow",
    "nom_locataire": "Fatou Diop",
    "adresse_bien": "Rue 10, Médina",
    "loyer_mensuel": 150000,
    "duree_mois": 12
  }
}
```

**Réponse 200** :
```json
{
  "contenu": "# CONTRAT DE BAIL\n\nEntre les soussignés...",
  "url_pdf": "/api/ia/documents/7/pdf"
}
```

---

## Carte Interactive

### `GET /carte/biens`
**Paramètres** : `type`, `statut`, `prix_min`, `prix_max`

```json
{
  "marqueurs": [
    {
      "id": 1,
      "type": "appartement",
      "adresse": "Rue 10, Médina",
      "prix": 250000,
      "statut": "disponible",
      "latitude": 14.6937,
      "longitude": -17.4441
    }
  ]
}
```

### `GET /carte/lotissements`
Retourne les lotissements avec coordonnées.

---

## Tableau de Bord

### `GET /tableau-de-bord`
🔒 Auth requise.

```json
{
  "total_biens": 48,
  "biens_loues": 32,
  "biens_disponibles": 16,
  "total_proprietaires": 15,
  "total_locataires": 32,
  "loyers_du_mois": {
    "attendu": 4800000,
    "recu": 3600000,
    "taux_recouvrement": 75.0
  },
  "loyers_impayes": 1200000,
  "revenus_6_mois": [
    { "mois": "2025-10", "montant": 3200000 },
    { "mois": "2025-11", "montant": 3500000 }
  ]
}
```

---

## Codes de statut HTTP

| Code | Signification |
|---|---|
| `200` | Succès |
| `201` | Créé avec succès |
| `204` | Supprimé avec succès |
| `401` | Non authentifié |
| `403` | Non autorisé (rôle insuffisant) |
| `404` | Ressource non trouvée |
| `422` | Erreur de validation |
| `500` | Erreur serveur |

### Format erreur validation (422)
```json
{
  "message": "Les données fournies sont invalides.",
  "erreurs": {
    "adresse": ["L'adresse est obligatoire."],
    "prix": ["Le prix doit être un nombre positif."]
  }
}
```
