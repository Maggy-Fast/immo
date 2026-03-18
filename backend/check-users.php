<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Domaine\Entities\Utilisateur;

echo "=== Vérification des utilisateurs ===\n\n";

$users = Utilisateur::select('id', 'nom', 'email')->limit(10)->get();

if ($users->isEmpty()) {
    echo "❌ Aucun utilisateur trouvé dans la base de données!\n";
    echo "\nCréation d'un utilisateur admin de test...\n";
    
    $admin = Utilisateur::create([
        'nom' => 'Administrateur',
        'email' => 'admin@maggyfast.com',
        'password' => bcrypt('password'),
        'telephone' => '+221771234567',
        'id_tenant' => 1,
        'id_role' => 1,
    ]);
    
    echo "✅ Utilisateur créé: {$admin->email}\n";
} else {
    echo "✅ Utilisateurs trouvés:\n\n";
    foreach ($users as $user) {
        echo "  - ID: {$user->id} | {$user->nom} ({$user->email})\n";
    }
}

echo "\n=== Test de connexion ===\n\n";

$testUser = Utilisateur::where('email', 'admin@maggyfast.com')->first();

if ($testUser) {
    echo "✅ Utilisateur admin trouvé: {$testUser->nom}\n";
    
    if (Hash::check('password', $testUser->password)) {
        echo "✅ Mot de passe 'password' est correct\n";
    } else {
        echo "❌ Mot de passe 'password' est incorrect\n";
        echo "Mise à jour du mot de passe...\n";
        $testUser->password = bcrypt('password');
        $testUser->save();
        echo "✅ Mot de passe mis à jour\n";
    }
} else {
    echo "❌ Utilisateur admin non trouvé\n";
}
