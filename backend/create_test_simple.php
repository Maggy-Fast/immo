<?php

require_once __DIR__ . '/vendor/autoload.php';

// Connexion à la base de données
$pdo = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');

// Insertion directe sans le modèle
$stmt = $pdo->prepare("
    INSERT INTO notifications_whatsapp 
    (id_tenant, id_adherent, type, message, telephone, statut, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
");

$stmt->execute([
    1, // id_tenant
    1, // id_adherent
    'rappel', // type
    'TEST POUR VOIR DESTINATAIRE - Tel: 771234567', // message
    '771234567', // telephone
    'en_attente' // statut
]);

$id = $pdo->lastInsertId();

echo "✅ Notification ID: {$id} créée pour 771234567" . PHP_EOL;
