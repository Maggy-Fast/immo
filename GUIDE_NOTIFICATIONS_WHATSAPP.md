# 📱 Notifications WhatsApp - Guide Complet

## 🎯 **Quand les notifications sont-elles envoyées ?**

### ✅ **Automatiquement (sans intervention manuelle)**

#### 📅 **Rappels avant échéance**
- **Quand** : Tous les jours à 09h00
- **Déclencheur** : 3 jours avant chaque échéance
- **Commande** : `php artisan whatsapp:envoyer-rappels --days=3`

#### ⚠️ **Notifications de retard**
- **Quand** : Tous les jours à 06h00  
- **Déclencheur** : Vérification des échéances en retard
- **Commande** : `php artisan cooperative:verifier-retards`

#### 🚫 **Notifications de suspension**
- **Quand** : Lors de la vérification des retards
- **Déclencheur** : Adhérent atteint la limite de retards autorisés

#### ✅ **Confirmations de paiement**
- **Quand** : Immédiatement après chaque paiement enregistré
- **Déclencheur** : Paiement d'une échéance

---

## 🔄 **Traitement de la file d'attente**

### **Toutes les 5 minutes**
- **Commande** : `php artisan whatsapp:traiter-notifications`
- **Scheduler** : Automatique via `routes/console.php`
- **Capacité** : 50 messages par batch

---

## 🖥️ **Interface Frontend - OUI !**

### **Nouvelle page dédiée**
- **URL** : `http://localhost:3000/whatsapp`
- **Accès** : Via le menu navigation
- **Fonctionnalités** complètes

#### 📋 **Onglets disponibles**

1. **📤 Envoi**
   - Message de test personnalisé
   - Rappel automatique pour adhérent
   - Formulaire simple et intuitif

2. **📊 Statistiques**
   - Messages en attente
   - Messages envoyés avec succès
   - Échecs et erreurs
   - Activité des 24 dernières heures

3. **⏰ File d'attente**
   - Traitement manuel
   - Résultats en temps réel
   - Bouton d'action unique

---

## 🛠️ **Configuration requise**

### **Variables d'environnement**
```bash
# Dans votre .env
TWILIO_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### **Mode test (sans Twilio)**
- ✅ **Fonctionne** même sans configuration
- 🔄 **Simulation** : Messages loggés mais non envoyés
- 📝 **Logs** : `storage/logs/laravel.log`

---

## 📆 **Planning quotidien des notifications**

| Heure | Action | Résultat |
|--------|---------|----------|
| **06:00** | Vérification retards | Notifications retard + suspension |
| **09:00** | Envoi rappels | Rappels 3 jours avant échéance |
| **Continu** | File d'attente | Traitement toutes les 5 minutes |
| **Immédiat** | Paiements | Confirmations instantanées |

---

## 🎮 **Utilisation manuelle**

### **Via le frontend**
1. Allez sur `/whatsapp`
2. Choisissez l'onglet "Envoi"
3. Remplissez le formulaire
4. Cliquez sur "Envoyer"

### **Via les commandes**
```bash
# Test d'envoi
php artisan whatsapp:traiter-notifications

# Rappels automatiques
php artisan whatsapp:envoyer-rappels --days=3

# Traitement file d'attente
php artisan whatsapp:traiter-notifications --tenant=1
```

### **Via l'API**
```bash
# Message test
curl -X POST http://localhost:8000/api/whatsapp/test \
  -H "Authorization: Bearer TOKEN" \
  -d '{"telephone": "771234567", "message": "Test"}'

# Statistiques
curl http://localhost:8000/api/whatsapp/statistiques \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 **Monitoring et suivi**

### **Logs disponibles**
- **Notifications envoyées** : `[INFO] Message WhatsApp envoyé à +221771234567`
- **Erreurs** : `[ERROR] Erreur envoi WhatsApp : ...`
- **Simulations** : `[WARNING] Twilio non configuré - Simulation d'envoi`

### **Statistiques en temps réel**
- Page frontend `/whatsapp` → Onglet "Statistiques"
- API : `GET /api/whatsapp/statistiques`
- Commande : `php artisan whatsapp:traiter-notifications`

---

## 🚨 **Dépannage rapide**

### **Pas de notifications envoyées ?**
1. **Vérifiez le scheduler** :
   ```bash
   php artisan schedule:run
   ```

2. **Vérifiez les identifiants Twilio** :
   ```bash
   php artisan tinker
   >>> config('services.twilio.sid')
   ```

3. **Vérifiez les logs** :
   ```bash
   tail -f storage/logs/laravel.log
   ```

---

## ✅ **Résumé**

### **🎯 Automatisation COMPLÈTE**
- ✅ Rappels avant échéance (09:00 quotidien)
- ✅ Notifications de retard (06:00 quotidien)  
- ✅ Suspensions automatiques
- ✅ Confirmations de paiement immédiates

### **🖥️ Frontend DISPONIBLE**
- ✅ Page `/whatsapp` avec 3 onglets
- ✅ Envoi manuel de messages
- ✅ Statistiques en temps réel
- ✅ Gestion de la file d'attente

### **🔄 Monitoring ACTIF**
- ✅ Logs détaillés
- ✅ API REST complète
- ✅ Commandes de test

---

## 🎉 **Conclusion**

**Les notifications WhatsApp sont 100% automatiques et disponibles dans le frontend !**

- **Automatisation** : 4 types de notifications envoyées automatiquement
- **Interface** : Page frontend complète à `/whatsapp`
- **Contrôle** : Monitoring et gestion manuelle possibles
- **Flexibilité** : Fonctionne même sans Twilio (mode simulation)

**Plus besoin d'intervention manuelle, tout est automatisé !** 🚀
