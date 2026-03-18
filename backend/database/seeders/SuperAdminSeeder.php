<?php

namespace Database\Seeders;

use App\Domaine\Entities\Utilisateur;
use App\Domaine\Entities\Tenant;
use App\Domaine\Entities\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer ou créer le tenant
        $tenant = Tenant::first();
        
        if (!$tenant) {
            $tenant = Tenant::create([
                'nom' => 'Maggyfast Immo',
                'domaine' => 'maggyfast.com',
                'plan' => 'premium',
                'actif' => true,
            ]);
        }

        // Récupérer le rôle super_admin
        $superAdminRole = Role::where('nom', 'super_admin')->first();
        
        if (!$superAdminRole) {
            $this->command->error('Le rôle super_admin n\'existe pas. Exécutez d\'abord les migrations.');
            return;
        }

        // Créer le super admin
        $superAdmin = Utilisateur::create([
            'id_tenant' => $tenant->id,
            'nom' => 'Super Administrateur',
            'email' => 'superadmin@maggyfast.com',
            'password' => Hash::make('SuperAdmin2026!'),
            'role' => 'super_admin', // Pour compatibilité
            'id_role' => $superAdminRole->id,
            'telephone' => '+221771234567',
        ]);

        $this->command->info('✓ Super Admin créé avec succès !');
        $this->command->info('');
        $this->command->info('Informations de connexion :');
        $this->command->info('Email    : superadmin@maggyfast.com');
        $this->command->info('Password : SuperAdmin2026!');
        $this->command->info('');
    }
}
