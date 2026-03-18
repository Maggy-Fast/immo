# 🏘️ Module Gestion des Coopératives d'Habitat

## 📋 Qu'est-ce que c'est ?

Un système complet pour gérer une coopérative d'habitat avec :
- Gestion des membres (adhérents)
- Suivi des cotisations mensuelles
- Attribution des parcelles
- Suspension automatique en cas de retard
- Tableau de bord avec statistiques

## ✨ Fonctionnalités principales

### 👥 Gestion des Adhérents
- Ajouter/Modifier/Supprimer des membres
- Numéro automatique (ADH001, ADH002...)
- Fiche complète avec historique
- Statuts : Actif, Suspendu, Radié

### 💰 Gestion des Cotisations
- Configuration flexible (montant, fréquence, jour d'échéance)
- Génération automatique des échéances
- Enregistrement des paiements
- Modes : Espèces, Virement, Mobile Money, Chèque
- Période de grâce configurable

### ⚠️ Suspension Automatique
- Compteur de retards par adhérent
- Suspension automatique après X retards
- Blocage d'attribution de parcelle si suspendu

### 🏗️ Gestion des Parcelles
- Création de parcelles (numéro, surface, prix)
- Attribution aux adhérents éligibles
- Vérification automatique d'éligibilité
- Historique complet des attributions

### 📊 Tableau de Bord
- Nombre d'adhérents actifs/suspendus
- Total encaissé et en retard
- Parcelles disponibles/attribuées
- Taux de paiement et d'attribution

## 🚀 Installation rapide

### 1. Exécuter les migrations
```bash
cd backend
php artisan migrate
```

### 2. Charger les données de test (optionnel)
```bash
php artisan db:seed --class=CooperativeSeeder
```

Cela créera :
- 5 adhérents de test
- 10 parcelles de test
- 1 configuration de cotisation

### 3. Démarrer le serveur
```bash
php artisan serve
```

Le serveur démarre sur http://localhost:8000

## 📖 Utilisation

### Workflow typique

1. **Configurer les cotisations**
   - Montant : 50 000 FCFA
   - Fréquence : Mensuel
   - Jour d'échéance : 5 de chaque mois
   - Période de grâce : 5 jours
   - Suspension après : 3 retards

2. **Ajouter un adhérent**
   - Nom, Prénom, Téléphone, CIN
   - Numéro automatique généré (ADH001)

3. **Générer ses échéances**
   - 12 mois d'échéances créées automatiquement

4. **Enregistrer les paiements**
   - Lier chaque paiement à une échéance
   - Reçu automatique (à venir)

5. **Créer des parcelles**
   - Numéro, Surface, Prix

6. **Attribuer une parcelle**
   - Vérification automatique d'éligibilité
   - Historique conservé

### Vérification quotidienne des retards

**Automatique (Production):**
Tous les jours à 6h du matin

**Manuel (Test):**
```bash
php artisan cooperative:verifier-retards
```

## 🔗 API Endpoints

### Tableau de bord
```
GET /api/cooperative/tableau-bord
```

### Adhérents
```
GET    /api/adherents                    - Liste
POST   /api/adherents                    - Créer
GET    /api/adherents/{id}               - Détails
PUT    /api/adherents/{id}               - Modifier
DELETE /api/adherents/{id}               - Supprimer
GET    /api/adherents/{id}/eligibilite   - Vérifier éligibilité
GET    /api/adherents/statistiques       - Statistiques
```

### Cotisations
```
POST /api/cotisations/parametres              - Configurer
GET  /api/cotisations/parametres/actif        - Paramètre actif
POST /api/cotisations/generer-echeances       - Générer échéances
GET  /api/cotisations/echeances               - Liste échéances
PUT  /api/cotisations/echeances/{id}/payer    - Payer
POST /api/cotisations/verifier-retards        - Vérifier retards
GET  /api/cotisations/statistiques            - Statistiques
```

### Parcelles
```
GET    /api/parcelles-cooperative                  - Liste
POST   /api/parcelles-cooperative                  - Créer
GET    /api/parcelles-cooperative/{id}             - Détails
PUT    /api/parcelles-cooperative/{id}             - Modifier
DELETE /api/parcelles-cooperative/{id}             - Supprimer
PUT    /api/parcelles-cooperative/{id}/attribuer   - Attribuer
PUT    /api/parcelles-cooperative/{id}/retirer     - Retirer
GET    /api/parcelles-cooperative/statistiques     - Statistiques
```

**Total : 24 endpoints**

## 📚 Documentation complète

- **Installation détaillée :** `INSTALLATION_MODULE_COOPERATIVE.md`
- **Guide de démarrage :** `docs/COOPERATIVE_QUICKSTART.md`
- **Exemples d'API :** `docs/COOPERATIVE_API_EXAMPLES.md`
- **Guide de tests :** `docs/COOPERATIVE_TESTS.md`
- **Documentation technique :** `docs/MODULE_COOPERATIVE.md`
- **Résumé complet :** `MODULE_COOPERATIVE_RESUME.md`

## 🗂️ Structure des fichiers

```
backend/
├── app/
│   ├── Domaine/Entities/          # 6 entités
│   ├── Application/Services/      # 4 services
│   ├── Presentation/Controllers/  # 4 contrôleurs
│   └── Console/Commands/          # 1 commande
├── database/
│   ├── migrations/                # 1 migration (7 tables)
│   └── seeders/                   # 1 seeder
└── routes/
    ├── api.php                    # Routes API
    └── console.php                # Scheduler

docs/
├── MODULE_COOPERATIVE.md
├── COOPERATIVE_QUICKSTART.md
├── COOPERATIVE_API_EXAMPLES.md
└── COOPERATIVE_TESTS.md
```

## 🎯 Exemple concret

### Scénario : Nouvel adhérent avec paiement et attribution

```bash
# 1. Créer l'adhérent
POST /api/adherents
{
  "nom": "Diop",
  "prenom": "Amadou",
  "telephone": "771234567"
}
# → Reçoit le numéro ADH001

# 2. Générer ses échéances (12 mois)
POST /api/cotisations/generer-echeances
{
  "id_adherent": 1,
  "nombre_mois": 12
}

# 3. Payer la première échéance
PUT /api/cotisations/echeances/1/payer
{
  "montant_paye": 50000,
  "mode_paiement": "mobile_money",
  "reference_paiement": "WAVE-123456"
}

# 4. Vérifier son éligibilité
GET /api/adherents/1/eligibilite
# → { "eligible": true }

# 5. Créer une parcelle
POST /api/parcelles-cooperative
{
  "numero": "PARC001",
  "surface": 300,
  "prix": 10000000
}

# 6. Attribuer la parcelle
PUT /api/parcelles-cooperative/1/attribuer
{
  "id_adherent": 1
}
# → Parcelle attribuée avec succès !
```

## ⚙️ Configuration

### Paramètres de cotisation

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| montant | Montant de la cotisation | 50000 FCFA |
| frequence | Fréquence de paiement | mensuel, trimestriel, annuel |
| jour_echeance | Jour du mois | 5 (le 5 de chaque mois) |
| date_debut | Date de début | 2026-03-01 |
| periode_grace_jours | Délai avant retard | 5 jours |
| max_echeances_retard | Retards avant suspension | 3 échéances |

### Statuts

**Adhérents :**
- `actif` - Peut recevoir une parcelle
- `suspendu` - Trop de retards, bloqué
- `radie` - Exclu définitivement

**Échéances :**
- `a_payer` - En attente
- `paye` - Payée
- `en_retard` - Dépassé la période de grâce

**Parcelles :**
- `disponible` - Libre
- `attribuee` - Attribuée à un adhérent
- `vendue` - Vendue définitivement

## 🔮 Prochaines fonctionnalités (Phase 2)

- [ ] 📱 Notifications WhatsApp automatiques
- [ ] 📄 Génération de reçus PDF
- [ ] 💳 Paiement en ligne (Wave, Orange Money, Free Money)
- [ ] 👤 Gestion des rôles (Admin, Trésorier, Gestionnaire)
- [ ] 📊 Export Excel des données
- [ ] 💰 Frais de dossier
- [ ] ⚖️ Calcul automatique des pénalités

## 🛠️ Technologies utilisées

- **Framework :** Laravel 11
- **Architecture :** DDD (Domain-Driven Design)
- **API :** RESTful avec JSON
- **Authentification :** Laravel Sanctum
- **Base de données :** MySQL/PostgreSQL/SQLite
- **Multi-tenancy :** Activé

## ✅ Statut

🟢 **OPÉRATIONNEL**

Le module est complet et prêt à l'emploi. Toutes les fonctionnalités de base sont implémentées et testées.

## 📞 Support

Pour toute question, consultez la documentation dans le dossier `docs/` ou le fichier `MODULE_COOPERATIVE_RESUME.md`.

---

**Développé avec ❤️ pour faciliter la gestion des coopératives d'habitat**
