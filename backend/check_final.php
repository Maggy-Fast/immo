<?php

$app = require_once __DIR__ . '/bootstrap/app.php';

// Vérifier la dernière notification pour 774958446
$notification = Illuminate\Support\Facades\DB::table('notifications_whatsapp')
    ->where('telephone', '774958446')
    ->latest()
    ->first();

if ($notification) {
    echo "✅ Dernière notification pour 774958446:" . PHP_EOL;
    echo "ID: {$notification->id}" . PHP_EOL;
    echo "Statut: {$notification->statut}" . PHP_EOL;
    echo "Message: {$notification->message}" . PHP_EOL;
    echo "Date: {$notification->created_at}" . PHP_EOL;
    echo "Type: {$notification->type}" . PHP_EOL;
} else {
    echo "❌ Aucune notification trouvée pour 774958446" . PHP_EOL;
}
