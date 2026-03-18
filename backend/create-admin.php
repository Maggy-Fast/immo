<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Domaine\Entities\Utilisateur;
use App\Domaine\Entities\Role;

echo "=== Création de l'utilisateur admin@maggyfast.com ===\n\n";

// Vérifier si l'utilisateur existe déjà
$existing = Utilisateur::where('email', 'admin@maggyfast.com')->first();

if ($existing) {
    echo "ℹ️  L'utilisateur existe déjà. Mise à jour du mot de passe...\n";
    $existing->password = bcrypt('password');
    $existing->save();
    echo "✅ Mot de passe mis à jour pour: {$existing->email}\n";
} else {
    // Trouver ou créer un rôle admin
    $role = Role::where('nom', 'admin')->orWhere('nom', 'administrateur')->first();
    
    if (!$role) {
        echo "⚠️  Aucun rôle admin trouvé. Création d'un rôle par défaut...\n";
        $role = Role::create([
            'nom' => 'admin',
            'libelle' => 'Administrateur',
            'description' => 'Accès complet au système',
        ]);
        echo "✅ Rôle créé: {$role->nom}\n";
    }
    
    // Créer l'utilisateur
    $admin = Utilisateur::create([
        'nom' => 'Administrateur MaggyFast',
        'email' => 'admin@maggyfast.com',
        'password' => bcrypt('password'),
        'telephone' => '+221771234567',
        'id_tenant' => 1,
        'id_role' => $role->id,
    ]);
    
    echo "✅ Utilisateur créé avec succès!\n";
    echo "   Email: {$admin->email}\n";
    echo "   Mot de passe: password\n";
    echo "   Rôle: {$role->nom}\n";
}

echo "\n=== Liste des utilisateurs disponibles ===\n\n";

$users = Utilisateur::select('id', 'nom', 'email')->get();
foreach ($users as $user) {
    echo "  - {$user->email} ({$user->nom})\n";
}

echo "\n✅ Configuration terminée!\n";
