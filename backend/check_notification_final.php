<?php

echo "🔍 Vérification des notifications pour 774958446..." . PHP_EOL;

try {
    // Connexion directe à la base
    $pdo = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');
    
    // Lister les tables
    $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
    
    echo "📋 Tables disponibles:" . PHP_EOL;
    foreach ($tables as $table) {
        if (str_contains($table['name'], 'notification')) {
            echo "✅ " . $table['name'] . PHP_EOL;
        }
    }
    
    // Vérifier si la table existe
    $tableExists = false;
    foreach ($tables as $table) {
        if ($table['name'] === 'notifications_whatsapp') {
            $tableExists = true;
            break;
        }
    }
    
    if ($tableExists) {
        echo PHP_EOL . "🔍 Recherche dans notifications_whatsapp..." . PHP_EOL;
        
        $stmt = $pdo->prepare("SELECT * FROM notifications_whatsapp WHERE telephone = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->execute(['774958446']);
        $notification = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($notification) {
            echo "✅ Notification trouvée pour 774958446:" . PHP_EOL;
            echo "📱 ID: " . $notification['id'] . PHP_EOL;
            echo "📞 Téléphone: " . $notification['telephone'] . PHP_EOL;
            echo "📋 Statut: " . $notification['statut'] . PHP_EOL;
            echo "📝 Type: " . $notification['type'] . PHP_EOL;
            echo "📅 Date: " . $notification['created_at'] . PHP_EOL;
            echo "💬 Message: " . substr($notification['message'], 0, 100) . (strlen($notification['message']) > 100 ? '...' : '') . PHP_EOL;
        } else {
            echo "❌ Aucune notification trouvée pour 774958446" . PHP_EOL;
        }
    } else {
        echo "❌ Table notifications_whatsapp introuvable" . PHP_EOL;
    }
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . PHP_EOL;
}
