<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Domaine\Entities\Utilisateur;
use Illuminate\Support\Facades\Hash;

$user = Utilisateur::where('email', 'superadmin@maggyfast.com')->first();

if ($user) {
    $user->password = Hash::make('SuperAdmin2026!');
    $user->save();
    echo "✓ Mot de passe mis à jour avec succès !\n";
    echo "Email: superadmin@maggyfast.com\n";
    echo "Password: SuperAdmin2026!\n";
} else {
    echo "✗ Utilisateur non trouvé\n";
}
