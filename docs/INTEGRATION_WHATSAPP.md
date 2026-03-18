# 📱 Intégration WhatsApp - Documentation Complète

## 🎯 Vue d'ensemble

L'application IMMO intègre maintenant **Twilio WhatsApp API** pour envoyer des notifications automatiques aux adhérents de la coopérative.

---

## 🛠️ Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```bash
# Configuration Twilio WhatsApp
TWILIO_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_WEBHOOK_URL=https://votre-domaine.com/api/whatsapp/webhook
```

### 2. Créer un compte Twilio

1. **Inscrivez-vous** sur [twilio.com](https://www.twilio.com)
2. **Activez le sandbox WhatsApp** :
   - Allez dans Messaging > Try it out > Send a WhatsApp message
   - Suivez les instructions pour connecter votre numéro
3. **Récupérez vos identifiants** :
   - Account SID (dans le dashboard)
   - Auth Token (caché, cliquez pour révéler)

---

## 📋 Fonctionnalités Implémentées

### ✅ Types de Notifications

| Type | Description | Déclencheur |
|------|-------------|-------------|
| `rappel` | Rappel avant échéance | 3 jours avant échéance |
| `retard` | Notification de retard | Dès la date d'échéance passée |
| `suspension` | Avertissement suspension | Après X retards |
| `confirmation_paiement` | Confirmation réception | Après enregistrement paiement |

### ✅ Services disponibles

#### ServiceNotificationWhatsapp
```php
// Envoyer un rappel
$service->envoyerRappel($adherent, $dateEcheance, $montant);

// Envoyer notification de retard
$service->envoyerNotificationRetard($adherent, $nbRetards);

// Envoyer notification de suspension
$service->envoyerNotificationSuspension($adherent);

// Envoyer confirmation de paiement
$service->envoyerConfirmationPaiement($adherent, $montant, $reference);

// Traiter la file d'attente
$nbEnvoyes = $service->traiterFileAttente();
```

---

## 🔄 Automatisation

### 1. Tâche planifiée (toutes les 5 minutes)

```bash
php artisan whatsapp:traiter-notifications
```

**Déjà configurée dans `routes/console.php`** :
- S'exécute toutes les 5 minutes
- Traite jusqu'à 50 notifications par batch
- Évite les chevauchements

### 2. Job asynchrone

```php
// Pour envoi immédiat
dispatch(new EnvoyerNotificationWhatsapp($telephone, $message));
```

---

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/whatsapp/test` | Envoyer un message de test |
| `POST` | `/api/whatsapp/rappel` | Envoyer un rappel manuel |
| `POST` | `/api/whatsapp/traiter-file` | Traiter manuellement la file |
| `GET` | `/api/whatsapp/historique/{id}` | Historique notifications adhérent |
| `GET` | `/api/whatsapp/statistiques` | Statistiques globales |

---

## 🧪 Tests

### 1. Test manuel via API

```bash
curl -X POST http://localhost:8000/api/whatsapp/test \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "771234567",
    "message": "Test de notification WhatsApp"
  }'
```

### 2. Test avec adhérent

```bash
curl -X POST http://localhost:8000/api/whatsapp/rappel \
  -H "Authorization: Bearer VOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_adherent": 1,
    "date_echeance": "2026-03-20",
    "montant": 50000
  }'
```

### 3. Vérifier les logs

```bash
php artisan log:tail
```

---

## 📊 Monitoring

### Statistiques disponibles

```json
{
  "en_attente": 15,
  "envoyees": 234,
  "echecs": 3,
  "total_24h": 12
}
```

### États des notifications

| Statut | Description |
|--------|-------------|
| `en_attente` | En file d'attente |
| `envoye` | Envoyé avec succès |
| `echec` | Échec d'envoi |

---

## 🔧 Dépannage

### Erreurs communes

#### 1. "Unauthorized (401)"
**Cause** : Mauvaises identifiants Twilio
**Solution** : Vérifiez `TWILIO_SID` et `TWILIO_AUTH_TOKEN`

#### 2. "Number not enabled"
**Cause** : Numéro WhatsApp non activé
**Solution** : Activez le sandbox Twilio WhatsApp

#### 3. "Invalid phone number"
**Cause** : Format du numéro incorrect
**Solution** : Le service formate automatiquement les numéros sénégalais

#### 4. Messages non envoyés
**Cause** : Queue worker non démarré
**Solution** :
```bash
php artisan queue:work
```

---

## 💡 Bonnes Pratiques

### 1. Limites d'utilisation
- **1 message/seconde** par numéro (limite Twilio)
- **50 messages/batch** maximum
- **Pas de spam** : respectez les heures de travail (8h-20h)

### 2. Templates de messages
Les messages sont personnalisables dans `ServiceNotificationWhatsapp.php` :

```php
'templates' => [
    'rappel' => "Bonjour {nom},\n\nRappel : Votre cotisation...",
    // Modifier ici pour personnaliser
]
```

### 3. Gestion des erreurs
- **3 tentatives** maximum par notification
- **Backoff exponentiel** : 1min, 5min, 15min
- **Logs détaillés** pour le debugging

---

## 🚀 Mise en Production

### 1. Configuration production
```bash
# Activer le worker en production
php artisan queue:work --daemon

# Ajouter au crontab
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### 2. Monitoring
- Surveillez les logs d'erreurs
- Vérifiez les statistiques quotidiennement
- Configurez des alertes pour les échecs élevés

---

## 📈 Évolutions Futures

### Prochaines améliorations
- [ ] Templates de messages personnalisables par coopérative
- [ ] Notifications interactives (boutons de réponse)
- [ ] Webhook pour gérer les réponses des adhérents
- [ ] Statistiques avancées et rapports
- [ ] Support des pièces jointes (PDF, images)

---

## 📞 Support

Pour toute question sur l'intégration WhatsApp :
1. Consultez les logs : `storage/logs/laravel.log`
2. Vérifiez la documentation Twilio
3. Testez avec le sandbox Twilio

---

**✅ L'intégration WhatsApp est maintenant opérationnelle !**
