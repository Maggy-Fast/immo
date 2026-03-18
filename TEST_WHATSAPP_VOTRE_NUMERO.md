# 📱 Test Notifications WhatsApp - Votre Numéro

## ✅ **Prêt pour tester avec votre numéro !**

### **🚀 Serveurs démarrés**
- ✅ **Backend** : http://127.0.0.1:8000 (API)
- ✅ **Frontend** : http://localhost:3000 (Interface)
- ✅ **Notification test** : Créée et traitée

---

## 📲 **Méthodes de test**

### **1. Via l'interface frontend (recommandé)**

1. **Allez sur** : http://localhost:3000/whatsapp
2. **Onglet "Envoi"**
3. **Formulaire de test** :
   ```
   Numéro WhatsApp: [VOTRE_NUMERO]
   Message: [VOTRE_MESSAGE_DE_TEST]
   ```
4. **Cliquez sur "Envoyer"**

### **2. Via API directe**

```bash
curl -X POST http://127.0.0.1:8000/api/whatsapp/test \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "VOTRE_NUMERO",
    "message": "Test depuis API - Message personnalisé"
  }'
```

### **3. Via commande (mode simulation)**

```bash
# Créer une notification pour votre numéro
php artisan tinker --execute="
use App\Domaine\Entities\NotificationWhatsapp;
NotificationWhatsapp::create([
  'id_tenant' => 1,
  'id_adherent' => 1,
  'type' => 'rappel',
  'message' => 'Test personnalisé pour VOTRE_NUMERO',
  'telephone' => 'VOTRE_NUMERO',
  'statut' => 'en_attente'
]);
"

# Traiter la file d'attente
php artisan whatsapp:traiter-notifications
```

---

## 📝 **Exemple avec votre numéro**

Remplacez `VOTRE_NUMERO` par votre vrai numéro WhatsApp :

```bash
# Exemple avec le 771234567
curl -X POST http://127.0.0.1:8000/api/whatsapp/test \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "771234567",
    "message": "Test depuis mon numéro - Ça fonctionne !"
  }'
```

---

## 🔧 **Configuration Twilio (optionnel)**

### **Mode test (actuel)**
- ✅ **Fonctionne** sans configuration Twilio
- 🔄 **Simulation** : Messages loggés
- 📝 **Logs** : `storage/logs/laravel.log`

### **Mode production (pour envoyer réellement)**
```bash
# Dans votre .env
TWILIO_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 📊 **Vérification**

### **Après envoi, vérifiez :**

1. **Logs backend** :
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Page frontend** :
   - Allez sur http://localhost:3000/whatsapp
   - Onglet "Statistiques"
   - Vérifiez le compteur "Envoyées"

3. **API statistiques** :
   ```bash
   curl http://127.0.0.1:8000/api/whatsapp/statistiques \
     -H "Authorization: Bearer VOTRE_TOKEN"
   ```

---

## 🎯 **Scénarios de test**

### **Test 1 : Message simple**
```
Numéro: VOTRE_NUMERO
Message: "Test de notification WhatsApp depuis IMMO"
```

### **Test 2 : Rappel adhérent**
```
1. Créez un adhérent test
2. Allez sur /whatsapp → Onglet "Envoi"
3. Cliquez "Créer rappel"
4. Entrez l'ID adhérent
```

### **Test 3 : File d'attente**
```
1. Allez sur /whatsapp → Onglet "File d'attente"
2. Cliquez "Traiter la file d'attente"
3. Vérifiez les résultats
```

---

## ✅ **État actuel**

- ✅ **Backend opérationnel** : API disponible
- ✅ **Frontend opérationnel** : Interface accessible
- ✅ **Notifications créées** : File d'attente fonctionnelle
- ✅ **Mode test actif** : Pas besoin de Twilio pour tester

---

## 🚀 **Prêt à tester !**

**Vous pouvez maintenant tester avec votre numéro personnel :**

1. **Interface web** : http://localhost:3000/whatsapp
2. **API directe** : curl vers /api/whatsapp/test
3. **Commande** : php artisan whatsapp:traiter-notifications

**Le système est prêt pour vos tests !** 📱✨
