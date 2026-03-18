<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domaine\Entities\Travaux;
use App\Domaine\Entities\Depense;
use App\Domaine\Entities\Bien;
use App\Domaine\Entities\Tenant;
use Carbon\Carbon;

class DepenseTravauxSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        if (!$tenant) return;

        $biens = Bien::all();
        if ($biens->isEmpty()) return;

        $maintenant = Carbon::now();

        // 1. Créer des Travaux
        $travauxData = [
            [
                'intitule' => 'Rénovation peinture salon',
                'description' => 'Peinture complète du salon et de la salle à manger avec de la peinture satinée.',
                'montant_estime' => 150000,
                'date_debut' => $maintenant->copy()->subDays(15),
                'date_fin' => $maintenant->copy()->subDays(5),
                'statut' => 'termine',
            ],
            [
                'intitule' => 'Réparation plomberie cuisine',
                'description' => 'Fuite sous l\'évier et remplacement du robinet.',
                'montant_estime' => 45000,
                'date_debut' => $maintenant->copy()->subDays(2),
                'date_fin' => null,
                'statut' => 'en_cours',
            ],
            [
                'intitule' => 'Installation climatisation',
                'description' => 'Pose d\'un split 1.5 CV dans la chambre principale.',
                'montant_estime' => 350000,
                'date_debut' => $maintenant->copy()->addDays(10),
                'date_fin' => null,
                'statut' => 'planifie',
            ],
        ];

        foreach ($travauxData as $index => $data) {
            $bien = $biens->random();
            $travail = Travaux::create(array_merge($data, [
                'id_tenant' => $tenant->id,
                'id_bien' => $bien->id,
            ]));

            // Créer des dépenses liées si terminé ou en cours
            if ($data['statut'] === 'termine') {
                Depense::create([
                    'id_tenant' => $tenant->id,
                    'id_bien' => $bien->id,
                    'id_travaux' => $travail->id,
                    'intitule' => 'Achat peinture et pinceaux',
                    'description' => 'Facture Quincaillerie Touba',
                    'montant' => 85000,
                    'date_depense' => $maintenant->copy()->subDays(14),
                    'type_depense' => 'materiaux',
                    'statut_paiement' => 'paye',
                ]);

                Depense::create([
                    'id_tenant' => $tenant->id,
                    'id_bien' => $bien->id,
                    'id_travaux' => $travail->id,
                    'intitule' => 'Main d\'œuvre peintre',
                    'description' => 'Paiement artisan',
                    'montant' => 65000,
                    'date_depense' => $maintenant->copy()->subDays(5),
                    'type_depense' => 'main_oeuvre',
                    'statut_paiement' => 'paye',
                ]);
            } elseif ($data['statut'] === 'en_cours') {
                Depense::create([
                    'id_tenant' => $tenant->id,
                    'id_bien' => $bien->id,
                    'id_travaux' => $travail->id,
                    'intitule' => 'Achat robinetterie',
                    'description' => 'Facture Orca',
                    'montant' => 25000,
                    'date_depense' => $maintenant->copy()->subDays(1),
                    'type_depense' => 'materiaux',
                    'statut_paiement' => 'paye',
                ]);
            }
        }

        // 2. Créer des dépenses isolées (hors travaux)
        $depensesIsolees = [
            [
                'intitule' => 'Frais de syndic - Mars',
                'description' => 'Cotisation mensuelle copropriété',
                'montant' => 20000,
                'date_depense' => $maintenant->copy()->startOfMonth(),
                'type_depense' => 'frais_administratif',
                'statut_paiement' => 'paye',
            ],
            [
                'intitule' => 'Taxe foncière 2026',
                'description' => 'Impôt annuel sur le foncier bâti',
                'montant' => 125000,
                'date_depense' => $maintenant->copy()->subMonths(1),
                'type_depense' => 'frais_administratif',
                'statut_paiement' => 'en_attente',
            ],
            [
                'intitule' => 'Entretien jardin',
                'description' => 'Taille des haies et désherbage',
                'montant' => 15000,
                'date_depense' => $maintenant->copy()->subDays(20),
                'type_depense' => 'autres',
                'statut_paiement' => 'paye',
            ],
        ];

        foreach ($depensesIsolees as $data) {
            Depense::create(array_merge($data, [
                'id_tenant' => $tenant->id,
                'id_bien' => $biens->random()->id,
            ]));
        }

        // Ajouter des données historiques de dépenses pour le graphique (6 derniers mois)
        for ($i = 6; $i >= 0; $i--) {
            $date = $maintenant->copy()->subMonths($i);
            
            // On ajoute 1 à 2 dépenses par mois au hasard
            $nb = rand(1, 2);
            for ($j = 0; $j < $nb; $j++) {
                Depense::create([
                    'id_tenant' => $tenant->id,
                    'id_bien' => $biens->random()->id,
                    'intitule' => 'Maintenance mensuelle ' . $date->format('M'),
                    'description' => 'Maintenance routine',
                    'montant' => rand(10000, 50000),
                    'date_depense' => $date->copy()->day(rand(1, 28)),
                    'type_depense' => 'autres',
                    'statut_paiement' => 'paye',
                ]);
            }
        }
    }
}
