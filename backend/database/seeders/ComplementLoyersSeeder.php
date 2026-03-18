<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ComplementLoyersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Récupérer le tenant de démo
        $tenant = DB::table('tenants')->where('domaine', 'demo.maggyfast.com')->first();
        if (!$tenant) {
            $this->command->error('Tenant démo non trouvé.');
            return;
        }

        // 2. Récupérer tous les contrats actifs pour ce tenant
        $contrats = DB::table('contrats')
            ->where('id_tenant', $tenant->id)
            ->where('statut', 'actif')
            ->get();

        $this->command->info('Génération de loyers pour ' . $contrats->count() . ' contrats...');

        $modesPaiement = ['especes', 'virement', 'wave', 'om'];
        $statuts = ['paye', 'impaye', 'en_retard', 'partiel'];
        $count = 0;

        foreach ($contrats as $contrat) {
            // Générer pour les 6 derniers mois
            for ($i = 0; $i < 6; $i++) {
                $dateMois = Carbon::now()->subMonths($i);
                $moisStr = $dateMois->format('Y-m');

                // Vérifier si le loyer existe déjà pour ce mois et ce contrat
                $existe = DB::table('loyers')
                    ->where('id_contrat', $contrat->id)
                    ->where('mois', 'LIKE', $moisStr . '%')
                    ->exists();

                if (!$existe) {
                    $statut = $statuts[array_rand($statuts)];
                    
                    // Pour le mois actuel, on met souvent en attente/impayé
                    if ($i === 0) {
                        $statut = (rand(0, 1) === 0) ? 'paye' : 'impaye';
                    }

                    $datePaiement = null;
                    $modePaiement = null;

                    if ($statut === 'paye') {
                        $datePaiement = $dateMois->copy()->addDays(rand(1, 10));
                        $modePaiement = $modesPaiement[array_rand($modesPaiement)];
                    }

                    DB::table('loyers')->insert([
                        'id_tenant' => $tenant->id,
                        'id_contrat' => $contrat->id,
                        'mois' => $moisStr, // Utilise le format Y-m pour correspondre au filtre
                        'montant' => $contrat->loyer_mensuel,
                        'statut' => $statut,
                        'mode_paiement' => $modePaiement,
                        'date_paiement' => $datePaiement,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $count++;
                }
            }
        }

        $this->command->info("✅ {$count} nouveaux loyers ont été générés !");
    }
}
