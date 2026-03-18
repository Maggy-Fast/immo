# Tests du Module Coopérative

## Tests manuels à effectuer

### 1. Test de la configuration

```bash
# Démarrer le serveur
cd backend
php artisan serve

# Dans un autre terminal, tester l'API
curl -X POST http://localhost:8000/api/cotisations/parametres \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "montant": 50000,
    "frequence": "mensuel",
    "jour_echeance": 5,
    "date_debut": "2026-03-01",
    "periode_grace_jours": 5,
    "max_echeances_retard": 3
  }'
```

### 2. Test du cycle complet

#### Étape 1: Créer un adhérent
```bash
curl -X POST http://localhost:8000/api/adherents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Utilisateur",
    "telephone": "771234567",
    "cin": "1234567890123"
  }'
```

#### Étape 2: Générer les échéances
```bash
curl -X POST http://localhost:8000/api/cotisations/generer-echeances \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_adherent": 1,
    "nombre_mois": 12
  }'
```

#### Étape 3: Payer une échéance
```bash
curl -X PUT http://localhost:8000/api/cotisations/echeances/1/payer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "montant_paye": 50000,
    "mode_paiement": "especes",
    "reference_paiement": "TEST001"
  }'
```

#### Étape 4: Créer une parcelle
```bash
curl -X POST http://localhost:8000/api/parcelles-cooperative \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "PARC001",
    "surface": 300,
    "prix": 10000000
  }'
```

#### Étape 5: Attribuer la parcelle
```bash
curl -X PUT http://localhost:8000/api/parcelles-cooperative/1/attribuer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_adherent": 1
  }'
```

### 3. Test de la suspension automatique

#### Scénario: Adhérent avec retards

1. Créer un adhérent
2. Générer 6 échéances
3. Ne payer aucune échéance
4. Modifier manuellement les dates d'échéance pour qu'elles soient dans le passé
5. Exécuter la vérification des retards:
```bash
php artisan cooperative:verifier-retards
```
6. Vérifier que l'adhérent est suspendu:
```bash
curl http://localhost:8000/api/adherents/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Test d'éligibilité

#### Cas 1: Adhérent éligible
```bash
# Adhérent actif sans retard
curl http://localhost:8000/api/adherents/1/eligibilite \
  -H "Authorization: Bearer YOUR_TOKEN"

# Réponse attendue:
# { "eligible": true, "raisons": [] }
```

#### Cas 2: Adhérent non éligible (suspendu)
```bash
# Adhérent suspendu
curl http://localhost:8000/api/adherents/2/eligibilite \
  -H "Authorization: Bearer YOUR_TOKEN"

# Réponse attendue:
# { "eligible": false, "raisons": ["Statut non actif: suspendu"] }
```

#### Cas 3: Adhérent non éligible (retards)
```bash
# Adhérent avec retards
curl http://localhost:8000/api/adherents/3/eligibilite \
  -H "Authorization: Bearer YOUR_TOKEN"

# Réponse attendue:
# { "eligible": false, "raisons": ["2 échéance(s) en retard"] }
```

### 5. Test du tableau de bord

```bash
curl http://localhost:8000/api/cooperative/tableau-bord \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Vérifier que la réponse contient:**
- Statistiques des adhérents
- Statistiques des cotisations
- Statistiques des parcelles
- Taux de paiement
- Taux d'attribution

### 6. Test des filtres

#### Filtrer les adhérents par statut
```bash
curl "http://localhost:8000/api/adherents?statut=actif" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Rechercher un adhérent
```bash
curl "http://localhost:8000/api/adherents?recherche=Diop" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Filtrer les échéances en retard
```bash
curl "http://localhost:8000/api/cotisations/echeances?statut=en_retard" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Filtrer les parcelles disponibles
```bash
curl "http://localhost:8000/api/parcelles-cooperative?statut=disponible" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Checklist de validation

### Fonctionnalités de base
- [ ] Création d'adhérent avec numéro automatique (ADH001, ADH002...)
- [ ] Modification d'adhérent
- [ ] Suppression d'adhérent (uniquement si pas de parcelle)
- [ ] Liste des adhérents avec filtres
- [ ] Détails d'un adhérent avec historique

### Cotisations
- [ ] Création de paramètre de cotisation
- [ ] Génération automatique des échéances
- [ ] Enregistrement de paiement
- [ ] Vérification des retards
- [ ] Suspension automatique après X retards
- [ ] Statistiques financières

### Parcelles
- [ ] Création de parcelle
- [ ] Attribution à un adhérent éligible
- [ ] Blocage si adhérent non éligible
- [ ] Retrait d'attribution
- [ ] Historique des attributions
- [ ] Statistiques des parcelles

### Tableau de bord
- [ ] Affichage des statistiques globales
- [ ] Calcul du taux de paiement
- [ ] Calcul du taux d'attribution

### Sécurité
- [ ] Multi-tenancy fonctionnel
- [ ] Authentification requise
- [ ] Validation des données
- [ ] Gestion des erreurs

## Tests de charge (optionnel)

### Créer 100 adhérents
```bash
for i in {1..100}; do
  curl -X POST http://localhost:8000/api/adherents \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"nom\": \"Nom$i\",
      \"prenom\": \"Prenom$i\",
      \"telephone\": \"77$(printf '%07d' $i)\",
      \"cin\": \"$(printf '%013d' $i)\"
    }"
done
```

### Générer échéances pour tous
```bash
for i in {1..100}; do
  curl -X POST http://localhost:8000/api/cotisations/generer-echeances \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"id_adherent\": $i,
      \"nombre_mois\": 12
    }"
done
```

## Commandes utiles

### Réinitialiser les données
```bash
php artisan migrate:fresh
php artisan db:seed --class=CooperativeSeeder
```

### Vérifier les retards manuellement
```bash
php artisan cooperative:verifier-retards
```

### Voir les logs
```bash
tail -f storage/logs/laravel.log
```

## Résolution de problèmes

### Erreur: "Aucun paramètre de cotisation actif"
**Solution:** Créer un paramètre via `POST /api/cotisations/parametres`

### Erreur: "Adhérent non éligible"
**Solution:** Vérifier le statut et les retards via `GET /api/adherents/{id}/eligibilite`

### Erreur: "Cette parcelle n'est pas disponible"
**Solution:** Vérifier le statut de la parcelle via `GET /api/parcelles-cooperative/{id}`

### Erreur 401 Unauthorized
**Solution:** Vérifier le token d'authentification dans le header Authorization
