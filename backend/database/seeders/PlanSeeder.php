<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domaine\Entities\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'nom' => 'Licence Annuelle',
                'slug' => 'annuelle',
                'prix' => 0,
                'duree_mois' => 12,
                'description' => 'Accès complet au logiciel pour une durée de 12 mois.',
                'actif' => true,
            ],
            [
                'nom' => 'Licence Semestrielle',
                'slug' => 'semestrielle',
                'prix' => 0,
                'duree_mois' => 6,
                'description' => 'Accès complet au logiciel pour une durée de 6 mois.',
                'actif' => true,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
