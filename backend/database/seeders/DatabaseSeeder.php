<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $tenant = \App\Domaine\Entities\Tenant::first() ?? \App\Domaine\Entities\Tenant::create([
            'nom' => 'Maggyfast Immo',
            'domaine' => 'maggyfast.com',
            'plan' => 'premium',
            'actif' => true,
        ]);

        User::factory()->create([
            'id_tenant' => $tenant->id,
            'nom' => 'Test User',
            'email' => 'test@example.com',
        ]);
        
        $this->call([
            SuperAdminSeeder::class,
            // Ajoutez d'autres seeders si nécessaire
        ]);
    }
}
