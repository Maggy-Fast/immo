<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DonneesTestSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer le tenant existant
        $tenant = DB::table('tenants')->first();
        
        if (!$tenant) {
            $this->command->error('Aucun tenant trouvé. Exécutez d\'abord TenantSeeder.');
            return;
        }

        $idTenant = $tenant->id;

        // 1. Propriétaires (10)
        $proprietaires = [
            ['nom' => 'Amadou Diop', 'telephone' => '77 123 45 67', 'email' => 'amadou.diop@email.sn', 'adresse' => 'Almadies, Dakar', 'cin' => '1234567890123'],
            ['nom' => 'Fatou Ndiaye', 'telephone' => '77 234 56 78', 'email' => 'fatou.ndiaye@email.sn', 'adresse' => 'Mermoz, Dakar', 'cin' => '2345678901234'],
            ['nom' => 'Ibrahima Sow', 'telephone' => '77 345 67 89', 'email' => 'ibrahima.sow@email.sn', 'adresse' => 'Sacré-Cœur, Dakar', 'cin' => '3456789012345'],
            ['nom' => 'Aïssatou Fall', 'telephone' => '77 456 78 90', 'email' => 'aissatou.fall@email.sn', 'adresse' => 'Point E, Dakar', 'cin' => '4567890123456'],
            ['nom' => 'Moussa Sarr', 'telephone' => '77 567 89 01', 'email' => 'moussa.sarr@email.sn', 'adresse' => 'Ouakam, Dakar', 'cin' => '5678901234567'],
            ['nom' => 'Mariama Ba', 'telephone' => '77 678 90 12', 'email' => 'mariama.ba@email.sn', 'adresse' => 'Fann, Dakar', 'cin' => '6789012345678'],
            ['nom' => 'Cheikh Cissé', 'telephone' => '77 789 01 23', 'email' => 'cheikh.cisse@email.sn', 'adresse' => 'Plateau, Dakar', 'cin' => '7890123456789'],
            ['nom' => 'Khady Sy', 'telephone' => '77 890 12 34', 'email' => 'khady.sy@email.sn', 'adresse' => 'Liberté 6, Dakar', 'cin' => '8901234567890'],
            ['nom' => 'Mamadou Gueye', 'telephone' => '77 901 23 45', 'email' => 'mamadou.gueye@email.sn', 'adresse' => 'HLM, Dakar', 'cin' => '9012345678901'],
            ['nom' => 'Awa Thiam', 'telephone' => '77 012 34 56', 'email' => 'awa.thiam@email.sn', 'adresse' => 'Yoff, Dakar', 'cin' => '0123456789012'],
        ];

        $proprietaireIds = [];
        foreach ($proprietaires as $prop) {
            $id = DB::table('proprietaires')->insertGetId([
                'id_tenant' => $idTenant,
                'nom' => $prop['nom'],
                'telephone' => $prop['telephone'],
                'email' => $prop['email'],
                'adresse' => $prop['adresse'],
                'cin' => $prop['cin'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $proprietaireIds[] = $id;
        }

        // 2. Biens (15)
        $biens = [
            ['type' => 'appartement', 'adresse' => 'Résidence Les Almadies, Dakar', 'superficie' => 85, 'prix' => 350000, 'statut' => 'loue'],
            ['type' => 'villa', 'adresse' => 'Villa Mermoz, Dakar', 'superficie' => 250, 'prix' => 800000, 'statut' => 'loue'],
            ['type' => 'appartement', 'adresse' => 'Immeuble Sacré-Cœur 3, Dakar', 'superficie' => 65, 'prix' => 250000, 'statut' => 'loue'],
            ['type' => 'studio', 'adresse' => 'Studio Point E, Dakar', 'superficie' => 35, 'prix' => 150000, 'statut' => 'disponible'],
            ['type' => 'villa', 'adresse' => 'Villa Ouakam, Dakar', 'superficie' => 300, 'prix' => 1000000, 'statut' => 'loue'],
            ['type' => 'appartement', 'adresse' => 'Résidence Fann, Dakar', 'superficie' => 95, 'prix' => 400000, 'statut' => 'disponible'],
            ['type' => 'bureau', 'adresse' => 'Immeuble Plateau, Dakar', 'superficie' => 120, 'prix' => 600000, 'statut' => 'loue'],
            ['type' => 'appartement', 'adresse' => 'Liberté 6 Extension, Dakar', 'superficie' => 75, 'prix' => 300000, 'statut' => 'loue'],
            ['type' => 'villa', 'adresse' => 'Villa HLM Grand Yoff, Dakar', 'superficie' => 200, 'prix' => 650000, 'statut' => 'disponible'],
            ['type' => 'appartement', 'adresse' => 'Résidence Yoff Virage, Dakar', 'superficie' => 80, 'prix' => 320000, 'statut' => 'loue'],
            ['type' => 'studio', 'adresse' => 'Studio Ngor, Dakar', 'superficie' => 30, 'prix' => 120000, 'statut' => 'disponible'],
            ['type' => 'villa', 'adresse' => 'Villa Mamelles, Dakar', 'superficie' => 280, 'prix' => 900000, 'statut' => 'loue'],
            ['type' => 'appartement', 'adresse' => 'Cité Keur Gorgui, Dakar', 'superficie' => 70, 'prix' => 280000, 'statut' => 'disponible'],
            ['type' => 'bureau', 'adresse' => 'Centre commercial Liberté 6, Dakar', 'superficie' => 150, 'prix' => 750000, 'statut' => 'loue'],
            ['type' => 'appartement', 'adresse' => 'Résidence Sicap Baobabs, Dakar', 'superficie' => 90, 'prix' => 380000, 'statut' => 'loue'],
        ];

        $bienIds = [];
        foreach ($biens as $index => $bien) {
            $id = DB::table('biens')->insertGetId([
                'id_tenant' => $idTenant,
                'id_proprietaire' => $proprietaireIds[$index % count($proprietaireIds)],
                'type' => $bien['type'],
                'adresse' => $bien['adresse'],
                'superficie' => $bien['superficie'],
                'prix' => $bien['prix'],
                'statut' => $bien['statut'],
                'description' => 'Bien situé dans un quartier calme et sécurisé.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $bienIds[] = $id;
        }

        // 3. Locataires (12)
        $locataires = [
            ['nom' => 'Ousmane Kane', 'telephone' => '76 111 22 33', 'email' => 'ousmane.kane@email.sn', 'profession' => 'Ingénieur', 'cin' => '1111222233334'],
            ['nom' => 'Coumba Mbaye', 'telephone' => '76 222 33 44', 'email' => 'coumba.mbaye@email.sn', 'profession' => 'Médecin', 'cin' => '2222333344445'],
            ['nom' => 'Alioune Diouf', 'telephone' => '76 333 44 55', 'email' => 'alioune.diouf@email.sn', 'profession' => 'Professeur', 'cin' => '3333444455556'],
            ['nom' => 'Bineta Seck', 'telephone' => '76 444 55 66', 'email' => 'bineta.seck@email.sn', 'profession' => 'Avocate', 'cin' => '4444555566667'],
            ['nom' => 'Abdoulaye Diallo', 'telephone' => '76 555 66 77', 'email' => 'abdoulaye.diallo@email.sn', 'profession' => 'Commerçant', 'cin' => '5555666677778'],
            ['nom' => 'Ndèye Faye', 'telephone' => '76 666 77 88', 'email' => 'ndeye.faye@email.sn', 'profession' => 'Comptable', 'cin' => '6666777788889'],
            ['nom' => 'Seydou Touré', 'telephone' => '76 777 88 99', 'email' => 'seydou.toure@email.sn', 'profession' => 'Architecte', 'cin' => '7777888899990'],
            ['nom' => 'Mame Ndao', 'telephone' => '76 888 99 00', 'email' => 'mame.ndao@email.sn', 'profession' => 'Pharmacienne', 'cin' => '8888999900001'],
            ['nom' => 'Lamine Camara', 'telephone' => '76 999 00 11', 'email' => 'lamine.camara@email.sn', 'profession' => 'Entrepreneur', 'cin' => '9999000011112'],
            ['nom' => 'Rokhaya Sène', 'telephone' => '76 000 11 22', 'email' => 'rokhaya.sene@email.sn', 'profession' => 'Journaliste', 'cin' => '0000111122223'],
            ['nom' => 'Modou Bâ', 'telephone' => '76 111 33 44', 'email' => 'modou.ba@email.sn', 'profession' => 'Informaticien', 'cin' => '1111333344445'],
            ['nom' => 'Astou Dieng', 'telephone' => '76 222 44 55', 'email' => 'astou.dieng@email.sn', 'profession' => 'Designer', 'cin' => '2222444455556'],
        ];

        $locataireIds = [];
        foreach ($locataires as $loc) {
            $id = DB::table('locataires')->insertGetId([
                'id_tenant' => $idTenant,
                'nom' => $loc['nom'],
                'telephone' => $loc['telephone'],
                'email' => $loc['email'],
                'cin' => $loc['cin'],
                'profession' => $loc['profession'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $locataireIds[] = $id;
        }

        // 4. Contrats (10 - seulement pour les biens loués)
        $biensLoues = array_filter($bienIds, function($index) use ($biens) {
            return $biens[$index]['statut'] === 'loue';
        }, ARRAY_FILTER_USE_KEY);

        $contratIds = [];
        $contratIndex = 0;
        foreach (array_values($biensLoues) as $index => $bienId) {
            if ($contratIndex >= count($locataireIds)) break;
            
            $dateDebut = Carbon::now()->subMonths(rand(1, 12));
            $dateFin = $dateDebut->copy()->addYear();
            
            $id = DB::table('contrats')->insertGetId([
                'id_tenant' => $idTenant,
                'id_bien' => $bienId,
                'id_locataire' => $locataireIds[$contratIndex],
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
                'loyer_mensuel' => $biens[array_search($bienId, $bienIds)]['prix'],
                'caution' => $biens[array_search($bienId, $bienIds)]['prix'] * 2,
                'statut' => 'actif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $contratIds[] = $id;
            $contratIndex++;
        }

        // 5. Loyers (30 - 3 mois pour chaque contrat)
        foreach ($contratIds as $contratId) {
            $contrat = DB::table('contrats')->where('id', $contratId)->first();
            
            for ($i = 0; $i < 3; $i++) {
                $mois = Carbon::parse($contrat->date_debut)->addMonths($i);
                $statut = $i < 2 ? 'paye' : ($i === 2 ? 'en_attente' : 'en_retard');
                $datePaiement = $i < 2 ? $mois->copy()->addDays(rand(1, 5)) : null;
                
                DB::table('loyers')->insert([
                    'id_tenant' => $idTenant,
                    'id_contrat' => $contratId,
                    'mois' => $mois->format('Y-m-d'),
                    'montant' => $contrat->loyer_mensuel,
                    'statut' => $statut,
                    'date_paiement' => $datePaiement,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 6. Lotissements (3)
        $lotissements = [
            ['nom' => 'Lotissement Diamaguène', 'localisation' => 'Diamaguène, Dakar', 'superficie' => 5000, 'nb_parcelles' => 20],
            ['nom' => 'Lotissement Keur Massar', 'localisation' => 'Keur Massar, Dakar', 'superficie' => 8000, 'nb_parcelles' => 30],
            ['nom' => 'Lotissement Mbao', 'localisation' => 'Mbao, Dakar', 'superficie' => 6000, 'nb_parcelles' => 25],
        ];

        $lotissementIds = [];
        foreach ($lotissements as $lot) {
            $id = DB::table('lotissements')->insertGetId([
                'id_tenant' => $idTenant,
                'nom' => $lot['nom'],
                'localisation' => $lot['localisation'],
                'superficie_totale' => $lot['superficie'],
                'nombre_parcelles' => $lot['nb_parcelles'],
                'statut' => 'en_cours',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $lotissementIds[] = $id;
        }

        // 7. Parcelles (20)
        foreach ($lotissementIds as $lotIndex => $lotId) {
            $nbParcelles = $lotissements[$lotIndex]['nb_parcelles'];
            
            for ($i = 1; $i <= min(7, $nbParcelles); $i++) {
                $statut = $i <= 3 ? 'vendue' : ($i <= 5 ? 'reservee' : 'disponible');
                
                DB::table('parcelles')->insert([
                    'id_tenant' => $idTenant,
                    'id_lotissement' => $lotId,
                    'numero' => "P{$i}",
                    'superficie' => rand(200, 500),
                    'prix' => rand(5000000, 15000000),
                    'statut' => $statut,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 8. Partenariats (3)
        foreach ($lotissementIds as $index => $lotId) {
            $partId = DB::table('partenariats')->insertGetId([
                'id_tenant' => $idTenant,
                'id_lotissement' => $lotId,
                'id_promoteur' => $proprietaireIds[0],
                'id_proprietaire' => $proprietaireIds[1],
                'ticket_entree' => rand(5000000, 20000000),
                'pourcentage_promoteur' => 60,
                'pourcentage_proprietaire' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Ajouter des dépenses
            $nbDepenses = rand(3, 6);
            for ($i = 0; $i < $nbDepenses; $i++) {
                DB::table('depenses_partenariat')->insert([
                    'id_tenant' => $idTenant,
                    'id_partenariat' => $partId,
                    'description' => ['Achat terrain', 'Frais notaire', 'Travaux fondation', 'Matériaux', 'Main d\'œuvre', 'Frais divers'][rand(0, 5)],
                    'montant' => rand(500000, 5000000),
                    'date' => Carbon::now()->subDays(rand(1, 180)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ Données de test créées avec succès!');
        $this->command->info('📊 Résumé:');
        $this->command->info('   - 10 propriétaires');
        $this->command->info('   - 15 biens');
        $this->command->info('   - 12 locataires');
        $this->command->info('   - ' . count($contratIds) . ' contrats');
        $this->command->info('   - ~30 loyers');
        $this->command->info('   - 3 lotissements');
        $this->command->info('   - ~20 parcelles');
        $this->command->info('   - 3 partenariats');
    }
}
