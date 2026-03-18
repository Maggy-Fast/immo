<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Domaine\Entities\NotificationWhatsapp;

$n = NotificationWhatsapp::create([
    'id_tenant' => 1,
    'id_adherent' => 1,
    'type' => 'rappel',
    'message' => 'TEST POUR VOIR DESTINATAIRE - Tel: 771234567',
    'telephone' => '771234567',
    'statut' => 'en_attente'
]);

echo "Notification ID: {$n->id} créée pour 771234567" . PHP_EOL;
