<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domaine\Entities\Adherent;
use App\Domaine\Entities\ParametreCotisation;
use App\Domaine\Entities\ParcelleCooperative;
use Carbon\Carbon;

class CooperativeSeeder extends Seeder
{
    public function run(): void
    {
        $idTenant = 1; // Ajuster selon votre configuration

        // Créer paramètre de cotisation
        $parametre = ParametreCotisation::create([
            'id_tenant' => $idTenant,
            'montant' => 50000,
            'frequence' => 'mensuel',
            'jour_echeance' => 5,
            'date_debut' => Carbon::now()->startOfMonth(),
            'periode_grace_jours' => 5,
            'max_echeances_retard' => 3,
            'actif' => true,
        ]);

        // Créer adhérents
        $adherents = [
            ['nom' => 'Diop', 'prenom' => 'Amadou', 'telephone' => '771234567', 'cin' => '1234567890123'],
            ['nom' => 'Ndiaye', 'prenom' => 'Fatou', 'telephone' => '772345678', 'cin' => '2345678901234'],
            ['nom' => 'Fall', 'prenom' => 'Moussa', 'telephone' => '773456789', 'cin' => '3456789012345'],
            ['nom' => 'Sow', 'prenom' => 'Aissatou', 'telephone' => '774567890', 'cin' => '4567890123456'],
            ['nom' => 'Sarr', 'prenom' => 'Ibrahima', 'telephone' => '775678901', 'cin' => '5678901234567'],
        ];

        foreach ($adherents as $index => $data) {
            Adherent::create([
                'id_tenant' => $idTenant,
                'numero' => 'ADH' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'telephone' => $data['telephone'],
                'cin' => $data['cin'],
                'email' => strtolower($data['prenom']) . '.' . strtolower($data['nom']) . '@example.com',
                'adresse' => 'Dakar, Sénégal',
                'date_adhesion' => Carbon::now()->subMonths(rand(1, 6)),
                'statut' => 'actif',
            ]);
        }

        // Créer parcelles
        for ($i = 1; $i <= 10; $i++) {
            ParcelleCooperative::create([
                'id_tenant' => $idTenant,
                'numero' => 'PARC' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'surface' => rand(200, 500),
                'prix' => rand(5000000, 15000000),
                'statut' => 'disponible',
                'description' => 'Parcelle située dans la zone ' . chr(64 + ceil($i / 2)),
            ]);
        }

        $this->command->info('Données de test pour le module Coopérative créées avec succès!');
    }
}
