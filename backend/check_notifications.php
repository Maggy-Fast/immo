<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Domaine\Entities\NotificationWhatsapp;

echo "=== Notifications en attente ===" . PHP_EOL;
$notifications = NotificationWhatsapp::where('statut', 'en_attente')->get();

foreach ($notifications as $notification) {
    echo sprintf(
        "ID: %d | Téléphone: %s | Adhérent: %d | Type: %s | Message: %s" . PHP_EOL,
        $notification->id,
        $notification->telephone,
        $notification->id_adherent,
        $notification->type,
        substr($notification->message, 0, 50) . (strlen($notification->message) > 50 ? '...' : '')
    );
}

echo PHP_EOL . "Total: " . count($notifications) . " notification(s) en attente" . PHP_EOL;
