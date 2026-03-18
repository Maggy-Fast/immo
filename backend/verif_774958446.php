<?php

require_once __DIR__ . '/vendor/autoload.php';

// Connexion à la base de données
$pdo = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');

// Vérifier la dernière notification pour 774958446
$stmt = $pdo->prepare("SELECT * FROM notifications_whatsapp WHERE telephone = ? ORDER BY created_at DESC LIMIT 1");
$stmt->execute(['774958446']);
$notification = $stmt->fetch(PDO::FETCH_ASSOC);

if ($notification) {
    echo "✅ Dernière notification pour 774958446:" . PHP_EOL;
    echo "ID: {$notification['id']}" . PHP_EOL;
    echo "Statut: {$notification['statut']}" . PHP_EOL;
    echo "Message: {$notification['message']}" . PHP_EOL;
    echo "Date: {$notification['created_at']}" . PHP_EOL;
    echo "Type: {$notification['type']}" . PHP_EOL;
} else {
    echo "❌ Aucune notification trouvée pour 774958446" . PHP_EOL;
}
