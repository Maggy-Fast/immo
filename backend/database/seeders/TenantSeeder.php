<?php

namespace Database\Seeders;

use App\Domaine\Entities\Tenant;
use App\Domaine\Entities\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un tenant de test
        $tenant = Tenant::create([
            'nom' => 'Maggyfast Immo',
            'domaine' => 'demo.maggyfast.com',
            'plan' => 'premium',
            'actif' => true,
        ]);

        // Créer un utilisateur admin pour ce tenant
        Utilisateur::create([
            'id_tenant' => $tenant->id,
            'nom' => 'Admin',
            'email' => 'admin@demo.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'telephone' => '+221771234567',
        ]);

        $this->command->info('Tenant et utilisateur de test créés avec succès!');
        $this->command->info('Email: admin@demo.com');
        $this->command->info('Mot de passe: password');
    }
}
